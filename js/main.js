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
  const bottleEl = cardEl.querySelector('.brand-bottle');

  // 優先使用 repo 內預先快取的本地圖片，失敗才打 Wikipedia API
  let url = resolveLocalWikiImage(brand);
  if (!url) url = await fetchWikiThumbnail(brand.wikiPage, brand.wikiLang);
  if (!url) {
    if (bottleEl) bottleEl.classList.remove('loading');
    return;
  }

  if (!bottleEl) return;

  const img = new Image();
  img.alt = brand.name;
  img.className = 'brand-image';
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.onload = () => {
    bottleEl.innerHTML = '';
    bottleEl.classList.remove('loading');
    bottleEl.appendChild(img);
    bottleEl.classList.add('has-image');
  };
  img.onerror = () => bottleEl.classList.remove('loading');
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

  currentBrands = data.brands;
  renderBrands(data.brands, data.bottleColor, data.labelColor);
  initToolbar(data.brands);
  initSearch(data.brands);
  applyFilters(); // 初始化結果計數
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

// 目前頁面的品牌資料（供 toolbar 排序/篩選使用）
let currentBrands = [];

function parsePrice(p) {
  if (!p) return Number.POSITIVE_INFINITY;
  const m = p.match(/[\d,]+/);
  if (!m) return Number.POSITIVE_INFINITY;
  return parseInt(m[0].replace(/,/g, ''), 10);
}

