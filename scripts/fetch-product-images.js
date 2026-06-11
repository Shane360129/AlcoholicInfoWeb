// 為每個產品抓取「真正的商品圖」（乾淨的酒瓶商品照），存到 images/products/
// 並產生 data/product-images.js（product.name -> 本地路徑）
//
// 圖片來源（依優先順序）：
//   0. product.imageUrl    — 資料中手動指定的圖片網址（最高優先）
//   1. Systembolaget       — 瑞典酒類專賣局公開商品 API，去背 PNG 商品照
//   2. Shopify 酒類零售商  — 公開 search/suggest.json，白底商品照
//   3. Bing 圖片搜尋        — 最後手段（偏好直式大圖），結果需人工複核
//
// 比對策略：產品名稱中的數字（年份/酒齡）必須完全一致；候選標題若多出
// 不在產品名稱中的酒齡數字或風味/版本字眼（如 double、reposado、honey），
// 一律剔除，避免抓到同品牌的別款酒。
//
// 環境變數：
//   REFETCH=missing|all   missing（預設）只抓還沒有圖的產品；all 全部重抓
//   ONLY="名稱1|名稱2"     只抓指定產品（與 REFETCH 無關）
//   SB_API_KEY=...        覆寫 Systembolaget API key
//
// 由 .github/workflows/fetch-wiki-images.yml 在 GitHub Actions 中執行

const fs = require('fs');
const path = require('path');

const spiritsData = require('../data/spirits.js');
const brandProducts = require('../data/brand-products.js');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images', 'products');
const MANIFEST_PATH = path.join(ROOT, 'data', 'product-images.js');
const SOURCES_PATH = path.join(ROOT, 'data', 'product-image-sources.json');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// Systembolaget 官網前端內嵌的公開 API key（可用 SB_API_KEY 覆寫）
const SB_API_KEY = process.env.SB_API_KEY || 'cfc702aed3094c86b92d6d4ff7a54c84';

// 公開 Shopify 酒類零售商（依圖片品質排序），啟動時自動探測可用性
const SHOPIFY_STORES = [
  'woodencork.com',
  'sipwhiskey.com',
  'nestorliquor.com',
  'delmesaliquor.com',
  'remedyliquor.com',
  'caskcartel.com'
];

// 參數：環境變數優先，否則讀 scripts/refetch.json（push 觸發時用）
let fileCfg = {};
try { fileCfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'refetch.json'), 'utf8')); } catch (e) { /* 沒有設定檔 */ }
const REFETCH = (process.env.REFETCH || fileCfg.refetch || 'missing').toLowerCase();
const ONLY = (process.env.ONLY || (Array.isArray(fileCfg.only) ? fileCfg.only.join('|') : ''))
  .split('|').map(s => s.trim()).filter(Boolean);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ---------------------------------------------------------------- HTTP

async function httpGet(url, { headers = {}, asBuffer = false, timeoutMs = 20000, retries = 1 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, ...headers },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs)
      });
      if (res.status >= 500 && attempt < retries) { await sleep(800); continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (asBuffer) {
        return { buf: Buffer.from(await res.arrayBuffer()), contentType: res.headers.get('content-type') || '' };
      }
      return { text: await res.text(), contentType: res.headers.get('content-type') || '' };
    } catch (e) {
      if (attempt < retries) { await sleep(800); continue; }
      throw e;
    }
  }
}

// ------------------------------------------------------- 圖檔格式 / 尺寸

function sniffImage(buf) {
  if (buf.length < 16) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50) return { ext: '.png', ...pngSize(buf) };
  if (buf[0] === 0xff && buf[1] === 0xd8) return { ext: '.jpg', ...jpegSize(buf) };
  if (buf.slice(0, 4).toString('ascii') === 'GIF8') {
    return { ext: '.gif', width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') {
    return { ext: '.webp', ...webpSize(buf) };
  }
  if (buf.slice(4, 12).toString('ascii') === 'ftypavif') return { ext: '.avif', width: 0, height: 0 };
  return null;
}

