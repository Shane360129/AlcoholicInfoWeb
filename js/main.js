// ============================================
// 烈酒知識網 - 主要 JS 邏輯
// ============================================

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

// 為頁面渲染烈酒詳細資訊（用於各細分頁面）
function renderSpiritPage(spiritKey) {
  const data = window.spiritsData[spiritKey];
  if (!data) {
    console.error('找不到該酒類資料:', spiritKey);
    return;
  }

  // 頁首
  const headerEl = document.getElementById('pageHeader');
  if (headerEl) {
    headerEl.innerHTML = `
      <span class="icon-large">${data.icon}</span>
      <h1>${data.name}</h1>
      <span class="name-en">${data.nameEn}</span>
    `;
  }

  // 簡介
  const descEl = document.getElementById('description');
  if (descEl) {
    descEl.innerHTML = `
      <p>${data.description}</p>
      ${data.history ? `<p style="margin-top:1rem;color:var(--color-text-muted);">${data.history}</p>` : ''}
    `;
  }

  // 基本資訊
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

  // 種類分類
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

  // 等級表（白蘭地專用）
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

  // 品牌列表
  renderBrands(data.brands);

  // 篩選器
  initFilters(data.brands);
  initSearch(data.brands);
}

// 渲染品牌卡片
function renderBrands(brands) {
  const el = document.getElementById('brandsGrid');
  if (!el) return;

  el.innerHTML = brands.map(b => `
    <div class="brand-card" data-country="${b.country}" data-category="${b.category}" data-name="${b.name.toLowerCase()}">
      <div class="brand-card-header">
        <div class="brand-name">${b.name}</div>
        <div class="brand-tags">
          <span class="brand-tag country">${b.country}</span>
          <span class="brand-tag">${b.category}</span>
        </div>
      </div>
      <p class="brand-desc">${b.desc}</p>
    </div>
  `).join('');
}

// 初始化國家篩選按鈕
function initFilters(brands) {
  const filterBar = document.getElementById('filterBar');
  if (!filterBar) return;

  // 收集所有國家
  const countries = ['全部', ...new Set(brands.map(b => b.country))];

  filterBar.innerHTML = countries.map((c, i) => `
    <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${c}">${c}</button>
  `).join('');

  // 綁定點擊事件
  filterBar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBrands(btn.dataset.filter);
    });
  });
}

// 篩選品牌
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

// 搜尋功能
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

    // 重設篩選器至「全部」
    const allBtn = document.querySelector('.filter-btn[data-filter="全部"]');
    if (allBtn && keyword) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
    }
  });
}

// 頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();

  // 自動偵測當前頁面對應的酒類資料 key
  const spiritKey = document.body.dataset.spirit;
  if (spiritKey && window.spiritsData) {
    renderSpiritPage(spiritKey);
  }

  // 為導覽列項目加上 active class
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
});