// 以品牌名稱中的 Latin 字段做排序鍵：對「大摩 Dalmore」這類混合名稱，
// 取出最長的英文部分（Dalmore）；若整名皆中文則退回小寫整名。
function nameSortKey(name) {
  if (!name) return '';
  const latin = name.match(/[A-Za-z][A-Za-z0-9'.&\-\s]+/g);
  if (latin && latin.length) {
    return latin.reduce((a, b) => (b.length > a.length ? b : a)).trim().toLowerCase();
  }
  return name.toLowerCase();
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
    const hasWiki = !!b.wikiPage;
    return `
      <a class="brand-card-link" href="brand.html?b=${encodeURIComponent(slug)}" data-country="${b.country}" data-category="${b.category}" data-name="${b.name.toLowerCase()}" data-price="${parsePrice(b.price)}" data-idx="${idx}">
        <div class="brand-card">
          <div class="brand-bottle${hasWiki ? ' loading' : ''}">
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

function buildChip(label, group, value, active) {
  return `<button type="button" class="filter-btn${active ? ' active' : ''}" data-group="${group}" data-value="${value}" aria-pressed="${active ? 'true' : 'false'}">${label}</button>`;
}

function initToolbar(brands) {
  const filterBar = document.getElementById('filterBar');
  if (!filterBar) return;

  const countries = ['全部', ...Array.from(new Set(brands.map(b => b.country)))];
  const categories = ['全部', ...Array.from(new Set(brands.map(b => b.category)))];

  filterBar.classList.add('toolbar');
  filterBar.innerHTML = `
    <div class="toolbar-row">
      <span class="toolbar-label">產地</span>
      <div class="toolbar-chips" data-group="country">
        ${countries.map((c, i) => buildChip(c, 'country', c, i === 0)).join('')}
      </div>
    </div>
    <div class="toolbar-row">
      <span class="toolbar-label">類型</span>
      <div class="toolbar-chips" data-group="category">
        ${categories.map((c, i) => buildChip(c, 'category', c, i === 0)).join('')}
      </div>
      <div class="toolbar-sort-group">
        <label for="sortSelect" class="toolbar-label">排序</label>
        <select id="sortSelect" class="toolbar-sort">
          <option value="default">預設順序</option>
          <option value="name-asc">名稱 A → Z</option>
          <option value="name-desc">名稱 Z → A</option>
          <option value="price-asc">價格：低 → 高</option>
          <option value="price-desc">價格：高 → 低</option>
        </select>
      </div>
    </div>
  `;

  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      filterBar.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilters();
    });
  });

  const sortSel = filterBar.querySelector('#sortSelect');
  if (sortSel) sortSel.addEventListener('change', applyFilters);

  // 結果計數元素：插在 toolbar 之後、grid 之前
  let counter = document.getElementById('resultCount');
  if (!counter) {
    counter = document.createElement('p');
    counter.id = 'resultCount';
    counter.className = 'result-count';
    filterBar.insertAdjacentElement('afterend', counter);
  }
}

function initSearch(brands) {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.setAttribute('aria-label', '搜尋品牌');
  input.addEventListener('input', applyFilters);
}

function getActiveFilter(group) {
  const btn = document.querySelector(`.filter-btn[data-group="${group}"].active`);
  return btn ? btn.dataset.value : '全部';
}

function applyFilters() {
  const grid = document.getElementById('brandsGrid');
  if (!grid) return;
  const country = getActiveFilter('country');
  const category = getActiveFilter('category');
  const keyword = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const sort = document.getElementById('sortSelect')?.value || 'default';

  const cards = Array.from(grid.querySelectorAll('.brand-card-link'));
  let visible = 0;
  cards.forEach(card => {
    const matchCountry = country === '全部' || card.dataset.country === country;
    const matchCategory = category === '全部' || card.dataset.category === category;
    const matchKeyword = !keyword || card.textContent.toLowerCase().includes(keyword);
    const show = matchCountry && matchCategory && matchKeyword;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  if (sort !== 'default') {
    const sorted = cards.slice().sort((a, b) => {
      const aIdx = parseInt(a.dataset.idx, 10);
      const bIdx = parseInt(b.dataset.idx, 10);
      const aBrand = currentBrands[aIdx] || {};
      const bBrand = currentBrands[bIdx] || {};
      if (sort === 'name-asc') return nameSortKey(aBrand.name).localeCompare(nameSortKey(bBrand.name));
      if (sort === 'name-desc') return nameSortKey(bBrand.name).localeCompare(nameSortKey(aBrand.name));
      if (sort === 'price-asc') return parsePrice(aBrand.price) - parsePrice(bBrand.price);
      if (sort === 'price-desc') return parsePrice(bBrand.price) - parsePrice(aBrand.price);
      return 0;
    });
    sorted.forEach(c => grid.appendChild(c));
  }

  // 結果計數
  const counter = document.getElementById('resultCount');
  if (counter) {
    counter.innerHTML = `共 <strong>${visible}</strong> / ${cards.length} 個品牌${keyword ? `（關鍵字「${escapeHtml(keyword)}」）` : ''}`;
  }

  // 空狀態
  let emptyEl = grid.querySelector('.empty-state');
  if (visible === 0) {
    if (!emptyEl) {
      emptyEl = document.createElement('div');
      emptyEl.className = 'empty-state';
      grid.appendChild(emptyEl);
    }
    emptyEl.innerHTML = `
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-title">沒有符合條件的品牌</div>
      <p>試試調整篩選條件，或<button type="button" class="filter-btn" id="resetFilters" style="margin-left:0.3rem;">重設篩選</button></p>
    `;
    emptyEl.style.display = '';
    const reset = emptyEl.querySelector('#resetFilters');
    if (reset) reset.addEventListener('click', resetFilters);
  } else if (emptyEl) {
    emptyEl.style.display = 'none';
  }
}

function resetFilters() {
  document.querySelectorAll('.filter-btn[data-group]').forEach(btn => {
    const isAll = btn.dataset.value === '全部';
    btn.classList.toggle('active', isAll);
    btn.setAttribute('aria-pressed', isAll ? 'true' : 'false');
  });
  const search = document.getElementById('searchInput');
  if (search) search.value = '';
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.value = 'default';
  applyFilters();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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

  // 上一個 / 下一個品牌
  renderBrandPager(brand, spirit, spiritInfo);
}

function renderBrandPager(currentBrand, spirit, spiritInfo) {
  const brands = spiritInfo.brands || [];
  const idx = brands.findIndex(b => brandSlug(b) === brandSlug(currentBrand));
  if (idx === -1) return;
  const prev = idx > 0 ? brands[idx - 1] : null;
  const next = idx < brands.length - 1 ? brands[idx + 1] : null;

  const productsSection = document.getElementById('productsGrid')?.closest('.section');
  if (!productsSection) return;
  const container = productsSection.querySelector('.container');
  if (!container) return;

  // 移除舊的（重新進入頁面時）
  container.querySelectorAll('.brand-pager').forEach(n => n.remove());

  const pager = document.createElement('nav');
  pager.className = 'brand-pager';
  pager.setAttribute('aria-label', '同類別品牌');

  const buildLink = (b, dir) => {
    if (!b) return `<span class="brand-pager-spacer"></span>`;
    return `
      <a class="brand-pager-link ${dir}" href="brand.html?b=${encodeURIComponent(brandSlug(b))}">
        <span class="brand-pager-direction">${dir === 'prev' ? '← 上一個品牌' : '下一個品牌 →'}</span>
        <span class="brand-pager-name">${escapeHtml(b.name)}</span>
      </a>
    `;
  };

  pager.innerHTML = `${buildLink(prev, 'prev')}${buildLink(next, 'next')}`;
  container.appendChild(pager);
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
      <div class="product-card" data-idx="${idx}" tabindex="0" role="button" aria-label="${escapeHtml(p.name)} - 點擊放大">
        <div class="product-image-box loading">
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
    if (product) {
      observeForProductImageLoad(card, product);
      const openLb = () => openLightbox(card, product);
      card.addEventListener('click', openLb);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(); }
      });
    }
  });
}

// ============ Lightbox ============

function ensureLightbox() {
  let lb = document.getElementById('productLightbox');
  if (lb) return lb;
  lb = document.createElement('div');
  lb.id = 'productLightbox';
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', '產品大圖');
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="關閉">×</button>
    <div class="lightbox-content">
      <div class="lightbox-media"></div>
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lb);

  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };
  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  return lb;
}

function openLightbox(cardEl, product) {
  const box = cardEl.querySelector('.product-image-box');
  if (!box) return;
  const lb = ensureLightbox();
  const media = lb.querySelector('.lightbox-media');
  const cap = lb.querySelector('.lightbox-caption');
  media.innerHTML = '';

  const imgEl = box.querySelector('img.product-image');
  let hasRealImg = false;
  if (imgEl) {
    const big = document.createElement('img');
    big.className = 'lightbox-img';
    big.src = imgEl.src;
    big.alt = product.name;
    media.appendChild(big);
    hasRealImg = true;
  } else {
    const svgEl = box.querySelector('svg.bottle-svg');
    if (!svgEl) return;
    const clone = svgEl.cloneNode(true);
    clone.classList.add('lightbox-svg');
    clone.removeAttribute('aria-hidden');
    clone.setAttribute('role', 'img');
    clone.setAttribute('aria-label', product.name);
    media.appendChild(clone);
  }

  cap.innerHTML = `
    <div>${escapeHtml(product.name)}</div>
    ${product.price ? `<div class="product-price">${escapeHtml(product.price)}</div>` : ''}
    ${hasRealImg ? '' : '<div class="lightbox-placeholder-note">圖示為示意圖（暫無實際產品圖）</div>'}
  `;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lightbox-close').focus();
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
  const box = cardEl.querySelector('.product-image-box');
  const url = resolveLocalProductImage(product);
  if (!url) {
    if (box) box.classList.remove('loading');
    return;
  }

  if (!box) return;
  const img = new Image();
  img.alt = product.name;
  img.className = 'product-image';
  img.loading = 'lazy';
  img.referrerPolicy = 'no-referrer';
  img.onload = () => {
    box.innerHTML = '';
    box.classList.remove('loading');
    box.appendChild(img);
    box.classList.add('has-image');
  };
  img.onerror = () => box.classList.remove('loading');
  img.src = url;
}

// ============ 全站共用：skip-nav / 漢堡選單 / 麵包屑 ============

function injectSkipNav() {
  if (document.querySelector('.skip-nav')) return;
  const link = document.createElement('a');
  link.href = '#mainContent';
  link.className = 'skip-nav';
  link.textContent = '跳至主要內容';
  document.body.insertBefore(link, document.body.firstChild);

  // 找到第一個 main / section 加上 id 給 skip-nav 跳轉
  let target = document.querySelector('main') || document.querySelector('header.page-header') || document.querySelector('.section');
  if (target && !target.id) target.id = 'mainContent';
}

function initMobileMenu() {
  const navContainer = document.querySelector('.nav-container');
  if (!navContainer) return;
  const navMenu = navContainer.querySelector('.nav-menu');
  if (!navMenu) return;
  if (navContainer.querySelector('.nav-toggle')) return; // 已注入

  navMenu.id = navMenu.id || 'navMenu';
  const btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', '切換主選單');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', navMenu.id);
  btn.innerHTML = '<span></span><span></span><span></span>';
  navContainer.appendChild(btn);

  btn.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // 點選單外關閉
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('open')) return;
    if (navContainer.contains(e.target)) return;
    navMenu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });
}

function injectBreadcrumb() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onCategoryPage = !!document.body.dataset.spirit;
  const onBrandPage = !!document.body.dataset.brandPage;
  if (!onCategoryPage && !onBrandPage) return;

  // 計算路徑前綴：/pages/*.html 下要回到 ../index.html
  const inPagesDir = window.location.pathname.includes('/pages/');
  const homeHref = inPagesDir ? '../index.html' : 'index.html';

  let items = [{ label: '首頁', href: homeHref }];

  if (onCategoryPage) {
    const data = window.spiritsData?.[document.body.dataset.spirit];
    items.push({ label: data?.name || document.body.dataset.spirit, current: true });
  } else if (onBrandPage) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('b');
    if (slug && window.spiritsData) {
      const found = findBrandBySlug(slug);
      if (found) {
        items.push({ label: found.spiritInfo.name, href: `${found.spirit}.html` });
        items.push({ label: found.brand.name, current: true });
      }
    }
  }

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb';
  nav.setAttribute('aria-label', '麵包屑導覽');
  nav.innerHTML = `
    <div class="breadcrumb-inner">
      <ol>
        ${items.map(it => it.current
          ? `<li aria-current="page">${escapeHtml(it.label)}</li>`
          : `<li><a href="${it.href}">${escapeHtml(it.label)}</a></li>`).join('')}
      </ol>
    </div>
  `;
  navbar.insertAdjacentElement('afterend', nav);
}

document.addEventListener('DOMContentLoaded', () => {
  injectSkipNav();
  initMobileMenu();
  initBackToTop();

  const spiritKey = document.body.dataset.spirit;
  if (spiritKey && window.spiritsData) {
    renderSpiritPage(spiritKey);
  } else if (document.body.dataset.brandPage && window.spiritsData) {
    renderBrandPage();
  }

  injectBreadcrumb();

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });
});
