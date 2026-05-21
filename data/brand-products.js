// 各品牌「現售酒款」資料
// 鍵：brand.name（與 spirits.js 完全一致）
// 值：產品陣列，每個產品有 name / desc / price，可選 searchQuery（Commons 搜尋字串）
// 圖片由 scripts/fetch-product-images.js 從 Wikimedia Commons 搜尋下載
(function (g) {
  g.brandProducts = {

    // ===== 威士忌 / Whisky =====

    "麥卡倫 Macallan": [
      { name: "Macallan 12 Sherry Oak", desc: "雪莉桶 12 年陳釀，乾果與肉桂香氣", price: "NT$ 3,200 – 3,800" },
      { name: "Macallan 12 Double Cask", desc: "美洲與歐洲雪莉桶雙桶熟成", price: "NT$ 2,500 – 3,200" },
      { name: "Macallan 15 Double Cask", desc: "雙桶 15 年陳釀，蜂蜜橙皮香氣", price: "NT$ 5,500 – 6,500" },
      { name: "Macallan 18 Sherry Oak", desc: "雪莉桶 18 年，深沉果乾與木質調", price: "NT$ 12,000 – 15,000" },
      { name: "Macallan Rare Cask", desc: "精選稀有雪莉桶，深紅寶石色澤", price: "NT$ 12,000 – 14,000" }
    ],
    "格蘭菲迪 Glenfiddich": [
      { name: "Glenfiddich 12", desc: "經典 12 年單一麥芽，新鮮梨子香", price: "NT$ 1,000 – 1,400" },
      { name: "Glenfiddich 15 Solera", desc: "獨特 Solera 桶系統熟成", price: "NT$ 1,800 – 2,300" },
      { name: "Glenfiddich 18", desc: "Small Batch 18 年雪莉橡木桶", price: "NT$ 3,000 – 3,800" },
      { name: "Glenfiddich 21 Reserva Rum Cask", desc: "21 年加勒比海蘭姆桶換桶", price: "NT$ 7,500 – 9,000" },
      { name: "Glenfiddich IPA Experiment", desc: "實驗系列，啤酒桶熟成", price: "NT$ 1,800 – 2,300" }
    ],
    "格蘭利威 Glenlivet": [
      { name: "Glenlivet 12 Double Oak", desc: "美洲與歐洲橡木雙桶 12 年", price: "NT$ 1,000 – 1,300" },
      { name: "Glenlivet 15 French Oak", desc: "15 年法國橡木桶熟成", price: "NT$ 1,800 – 2,300" },
      { name: "Glenlivet 18", desc: "18 年陳年單一麥芽", price: "NT$ 3,500 – 4,500" },
      { name: "Glenlivet Founder's Reserve", desc: "創辦人系列 NAS 入門款", price: "NT$ 900 – 1,200" }
    ],
    "百富 Balvenie": [
      { name: "Balvenie 12 DoubleWood", desc: "經典波本與雪莉雙桶 12 年", price: "NT$ 1,500 – 2,000" },
      { name: "Balvenie 14 Caribbean Cask", desc: "加勒比海蘭姆桶換桶 14 年", price: "NT$ 2,500 – 3,200" },
      { name: "Balvenie 17 DoubleWood", desc: "雙桶 17 年陳釀", price: "NT$ 4,500 – 5,500" },
      { name: "Balvenie 21 PortWood", desc: "21 年波特酒桶換桶", price: "NT$ 8,000 – 10,000" }
    ],
    "蘇格登 Singleton": [
      { name: "Singleton 12", desc: "Glen Ord 酒廠 12 年單一麥芽", price: "NT$ 900 – 1,400" },
      { name: "Singleton 15", desc: "15 年雪莉桶熟成", price: "NT$ 1,400 – 1,900" },
      { name: "Singleton 18", desc: "18 年陳年版本", price: "NT$ 2,500 – 3,200" }
    ],
    "慕赫 Mortlach": [
      { name: "Mortlach 12 Wee Witchie", desc: "「達夫鎮野獸」12 年", price: "NT$ 1,400 – 1,900" },
      { name: "Mortlach 16 Distiller's Dram", desc: "16 年酒廠精選", price: "NT$ 3,500 – 4,500" },
      { name: "Mortlach 20", desc: "20 年陳年版本", price: "NT$ 6,500 – 8,000" }
    ],
    "格蘭多納 Glendronach": [
      { name: "Glendronach 12 Original", desc: "PX 與 Oloroso 雪莉桶 12 年", price: "NT$ 1,800 – 2,500" },
      { name: "Glendronach 15 Revival", desc: "重生系列 15 年", price: "NT$ 2,800 – 3,500" },
      { name: "Glendronach 18 Allardice", desc: "Oloroso 雪莉桶 18 年", price: "NT$ 5,500 – 6,800" },
      { name: "Glendronach 21 Parliament", desc: "21 年雪莉桶熟成", price: "NT$ 8,500 – 11,000" }
    ],
    "格蘭傑 Glenmorangie": [
      { name: "Glenmorangie Original 10", desc: "經典 10 年波本桶陳釀", price: "NT$ 1,000 – 1,300" },
      { name: "Glenmorangie 12 Lasanta Sherry", desc: "12 年雪莉桶換桶", price: "NT$ 1,400 – 1,800" },
      { name: "Glenmorangie 12 Quinta Ruban Port", desc: "12 年波特桶換桶", price: "NT$ 1,400 – 1,900" },
      { name: "Glenmorangie 18 Extremely Rare", desc: "18 年限量版", price: "NT$ 4,500 – 5,500" },
      { name: "Glenmorangie Signet", desc: "黑色巧克力麥芽特殊款", price: "NT$ 6,500 – 8,000" }
    ],
    "大摩 Dalmore": [
      { name: "Dalmore 12", desc: "經典 12 年雪莉桶換桶", price: "NT$ 1,500 – 2,200" },
      { name: "Dalmore 15", desc: "15 年三種雪莉桶熟成", price: "NT$ 2,800 – 3,500" },
      { name: "Dalmore 18", desc: "18 年陳年版本", price: "NT$ 6,000 – 7,500" },
      { name: "Dalmore King Alexander III", desc: "六種桶型調和的旗艦款", price: "NT$ 7,500 – 9,500" },
      { name: "Dalmore Cigar Malt", desc: "搭配雪茄的特調版本", price: "NT$ 3,200 – 4,000" }
    ],
    "拉佛格 Laphroaig": [
      { name: "Laphroaig 10", desc: "經典艾雷 10 年，濃郁泥煤", price: "NT$ 1,200 – 1,600" },
      { name: "Laphroaig Quarter Cask", desc: "小桶二次熟成，泥煤更濃", price: "NT$ 1,400 – 1,800" },
      { name: "Laphroaig Lore", desc: "多桶調和，泥煤旗艦", price: "NT$ 3,500 – 4,500" },
      { name: "Laphroaig PX Cask", desc: "PX 雪莉桶換桶版本", price: "NT$ 2,500 – 3,200" }
    ],
    "阿貝 Ardbeg": [
      { name: "Ardbeg 10", desc: "重泥煤艾雷代表 10 年", price: "NT$ 1,300 – 1,800" },
      { name: "Ardbeg An Oa", desc: "三種桶調和的圓潤泥煤", price: "NT$ 1,500 – 2,000" },
      { name: "Ardbeg Uigeadail", desc: "雪莉桶與波本桶結合", price: "NT$ 2,500 – 3,200" },
      { name: "Ardbeg Corryvreckan", desc: "桶強版本，海風辛香", price: "NT$ 2,800 – 3,500" }
    ],
    "雲頂 Springbank": [
      { name: "Springbank 10", desc: "坎培爾鎮經典 10 年", price: "NT$ 2,000 – 2,800" },
      { name: "Springbank 15", desc: "15 年雪莉桶熟成", price: "NT$ 4,500 – 5,800" },
      { name: "Springbank 18", desc: "18 年陳年版本", price: "NT$ 8,000 – 10,000" },
      { name: "Hazelburn 10", desc: "雲頂三次蒸餾無泥煤 10 年", price: "NT$ 2,200 – 2,800" }
    ],
    "愛倫 Arran": [
      { name: "Arran 10", desc: "島嶼新酒廠經典 10 年", price: "NT$ 1,200 – 1,700" },
      { name: "Arran 14", desc: "14 年雪莉桶換桶", price: "NT$ 2,200 – 2,800" },
      { name: "Arran 18", desc: "18 年陳年單一麥芽", price: "NT$ 3,500 – 4,500" },
      { name: "Arran Sherry Cask", desc: "雪莉桶原桶強度", price: "NT$ 2,500 – 3,200" }
    ],
    "布萊德諾赫 Bladnoch": [
      { name: "Bladnoch Vinaya", desc: "波本與雪莉桶調和 NAS", price: "NT$ 1,800 – 2,400" },
      { name: "Bladnoch 11", desc: "11 年雪莉桶換桶", price: "NT$ 2,500 – 3,200" },
      { name: "Bladnoch 14", desc: "14 年陳年版本", price: "NT$ 3,800 – 4,800" }
    ],
    "雷神島 Isle of Raasay": [
      { name: "Isle of Raasay R-01", desc: "酒廠首批裝瓶", price: "NT$ 2,200 – 2,800" },
      { name: "Isle of Raasay Hebridean", desc: "經典款核心商品", price: "NT$ 2,000 – 2,600" }
    ],
    "尊尼獲加 Johnnie Walker": [
      { name: "Johnnie Walker Red Label", desc: "全球最暢銷調和威士忌", price: "NT$ 400 – 600" },
      { name: "Johnnie Walker Black Label 12", desc: "經典黑牌 12 年", price: "NT$ 700 – 900" },
      { name: "Johnnie Walker Double Black", desc: "重泥煤強化版", price: "NT$ 1,000 – 1,300" },
      { name: "Johnnie Walker Green Label 15", desc: "綠牌 15 年純麥調和", price: "NT$ 1,500 – 1,900" },
      { name: "Johnnie Walker Gold Label Reserve", desc: "金牌典藏", price: "NT$ 1,800 – 2,300" },
      { name: "Johnnie Walker Blue Label", desc: "藍牌頂級調和", price: "NT$ 6,500 – 8,000" }
    ],
    "芝華士 Chivas Regal": [
      { name: "Chivas Regal 12", desc: "經典 12 年調和", price: "NT$ 700 – 900" },
      { name: "Chivas Regal Extra 13", desc: "13 年特別版", price: "NT$ 900 – 1,200" },
      { name: "Chivas Regal 18", desc: "18 年圓潤平衡", price: "NT$ 1,800 – 2,400" },
      { name: "Chivas Regal 25", desc: "25 年頂級調和", price: "NT$ 7,500 – 9,000" }
    ],
    "皇家禮炮 Royal Salute": [
      { name: "Royal Salute 21", desc: "21 年經典款", price: "NT$ 3,500 – 4,500" },
      { name: "Royal Salute 21 Lochan Eich", desc: "21 年新酒桶版本", price: "NT$ 4,500 – 5,500" },
      { name: "Royal Salute 38 Stone of Destiny", desc: "38 年命運之石", price: "NT$ 28,000 – 35,000" }
    ],
    "勞德 Lauder's": [
      { name: "Lauder's Finest", desc: "經典調和入門款", price: "NT$ 300 – 450" },
      { name: "Lauder's 12 Year Old", desc: "12 年陳年版本", price: "NT$ 600 – 800" }
    ],
    "傑姆森 Jameson": [
      { name: "Jameson Original", desc: "三重蒸餾愛爾蘭威士忌", price: "NT$ 650 – 850" },
      { name: "Jameson Black Barrel", desc: "雙重炭烤桶熟成", price: "NT$ 1,000 – 1,300" },
      { name: "Jameson Caskmates Stout", desc: "啤酒桶換桶版", price: "NT$ 950 – 1,200" },
      { name: "Jameson 18", desc: "18 年限量典藏", price: "NT$ 3,800 – 4,800" }
    ],
    "傑克丹尼 Jack Daniel's": [
      { name: "Jack Daniel's Old No. 7", desc: "招牌田納西威士忌", price: "NT$ 700 – 900" },
      { name: "Jack Daniel's Single Barrel", desc: "單桶原裝", price: "NT$ 1,500 – 1,900" },
      { name: "Jack Daniel's Gentleman Jack", desc: "雙重炭過濾紳士版", price: "NT$ 1,000 – 1,300" },
      { name: "Jack Daniel's Tennessee Honey", desc: "蜂蜜風味利口酒", price: "NT$ 750 – 950" }
    ],
    "美格 Maker's Mark": [
      { name: "Maker's Mark", desc: "紅色封蠟瓶口波本", price: "NT$ 1,000 – 1,300" },
      { name: "Maker's Mark 46", desc: "法國橡木板桶內熟成", price: "NT$ 1,400 – 1,800" },
      { name: "Maker's Mark Cask Strength", desc: "原桶強度版", price: "NT$ 1,800 – 2,300" }
    ],
    "金賓 Jim Beam": [
      { name: "Jim Beam White Label", desc: "經典白牌波本", price: "NT$ 500 – 700" },
      { name: "Jim Beam Black Extra Aged", desc: "黑牌 8 年陳釀", price: "NT$ 800 – 1,000" },
      { name: "Jim Beam Devil's Cut", desc: "釋出桶壁酒液版", price: "NT$ 900 – 1,200" },
      { name: "Jim Beam Single Barrel", desc: "單桶原裝", price: "NT$ 1,400 – 1,800" }
    ],
    "野火雞 Wild Turkey": [
      { name: "Wild Turkey 101", desc: "101 Proof 招牌款", price: "NT$ 800 – 1,100" },
      { name: "Wild Turkey 8 Year", desc: "8 年陳年版本", price: "NT$ 750 – 950" },
      { name: "Wild Turkey Rare Breed", desc: "原桶強度調配", price: "NT$ 1,800 – 2,300" },
      { name: "Russell's Reserve 10", desc: "Russell 家族 10 年", price: "NT$ 1,500 – 1,900" }
    ],
    "山崎 Yamazaki": [
      { name: "Yamazaki Distiller's Reserve", desc: "蒸餾廠精選 NAS", price: "NT$ 4,500 – 6,000" },
      { name: "Yamazaki 12", desc: "經典 12 年", price: "NT$ 8,000 – 15,000" },
      { name: "Yamazaki 18", desc: "18 年陳年版本", price: "NT$ 35,000 – 50,000" },
      { name: "Yamazaki 25", desc: "25 年頂級珍藏", price: "NT$ 280,000+" }
    ],
    "響 Hibiki": [
      { name: "Hibiki Japanese Harmony", desc: "經典調和 NAS", price: "NT$ 3,000 – 5,000" },
      { name: "Hibiki 17", desc: "17 年調和威士忌", price: "NT$ 28,000 – 40,000" },
      { name: "Hibiki 21", desc: "21 年頂級調和", price: "NT$ 75,000 – 100,000" }
    ],
    "白州 Hakushu": [
      { name: "Hakushu Distiller's Reserve", desc: "蒸餾廠精選 NAS", price: "NT$ 4,500 – 6,000" },
      { name: "Hakushu 12", desc: "經典 12 年青草煙燻", price: "NT$ 8,000 – 15,000" },
      { name: "Hakushu 18", desc: "18 年深邃版本", price: "NT$ 40,000 – 60,000" }
    ],
    "余市 Yoichi": [
      { name: "Yoichi Single Malt", desc: "Nikka 余市 NAS", price: "NT$ 2,500 – 3,500" },
      { name: "Yoichi 10", desc: "10 年陳年版本", price: "NT$ 5,500 – 7,500" },
      { name: "Yoichi 15", desc: "15 年深沉風味", price: "NT$ 12,000 – 18,000" }
    ],
    "竹鶴 Taketsuru": [
      { name: "Taketsuru Pure Malt", desc: "竹鶴政孝命名純麥調和 NAS", price: "NT$ 1,500 – 2,200" },
      { name: "Taketsuru 17", desc: "17 年純麥調和", price: "NT$ 6,500 – 9,000" }
    ],
    "噶瑪蘭 Kavalan": [
      { name: "Kavalan Classic", desc: "經典款入門首選", price: "NT$ 1,200 – 1,500" },
      { name: "Kavalan Concertmaster Port", desc: "波特桶換桶款", price: "NT$ 1,800 – 2,500" },
      { name: "Kavalan Solist Sherry", desc: "Solist 雪莉桶原桶強度", price: "NT$ 5,500 – 7,500" },
      { name: "Kavalan Solist Vinho Barrique", desc: "葡萄酒桶原桶強度", price: "NT$ 5,000 – 7,000" }
    ],
    "OMAR": [
      { name: "OMAR Bourbon Type", desc: "南投酒廠波本桶花果香", price: "NT$ 1,300 – 1,800" },
      { name: "OMAR Sherry Type", desc: "雪莉桶雪莉果乾風味", price: "NT$ 1,500 – 2,000" },
      { name: "OMAR Peated", desc: "泥煤系列限量版", price: "NT$ 2,000 – 2,800" },
      { name: "OMAR Single Cask", desc: "單桶原桶強度", price: "NT$ 2,500 – 3,500" }
    ],

    // ===== 白蘭地 / Brandy =====

    "軒尼詩 Hennessy": [
      { name: "Hennessy V.S", desc: "經典 VS 入門款", price: "NT$ 950 – 1,300" },
      { name: "Hennessy V.S.O.P", desc: "干邑經典 VSOP", price: "NT$ 1,350 – 1,700" },
      { name: "Hennessy X.O", desc: "XO 旗艦款，深邃醇厚", price: "NT$ 3,800 – 4,500" },
      { name: "Hennessy Paradis", desc: "天堂級頂級調配", price: "NT$ 28,000 – 35,000" },
      { name: "Hennessy Richard", desc: "理察軒尼詩，家族傳承之作", price: "NT$ 150,000+" }
    ],
    "人頭馬 Rémy Martin": [
      { name: "Rémy Martin V.S.O.P", desc: "Fine Champagne VSOP", price: "NT$ 1,100 – 1,500" },
      { name: "Rémy Martin 1738 Accord Royal", desc: "1738 皇家禮讚", price: "NT$ 1,600 – 2,200" },
      { name: "Rémy Martin X.O", desc: "Fine Champagne XO", price: "NT$ 4,500 – 5,500" },
      { name: "Rémy Martin Louis XIII", desc: "路易十三頂級珍藏", price: "NT$ 95,000 – 130,000" }
    ],
    "馬爹利 Martell": [
      { name: "Martell V.S.O.P", desc: "經典 VSOP", price: "NT$ 1,100 – 1,500" },
      { name: "Martell Cordon Bleu", desc: "藍帶調配", price: "NT$ 2,800 – 3,500" },
      { name: "Martell X.O", desc: "XO 旗艦款", price: "NT$ 4,500 – 5,500" },
      { name: "Martell Chanteloup Perspective", desc: "頂級珍藏", price: "NT$ 35,000+" }
    ],
    "拿破崙 Courvoisier": [
      { name: "Courvoisier V.S", desc: "經典入門款", price: "NT$ 800 – 1,000" },
      { name: "Courvoisier V.S.O.P", desc: "VSOP 經典", price: "NT$ 1,000 – 1,300" },
      { name: "Courvoisier X.O", desc: "XO 旗艦款", price: "NT$ 3,500 – 4,500" },
      { name: "Courvoisier Initiale Extra", desc: "Extra 級頂級調配", price: "NT$ 12,000 – 16,000" }
    ],
    "百樂廷 Camus": [
      { name: "Camus V.S.O.P Elegance", desc: "VSOP 優雅系列", price: "NT$ 1,200 – 1,500" },
      { name: "Camus X.O Elegance", desc: "XO 優雅版本", price: "NT$ 3,800 – 4,800" },
      { name: "Camus Borderies V.S.O.P", desc: "波爾德利區單一產區 VSOP", price: "NT$ 2,000 – 2,800" },
      { name: "Camus Borderies X.O", desc: "波爾德利區單一產區 XO", price: "NT$ 5,500 – 7,000" }
    ],
    "御鹿 Otard": [
      { name: "Otard V.S.O.P", desc: "干邑古堡熟成 VSOP", price: "NT$ 900 – 1,200" },
      { name: "Otard X.O", desc: "XO 旗艦款", price: "NT$ 3,500 – 4,500" },
      { name: "Otard X.O Gold", desc: "限量金色版本", price: "NT$ 4,500 – 5,800" }
    ],

    // ===== 伏特加 / Vodka =====

    "絕對 Absolut": [
      { name: "Absolut Original", desc: "瑞典經典原味伏特加", price: "NT$ 500 – 700" },
      { name: "Absolut Citron", desc: "檸檬風味", price: "NT$ 550 – 750" },
      { name: "Absolut Vanilla", desc: "香草風味", price: "NT$ 550 – 750" },
      { name: "Absolut Elyx", desc: "銅製蒸餾頂級版", price: "NT$ 1,500 – 2,000" }
    ],
    "斯米諾 Smirnoff": [
      { name: "Smirnoff No. 21 Red", desc: "經典紅牌伏特加", price: "NT$ 400 – 550" },
      { name: "Smirnoff Black", desc: "黑牌單一桶蒸餾", price: "NT$ 700 – 900" },
      { name: "Smirnoff Vanilla", desc: "香草風味款", price: "NT$ 450 – 600" }
    ],
    "灰雁 Grey Goose": [
      { name: "Grey Goose Original", desc: "法國經典原味", price: "NT$ 1,400 – 1,800" },
      { name: "Grey Goose La Poire", desc: "梨子風味", price: "NT$ 1,500 – 1,900" },
      { name: "Grey Goose Le Citron", desc: "檸檬風味", price: "NT$ 1,500 – 1,900" },
      { name: "Grey Goose Altius", desc: "頂級山泉版", price: "NT$ 8,000 – 11,000" }
    ],
    "雪樹 Belvedere": [
      { name: "Belvedere Vodka", desc: "波蘭黑麥伏特加經典", price: "NT$ 1,300 – 1,700" },
      { name: "Belvedere Heritage 176", desc: "傳承 176 麥芽版", price: "NT$ 1,800 – 2,400" },
      { name: "Belvedere Single Estate Rye", desc: "單一莊園黑麥版", price: "NT$ 2,200 – 2,800" }
    ],
    "蕭邦 Chopin": [
      { name: "Chopin Potato Vodka", desc: "馬鈴薯伏特加", price: "NT$ 1,500 – 1,900" },
      { name: "Chopin Rye Vodka", desc: "黑麥伏特加", price: "NT$ 1,400 – 1,800" },
      { name: "Chopin Wheat Vodka", desc: "小麥伏特加", price: "NT$ 1,400 – 1,800" }
    ],
    "坎特 Ketel One": [
      { name: "Ketel One Original", desc: "荷蘭家族銅蒸餾", price: "NT$ 1,000 – 1,400" },
      { name: "Ketel One Citroen", desc: "檸檬風味", price: "NT$ 1,100 – 1,500" },
      { name: "Ketel One Oranje", desc: "橙香風味", price: "NT$ 1,100 – 1,500" },
      { name: "Ketel One Botanical", desc: "草本系列低酒精", price: "NT$ 950 – 1,300" }
    ],
    "野牛草 Żubrówka": [
      { name: "Żubrówka Bison Grass", desc: "野牛草伏特加", price: "NT$ 700 – 1,000" },
      { name: "Żubrówka Biała", desc: "白色經典款", price: "NT$ 600 – 850" }
    ],
    "斯托利 Stolichnaya": [
      { name: "Stolichnaya Premium", desc: "經典紅標", price: "NT$ 700 – 950" },
      { name: "Stolichnaya Gold", desc: "金牌頂級版", price: "NT$ 1,200 – 1,600" },
      { name: "Stolichnaya Elit", desc: "Elit 超頂級版", price: "NT$ 2,500 – 3,200" }
    ],

    // ===== 琴酒 / Gin =====

    "英人牌 Beefeater": [
      { name: "Beefeater London Dry", desc: "經典 London Dry Gin", price: "NT$ 600 – 850" },
      { name: "Beefeater 24", desc: "茶葉與柚子加味版", price: "NT$ 1,000 – 1,400" },
      { name: "Beefeater Pink Strawberry", desc: "草莓粉紅版", price: "NT$ 650 – 900" }
    ],
    "坦奎瑞 Tanqueray": [
      { name: "Tanqueray London Dry", desc: "經典 London Dry", price: "NT$ 700 – 950" },
      { name: "Tanqueray No. Ten", desc: "頂級小批量蒸餾", price: "NT$ 1,300 – 1,700" },
      { name: "Tanqueray Rangpur", desc: "印度青檸風味", price: "NT$ 900 – 1,200" },
      { name: "Tanqueray Sevilla Orange", desc: "西班牙橙香版", price: "NT$ 900 – 1,200" }
    ],
    "龐貝藍鑽 Bombay Sapphire": [
      { name: "Bombay Sapphire London Dry", desc: "經典藍寶石版", price: "NT$ 750 – 950" },
      { name: "Bombay Sapphire East", desc: "東方香料版", price: "NT$ 900 – 1,200" },
      { name: "Bombay Sapphire Premier Cru", desc: "頂級柑橘版", price: "NT$ 1,400 – 1,800" },
      { name: "Bombay Bramble", desc: "黑莓覆盆莓粉紅版", price: "NT$ 850 – 1,100" }
    ],
    "高登 Gordon's": [
      { name: "Gordon's London Dry", desc: "經典杜松子琴酒", price: "NT$ 500 – 700" },
      { name: "Gordon's Pink", desc: "粉紅草莓版", price: "NT$ 550 – 750" }
    ],
    "亨利爵士 Hendrick's": [
      { name: "Hendrick's Gin", desc: "小黃瓜與玫瑰花瓣經典款", price: "NT$ 1,200 – 1,600" },
      { name: "Hendrick's Orbium", desc: "苦艾酒香與洋甘菊", price: "NT$ 1,800 – 2,400" },
      { name: "Hendrick's Lunar", desc: "月光限定版", price: "NT$ 1,500 – 2,000" },
      { name: "Hendrick's Flora Adora", desc: "花卉香氛限定版", price: "NT$ 1,500 – 2,000" }
    ],
    "孟買之星 Star of Bombay": [
      { name: "Star of Bombay", desc: "孟買頂級系列，柏甘油與義大利黑橙皮", price: "NT$ 1,300 – 1,700" }
    ],
    "猴王 Monkey 47": [
      { name: "Monkey 47 Dry Gin", desc: "47 種植物的黑森林乾琴酒", price: "NT$ 2,000 – 2,600" },
      { name: "Monkey 47 Sloe Gin", desc: "黑刺李琴酒", price: "NT$ 2,200 – 2,800" },
      { name: "Monkey 47 Distiller's Cut", desc: "每年蒸餾師特別版", price: "NT$ 3,200 – 4,000" }
    ],
    "希普史密斯 Sipsmith": [
      { name: "Sipsmith London Dry", desc: "倫敦傳統小批量蒸餾", price: "NT$ 1,200 – 1,600" },
      { name: "Sipsmith VJOP", desc: "極致杜松子強度版", price: "NT$ 1,500 – 1,900" },
      { name: "Sipsmith Lemon Drizzle", desc: "檸檬糖霜風味", price: "NT$ 1,300 – 1,700" },
      { name: "Sipsmith Sloe Gin", desc: "黑刺李琴酒", price: "NT$ 1,400 – 1,800" }
    ],
    "Roku 六": [
      { name: "Roku Japanese Gin", desc: "三得利六種日本素材", price: "NT$ 1,100 – 1,500" }
    ],
    "季之美 Ki No Bi": [
      { name: "Ki No Bi Kyoto Dry Gin", desc: "京都蒸餾所經典款", price: "NT$ 1,800 – 2,400" },
      { name: "Ki No Bi Sei Navy Strength", desc: "海軍強度版", price: "NT$ 2,200 – 2,800" },
      { name: "Ki No Tea", desc: "茶香限定版", price: "NT$ 2,500 – 3,200" }
    ],
    "植物學家 The Botanist": [
      { name: "The Botanist Islay Dry Gin", desc: "艾雷島 22 種野生植物", price: "NT$ 1,400 – 1,900" }
    ],

    // ===== 蘭姆酒 / Rum =====

    "百加得 Bacardi": [
      { name: "Bacardi Superior", desc: "白蘭姆經典", price: "NT$ 500 – 700" },
      { name: "Bacardi Gold", desc: "金蘭姆陳年版", price: "NT$ 550 – 750" },
      { name: "Bacardi 8", desc: "8 年陳釀", price: "NT$ 1,100 – 1,500" },
      { name: "Bacardi Reserva Ocho", desc: "Reserva 系列陳年版", price: "NT$ 1,200 – 1,600" }
    ],
    "摩根船長 Captain Morgan": [
      { name: "Captain Morgan Original Spiced", desc: "經典香料蘭姆", price: "NT$ 600 – 800" },
      { name: "Captain Morgan Black Spiced", desc: "黑色重香料版", price: "NT$ 700 – 950" },
      { name: "Captain Morgan Private Stock", desc: "私藏陳年版", price: "NT$ 1,000 – 1,300" },
      { name: "Captain Morgan White", desc: "白蘭姆", price: "NT$ 550 – 750" }
    ],
    "哈瓦那俱樂部 Havana Club": [
      { name: "Havana Club Añejo 3 Años", desc: "3 年陳年白蘭姆", price: "NT$ 600 – 850" },
      { name: "Havana Club Añejo 7 Años", desc: "7 年陳年深色蘭姆", price: "NT$ 850 – 1,200" },
      { name: "Havana Club Selección de Maestros", desc: "大師精選", price: "NT$ 1,800 – 2,400" },
      { name: "Havana Club Especial", desc: "特級金色蘭姆", price: "NT$ 700 – 950" }
    ],
    "外交官 Diplomático": [
      { name: "Diplomático Mantuano", desc: "8 年陳年入門款", price: "NT$ 900 – 1,300" },
      { name: "Diplomático Reserva Exclusiva", desc: "12 年特選陳釀", price: "NT$ 1,500 – 2,000" },
      { name: "Diplomático Single Vintage", desc: "單一年份限量", price: "NT$ 3,500 – 4,500" },
      { name: "Diplomático Ambassador", desc: "頂級大使版", price: "NT$ 7,500 – 9,500" }
    ],
    "薩凱帕 Zacapa": [
      { name: "Zacapa 23", desc: "瓜地馬拉 6-23 年 Solera 陳釀", price: "NT$ 1,800 – 2,400" },
      { name: "Zacapa XO", desc: "25 年頂級陳年", price: "NT$ 4,500 – 5,800" },
      { name: "Zacapa Edición Negra", desc: "炭烤桶限量版", price: "NT$ 2,500 – 3,200" }
    ],
    "凱朋 Mount Gay": [
      { name: "Mount Gay Eclipse", desc: "巴貝多經典蘭姆", price: "NT$ 700 – 950" },
      { name: "Mount Gay XO", desc: "XO 陳年版", price: "NT$ 1,500 – 1,900" },
      { name: "Mount Gay 1703 Master Select", desc: "1703 大師精選", price: "NT$ 3,500 – 4,500" }
    ],
    "百富門 Appleton Estate": [
      { name: "Appleton Estate Signature", desc: "牙買加經典招牌", price: "NT$ 700 – 950" },
      { name: "Appleton Estate 8 Reserve", desc: "8 年陳釀", price: "NT$ 1,100 – 1,500" },
      { name: "Appleton Estate 12 Rare Casks", desc: "12 年稀有桶版", price: "NT$ 1,800 – 2,300" },
      { name: "Appleton Estate 21", desc: "21 年限量陳年", price: "NT$ 5,500 – 7,000" }
    ],
    "麥拉斯 Mauritius": [
      { name: "Mauritius Rum", desc: "模里西斯產區蘭姆代表款", price: "NT$ 700 – 1,100" }
    ],

    // ===== 龍舌蘭 / Tequila =====

    "豪帥快活 Jose Cuervo": [
      { name: "Jose Cuervo Especial Gold", desc: "金色經典款", price: "NT$ 700 – 950" },
      { name: "Jose Cuervo Especial Silver", desc: "銀色經典款", price: "NT$ 650 – 900" },
      { name: "Jose Cuervo Tradicional Plata", desc: "100% 龍舌蘭傳統款", price: "NT$ 950 – 1,300" },
      { name: "Jose Cuervo Reserva de la Familia", desc: "家族珍藏 Extra Añejo", price: "NT$ 4,500 – 6,000" }
    ],
    "唐胡立歐 Don Julio": [
      { name: "Don Julio Blanco", desc: "100% 藍色龍舌蘭白", price: "NT$ 1,800 – 2,300" },
      { name: "Don Julio Reposado", desc: "8 個月橡木桶熟成", price: "NT$ 2,000 – 2,600" },
      { name: "Don Julio Añejo", desc: "18 個月陳年", price: "NT$ 2,500 – 3,200" },
      { name: "Don Julio 1942", desc: "Extra Añejo 旗艦款", price: "NT$ 6,500 – 8,500" },
      { name: "Don Julio Real", desc: "Extra Añejo 5 年", price: "NT$ 12,000 – 16,000" }
    ],
    "培恩 Patrón": [
      { name: "Patrón Silver", desc: "100% 藍色龍舌蘭白", price: "NT$ 1,800 – 2,300" },
      { name: "Patrón Reposado", desc: "至少 2 個月陳年", price: "NT$ 2,000 – 2,500" },
      { name: "Patrón Añejo", desc: "至少 1 年陳年", price: "NT$ 2,300 – 2,900" },
      { name: "Patrón Extra Añejo", desc: "至少 3 年陳年", price: "NT$ 3,800 – 4,800" }
    ],
    "Clase Azul 克斯阿祖爾": [
      { name: "Clase Azul Plata", desc: "經典藍瓷瓶白龍舌蘭", price: "NT$ 4,500 – 5,800" },
      { name: "Clase Azul Reposado", desc: "藍瓷瓶 Reposado 經典款", price: "NT$ 6,500 – 8,500" },
      { name: "Clase Azul Añejo", desc: "Añejo 黑瓷瓶版", price: "NT$ 35,000 – 45,000" },
      { name: "Clase Azul Ultra", desc: "Extra Añejo 銀邊頂級版", price: "NT$ 95,000+" }
    ],
    "Código 1530": [
      { name: "Código 1530 Blanco", desc: "100% 龍舌蘭白", price: "NT$ 2,000 – 2,500" },
      { name: "Código 1530 Rosa", desc: "粉紅葡萄酒桶熟成", price: "NT$ 2,500 – 3,200" },
      { name: "Código 1530 Reposado", desc: "法國橡木桶熟成", price: "NT$ 2,500 – 3,200" },
      { name: "Código 1530 Añejo", desc: "18 個月法國橡木桶", price: "NT$ 3,500 – 4,500" }
    ],
    "塔巴蒂奧 Tapatío": [
      { name: "Tapatío Blanco", desc: "100% 龍舌蘭白", price: "NT$ 1,000 – 1,400" },
      { name: "Tapatío Reposado", desc: "4 個月陳年", price: "NT$ 1,200 – 1,600" },
      { name: "Tapatío Añejo", desc: "18 個月陳年", price: "NT$ 1,500 – 1,900" },
      { name: "Tapatío Excelencia Gran Reserva", desc: "Extra Añejo 限量版", price: "NT$ 3,800 – 4,800" }
    ],
    "金快活 Olmeca": [
      { name: "Olmeca Gold", desc: "金色混合龍舌蘭", price: "NT$ 600 – 850" },
      { name: "Olmeca Blanco", desc: "白色混合龍舌蘭", price: "NT$ 550 – 800" },
      { name: "Olmeca Altos Plata", desc: "Altos 系列 100% 白", price: "NT$ 900 – 1,200" },
      { name: "Olmeca Altos Reposado", desc: "Altos 系列陳年版", price: "NT$ 1,000 – 1,300" }
    ],
    "賀雷拉杜拉 Herradura": [
      { name: "Herradura Plata", desc: "45 天熟成的白龍舌蘭", price: "NT$ 1,500 – 1,900" },
      { name: "Herradura Reposado", desc: "11 個月陳年", price: "NT$ 1,700 – 2,200" },
      { name: "Herradura Añejo", desc: "25 個月陳年", price: "NT$ 2,000 – 2,600" },
      { name: "Herradura Selección Suprema", desc: "Extra Añejo 49 個月", price: "NT$ 12,000 – 15,000" }
    ],
    "1800 Tequila": [
      { name: "1800 Silver", desc: "100% 龍舌蘭白", price: "NT$ 800 – 1,100" },
      { name: "1800 Reposado", desc: "美桶與法桶熟成", price: "NT$ 900 – 1,200" },
      { name: "1800 Añejo", desc: "美桶 14 個月陳年", price: "NT$ 1,100 – 1,400" },
      { name: "1800 Cristalino", desc: "Añejo 過濾透明版", price: "NT$ 2,500 – 3,200" }
    ],
    "梅斯卡爾 Del Maguey": [
      { name: "Del Maguey Vida", desc: "Mezcal 入門款", price: "NT$ 1,200 – 1,600" },
      { name: "Del Maguey San Luis del Río", desc: "聖路易斯里約村落單一產區", price: "NT$ 2,500 – 3,200" },
      { name: "Del Maguey Chichicapa", desc: "Chichicapa 村落產區", price: "NT$ 2,800 – 3,500" },
      { name: "Del Maguey Tobalá", desc: "野生 Tobalá 龍舌蘭", price: "NT$ 4,500 – 5,800" }
    ],

    // ===== 中式白酒 / Baijiu =====

    "茅台 Moutai": [
      { name: "飛天茅台 53%", desc: "貴州茅台旗艦醬香", price: "NT$ 25,000 – 32,000", searchQuery: "Moutai Feitian" },
      { name: "五星茅台", desc: "五星經典版", price: "NT$ 22,000 – 28,000", searchQuery: "Moutai Wuxing" },
      { name: "茅台王子酒", desc: "茅台副品牌親民款", price: "NT$ 1,800 – 2,500", searchQuery: "Moutai Prince" },
      { name: "茅台醇", desc: "茅台醇系列", price: "NT$ 1,500 – 2,200", searchQuery: "Moutai Chun" }
    ],
    "五糧液 Wuliangye": [
      { name: "五糧液 普五 52%", desc: "經典普五濃香", price: "NT$ 4,500 – 6,500", searchQuery: "Wuliangye baijiu" },
      { name: "五糧液 1618", desc: "1618 高端版本", price: "NT$ 6,800 – 9,500", searchQuery: "Wuliangye 1618" },
      { name: "五糧春", desc: "五糧液副品牌", price: "NT$ 800 – 1,200", searchQuery: "Wuliangchun" }
    ],
    "瀘州老窖": [
      { name: "國窖 1573", desc: "瀘州老窖頂級濃香", price: "NT$ 5,500 – 8,000", searchQuery: "Guojiao 1573" },
      { name: "瀘州老窖特曲", desc: "特曲經典款", price: "NT$ 1,200 – 1,800", searchQuery: "Luzhou Laojiao Tequ" },
      { name: "瀘州老窖頭曲", desc: "頭曲親民款", price: "NT$ 600 – 900", searchQuery: "Luzhou Laojiao baijiu" }
    ],
    "汾酒": [
      { name: "青花汾 20", desc: "20 年清香型汾酒", price: "NT$ 2,500 – 3,500", searchQuery: "Fenjiu Qinghua 20" },
      { name: "青花汾 30", desc: "30 年頂級清香", price: "NT$ 8,500 – 12,000", searchQuery: "Fenjiu Qinghua 30" },
      { name: "玻汾", desc: "玻璃瓶經濟款", price: "NT$ 350 – 550", searchQuery: "Fenjiu Bofen" }
    ],
    "劍南春": [
      { name: "劍南春 水晶劍", desc: "經典水晶瓶濃香", price: "NT$ 1,800 – 2,800", searchQuery: "Jiannanchun baijiu" }
    ],
    "洋河大曲": [
      { name: "洋河 海之藍", desc: "藍色經典系列", price: "NT$ 750 – 1,100", searchQuery: "Yanghe Haizhilan" },
      { name: "洋河 天之藍", desc: "天藍版本", price: "NT$ 1,300 – 1,800", searchQuery: "Yanghe Tianzhilan" },
      { name: "洋河 夢之藍 M3", desc: "夢藍 M3 高端", price: "NT$ 2,500 – 3,500", searchQuery: "Yanghe Mengzhilan M3" },
      { name: "洋河 夢之藍 M9", desc: "夢藍 M9 頂級", price: "NT$ 6,800 – 9,500", searchQuery: "Yanghe Mengzhilan M9" }
    ],
    "郎酒": [
      { name: "紅花郎 10", desc: "10 年醬香型紅瓶", price: "NT$ 2,500 – 3,500", searchQuery: "Langjiu Honghualang 10" },
      { name: "紅花郎 15", desc: "15 年醬香頂級", price: "NT$ 4,500 – 6,500", searchQuery: "Langjiu Honghualang 15" },
      { name: "青花郎", desc: "青花郎二郎鎮頂級", price: "NT$ 12,000 – 16,000", searchQuery: "Langjiu Qinghualang" }
    ],
    "金門高粱 Kinmen Kaoliang": [
      { name: "金門高粱 58 度白金龍", desc: "白瓶經典款", price: "NT$ 700 – 950", searchQuery: "Kinmen Kaoliang 58" },
      { name: "金門高粱 58 度紅金龍", desc: "紅瓶經典款", price: "NT$ 700 – 950", searchQuery: "Kinmen Kaoliang red" },
      { name: "金門陳年特級高粱 58 度", desc: "陳年特級窖藏", price: "NT$ 1,800 – 2,500", searchQuery: "Kinmen Kaoliang aged" },
      { name: "金門特級高粱 38 度", desc: "低度版本", price: "NT$ 500 – 750", searchQuery: "Kinmen Kaoliang 38" }
    ],
    "馬祖老酒／八八坑道": [
      { name: "八八坑道高粱 58 度", desc: "東引坑道窖藏", price: "NT$ 800 – 1,200", searchQuery: "Matsu 88 tunnel kaoliang" },
      { name: "馬祖老酒", desc: "傳統紅麴老酒", price: "NT$ 500 – 800", searchQuery: "Matsu Laojiu" }
    ],
    "玉山高粱": [
      { name: "玉山高粱 58 度", desc: "台酒玉山經典", price: "NT$ 350 – 500", searchQuery: "Yushan Kaoliang 58" },
      { name: "玉山陳年特級高粱", desc: "陳年特級版", price: "NT$ 800 – 1,200", searchQuery: "Yushan Kaoliang aged" },
      { name: "玉山高粱 38 度", desc: "低度版本", price: "NT$ 280 – 400", searchQuery: "Yushan Kaoliang 38" }
    ],

    // ===== 其他烈酒 =====

    "真露 Jinro": [
      { name: "真露 Chamisul Fresh", desc: "韓國國民燒酒清新版", price: "NT$ 90 – 130", searchQuery: "Jinro Chamisul" },
      { name: "真露 Chamisul Original", desc: "經典原味", price: "NT$ 90 – 130", searchQuery: "Jinro Chamisul Original" },
      { name: "真露 Jinro 24", desc: "24% 高酒精度版", price: "NT$ 150 – 200", searchQuery: "Jinro soju 24" }
    ],
    "處處 Chum-Churum": [
      { name: "Chum-Churum Original", desc: "韓國經典燒酒", price: "NT$ 100 – 150", searchQuery: "Chum Churum soju" },
      { name: "Chum-Churum Peach", desc: "水蜜桃風味", price: "NT$ 120 – 170", searchQuery: "Chum Churum peach soju" }
    ],
    "鏡月 Kyoungwol": [
      { name: "鏡月燒酒", desc: "Lotte 出品韓國燒酒", price: "NT$ 130 – 180", searchQuery: "Kyoungwol soju" },
      { name: "鏡月綠", desc: "綠色清新版", price: "NT$ 130 – 180", searchQuery: "Kyoungwol green soju" }
    ],
    "iichiko 三和": [
      { name: "iichiko Silhouette", desc: "經典藍標麥燒酎", price: "NT$ 700 – 950", searchQuery: "iichiko silhouette" },
      { name: "iichiko Frasco", desc: "稀少品種長期熟成", price: "NT$ 1,800 – 2,500", searchQuery: "iichiko frasco" },
      { name: "iichiko Special", desc: "特級陳年版", price: "NT$ 1,100 – 1,500", searchQuery: "iichiko special" }
    ],
    "黑霧島": [
      { name: "黑霧島 25 度", desc: "黃金千貫芋燒酎", price: "NT$ 800 – 1,200", searchQuery: "Kuro Kirishima shochu" },
      { name: "赤霧島", desc: "紫芋限量版", price: "NT$ 1,200 – 1,600", searchQuery: "Aka Kirishima shochu" },
      { name: "白霧島", desc: "經典白瓶版", price: "NT$ 700 – 950", searchQuery: "Shiro Kirishima shochu" }
    ],
    "白岳 Shiratake": [
      { name: "白岳 銀座", desc: "球磨米燒酎銀座版", price: "NT$ 600 – 900", searchQuery: "Hakutake Ginza shochu" },
      { name: "白岳 KAORU", desc: "新風味系列", price: "NT$ 700 – 1,000", searchQuery: "Hakutake Kaoru" }
    ],
    "Aperol": [
      { name: "Aperol", desc: "義大利橙紅利口酒，Spritz 主角", price: "NT$ 600 – 900" }
    ],
    "Campari": [
      { name: "Campari", desc: "義大利經典紅色苦味酒", price: "NT$ 700 – 1,000" }
    ],
    "Sambuca": [
      { name: "Molinari Sambuca Extra", desc: "莫里納利茴香酒經典", price: "NT$ 700 – 1,000", searchQuery: "Molinari Sambuca" },
      { name: "Luxardo Sambuca", desc: "Luxardo 出品", price: "NT$ 750 – 1,100", searchQuery: "Luxardo Sambuca" }
    ],
    "Jägermeister 野格": [
      { name: "Jägermeister Original", desc: "經典 56 種草本利口酒", price: "NT$ 700 – 1,000", searchQuery: "Jagermeister" },
      { name: "Jägermeister Manifest", desc: "限量陳年版", price: "NT$ 1,800 – 2,400", searchQuery: "Jagermeister Manifest" },
      { name: "Jägermeister Scharf", desc: "薑與辣椒辛辣版", price: "NT$ 800 – 1,100", searchQuery: "Jagermeister Scharf" }
    ],
    "Pernod / Ricard": [
      { name: "Pernod Anise", desc: "法國經典茴香酒", price: "NT$ 750 – 1,000", searchQuery: "Pernod anise" },
      { name: "Ricard Pastis", desc: "Ricard 茴香烈酒", price: "NT$ 700 – 950", searchQuery: "Ricard pastis" }
    ],
    "Ouzo": [
      { name: "Ouzo 12", desc: "希臘 Ouzo 12 經典", price: "NT$ 550 – 800", searchQuery: "Ouzo 12" },
      { name: "Plomari Ouzo", desc: "Plomari 萊斯沃斯島經典", price: "NT$ 600 – 850", searchQuery: "Plomari Ouzo" }
    ],
    "Sake 清酒": [
      { name: "獺祭 23 二割三分", desc: "山口縣旭酒造頂級純米大吟釀", price: "NT$ 4,500 – 6,500", searchQuery: "Dassai 23 sake" },
      { name: "獺祭 45 純米大吟釀", desc: "獺祭核心款 45% 精米", price: "NT$ 1,500 – 2,200", searchQuery: "Dassai 45 sake" },
      { name: "久保田 千寿", desc: "新潟朝日酒造特別本釀造", price: "NT$ 1,200 – 1,700", searchQuery: "Kubota Senju sake" },
      { name: "八海山 純米吟醸", desc: "新潟八海釀造純米吟釀", price: "NT$ 1,500 – 2,100", searchQuery: "Hakkaisan junmai ginjo" }
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = (typeof window !== 'undefined' ? window : globalThis).brandProducts;
}
