# 烈酒知識網 The Spirits Atlas

一個介紹當代市場上仍在販售的主要烈酒（Hard Liquor / Spirits）品牌與知識的資訊型網站。

## 內容範疇

涵蓋全球八大烈酒類別：

- **威士忌（Whisky / Whiskey）** — 蘇格蘭、愛爾蘭、美國、日本、台灣
- **白蘭地（Brandy）** — 干邑、雅馬邑、水果白蘭地
- **伏特加（Vodka）** — 穀物、馬鈴薯、風味伏特加
- **琴酒（Gin）** — 倫敦乾、普利茅斯、新世代
- **蘭姆酒（Rum）** — 白蘭姆、金蘭姆、黑蘭姆、農業蘭姆
- **龍舌蘭（Tequila）** — Blanco、Reposado、Añejo、Mezcal
- **中式白酒（Baijiu）** — 醬香、濃香、清香、台灣高粱
- **其他烈酒** — 韓國燒酒、日本燒酎、義大利苦酒等

## 技術架構

純靜態網站，無需後端：

- HTML5 / CSS3
- 原生 JavaScript（ES6+）
- 資料以 JS 物件形式集中於 `data/spirits.js`
- 響應式設計，支援桌機與行動裝置

## 檔案結構

```
AlcoholicInfoWeb/
├── index.html              # 首頁
├── css/
│   └── style.css           # 主樣式表（深色琥珀金色調）
├── js/
│   └── main.js             # 主要 JS 邏輯（渲染、篩選、搜尋）
├── data/
│   └── spirits.js          # 所有烈酒資料
└── pages/                  # 各酒類詳細頁
    ├── whisky.html
    ├── brandy.html
    ├── vodka.html
    ├── gin.html
    ├── rum.html
    ├── tequila.html
    ├── baijiu.html
    └── others.html
```

## 本地預覽

直接以瀏覽器開啟 `index.html` 即可，或使用任意靜態檔案伺服器：

```bash
# Python
python3 -m http.server 8000

# Node (需要 npx)
npx serve .
```

## 功能特色

- 八大烈酒分類詳細介紹
- 每類別含：簡介、歷史、種類劃分、品牌列表
- 品牌可依產地篩選
- 即時搜尋功能
- 響應式設計
- 平滑捲動與返回頂部

## 內容免責聲明

- 本站內容整理自網路公開資料，僅供學習研究與一般資訊參考
- 飲酒過量，有害健康；禁止酒駕
- 未滿法定飲酒年齡者請勿飲酒
