// 從 Wikimedia Commons 搜尋每個產品的代表圖，存到 images/products/
// 並產生 data/product-images.js（product.name -> 本地路徑）
//
// 由 .github/workflows/fetch-wiki-images.yml 在 GitHub Actions 中執行

const fs = require('fs');
const path = require('path');

const spiritsData = require('../data/spirits.js');
const brandProducts = require('../data/brand-products.js');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images', 'products');
const MANIFEST_PATH = path.join(ROOT, 'data', 'product-images.js');

const USER_AGENT =
  'AlcoholicInfoWeb-ProductImageFetcher/1.0 (https://github.com/Shane360129/AlcoholicInfoWeb; static site image cache)';

async function commonsSearch(query) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: `${query} bottle`,
    srnamespace: '6',          // File: namespace
    srlimit: '5',
    format: 'json'
  });
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`Commons search HTTP ${res.status}`);
  const data = await res.json();
  const results = (data.query && data.query.search) || [];
  return results.map(r => r.title); // ["File:...", ...]
}

async function commonsImageUrl(fileTitle) {
  const params = new URLSearchParams({
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url|mime|size',
    iiurlwidth: '500',
    format: 'json'
  });
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`Commons info HTTP ${res.status}`);
  const data = await res.json();
  const pages = (data.query && data.query.pages) || {};
  for (const pid in pages) {
    const ii = pages[pid].imageinfo;
    if (ii && ii[0]) {
      return {
        thumb: ii[0].thumburl || ii[0].url,
        mime: ii[0].mime,
        width: ii[0].width,
        height: ii[0].height
      };
    }
  }
  return null;
}

async function downloadImage(imgUrl, destPath) {
  const res = await fetch(imgUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

function slugifyProduct(brandName, productName) {
  const base = `${brandName}-${productName}`
    .replace(/[^A-Za-z0-9一-鿿]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'product';
}

function extFromMime(mime) {
  if (!mime) return '.jpg';
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/svg+xml') return '.svg';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'image/gif') return '.gif';
  return '.jpg';
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const manifest = {};
  let okCount = 0, skipCount = 0, errCount = 0;

  for (const spiritKey of Object.keys(spiritsData)) {
    const info = spiritsData[spiritKey];
    if (!info || !info.brands) continue;

    for (const brand of info.brands) {
      const products = Array.isArray(brand.products)
        ? brand.products
        : (brandProducts && brandProducts[brand.name]) || [];
      for (const product of products) {
        if (!product.name) continue;
        const query = product.searchQuery || product.name;
        try {
          const files = await commonsSearch(query);
          if (files.length === 0) {
            console.log(`[SKIP] ${product.name}: 沒搜到`);
            skipCount++;
            await sleep(120);
            continue;
          }

          let chosen = null;
          for (const f of files) {
            try {
              const info = await commonsImageUrl(f);
              if (info && info.thumb && info.mime && info.mime.startsWith('image/')) {
                chosen = { file: f, ...info };
                break;
              }
            } catch (e) { /* try next */ }
            await sleep(80);
          }

          if (!chosen) {
            console.log(`[SKIP] ${product.name}: 沒有可用圖檔`);
            skipCount++;
            continue;
          }

          const ext = extFromMime(chosen.mime);
          const fileName = `${slugifyProduct(brand.name, product.name)}${ext}`;
          const destPath = path.join(IMAGES_DIR, fileName);
          const relPath = `images/products/${fileName}`;
          const size = await downloadImage(chosen.thumb, destPath);
          console.log(`[OK]   ${product.name}: ${fileName} (${(size / 1024).toFixed(1)} KB) via ${chosen.file}`);
          manifest[product.name] = relPath;
          okCount++;
        } catch (e) {
          console.log(`[ERR]  ${product.name}: ${e.message}`);
          errCount++;
        }
        await sleep(180);
      }
    }
  }

  const sortedKeys = Object.keys(manifest).sort();
  const sorted = {};
  for (const k of sortedKeys) sorted[k] = manifest[k];

  const js =
    `// 由 scripts/fetch-product-images.js 自動產生，請勿手動編輯\n` +
    `// 鍵：產品名稱 (product.name)；值：相對於 repo 根目錄的圖片路徑\n` +
    `(function (g) { g.productImages = ${JSON.stringify(sorted, null, 2)}; })` +
    `(typeof window !== 'undefined' ? window : globalThis);\n`;
  fs.writeFileSync(MANIFEST_PATH, js);

  console.log(`\n完成：${okCount} 張下載 / ${skipCount} 無圖 / ${errCount} 失敗`);
}

main().catch(e => { console.error(e); process.exit(1); });
