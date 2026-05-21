// 從 Wikipedia 抓取所有烈酒品牌的縮圖，存到 images/wiki/
// 並產生 data/wiki-images.js 作為品牌名 → 本地路徑的對照表
//
// 在 GitHub Actions 中執行（workflow: fetch-wiki-images.yml）
// 本機執行： node scripts/fetch-wiki-images.js

const fs = require('fs');
const path = require('path');

const spiritsData = require('../data/spirits.js');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images', 'wiki');
const MANIFEST_PATH = path.join(ROOT, 'data', 'wiki-images.js');

const USER_AGENT =
  'AlcoholicInfoWeb-ImageFetcher/1.0 (https://github.com/Shane360129/AlcoholicInfoWeb; static site image cache)';

async function fetchWikiImageUrl(pageTitle, lang) {
  const language = lang || 'en';
  let title;
  try { title = decodeURIComponent(pageTitle); } catch (e) { title = pageTitle; }
  title = title.replace(/_/g, ' ');

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'pageimages',
    piprop: 'thumbnail|original',
    pithumbsize: '500',
    redirects: '1',
    titles: title
  });
  const url = `https://${language}.wikipedia.org/w/api.php?${params.toString()}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`API HTTP ${res.status}`);
  const data = await res.json();
  const pages = (data.query && data.query.pages) || {};
  for (const pid in pages) {
    const p = pages[pid];
    if (p.thumbnail && p.thumbnail.source) return p.thumbnail.source;
    if (p.original && p.original.source) return p.original.source;
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

function fileNameFromWikiPage(wikiPage, ext) {
  const safe = wikiPage
    .replace(/[^A-Za-z0-9]+/g, '_')
    .toLowerCase()
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);
  return `${safe || 'page'}${ext}`;
}

function extFromUrl(url) {
  try {
    const u = new URL(url);
    let ext = path.extname(u.pathname).toLowerCase();
    if (ext === '.jpeg') ext = '.jpg';
    if (['.jpg', '.png', '.svg', '.webp', '.gif'].includes(ext)) return ext;
  } catch (e) {}
  return '.jpg';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const manifest = {};
  const cachedByPage = new Map(); // wikiPage -> rel path (or null = no image)
  let okCount = 0, skipCount = 0, errCount = 0, reuseCount = 0;

  for (const spiritKey of Object.keys(spiritsData)) {
    const info = spiritsData[spiritKey];
    if (!info || !info.brands) continue;

    for (const brand of info.brands) {
      if (!brand.wikiPage) continue;

      if (cachedByPage.has(brand.wikiPage)) {
        const rel = cachedByPage.get(brand.wikiPage);
        if (rel) {
          manifest[brand.name] = rel;
          reuseCount++;
        }
        continue;
      }

      try {
        const imgUrl = await fetchWikiImageUrl(brand.wikiPage, brand.wikiLang);
        if (!imgUrl) {
          console.log(`[SKIP] ${brand.name} (${brand.wikiPage}): 無圖`);
          cachedByPage.set(brand.wikiPage, null);
          skipCount++;
          await sleep(120);
          continue;
        }

        const ext = extFromUrl(imgUrl);
        const fileName = fileNameFromWikiPage(brand.wikiPage, ext);
        const destPath = path.join(IMAGES_DIR, fileName);
        const relPath = `images/wiki/${fileName}`;

        const size = await downloadImage(imgUrl, destPath);
        console.log(`[OK]   ${brand.name}: ${fileName} (${(size / 1024).toFixed(1)} KB)`);
        manifest[brand.name] = relPath;
        cachedByPage.set(brand.wikiPage, relPath);
        okCount++;
      } catch (e) {
        console.log(`[ERR]  ${brand.name} (${brand.wikiPage}): ${e.message}`);
        cachedByPage.set(brand.wikiPage, null);
        errCount++;
      }

      await sleep(150);
    }
  }

  const sortedKeys = Object.keys(manifest).sort();
  const sortedManifest = {};
  for (const k of sortedKeys) sortedManifest[k] = manifest[k];

  const manifestJs =
    `// 由 scripts/fetch-wiki-images.js 自動產生，請勿手動編輯\n` +
    `// 鍵：品牌名稱 (brand.name)；值：相對於 repo 根目錄的圖片路徑\n` +
    `(function (g) { g.wikiImages = ${JSON.stringify(sortedManifest, null, 2)}; })` +
    `(typeof window !== 'undefined' ? window : globalThis);\n`;
  fs.writeFileSync(MANIFEST_PATH, manifestJs);

  console.log(
    `\n完成：${okCount} 張新下載 / ${reuseCount} 張共用 / ${skipCount} 無圖 / ${errCount} 失敗`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
