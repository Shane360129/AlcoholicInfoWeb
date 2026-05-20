// ============================================
// 烈酒知識網 - 主要 JS 邏輯
// ============================================

const WIKI_CACHE_KEY = 'spirits_wiki_image_cache_v2';
const WIKI_CACHE_TTL_HIT = 7 * 24 * 60 * 60 * 1000; // 命中 7 天
const WIKI_CACHE_TTL_MISS = 24 * 60 * 60 * 1000;    // 未命中只快取 1 天，避免暫時失敗被卡住

function loadWikiCache() {
  try {
    const raw = localStorage.getItem(WIKI_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

function saveWikiCache(cache) {
  try {
    localStorage.setItem(WIKI_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // localStorage 滿了就忽略
  }
}

function normalizeWikiTitle(pageTitle) {
  try {
    return decodeURIComponent(pageTitle).replace(/_/g, ' ');
  } catch (e) {
    return pageTitle.replace(/_/g, ' ');
  }
}

// 透過 MediaWiki Action API 取得頁面縮圖
// 使用 redirects=1 自動跟隨頁面重定向（解決如 Kavalan_Distillery → Kavalan distillery 等大小寫問題）
// origin=* 為 CORS 必須
async function fetchWikiThumbnail(pageTitle, lang) {
  if (!pageTitle) return null;
  const cache = loadWikiCache();
  const cacheKey = `${lang || 'en'}:${pageTitle}`;
  const cached = cache[cacheKey];
  if (cached) {
    const ttl = cached.url ? WIKI_CACHE_TTL_HIT : WIKI_CACHE_TTL_MISS;
    if (Date.now() - cached.ts < ttl) return cached.url;
  }

  const language = lang || 'en';
  const title = normalizeWikiTitle(pageTitle);
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'pageimages',
    piprop: 'thumbnail|original',
    pithumbsize: '400',
    redirects: '1',
    origin: '*',
    titles: title
  });
  const apiUrl = `https://${language}.wikipedia.org/w/api.php?${params.toString()}`;

  try {
    const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      cache[cacheKey] = { url: null, ts: Date.now() };
      saveWikiCache(cache);
      return null;
    }
    const data = await res.json();
    const pages = (data && data.query && data.query.pages) || {};
    let thumb = null;
    for (const pid in pages) {
      const p = pages[pid];
      if (p && p.thumbnail && p.thumbnail.source) { thumb = p.thumbnail.source; break; }
      if (p && p.original && p.original.source) { thumb = p.original.source; break; }
    }
    cache[cacheKey] = { url: thumb, ts: Date.now() };
    saveWikiCache(cache);
    return thumb;
  } catch (e) {
    return null;
  }
}

function getBottleLabel(name) {
  const cnMatch = name.match(/[一-龥]+/);
  if (cnMatch) return cnMatch[0].substring(0, 4);
  const parts = name.split(/\s+/);
  return parts.slice(0, 2).map(p => p[0] || '').join('').toUpperCase() || name.substring(0, 3);
}

function createBottleSVG(bottleColor, labelColor, label, uniqueId) {
  return `
    <svg class="bottle-svg" viewBox="0 0 60 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="g-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${bottleColor};stop-opacity:0.8"/>
          <stop offset="50%" style="stop-color:${bottleColor};stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${bottleColor};stop-opacity:0.7"/>
        </linearGradient>
      </defs>
      <rect x="22" y="6" width="16" height="14" fill="#2a1a10" rx="1"/>
      <rect x="20" y="18" width="20" height="4" fill="#1a0f08"/>
      <rect x="24" y="22" width="12" height="18" fill="url(#g-${uniqueId})"/>
      <path d="M 24 40 L 12 56 L 12 130 Q 12 134 16 134 L 44 134 Q 48 134 48 130 L 48 56 L 36 40 Z"
            fill="url(#g-${uniqueId})" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
      <path d="M 15 60 L 15 125 L 18 125 L 18 60 Z" fill="rgba(255,255,255,0.25)"/>
      <rect x="14" y="75" width="32" height="40" fill="${labelColor}" rx="1"/>
      <rect x="14" y="75" width="32" height="40" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="0.5" rx="1"/>
      <text x="30" y="98" text-anchor="middle" font-family="serif" font-size="9" font-weight="600" fill="#2a1810">${label}</text>
    </svg>
  `;
}

// 從本地 manifest 取得圖片路徑（由 scripts/fetch-wiki-images.js 產生的 wiki-images.js）
// 從 /pages/*.html 載入時需加上 ../ 前綴
function resolveLocalWikiImage(brand) {
  if (!window.wikiImages) return null;
  const relPath = window.wikiImages[brand.name];
  if (!relPath) return null;
  const prefix = document.body.dataset.spirit ? '../' : '';
  return prefix + relPath;
}

async function loadWikiImage(cardEl, brand) {
  if (!brand.wikiPage) return;

  // 優先使用 repo 內預先快取的本地圖片，失敗才打 Wikipedia API
  let url = resolveLocalWikiImage(brand);
  if (!url) url = await fetchWikiThumbnail(brand.wikiPage, brand.wikiLang);
  if (!url) return;

  const bottleEl = cardEl.querySelector('.brand-bottle');
  if (!bottleEl) return;

  const img = new Image();
  img.alt = brand.name;
  img.className = 'brand-image';
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.onload = () => {
    bottleEl.innerHTML = '';
    bottleEl.appendChild(img);
    bottleEl.classList.add('has-image');
  };
  // 載入失敗就保留原 SVG
  img.src = url;
}

function observeForImageLoad(cardEl, brand) {
  if (!('IntersectionObserver' in window)) {
    loadWikiImage(cardEl, brand);
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadWikiImage(cardEl, brand);
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });
  observer.observe(cardEl);
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function renderSpiritPage(spiritKey) {
  const data = window.spiritsData[spiritKey];
  if (!data) {
    console.error('找不到該酒類資料:', spiritKey);
    return;
  }

  const headerEl = document.getElementById('pageHeader');
  if (headerEl) {
    headerEl.innerHTML = `
      <span class="icon-large">${data.icon}</span>
      <h1>${data.name}</h1>
      <span class="name-en">${data.nameEn}</span>
    `;
  }

  const descEl = document.getElementById('description');
  if (descEl) {
    descEl.innerHTML = `
      <p>${data.description}</p>
      ${data.history ? `<p style="margin-top:1rem;color:var(--color-text-muted);">${data.history}</p>` : ''}
    `;
  }

  const infoEl = document.getElementById('infoGrid');
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="info-cell"><div class="label">酒精濃度</div><div class="value">${data.abv}</div></div>
      <div class="info-cell"><div class="label">主要產地</div><div class="value">${data.origin}</div></div>
      <div class="info-cell"><div class="label">原料</div><div class="value">${data.rawMaterial}</div></div>
    `;
  }

  const typesEl = document.getElementById('typesList');
  if (typesEl && data.types && data.types.length > 0) {
    typesEl.innerHTML = data.types.map(t => `
      <div class="type-item"><h4>${t.name}</h4><p>${t.desc}</p></div>
    `).join('');
  } else if (typesEl) {
    const typesSection = document.getElementById('typesSection');
    if (typesSection) typesSection.style.display = 'none';
  }

  const gradesEl = document.getElementById('gradesTable');
  if (gradesEl && data.grades && data.grades.length > 0) {
    gradesEl.innerHTML = `
      <table class="grade-table">
        <thead><tr><th>等級</th><th>陳年要求</th></tr></thead>
        <tbody>
          ${data.grades.map(g => `<tr><td><strong>${g.name}</strong></td><td>${g.desc}</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  }

  renderBrands(data.brands, data.bottleColor, data.labelColor);
  initFilters(data.brands);
  initSearch(data.brands);
}

function brandSlug(brand) {
  if (brand.slug) return brand.slug;
  const matches = brand.name.match(/[A-Za-z][A-Za-z0-9'.&\-\s]+/g);
  if (matches) {
    const s = matches.join(' ').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (s) return s;
  }
  if (brand.wikiPage) {
    return brand.wikiPage.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
  }
  return brand.name.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/^-+|-+$/g, '');
}

function findBrandBySlug(slug) {
  if (!window.spiritsData) return null;
  for (const spiritKey of Object.keys(window.spiritsData)) {
    const info = window.spiritsData[spiritKey];
    if (!info || !info.brands) continue;
    for (const b of info.brands) {
      if (brandSlug(b) === slug) return { brand: b, spirit: spiritKey, spiritInfo: info };
    }
  }
  return null;
}

function renderBrands(brands, defaultBottleColor, defaultLabelColor) {
  const el = document.getElementById('brandsGrid');
  if (!el) return;

  el.innerHTML = brands.map((b, idx) => {
    const label = getBottleLabel(b.name);
    const bottleColor = b.bottleColor || defaultBottleColor || '#b87333';
    const labelColor = b.labelColor || defaultLabelColor || '#f0d878';
    const uniqueId = `b${idx}-${Math.random().toString(36).slice(2, 8)}`;
    const slug = brandSlug(b);
    return `
      <a class="brand-card-link" href="brand.html?b=${encodeURIComponent(slug)}" data-country="${b.country}" data-category="${b.category}" data-name="${b.name.toLowerCase()}" data-idx="${idx}">
        <div class="brand-card">
          <div class="brand-bottle">
            ${createBottleSVG(bottleColor, labelColor, label, uniqueId)}
          </div>
          <div class="brand-info">
            <div class="brand-card-header">
              <div class="brand-name">${b.name}</div>
              <div class="brand-tags">
                <span class="brand-tag country">${b.country}</span>
                <span class="brand-tag">${b.category}</span>
              </div>
            </div>
            <p class="brand-desc">${b.desc}</p>
            ${b.price ? `<div class="brand-price"><span class="price-icon">💰</span> <span class="price-text">${b.price}</span></div>` : ''}
          </div>
        </div>
      </a>
    `;
  }).join('');

  // 啟動 Wikipedia 圖片懶載入
  el.querySelectorAll('.brand-card-link').forEach(linkEl => {
    const idx = parseInt(linkEl.dataset.idx, 10);
    const brand = brands[idx];
    if (brand && brand.wikiPage) {
      observeForImageLoad(linkEl.querySelector('.brand-card'), brand);
    }
  });
}

function initFilters(brands) {
  const filterBar = document.getElementById('filterBar');
  if (!filterBar) return;
  const countries = ['全部', ...new Set(brands.map(b => b.country))];
  filterBar.innerHTML = countries.map((c, i) => `
    <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${c}">${c}</button>
  `).join('');
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBrands(btn.dataset.filter);
    });
  });
}

function filterBrands(country) {
  document.querySelectorAll('#brandsGrid .brand-card-link').forEach(link => {
    link.style.display = (country === '全部' || link.dataset.country === country) ? '' : 'none';
  });
}

function initSearch(brands) {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    document.querySelectorAll('#brandsGrid .brand-card-link').forEach(link => {
      link.style.display = link.textContent.toLowerCase().includes(keyword) ? '' : 'none';
    });
    const allBtn = document.querySelector('.filter-btn[data-filter="全部"]');
    if (allBtn && keyword) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
    }
  });
}

// ============ 品牌詳情頁 ============

function resolveLocalProductImage(product) {
  if (!window.productImages) return null;
  const relPath = window.productImages[product.name];
  if (!relPath) return null;
  // 此頁固定在 /pages/ 之下，永遠加上 ../
  return '../' + relPath;
}

function renderBrandPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('b');
  if (!slug) {
    document.body.innerHTML = '<div style="padding:4rem;text-align:center;">缺少品牌參數 ?b=&lt;slug&gt;</div>';
    return;
  }

  const found = findBrandBySlug(slug);
  if (!found) {
    document.body.innerHTML = `<div style="padding:4rem;text-align:center;">找不到品牌：${slug}</div>`;
    return;
  }
  const { brand, spirit, spiritInfo } = found;

  // 標題與 meta
  document.title = `${brand.name} | 烈酒知識網`;
  const descMeta = document.getElementById('pageDesc');
  if (descMeta) descMeta.setAttribute('content', `${brand.name}（${brand.country}）— ${brand.desc}`);

  // 返回連結
  const backLink = document.getElementById('backLink');
  if (backLink) {
    backLink.href = `${spirit}.html`;
    backLink.textContent = `← 返回${spiritInfo.name}`;
  }

  // 頁面 header
  const headerEl = document.getElementById('brandHeader');
  if (headerEl) {
    headerEl.innerHTML = `
      <span class="icon-large">${spiritInfo.icon}</span>
      <h1>${brand.name}</h1>
      <span class="name-en">${brand.country} · ${brand.category}</span>
    `;
  }

  // 描述
  const descEl = document.getElementById('brandDescription');
  if (descEl) {
    descEl.innerHTML = `<p style="font-size:1.05rem;line-height:1.8;">${brand.desc}</p>`;
  }

  // 資訊網格
  const infoEl = document.getElementById('brandInfoGrid');
  if (infoEl) {
    const rows = [
      { label: '所屬類別', value: spiritInfo.name },
      { label: '產地', value: brand.country },
      { label: '類型', value: brand.category }
    ];
    if (brand.price) rows.push({ label: '台灣參考價', value: brand.price });
    infoEl.innerHTML = rows.map(r =>
      `<div class="info-cell"><div class="label">${r.label}</div><div class="value">${r.value}</div></div>`
    ).join('');
  }

  // 產品列表
  renderProducts(brand);
}

function getBrandProducts(brand) {
  if (Array.isArray(brand.products)) return brand.products;
  if (window.brandProducts && Array.isArray(window.brandProducts[brand.name])) {
    return window.brandProducts[brand.name];
  }
  return [];
}

function renderProducts(brand) {
  const gridEl = document.getElementById('productsGrid');
  const noneEl = document.getElementById('noProducts');
  if (!gridEl) return;

  const products = getBrandProducts(brand);
  if (products.length === 0) {
    gridEl.innerHTML = '';
    if (noneEl) noneEl.style.display = 'block';
    return;
  }
  if (noneEl) noneEl.style.display = 'none';

  gridEl.innerHTML = products.map((p, idx) => {
    const label = getBottleLabel(p.name);
    const bottleColor = brand.bottleColor || '#b87333';
    const labelColor = brand.labelColor || '#f0d878';
    const uniqueId = `p${idx}-${Math.random().toString(36).slice(2, 8)}`;
    return `
      <div class="product-card" data-idx="${idx}">
        <div class="product-image-box">
          ${createBottleSVG(bottleColor, labelColor, label, uniqueId)}
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          ${p.desc ? `<p class="product-desc">${p.desc}</p>` : ''}
          ${p.price ? `<div class="product-price"><span class="price-icon">💰</span> <span class="price-text">${p.price}</span></div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // 懶載入產品圖
  gridEl.querySelectorAll('.product-card').forEach(card => {
    const idx = parseInt(card.dataset.idx, 10);
    const product = products[idx];
    if (product) observeForProductImageLoad(card, product);
  });
}

function observeForProductImageLoad(cardEl, product) {
  if (!('IntersectionObserver' in window)) {
    loadProductImage(cardEl, product);
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadProductImage(cardEl, product);
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });
  observer.observe(cardEl);
}

async function loadProductImage(cardEl, product) {
  const url = resolveLocalProductImage(product);
  if (!url) return; // 沒有本地圖就保留 SVG（不打 Commons API，避免大量請求）

  const box = cardEl.querySelector('.product-image-box');
  if (!box) return;
  const img = new Image();
  img.alt = product.name;
  img.className = 'product-image';
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.onload = () => {
    box.innerHTML = '';
    box.appendChild(img);
    box.classList.add('has-image');
  };
  img.src = url;
}

document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  const spiritKey = document.body.dataset.spirit;
  if (spiritKey && window.spiritsData) {
    renderSpiritPage(spiritKey);
  } else if (document.body.dataset.brandPage && window.spiritsData) {
    renderBrandPage();
  }
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });
});
