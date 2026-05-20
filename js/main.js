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

function renderBrands(brands, defaultBottleColor, defaultLabelColor) {
  const el = document.getElementById('brandsGrid');
  if (!el) return;

  el.innerHTML = brands.map((b, idx) => {
    const label = getBottleLabel(b.name);
    const bottleColor = b.bottleColor || defaultBottleColor || '#b87333';
    const labelColor = b.labelColor || defaultLabelColor || '#f0d878';
    const uniqueId = `b${idx}-${Math.random().toString(36).slice(2, 8)}`;
    return `
      <div class="brand-card" data-country="${b.country}" data-category="${b.category}" data-name="${b.name.toLowerCase()}" data-idx="${idx}">
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
    `;
  }).join('');

  // 啟動 Wikipedia 圖片懶載入
  el.querySelectorAll('.brand-card').forEach(card => {
    const idx = parseInt(card.dataset.idx, 10);
    const brand = brands[idx];
    if (brand && brand.wikiPage) {
      observeForImageLoad(card, brand);
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
  document.querySelectorAll('#brandsGrid .brand-card').forEach(card => {
    card.style.display = (country === '全部' || card.dataset.country === country) ? '' : 'none';
  });
}

function initSearch(brands) {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    document.querySelectorAll('#brandsGrid .brand-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(keyword) ? '' : 'none';
    });
    const allBtn = document.querySelector('.filter-btn[data-filter="全部"]');
    if (allBtn && keyword) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  const spiritKey = document.body.dataset.spirit;
  if (spiritKey && window.spiritsData) {
    renderSpiritPage(spiritKey);
  }
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });
});
