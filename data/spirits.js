// 烈酒資料庫 - 市場上現售的主要烈酒品牌資訊
const spiritsData = {
  whisky: {
    name: "威士忌",
    nameEn: "Whisky / Whiskey",
    icon: "🥃",
    abv: "40-60%",
    origin: "蘇格蘭、愛爾蘭、美國、加拿大、日本、台灣等",
    rawMaterial: "大麥、黑麥、小麥、玉米等穀物",
    description: "威士忌是以發酵穀物為原料製成的蒸餾酒，通常在橡木桶中陳年，產生豐富的風味層次。依產地、原料、製法不同分為許多種類，是世界上最受歡迎的烈酒之一。",
    history: "威士忌的歷史可追溯至 15 世紀的蘇格蘭與愛爾蘭，「Whisky」一字源自蓋爾語「uisge beatha」，意為「生命之水」。",
    types: [
      { name: "蘇格蘭威士忌 (Scotch)", desc: "必須在蘇格蘭蒸餾並陳年至少 3 年，分為單一麥芽、調和、單一穀物等" },
      { name: "愛爾蘭威士忌 (Irish)", desc: "通常經過三次蒸餾，口感較為柔順" },
      { name: "美國威士忌 (Bourbon/Rye)", desc: "波本以玉米為主，肯塔基州生產；裸麥威士忌則以黑麥為主" },
      { name: "日本威士忌 (Japanese)", desc: "受蘇格蘭影響，風格精緻細膩，近年國際大放異彩" },
      { name: "加拿大威士忌 (Canadian)", desc: "多為混合穀物製成，口感清爽" },
      { name: "台灣威士忌 (Taiwanese)", desc: "亞熱帶氣候加速熟成，風味濃郁，國際屢獲大獎" }
    ],
    brands: [
      { name: "麥卡倫 Macallan", country: "蘇格蘭", category: "單一麥芽", desc: "斯佩賽區頂級單一麥芽威士忌，使用雪莉桶陳年，深受收藏家喜愛。" },
      { name: "格蘭菲迪 Glenfiddich", country: "蘇格蘭", category: "單一麥芽", desc: "1960 年代單一麥芽威士忌的開創者，最具代表性的入門款。" },
      { name: "尊尼獲加 Johnnie Walker", country: "蘇格蘭", category: "調和", desc: "蘇格蘭最知名的調和威士忌品牌，從紅牌到藍牌定位明確。" },
      { name: "芝華士 Chivas Regal", country: "蘇格蘭", category: "調和", desc: "經典 12 年、18 年調和威士忌，圓潤平衡。" },
      { name: "格蘭利威 The Glenlivet", country: "蘇格蘭", category: "單一麥芽", desc: "斯佩賽區另一經典品牌，風格清新易飲。" },
      { name: "拉佛格 Laphroaig", country: "蘇格蘭", category: "單一麥芽", desc: "艾雷島代表，重泥煤、藥水與煙燻風味鮮明。" },
      { name: "阿貝 Ardbeg", country: "蘇格蘭", category: "單一麥芽", desc: "艾雷島重泥煤威士忌愛好者的必選。" },
      { name: "傑克丹尼 Jack Daniel's", country: "美國", category: "田納西", desc: "全球最暢銷的美國威士忌之一，老 7 號為其招牌。" },
      { name: "美格 Maker's Mark", country: "美國", category: "波本", desc: "紅色封蠟瓶口為其辨識度極高的標誌。" },
      { name: "金賓 Jim Beam", country: "美國", category: "波本", desc: "波本威士忌全球銷量領導品牌。" },
      { name: "傑姆森 Jameson", country: "愛爾蘭", category: "調和", desc: "全球最暢銷的愛爾蘭威士忌，三重蒸餾口感柔順。" },
      { name: "山崎 Yamazaki", country: "日本", category: "單一麥芽", desc: "三得利旗下，日本威士忌的代表作。" },
      { name: "響 Hibiki", country: "日本", category: "調和", desc: "三得利調和威士忌，瓶身 24 面切割象徵日本 24 節氣。" },
      { name: "余市 Yoichi", country: "日本", category: "單一麥芽", desc: "Nikka 旗下，海風與煤炭直火蒸餾賦予的厚實風味。" },
      { name: "噶瑪蘭 Kavalan", country: "台灣", category: "單一麥芽", desc: "金車集團出品，台灣第一座威士忌酒廠，國際獎牌數百面。" },
      { name: "OMAR", country: "台灣", category: "單一麥芽", desc: "南投酒廠出品的台灣本土單一麥芽威士忌。" }
    ]
  },

  brandy: {
    name: "白蘭地",
    nameEn: "Brandy",
    icon: "🍷",
    abv: "35-60%",
    origin: "法國（干邑、雅馬邑）、西班牙、美國等",
    rawMaterial: "葡萄為主，其他水果亦可",
    description: "白蘭地原意為「燒葡萄酒」，是以葡萄酒或其他水果酒為基底蒸餾而成的烈酒，通常於橡木桶中陳年。最著名的產區為法國干邑地區。",
    history: "白蘭地的歷史源於 16 世紀荷蘭商人在法國以蒸餾保存葡萄酒運輸，逐漸演變為精緻烈酒。",
    types: [
      { name: "干邑 Cognac", desc: "法國干邑地區生產，使用銅製壺式蒸餾器二次蒸餾" },
      { name: "雅馬邑 Armagnac", desc: "法國加斯科涅地區，使用連續蒸餾器，風格較粗獷" },
      { name: "美國白蘭地 American Brandy", desc: "加州為主要產區，代表品牌如 E&J" },
      { name: "水果白蘭地 Fruit Brandy", desc: "以蘋果（Calvados）、櫻桃（Kirsch）等水果蒸餾" }
    ],
    grades: [
      { name: "V.S. (Very Special)", desc: "桶陳至少 2 年" },
      { name: "V.S.O.P. (Very Superior Old Pale)", desc: "桶陳至少 4 年" },
      { name: "X.O. (Extra Old)", desc: "桶陳至少 10 年" },
      { name: "X.X.O. / Extra", desc: "桶陳至少 14 年" }
    ],
    brands: [
      { name: "軒尼詩 Hennessy", country: "法國干邑", category: "Cognac", desc: "全球最大的干邑品牌，V.S.O.P 與 X.O 是經典之作。" },
      { name: "人頭馬 Rémy Martin", country: "法國干邑", category: "Cognac", desc: "以「Fine Champagne」干邑著稱，路易十三為其頂級代表。" },
      { name: "馬爹利 Martell", country: "法國干邑", category: "Cognac", desc: "歷史最悠久的干邑品牌之一，創立於 1715 年。" },
      { name: "拿破崙 Courvoisier", country: "法國干邑", category: "Cognac", desc: "傳說中拿破崙最愛的品牌，VSOP 與 XO 廣受歡迎。" },
      { name: "百樂廷 Camus", country: "法國干邑", category: "Cognac", desc: "最大的家族經營干邑酒商。" },
      { name: "達摩 Dalmore", country: "蘇格蘭", category: "白蘭地風格威士忌", desc: "以雪莉桶風味著稱（注：嚴格來說為威士忌）。" }
    ]
  },

  vodka: {
    name: "伏特加",
    nameEn: "Vodka",
    icon: "🍸",
    abv: "37.5-50%",
    origin: "俄羅斯、波蘭、北歐",
    rawMaterial: "穀物（小麥、黑麥）、馬鈴薯",
    description: "伏特加是經過至少三次蒸餾、活性碳過濾製成的純淨蒸餾酒，傳統上純飲冰鎮，也是調酒的萬用基酒之一。",
    history: "伏特加起源於 14 世紀的東歐，原意為「小水（little water）」，是俄羅斯與波蘭的國民酒。",
    types: [
      { name: "穀物伏特加", desc: "以小麥、黑麥、玉米為原料，口感柔順" },
      { name: "馬鈴薯伏特加", desc: "口感較濃稠，有奶油香氣" },
      { name: "風味伏特加", desc: "加入水果、香草、辣椒等香料製成" }
    ],
    brands: [
      { name: "絕對 Absolut", country: "瑞典", category: "穀物", desc: "以冬小麥蒸餾，瓶身設計獨特，是世界最暢銷伏特加之一。" },
      { name: "斯米諾 Smirnoff", country: "原俄羅斯", category: "穀物", desc: "全球銷量第一的伏特加，調酒最常見的選擇。" },
      { name: "灰雁 Grey Goose", country: "法國", category: "穀物", desc: "以法國小麥蒸餾五次，高端伏特加代表。" },
      { name: "雪樹 Belvedere", country: "波蘭", category: "黑麥", desc: "100% 波蘭黑麥蒸餾四次，奢華風格。" },
      { name: "蕭邦 Chopin", country: "波蘭", category: "馬鈴薯", desc: "以馬鈴薯為原料的高端伏特加，口感絲滑。" },
      { name: "坎特 Ketel One", country: "荷蘭", category: "穀物", desc: "荷蘭家族傳承的小批次蒸餾伏特加。" },
      { name: "野牛草 Żubrówka", country: "波蘭", category: "風味", desc: "添加比亞沃維耶扎森林野牛草，瓶內常浮一根草葉。" },
      { name: "斯托利 Stolichnaya", country: "拉脫維亞", category: "穀物", desc: "經典的俄式風格伏特加，調酒師愛用。" }
    ]
  },

  gin: {
    name: "琴酒",
    nameEn: "Gin",
    icon: "🌿",
    abv: "37.5-50%",
    origin: "荷蘭、英國",
    rawMaterial: "穀物烈酒加上杜松子等多種植物香料",
    description: "琴酒以中性烈酒為基底，加入杜松子（Juniper Berry）為主的植物香料再次蒸餾製成。是調製琴湯尼、馬丁尼等經典調酒的核心基酒。",
    history: "琴酒最早源於 17 世紀荷蘭醫師 Franciscus Sylvius 製作的藥酒「Genever」，後傳入英國發展出 London Dry 風格。",
    types: [
      { name: "倫敦乾琴酒 London Dry Gin", desc: "市售最常見類型，必須在蒸餾過程加入植物香料，不加糖" },
      { name: "普利茅斯琴酒 Plymouth Gin", desc: "受地理標示保護，僅能在英國普利茅斯生產" },
      { name: "老湯姆琴酒 Old Tom Gin", desc: "風格略甜，介於 Genever 與 London Dry 之間" },
      { name: "荷蘭琴酒 Genever", desc: "琴酒的始祖，以麥芽酒為基底，風味類似威士忌" },
      { name: "新世代琴酒 New Western/Contemporary", desc: "強調當地特色植物，杜松子味較淡" }
    ],
    brands: [
      { name: "英人牌 Beefeater", country: "英國", category: "London Dry", desc: "倫敦市區唯一的琴酒蒸餾廠，價格親民、品質穩定。" },
      { name: "坦奎瑞 Tanqueray", country: "英國", category: "London Dry", desc: "綠瓶辨識度高，調酒師最愛用的琴酒之一。" },
      { name: "龐貝藍鑽 Bombay Sapphire", country: "英國", category: "London Dry", desc: "藍色瓶身，使用 10 種植物香料蒸氣浸潤蒸餾。" },
      { name: "高登 Gordon's", country: "英國", category: "London Dry", desc: "全球銷量領先的琴酒品牌，調酒入門首選。" },
      { name: "亨利爵士 Hendrick's", country: "蘇格蘭", category: "新世代", desc: "添加小黃瓜與玫瑰花瓣，風格獨特。" },
      { name: "孟買之星 Star of Bombay", country: "英國", category: "London Dry", desc: "龐貝藍鑽的高端版本，加入鳶尾草與安布雷特籽。" },
      { name: "猴王 Monkey 47", country: "德國", category: "新世代", desc: "使用 47 種植物香料，黑森林地區生產的精品琴酒。" },
      { name: "希普史密斯 Sipsmith", country: "英國", category: "London Dry", desc: "復興倫敦小批次琴酒風潮的先驅。" },
      { name: "Roku 六", country: "日本", category: "新世代", desc: "三得利出品，加入櫻花、櫻葉、玉露等六種日本植物。" }
    ]
  },

  rum: {
    name: "蘭姆酒",
    nameEn: "Rum",
    icon: "🏴‍☠️",
    abv: "37.5-75.5%",
    origin: "加勒比海、中南美洲",
    rawMaterial: "甘蔗汁、糖蜜",
    description: "蘭姆酒由甘蔗副產品糖蜜或新鮮甘蔗汁發酵蒸餾製成，又稱「糖酒」。是加勒比海國家的代表酒，也是莫吉托、Pina Colada 等熱帶調酒的靈魂。",
    history: "蘭姆酒誕生於 17 世紀的加勒比海甘蔗種植園，曾是海盜與英國皇家海軍的標準配給。",
    types: [
      { name: "白蘭姆 / 輕蘭姆 White/Light Rum", desc: "陳年時間最短，風味清淡，常用於調酒" },
      { name: "金蘭姆 Gold/Amber Rum", desc: "桶陳數年，呈金黃色，風味平衡" },
      { name: "黑蘭姆 Dark Rum", desc: "長時間陳年，深褐色，風味濃郁帶焦糖、香草味" },
      { name: "陳年蘭姆 Aged/Añejo Rum", desc: "長期橡木桶陳年，可純飲品鑑" },
      { name: "農業蘭姆 Rhum Agricole", desc: "以新鮮甘蔗汁直接蒸餾，主要法屬西印度群島生產" }
    ],
    brands: [
      { name: "百加得 Bacardi", country: "波多黎各", category: "白蘭姆", desc: "全球銷量第一的蘭姆酒品牌，調酒師基本款。" },
      { name: "摩根船長 Captain Morgan", country: "波多黎各", category: "香料蘭姆", desc: "加勒比海風格香料蘭姆酒的代表。" },
      { name: "哈瓦那俱樂部 Havana Club", country: "古巴", category: "陳年", desc: "古巴國寶，純正古巴風格蘭姆酒。" },
      { name: "外交官 Diplomático", country: "委內瑞拉", category: "陳年", desc: "南美陳年蘭姆酒代表，多次獲獎。" },
      { name: "薩凱帕 Zacapa", country: "瓜地馬拉", category: "陳年", desc: "海拔 2300 公尺陳年，使用 Solera 系統，奢華柔順。" },
      { name: "凱朋 Mount Gay", country: "巴貝多", category: "陳年", desc: "世界最古老的商業蘭姆酒廠，創立於 1703 年。" },
      { name: "牙買加 Appleton Estate", country: "牙買加", category: "陳年", desc: "牙買加蘭姆酒代表，風味濃郁帶熱帶水果。" },
      { name: "麥拉斯 Mauritius", country: "模里西斯", category: "農業蘭姆", desc: "印度洋風格農業蘭姆酒。" }
    ]
  },

  tequila: {
    name: "龍舌蘭",
    nameEn: "Tequila",
    icon: "🌵",
    abv: "38-55%",
    origin: "墨西哥（哈利斯科州 Jalisco）",
    rawMaterial: "藍色龍舌蘭草（Agave Tequilana Weber Azul）的心臟「Piña」",
    description: "龍舌蘭是墨西哥國酒，由藍色龍舌蘭草心烘烤、發酵、蒸餾製成。受 DOT 原產地保護，僅特定地區生產。國際對應墨西哥區域以外的同類酒稱 Mezcal。",
    history: "龍舌蘭最早可追溯至 16 世紀西班牙征服者引入蒸餾術後的當地酒，1974 年取得原產地保護。",
    types: [
      { name: "Blanco / Silver", desc: "蒸餾後直接裝瓶或短暫陳年（少於 2 個月），純淨龍舌蘭風味" },
      { name: "Reposado", desc: "橡木桶陳年 2 個月至 1 年，呈淡金色" },
      { name: "Añejo", desc: "陳年 1-3 年，琥珀色，圓潤甘甜" },
      { name: "Extra Añejo", desc: "陳年超過 3 年，最頂級的龍舌蘭酒" },
      { name: "Mezcal", desc: "更廣義的龍舌蘭酒，可用多種龍舌蘭，傳統土窯煙燻風味" }
    ],
    brands: [
      { name: "豪帥快活 Jose Cuervo", country: "墨西哥", category: "Reposado", desc: "全球最暢銷的龍舌蘭品牌，歷史最悠久。" },
      { name: "唐胡里奧 Don Julio", country: "墨西哥", category: "Reposado/Añejo", desc: "高端龍舌蘭代表，1942 為其頂級珍藏。" },
      { name: "培恩 Patrón", country: "墨西哥", category: "Silver/Reposado", desc: "美國市場熱賣的精品龍舌蘭。" },
      { name: "塔巴蒂奧 Tapatío", country: "墨西哥", category: "Blanco", desc: "100% Agave，調酒師高度推崇。" },
      { name: "金快活 Olmeca", country: "墨西哥", category: "Reposado", desc: "受歡迎的中價位龍舌蘭品牌。" },
      { name: "賀雷拉杜拉 Herradura", country: "墨西哥", category: "Reposado", desc: "歷史悠久的家族酒廠，100% Agave。" },
      { name: "1800 Tequila", country: "墨西哥", category: "Reposado", desc: "以 1800 年為名，紀念當時開始橡木桶陳年的傳統。" },
      { name: "梅斯卡爾 Del Maguey", country: "墨西哥", category: "Mezcal", desc: "單一村莊（Single Village）梅斯卡爾代表品牌。" }
    ]
  },

  baijiu: {
    name: "中式白酒",
    nameEn: "Baijiu / Chinese Liquor",
    icon: "🍶",
    abv: "38-65%",
    origin: "中國、台灣、金門",
    rawMaterial: "高粱、小麥、糯米、玉米等",
    description: "中式白酒是以穀物為原料、酒麴發酵蒸餾製成的傳統中國烈酒，依香型可分為醬香、濃香、清香、米香、鳳香、芝麻香等。台灣金門高粱也屬於此類。",
    history: "白酒釀造歷史可追溯至元朝引進蒸餾技術，發展至今超過 700 年。",
    types: [
      { name: "醬香型", desc: "代表：茅台。香氣濃郁、回甘悠長" },
      { name: "濃香型", desc: "代表：五糧液、瀘州老窖。窖香濃郁，入口甘美" },
      { name: "清香型", desc: "代表：汾酒、金門高粱。香氣清雅，純淨爽淨" },
      { name: "米香型", desc: "代表：桂林三花酒。蜜香清雅，落口爽淨" },
      { name: "鳳香型", desc: "代表：西鳳酒。介於濃、清香之間" }
    ],
    brands: [
      { name: "茅台 Moutai", country: "中國貴州", category: "醬香", desc: "中國「國酒」，世界三大名酒之一，醬香型代表。" },
      { name: "五糧液 Wuliangye", country: "中國四川", category: "濃香", desc: "以五種穀物釀造的濃香型白酒，銷量領先。" },
      { name: "瀘州老窖", country: "中國四川", category: "濃香", desc: "濃香型白酒「鼻祖」，使用 400 餘年連續發酵窖池。" },
      { name: "汾酒", country: "中國山西", category: "清香", desc: "清香型白酒代表，歷史超過 1500 年。" },
      { name: "劍南春", country: "中國四川", category: "濃香", desc: "濃香型名酒，唐代宮廷御酒。" },
      { name: "洋河大曲", country: "中國江蘇", category: "綿柔濃香", desc: "藍色經典「夢之藍」系列享譽全國。" },
      { name: "郎酒", country: "中國四川", category: "兼香", desc: "醬香、濃香兼具，紅花郎為代表。" },
      { name: "金門高粱 Kinmen Kaoliang", country: "台灣金門", category: "清香（高粱）", desc: "台灣最知名的白酒品牌，以金門純淨水質釀造。" },
      { name: "馬祖老酒 / 八八坑道", country: "台灣馬祖", category: "高粱", desc: "馬祖酒廠出品，於戰備坑道陳年。" },
      { name: "玉山高粱", country: "台灣", category: "高粱", desc: "台灣菸酒公司出品，價格親民。" }
    ]
  },

  others: {
    name: "其他烈酒",
    nameEn: "Other Spirits",
    icon: "🍶",
    abv: "20-55%",
    origin: "全球各地",
    rawMaterial: "依品項而異",
    description: "除六大基酒與中式白酒外，全球各地還有多種特色烈酒，包括日本燒酎、韓國燒酒、墨西哥梅斯卡爾、義大利渣釀白蘭地等。",
    types: [],
    brands: [
      { name: "真露 Jinro", country: "韓國", category: "燒酒", desc: "全球銷量第一的烈酒品牌，韓式餐桌上的常客。" },
      { name: "Chum-Churum 處處", country: "韓國", category: "燒酒", desc: "樂天酒類出品，主打順口柔滑。" },
      { name: "iichiko 三和", country: "日本", category: "燒酎", desc: "大麥燒酎代表，產自大分縣。" },
      { name: "黑霧島 Kuro Kirishima", country: "日本", category: "燒酎", desc: "宮崎縣芋燒酎代表，香氣濃郁。" },
      { name: "Aperol", country: "義大利", category: "利口酒", desc: "Spritz 調酒的主角，橙色苦甜風味。" },
      { name: "Campari", country: "義大利", category: "苦酒", desc: "Negroni 經典基底，苦中帶甘。" },
      { name: "Jägermeister", country: "德國", category: "草本利口酒", desc: "56 種草本香料浸製，年輕族群派對熱門。" },
      { name: "Pernod / Ricard", country: "法國", category: "茴香酒", desc: "法國國民調酒「Pastis」的代表。" },
      { name: "Ouzo", country: "希臘", category: "茴香酒", desc: "希臘國酒，加水後變乳白色。" },
      { name: "Sambuca", country: "義大利", category: "茴香酒", desc: "甜味茴香利口酒，傳統點火飲用。" },
      { name: "Sake 清酒", country: "日本", category: "釀造酒", desc: "雖為釀造酒（非烈酒），但常與烈酒並列。代表如獺祭、八海山。" }
    ]
  }
};

// 在瀏覽器或 Node 環境都能存取
if (typeof window !== 'undefined') {
  window.spiritsData = spiritsData;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = spiritsData;
}
