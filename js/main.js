// ============================================
// 烈酒知識網 - 主要 JS 邏輯
// ============================================

// 為品牌名取得簡短標籤（中文取最前面，英文取首字大寫）
function getBottleLabel(name) {
  // 取得中文部分（如有）
  const cnMatch = name.match(/[一-龥]+/);
  if (cnMatch) {
    return cnMatch[0].substring(0, 4);
  }
  // 否則取英文首字母
  const parts = name.split(/\s+/);
  return parts.slice(0, 2).map(p => p[0] || '').join('').toUpperCase() || name.substring(0, 3);
}

// 產生 SVG 酒瓶圖示
function createBottleSVG(bottleColor, labelColor, label) {
  return `
    <svg class="bottle-svg" viewBox="0 0 60 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="g-${label}-${bottleColor.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${bottleColor};stop-opacity:0.8"/>
          <stop offset="50%" style="stop-color:${bottleColor};stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${bottleColor};stop-opacity:0.7"/>
        </linearGradient>
      </defs>
      <!-- 瓶蓋 -->
      <rect x="22" y="6" width="16" height="14" fill="#2a1a10" rx="1"/>
      <rect x="20" y="18" width="20" height="4" fill="#1a0f08"/>
      <!-- 瓶頸 -->
      <rect x="24" y="22" width="12" height="18" fill="url(#g-${label}-${bottleColor.replace('#','')})"/>
      <!-- 瓶肩過渡 -->
      <path d="M 24 40 L 12 56 L 12 130 Q 12 134 16 134 L 44 134 Q 48 134 48 130 L 48 56 L 36 40 Z"
            fill="url(#g-${label}-${bottleColor.replace('#','')})" stroke="rgba(0,0,0,0.3)" stroke-width="0.5"/>
      <!-- 高光 -->
      <path d="M 15 60 L 15 125 L 18 125 L 18 60 Z" fill="rgba(255,255,255,0.25)"/>
      <!-- 標籤 -->
      <rect x="14" y="75" width="32" height="40" fill="${labelColor}" rx="1"/>
      <rect x="14" y="75" width="32" height="40" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="0.5" rx="1"/>
      <text x="30" y="98" text-anchor="middle" font-family="serif" font-size="9" font-weight="600" fill="#2a1810">${label}</text>
    </svg>
  `;
}

// 返回頂部按鈕
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 為頁面渲染烈酒詳細資訊
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
      <div class="info-cell">
        <div class="label">酒精濃度</div>
        <div class="value">${data.abv}</div>
      </div>
      <div class="info-cell">
        <div class="label">主要產地</div>
        <div class="value">${data.origin}</div>
      </div>
      <div class="info-cell">
        <div class="label">原料</div>
        <div class="value">${data.rawMaterial}</div>
      </div>
    `;
  }

  const typesEl = document.getElementById('typesList');
  if (typesEl && data.types && data.types.length > 0) {
    typesEl.innerHTML = data.types.map(t => `
      <div class="type-item">
        <h4>${t.name}</h4>
        <p>${t.desc}</p>
      </div>
    `).join('');
  } else if (typesEl) {
    const typesSection = document.getElementById('typesSection');
    if (typesSection) typesSection.style.display = 'none';
  }

  const gradesEl = document.getElementById('gradesTable');
  if (gradesEl && data.grades && data.grades.length > 0) {
    gradesEl.innerHTML = `
      <table class="grade-table">
        <thead>
          <tr>
            <th>等級</th>
            <th>陳年要求</th>
          </tr>
        </thead>
        <tbody>
          ${data.grades.map(g => `
            <tr>
              <td><strong>${g.name}</strong></td>
              <td>${g.desc}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderBrands(data.brands, data.bottleColor, data.labelColor);
  initFilters(data.brands);
  initSearch(data.brands);
}

// 渲染品牌卡片（含 SVG 酒瓶與價格）
function renderBrands(brands, defaultBottleColor, defaultLabelColor) {
  const el = document.getElementById('brandsGrid');
  if (!el) return;

  el.innerHTML = brands.map((b, idx) => {
    const label = getBottleLabel(b.name);
    const bottleColor = b.bottleColor || defaultBottleColor || '#b87333';
    const labelColor = b.labelColor || defaultLabelColor || '#f0d878';
    return `
      <div class="brand-card" data-country="${b.country}" data-category="${b.category}" data-name="${b.name.toLowerCase()}">
        <div class="brand-bottle">
          ${createBottleSVG(bottleColor, labelColor, label + '-' + idx)}
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

  // 修正 SVG 內的 label 文字（避免文字含座標號）
  document.querySelectorAll('.bottle-svg text').forEach((text, i) => {
    const card = text.closest('.brand-card');
    if (card) {
      const brandName = card.querySelector('.brand-name').textContent;
      text.textContent = getBottleLabel(brandName);
    }
  });
}

// 國家篩選按鈕
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
  const cards = document.querySelectorAll('#brandsGrid .brand-card');
  cards.forEach(card => {
    if (country === '全部' || card.dataset.country === country) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function initSearch(brands) {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('#brandsGrid .brand-card');

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(keyword)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
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
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
});