function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegSize(buf) {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    // SOF0-SOF15（不含 DHT/DAC/RST）
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return { width: 0, height: 0 };
}

function webpSize(buf) {
  const fmt = buf.slice(12, 16).toString('ascii');
  if (fmt === 'VP8X') {
    return {
      width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
      height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16))
    };
  }
  if (fmt === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  if (fmt === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
  }
  return { width: 0, height: 0 };
}

// ------------------------------------------------------------ 名稱比對

function normalizeText(s) {
  let t = String(s)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // 去重音：Patrón -> Patron
    .toLowerCase()
    .replace(/['’]/g, '');                              // Maker's -> makers
  t = t
    .replace(/\bv\.?\s?s\.?\s?o\.?\s?p\b\.?/g, ' vsop ')
    .replace(/\bx\.?o\b\.?/g, ' xo ')
    .replace(/\bv\.?s\b\.?/g, ' vs ')
    .replace(/\bno\.?\s*(\d)/g, ' no $1')
    .replace(/\b\d+(?:\.\d+)?\s*(?:ml|cl|ltr|liter|litre|l)\b/g, ' ')   // 容量
    .replace(/\b\d+\.\d+\b/g, ' ');                                     // 小數視為規格（proof/abv）
  return t.replace(/[^a-z0-9一-鿿぀-ヿ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const STOP_TOKENS = new Set(['the', 'of', 'and', 'with', 'de', 'la', 'le', 'el', 'du', 'no', 'nv', 'year', 'years', 'old', 'yr', 'yo', 'aged', 'anos', 'ans', 'original', 'premium']);

// 候選標題若多出這些「版本/風味」字眼（而產品名稱沒有）→ 視為別款酒
const CONFLICT_TOKENS = new Set([
  'double', 'black', 'blue', 'gold', 'green', 'red', 'white', 'pink', 'silver',
  'blanco', 'plata', 'reposado', 'anejo', 'cristalino', 'rosa', 'joven',
  'honey', 'apple', 'fire', 'vanilla', 'citron', 'citroen', 'oranje', 'orange',
  'lime', 'raspberry', 'peach', 'mango', 'watermelon', 'grapefruit', 'cherry',
  'espresso', 'coffee', 'caramel', 'sloe', 'navy', 'spiced', 'overproof', 'dark',
  'peated', 'px', 'elyx', 'elit', 'manifest', 'scharf', 'orbium', 'lunar'
]);
const VARIANT_PHRASES = [
  'cask strength', 'single barrel', 'single cask', 'double cask', 'triple cask',
  'quarter cask', 'extra anejo', 'barrel proof'
];
// 不論何種產品都不接受的包裝/禮盒字眼
const PACKAGING_PHRASES = [
  'gift set', 'gift box', 'glass set', 'with glasses', 'tasting set',
  'miniature', 'empty bottle'
];

function tokensOf(normText) {
  return normText.split(' ').filter(Boolean);
}

function numbersOf(tokens) {
  return new Set(tokens.filter(t => /^\d+$/.test(t)).map(Number));
}

// 產品名稱以中日韓字元為主時，改用 searchQuery 做比對基準
function matchBasis(product) {
  const asciiTokens = tokensOf(normalizeText(product.name)).filter(t => /^[a-z0-9]+$/.test(t));
  if (asciiTokens.length < 2 && product.searchQuery) return product.searchQuery;
  return product.name;
}

function buildMatcher(brandName, product) {
  const basis = matchBasis(product);
  const basisNorm = normalizeText(basis);
  const basisTokens = tokensOf(basisNorm);
  const nums = numbersOf(basisTokens);
  let sigTokens = basisTokens.filter(t => !/^\d+$/.test(t) && t.length >= 2 && !STOP_TOKENS.has(t));
  // 中英混合名稱（如「真露 Jinro 24」）：英文部分已可識別產品，中文別名不列入必要關鍵詞
  const asciiSig = sigTokens.filter(t => /^[a-z0-9]+$/.test(t));
  if (asciiSig.length > 0) sigTokens = asciiSig;
  const brandTokens = tokensOf(normalizeText(brandName)).filter(t => /^[a-z0-9]+$/.test(t) && t.length >= 2);
  const basisSet = new Set(basisTokens);
  // 1942 / 1738 / 1573 這類「年份編號」即可唯一識別產品；
  // 此時零售標題附加的 Anejo 等熟成等級字眼不視為衝突
  const basisHasVariant = basisTokens.some(t => CONFLICT_TOKENS.has(t));
  const uniqueEdition = [...nums].some(n => n >= 1000) && !basisHasVariant;

  return function score(candidateTitle) {
    // 緊跟 % / 度 / proof 的數字是酒精度規格：可滿足必要數字（高粱 58），
    // 但多出來時不視為衝突（白酒 52%）
    const specNums = new Set();
    for (const re of [/(\d+(?:\.\d+)?)\s*(?:%|度|proof|abv|pf\b)/gi, /(?:proof|abv)\s*:?\s*(\d+(?:\.\d+)?)/gi]) {
      let sm;
      while ((sm = re.exec(String(candidateTitle)))) specNums.add(Math.trunc(Number(sm[1])));
    }

    let candNorm = normalizeText(candidateTitle);
    // 基本款產品：候選標題中的「white rum / dark rum」是品類描述而非版本
    if (!basisHasVariant) candNorm = candNorm.replace(/\b(?:white|dark) rum\b/g, ' rum ').replace(/\s+/g, ' ');
    const candTokens = tokensOf(candNorm);
    const candSet = new Set(candTokens);
    const candJoined = candTokens.join('');

    // 1. 數字必須完全一致（酒齡/年份），多出 <=60 的數字視為別的酒齡
    const candNums = numbersOf(candTokens);
    for (const n of nums) if (!candNums.has(n)) return 0;
    for (const n of candNums) {
      if (nums.has(n) || specNums.has(n)) continue;
      if (n <= 60) return 0;
      if (n >= 1500 && n <= 2099) return 0;  // 年份/特殊編號不符
    }

    // 2. 候選多出「版本/風味」衝突字 → 剔除（年份編號款除外）
    if (!uniqueEdition) {
      for (const t of candSet) {
        if (CONFLICT_TOKENS.has(t) && !basisSet.has(t)) return 0;
      }
      for (const ph of VARIANT_PHRASES) {
        if (candNorm.includes(ph) && !basisNorm.includes(ph)) return 0;
      }
    }
    for (const ph of PACKAGING_PHRASES) {
      if (candNorm.includes(ph) && !basisNorm.includes(ph)) return 0;
    }

    // 3. 關鍵詞涵蓋率。產品名稱中的顏色/版本字（如 Red、Silver）零售標題常省略，
    //    跨版本誤抓已由衝突字規則把關，故候選缺少時不列入分母
    let hit = 0, denom = 0, excluded = 0;
    for (const t of sigTokens) {
      const present = candSet.has(t) || candJoined.includes(t);
      if (!present && CONFLICT_TOKENS.has(t)) { excluded++; continue; }
      denom++;
      if (present) hit++;
    }
    const coverage = denom === 0 ? 1 : hit / denom;
    if (coverage >= 0.999) return excluded === 0 ? 2 : 1.5;  // 2 = 全部關鍵詞命中

    // 寬鬆：品牌詞（出現在比對基準中的）必須齊全，且涵蓋率 >= 0.6
    const requiredBrand = brandTokens.filter(t => basisSet.has(t) || basisNorm.replace(/ /g, '').includes(t));
    const brandOk = requiredBrand.length === 0
      ? brandTokens.some(t => candJoined.includes(t))
      : requiredBrand.every(t => candSet.has(t) || candJoined.includes(t));
    if (brandOk && coverage >= 0.6) return 1;
    return 0;
  };
}

// ------------------------------------------------------------- 來源 1：Systembolaget

let sbAvailable = true;

async function trySystembolaget(query, scoreFn) {
  if (!sbAvailable) return null;
  const url = 'https://api-extern.systembolaget.se/sb-api-ecommerce/v1/productsearch/search?' +
    new URLSearchParams({ textQuery: query, page: '1', size: '30' });
  let data;
  try {
    const { text } = await httpGet(url, {
      headers: { 'Ocp-Apim-Subscription-Key': SB_API_KEY, 'Accept': 'application/json' }
    });
    data = JSON.parse(text);
  } catch (e) {
    if (/HTTP (401|403)/.test(e.message)) {
      sbAvailable = false;
      console.log(`  [SB] API 無法使用（${e.message}），之後跳過此來源`);
    }
    return null;
  }
  const products = (data && data.products) || [];
  let best = null;
  for (const p of products) {
    if (p.categoryLevel1 && p.categoryLevel1 !== 'Sprit') continue;
    const img = p.images && p.images[0] && p.images[0].imageUrl;
    if (!img) continue;
    const title = [p.productNameBold, p.productNameThin].filter(Boolean).join(' ');
    const s = scoreFn(title);
    if (s > 0 && (!best || s > best.score)) best = { score: s, imageUrl: img, title };
    if (best && best.score >= 2) break;
  }
  if (!best) return null;
  for (const suffix of ['_400.png', '_800.png', '.png']) {
    try {
      const { buf } = await httpGet(best.imageUrl + suffix, { asBuffer: true });
      const info = sniffImage(buf);
      if (info && buf.length > 3000) {
        return { buf, info, source: 'systembolaget', from: best.imageUrl + suffix, title: best.title };
      }
    } catch (e) { /* 換下一個尺寸 */ }
  }
  return null;
}

// ------------------------------------------------------------- 來源 2：Shopify 零售商

const liveStores = new Map(); // store -> true/false

async function storeAlive(store) {
  if (liveStores.has(store)) return liveStores.get(store);
  try {
    const { text } = await httpGet(
      `https://${store}/search/suggest.json?q=whisky&resources[type]=product&resources[limit]=1`,
      { timeoutMs: 12000, retries: 0 }
    );
    const ok = !!JSON.parse(text).resources;
    liveStores.set(store, ok);
    if (!ok) console.log(`  [Shopify] ${store} 回應異常，跳過此站`);
    return ok;
  } catch (e) {
    liveStores.set(store, false);
    console.log(`  [Shopify] ${store} 無法使用（${e.message}），跳過此站`);
    return false;
  }
}

async function tryShopify(query, scoreFn) {
  for (const store of SHOPIFY_STORES) {
    if (!(await storeAlive(store))) continue;
    let products = [];
    try {
      const url = `https://${store}/search/suggest.json?` + new URLSearchParams({
        q: query,
        'resources[type]': 'product',
        'resources[limit]': '10',
        'resources[options][unavailable_products]': 'show'
      });
      const { text } = await httpGet(url, { timeoutMs: 15000, retries: 0 });
      const data = JSON.parse(text);
      products = (data.resources && data.resources.results && data.resources.results.products) || [];
    } catch (e) { continue; }

    let best = null;
    for (const p of products) {
      const imgUrl = (p.featured_image && p.featured_image.url) || p.image;
      if (!imgUrl) continue;
      const s = scoreFn(p.title || '');
      if (s > 0 && (!best || s > best.score)) best = { score: s, imageUrl: imgUrl, title: p.title };
      if (best && best.score >= 2) break;
    }
    if (!best) { await sleep(80); continue; }

    const candidates = [];
    const u = best.imageUrl.startsWith('//') ? 'https:' + best.imageUrl : best.imageUrl;
    candidates.push(u + (u.includes('?') ? '&' : '?') + 'width=700');
    candidates.push(u);
    for (const cu of candidates) {
      try {
        const { buf } = await httpGet(cu, { asBuffer: true });
        const info = sniffImage(buf);
        if (info && buf.length > 3000) {
          return { buf, info, source: `shopify:${store}`, from: cu, title: best.title };
        }
      } catch (e) { /* 換下一個網址 */ }
    }
    await sleep(80);
  }
  return null;
}

// ------------------------------------------------------------- 來源 3：Bing 圖片

function extractBingImageUrls(html) {
  const urls = [];
  const seen = new Set();
  const re = /(?:&quot;|")murl(?:&quot;|"):(?:&quot;|")(https?:.*?)(?:&quot;|")/g;
  let m;
  while ((m = re.exec(html)) && urls.length < 12) {
    const u = m[1].replace(/&amp;/g, '&').replace(/\\\//g, '/');
    if (seen.has(u)) continue;
    seen.add(u);
    if (/\.svg($|\?)/i.test(u)) continue;
    urls.push(u);
  }
  return urls;
}

async function tryBing(query, { tallOnly = true } = {}) {
  const qft = tallOnly ? '+filterui:aspect-tall+filterui:imagesize-large' : '+filterui:imagesize-large';
  const url = 'https://www.bing.com/images/search?' + new URLSearchParams({ q: query, qft, form: 'IRFLTR' });
  let html;
  try {
    ({ text: html } = await httpGet(url, { headers: { 'Accept-Language': 'en-US,en;q=0.8,zh-TW;q=0.6' } }));
  } catch (e) {
    return null;
  }
  const urls = extractBingImageUrls(html);
  for (const imgUrl of urls.slice(0, 6)) {
    try {
      const { buf } = await httpGet(imgUrl, { asBuffer: true, timeoutMs: 15000, retries: 0 });
      if (buf.length < 5000 || buf.length > 8 * 1024 * 1024) continue;
      const info = sniffImage(buf);
      if (!info) continue;
      if (info.width && info.height) {
        if (info.height < 300 || info.width < 180) continue;
        if (info.height / info.width < 0.7) continue;   // 排除橫幅圖
      }
      return { buf, info, source: 'bing', from: imgUrl, title: query };
    } catch (e) { /* 換下一張 */ }
    await sleep(100);
  }
  return null;
}

// --------------------------------------------------------------- 主流程

function slugifyProduct(brandName, productName) {
  const base = `${brandName}-${productName}`
    .replace(/[^A-Za-z0-9一-鿿]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'product';
}

function loadExisting() {
  let manifest = {};
  let sources = {};
  try {
    const g = {};
    const code = fs.readFileSync(MANIFEST_PATH, 'utf8');
    new Function('globalThis', `var window; ${code}`)(g);
    manifest = g.productImages || {};
  } catch (e) { /* 沒有舊資料 */ }
  try { sources = JSON.parse(fs.readFileSync(SOURCES_PATH, 'utf8')); } catch (e) { /* 沒有舊資料 */ }
  return { manifest, sources };
}

async function fetchOne(brand, product) {
  // 0. 手動指定圖片網址
  if (product.imageUrl) {
    try {
      const { buf } = await httpGet(product.imageUrl, { asBuffer: true });
      const info = sniffImage(buf);
      if (info && buf.length > 3000) {
        return { buf, info, source: 'override', from: product.imageUrl, title: product.name };
      }
      console.log(`  [override] ${product.name}: 指定網址不是有效圖片，改用自動搜尋`);
    } catch (e) {
      console.log(`  [override] ${product.name}: 下載失敗（${e.message}），改用自動搜尋`);
    }
  }

  const scoreFn = buildMatcher(brand.name, product);
  const query = product.searchQuery || product.name;

  let hit = await trySystembolaget(query, scoreFn);
  if (hit) return hit;
  await sleep(100);

  hit = await tryShopify(query, scoreFn);
  if (hit) return hit;
  await sleep(100);

  hit = await tryBing(`${query} bottle`);
  if (hit) return hit;
  // 中文原名再試一次（台灣/中國產品在中文網站圖較多）
  if (query !== product.name) {
    hit = await tryBing(product.name);
    if (hit) return hit;
  }
  return await tryBing(query, { tallOnly: false });
}

async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const { manifest: oldManifest, sources: oldSources } = loadExisting();
  const fullMode = REFETCH === 'all' && ONLY.length === 0;
  const manifest = fullMode ? {} : { ...oldManifest };
  const sources = fullMode ? {} : { ...oldSources };

  let okCount = 0, skipCount = 0, missCount = 0;
  const misses = [];

  for (const spiritKey of Object.keys(spiritsData)) {
    const info = spiritsData[spiritKey];
    if (!info || !info.brands) continue;

    for (const brand of info.brands) {
      const products = Array.isArray(brand.products)
        ? brand.products
        : (brandProducts && brandProducts[brand.name]) || [];
      for (const product of products) {
        if (!product.name) continue;
        if (ONLY.length > 0 && !ONLY.includes(product.name)) continue;
        if (ONLY.length === 0 && REFETCH !== 'all') {
          const existing = oldManifest[product.name];
          if (existing && fs.existsSync(path.join(ROOT, existing))) { skipCount++; continue; }
        }

        try {
          const hit = await fetchOne(brand, product);
          if (!hit) {
            console.log(`[MISS] ${product.name}: 三個來源都沒有合格的商品圖`);
            misses.push(product.name);
            missCount++;
            continue;
          }
          const fileName = `${slugifyProduct(brand.name, product.name)}${hit.info.ext}`;
          fs.writeFileSync(path.join(IMAGES_DIR, fileName), hit.buf);
          manifest[product.name] = `images/products/${fileName}`;
          sources[product.name] = { source: hit.source, from: hit.from, matchedTitle: hit.title };
          console.log(`[OK]   ${product.name}: ${fileName} (${(hit.buf.length / 1024).toFixed(0)} KB, ${hit.info.width}x${hit.info.height}) via ${hit.source}`);
          okCount++;
        } catch (e) {
          console.log(`[ERR]  ${product.name}: ${e.message}`);
          misses.push(product.name);
          missCount++;
        }
        await sleep(150);
      }
    }
  }

  // 寫 manifest（排序保持 diff 穩定）
  const sorted = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  const js =
    `// 由 scripts/fetch-product-images.js 自動產生，請勿手動編輯\n` +
    `// 鍵：產品名稱 (product.name)；值：相對於 repo 根目錄的圖片路徑\n` +
    `(function (g) { g.productImages = ${JSON.stringify(sorted, null, 2)}; })` +
    `(typeof window !== 'undefined' ? window : globalThis);\n`;
  fs.writeFileSync(MANIFEST_PATH, js);

  const sortedSources = {};
  for (const k of Object.keys(sources).sort()) sortedSources[k] = sources[k];
  fs.writeFileSync(SOURCES_PATH, JSON.stringify(sortedSources, null, 2) + '\n');

  // 全量模式：清掉 manifest 沒有引用的舊圖
  if (fullMode) {
    const referenced = new Set(Object.values(sorted).map(p => path.basename(p)));
    for (const f of fs.readdirSync(IMAGES_DIR)) {
      if (!referenced.has(f)) {
        fs.unlinkSync(path.join(IMAGES_DIR, f));
        console.log(`[CLEAN] 移除未引用的舊圖 ${f}`);
      }
    }
  }

  console.log(`\n完成：${okCount} 張下載 / ${skipCount} 已有跳過 / ${missCount} 沒抓到`);
  if (misses.length) console.log('沒抓到的產品：\n  - ' + misses.join('\n  - '));
}

main().catch(e => { console.error(e); process.exit(1); });
