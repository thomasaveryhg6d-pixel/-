// 天干数据
const TIAN_GAN = [
    { name: '甲', element: 'wood', yin_yang: 'yang', number: 1 },
    { name: '乙', element: 'wood', yin_yang: 'yin', number: 2 },
    { name: '丙', element: 'fire', yin_yang: 'yang', number: 3 },
    { name: '丁', element: 'fire', yin_yang: 'yin', number: 4 },
    { name: '戊', element: 'earth', yin_yang: 'yang', number: 5 },
    { name: '己', element: 'earth', yin_yang: 'yin', number: 6 },
    { name: '庚', element: 'metal', yin_yang: 'yang', number: 7 },
    { name: '辛', element: 'metal', yin_yang: 'yin', number: 8 },
    { name: '壬', element: 'water', yin_yang: 'yang', number: 9 },
    { name: '癸', element: 'water', yin_yang: 'yin', number: 10 }
];

// 地支数据
const DI_ZHI = [
    { name: '子', element: 'water', yin_yang: 'yang', number: 1, animal: '鼠', hour: '23:00-01:00' },
    { name: '丑', element: 'earth', yin_yang: 'yin', number: 2, animal: '牛', hour: '01:00-03:00' },
    { name: '寅', element: 'wood', yin_yang: 'yang', number: 3, animal: '虎', hour: '03:00-05:00' },
    { name: '卯', element: 'wood', yin_yang: 'yin', number: 4, animal: '兔', hour: '05:00-07:00' },
    { name: '辰', element: 'earth', yin_yang: 'yang', number: 5, animal: '龙', hour: '07:00-09:00' },
    { name: '巳', element: 'fire', yin_yang: 'yin', number: 6, animal: '蛇', hour: '09:00-11:00' },
    { name: '午', element: 'fire', yin_yang: 'yang', number: 7, animal: '马', hour: '11:00-13:00' },
    { name: '未', element: 'earth', yin_yang: 'yin', number: 8, animal: '羊', hour: '13:00-15:00' },
    { name: '申', element: 'metal', yin_yang: 'yang', number: 9, animal: '猴', hour: '15:00-17:00' },
    { name: '酉', element: 'metal', yin_yang: 'yin', number: 10, animal: '鸡', hour: '17:00-19:00' },
    { name: '戌', element: 'earth', yin_yang: 'yang', number: 11, animal: '狗', hour: '19:00-21:00' },
    { name: '亥', element: 'water', yin_yang: 'yin', number: 12, animal: '猪', hour: '21:00-23:00' }
];

// 五行数据
const WU_XING = {
    metal: { name: '金', color: '#C0C0C0', icon: '⚙️', direction: '西', season: '秋', organ: '肺' },
    wood: { name: '木', color: '#228B22', icon: '🌳', direction: '东', season: '春', organ: '肝' },
    water: { name: '水', color: '#1E90FF', icon: '💧', direction: '北', season: '冬', organ: '肾' },
    fire: { name: '火', color: '#DC143C', icon: '🔥', direction: '南', season: '夏', organ: '心' },
    earth: { name: '土', color: '#DAA520', icon: '🏔️', direction: '中', season: '四季', organ: '脾' }
};

// 五行相生相克关系
const WU_XING_RELATIONS = {
    generate: { // 相生
        metal: 'water',
        water: 'wood',
        wood: 'fire',
        fire: 'earth',
        earth: 'metal'
    },
    overcome: { // 相克
        metal: 'wood',
        wood: 'earth',
        earth: 'water',
        water: 'fire',
        fire: 'metal'
    }
};

// 五行元素中文名映射
const WU_XING_NAMES = {
    '金': 'metal',
    '木': 'wood',
    '水': 'water',
    '火': 'fire',
    '土': 'earth'
};

// 八卦数据
const BA_GUA = [
    { name: '乾', symbol: '☰', nature: '天', element: 'metal', direction: '西北', natureText: '天行健，君子以自强不息', lines: [1, 1, 1] },
    { name: '兑', symbol: '☱', nature: '泽', element: 'metal', direction: '西', natureText: '丽泽兑，君子以朋友讲习', lines: [1, 1, 0] },
    { name: '离', symbol: '☲', nature: '火', element: 'fire', direction: '南', natureText: '明两作离，大人以继明照于四方', lines: [1, 0, 1] },
    { name: '震', symbol: '☳', nature: '雷', element: 'wood', direction: '东', natureText: '洊雷震，君子以恐惧修省', lines: [0, 0, 1] },
    { name: '巽', symbol: '☴', nature: '风', element: 'wood', direction: '东南', natureText: '随风巽，君子以申命行事', lines: [1, 1, 0] },
    { name: '坎', symbol: '☵', nature: '水', element: 'water', direction: '北', natureText: '水洊至，习坎，君子以常德行', lines: [0, 1, 0] },
    { name: '艮', symbol: '☶', nature: '山', element: 'earth', direction: '东北', natureText: '兼山艮，君子以思不出其位', lines: [0, 0, 1] },
    { name: '坤', symbol: '☷', nature: '地', element: 'earth', direction: '西南', natureText: '地势坤，君子以厚德载物', lines: [0, 0, 0] }
];

// 六十四卦完整数据
const SIXTY_FOUR_GUA = {
    // 乾宫八卦
    '乾乾': { name: '乾为天', symbol: '☰', judgment: '元亨利贞', image: '天行健，君子以自强不息', interpretation: '刚健中正，万事如意，宜积极进取', fortune: '大吉', wuxing: '金', lines: [1,1,1,1,1,1] },
    '乾坤': { name: '天地否', symbol: '否', judgment: '否之匪人，不利君子贞', image: '天地不交，否', interpretation: '阴阳不交，万物不生，宜守静待变', fortune: '凶', wuxing: '土', lines: [0,0,0,1,1,1] },
    '乾兑': { name: '天泽履', symbol: '履', judgment: '履虎尾，不咥人，亨', image: '上天下泽，履', interpretation: '小心谨慎，如履薄冰，终能化险为夷', fortune: '中', wuxing: '金', lines: [1,1,1,1,1,0] },
    '乾离': { name: '天火同人', symbol: '同人', judgment: '同人于野，亨', image: '天与火，同人', interpretation: '志同道合，团结协作，利于社交', fortune: '吉', wuxing: '火', lines: [1,1,1,1,0,1] },
    '乾震': { name: '天雷无妄', symbol: '无妄', judgment: '元亨利贞', image: '天下雷行，物与无妄', interpretation: '真诚无妄，遵循正道，勿妄动', fortune: '吉', wuxing: '木', lines: [1,1,1,0,0,1] },
    '乾巽': { name: '天风姤', symbol: '姤', judgment: '女壮，勿用取女', image: '天下有风，姤', interpretation: '偶然相遇，把握时机，但需谨慎', fortune: '中', wuxing: '木', lines: [1,1,1,1,1,0] },
    '乾坎': { name: '天水讼', symbol: '讼', judgment: '有孚窒惕，中吉', image: '天与水违行，讼', interpretation: '争讼之象，宜和解，不宜争执', fortune: '凶', wuxing: '水', lines: [1,1,1,0,1,0] },
    '乾艮': { name: '天山遁', symbol: '遁', judgment: '亨，小利贞', image: '天下有山，遁', interpretation: '退避隐遁，保存实力，待时而动', fortune: '中', wuxing: '土', lines: [1,1,1,0,0,1] },

    // 坤宫八卦
    '坤乾': { name: '地天泰', symbol: '泰', judgment: '小往大来，吉亨', image: '天地交，泰', interpretation: '天地交泰，万事亨通，大吉大利', fortune: '大吉', wuxing: '土', lines: [0,0,0,1,1,1] },
    '坤坤': { name: '坤为地', symbol: '坤', judgment: '元亨，利牝马之贞', image: '地势坤，君子以厚德载物', interpretation: '柔顺包容，厚德载物，宜顺从配合', fortune: '大吉', wuxing: '土', lines: [0,0,0,0,0,0] },
    '坤兑': { name: '地泽临', symbol: '临', judgment: '元亨利贞', image: '泽上有地，临', interpretation: '居高临下，指导引领，宜积极作为', fortune: '吉', wuxing: '土', lines: [0,0,0,1,1,0] },
    '坤离': { name: '地火明夷', symbol: '明夷', judgment: '利艰贞', image: '明入地中，明夷', interpretation: '光明受损，宜韬光养晦，暗中努力', fortune: '凶', wuxing: '火', lines: [0,0,0,1,0,1] },
    '坤震': { name: '地雷复', symbol: '复', judgment: '亨。出入无疾，朋来无咎', image: '雷在地中，复', interpretation: '一阳来复，重新开始，万象更新', fortune: '吉', wuxing: '木', lines: [0,0,0,0,0,1] },
    '坤巽': { name: '地风升', symbol: '升', judgment: '元亨', image: '地中生木，升', interpretation: '积小成大，循序渐进，步步高升', fortune: '吉', wuxing: '木', lines: [0,0,0,1,1,0] },
    '坤坎': { name: '地水师', symbol: '师', judgment: '贞，丈人吉，无咎', image: '地中有水，师', interpretation: '统帅之象，宜组织力量，纪律严明', fortune: '中', wuxing: '水', lines: [0,0,0,0,1,0] },
    '坤艮': { name: '地山谦', symbol: '谦', judgment: '亨，君子有终', image: '地中有山，谦', interpretation: '谦虚退让，品德高尚，终获吉祥', fortune: '大吉', wuxing: '土', lines: [0,0,0,0,0,1] },

    // 离宫八卦
    '离乾': { name: '火天大有', symbol: '大有', judgment: '元亨', image: '火在天上，大有', interpretation: '丰收之象，事业有成，财运亨通', fortune: '大吉', wuxing: '火', lines: [1,0,1,1,1,1] },
    '离坤': { name: '火地晋', symbol: '晋', judgment: '康侯用锡马蕃庶', image: '明出地上，晋', interpretation: '光明上进，事业发展，获得赏识', fortune: '吉', wuxing: '火', lines: [1,0,1,0,0,0] },
    '离兑': { name: '火泽睽', symbol: '睽', judgment: '小事吉', image: '上火下泽，睽', interpretation: '意见相左，小事可成，大事难成', fortune: '凶', wuxing: '火', lines: [1,0,1,1,1,0] },
    '离离': { name: '离为火', symbol: '离', judgment: '利贞，亨', image: '明两作离，大人以继明照于四方', interpretation: '光明美丽，依附正道，利于文化事业', fortune: '吉', wuxing: '火', lines: [1,0,1,1,0,1] },
    '离震': { name: '火雷噬嗑', symbol: '噬嗑', judgment: '亨，利用狱', image: '雷电噬嗑，先王以明罚敕法', interpretation: '清除障碍，果断决绝，利于执法', fortune: '中', wuxing: '木', lines: [1,0,1,0,0,1] },
    '离巽': { name: '火风鼎', symbol: '鼎', judgment: '元吉，亨', image: '木上有火，鼎', interpretation: '革故鼎新，事业稳固，大吉大利', fortune: '大吉', wuxing: '木', lines: [1,0,1,1,1,0] },
    '离坎': { name: '火水未济', symbol: '未济', judgment: '亨，小狐汔济', image: '火在水上，未济', interpretation: '尚未完成，需继续努力，终将成功', fortune: '中', wuxing: '水', lines: [1,0,1,0,1,0] },
    '离艮': { name: '火山旅', symbol: '旅', judgment: '小亨，旅贞吉', image: '山上有火，旅', interpretation: '旅途之象，漂泊不定，宜谨慎行事', fortune: '中', wuxing: '土', lines: [1,0,1,0,0,1] },

    // 震宫八卦
    '震乾': { name: '雷天大壮', symbol: '大壮', judgment: '利贞', image: '雷在天上，大壮', interpretation: '强壮刚健，但需守正，不可妄动', fortune: '吉', wuxing: '木', lines: [0,0,1,1,1,1] },
    '震坤': { name: '雷地豫', symbol: '豫', judgment: '利建侯行师', image: '雷出地奋，豫', interpretation: '欢乐和顺，利于行动，万事预备', fortune: '吉', wuxing: '木', lines: [0,0,1,0,0,0] },
    '震兑': { name: '雷泽归妹', symbol: '归妹', judgment: '征凶，无攸利', image: '泽上有雷，归妹', interpretation: '婚嫁之象，但时机未到，宜等待', fortune: '凶', wuxing: '金', lines: [0,0,1,1,1,0] },
    '震离': { name: '雷火丰', symbol: '丰', judgment: '亨，王假之', image: '雷电皆至，丰', interpretation: '丰盛之象，事业鼎盛，但盛极必衰', fortune: '吉', wuxing: '火', lines: [0,0,1,1,0,1] },
    '震震': { name: '震为雷', symbol: '震', judgment: '亨。震来虩虩，笑言哑哑', image: '洊雷震，君子以恐惧修省', interpretation: '震动惊惧，但终能安定，宜修省', fortune: '中', wuxing: '木', lines: [0,0,1,0,0,1] },
    '震巽': { name: '雷风恒', symbol: '恒', judgment: '亨，无咎，利贞', image: '雷风恒，君子以立不易方', interpretation: '持之以恒，坚守正道，终获成功', fortune: '吉', wuxing: '木', lines: [0,0,1,1,1,0] },
    '震坎': { name: '雷水解', symbol: '解', judgment: '利西南', image: '雷雨作，解', interpretation: '困难化解，雨过天晴，宜宽以待人', fortune: '吉', wuxing: '水', lines: [0,0,1,0,1,0] },
    '震艮': { name: '雷山小过', symbol: '小过', judgment: '亨，利贞', image: '山上有雷，小过', interpretation: '小事可成，大事不宜，宜谨慎', fortune: '中', wuxing: '土', lines: [0,0,1,0,0,1] },

    // 巽宫八卦
    '巽乾': { name: '风天小畜', symbol: '小畜', judgment: '亨，密云不雨', image: '风行天上，小畜', interpretation: '小有积蓄，力量不足，宜等待', fortune: '中', wuxing: '木', lines: [1,1,0,1,1,1] },
    '巽坤': { name: '风地观', symbol: '观', judgment: '盥而不荐，有孚颙若', image: '风行地上，观', interpretation: '观察审视，以德感化，宜静观其变', fortune: '中', wuxing: '木', lines: [1,1,0,0,0,0] },
    '巽兑': { name: '风泽中孚', symbol: '中孚', judgment: '豚鱼吉', image: '泽上有风，中孚', interpretation: '诚信感人，以诚待人，万事皆吉', fortune: '大吉', wuxing: '金', lines: [1,1,0,1,1,0] },
    '巽离': { name: '风火家人', symbol: '家人', judgment: '利女贞', image: '风自火出，家人', interpretation: '家庭和睦，各守本分，家和万事兴', fortune: '吉', wuxing: '火', lines: [1,1,0,1,0,1] },
    '巽震': { name: '风雷益', symbol: '益', judgment: '利有攸往', image: '风雷益，君子以见善则迁', interpretation: '增益之象，利于行动，会有收获', fortune: '大吉', wuxing: '木', lines: [1,1,0,0,0,1] },
    '巽巽': { name: '巽为风', symbol: '巽', judgment: '小亨，利有攸往', image: '随风巽，君子以申命行事', interpretation: '顺从柔和，小亨，利于行动', fortune: '吉', wuxing: '木', lines: [1,1,0,1,1,0] },
    '巽坎': { name: '风水涣', symbol: '涣', judgment: '亨，王假有庙', image: '风行水上，涣', interpretation: '涣散之象，宜精神统一，化解矛盾', fortune: '中', wuxing: '水', lines: [1,1,0,0,1,0] },
    '巽艮': { name: '风山渐', symbol: '渐', judgment: '女归吉，利贞', image: '山上有木，渐', interpretation: '循序渐进，不可急躁，终获成功', fortune: '吉', wuxing: '土', lines: [1,1,0,0,0,1] },

    // 坎宫八卦
    '坎乾': { name: '水天需', symbol: '需', judgment: '有孚，光亨', image: '云上于天，需', interpretation: '等待时机，有信心终获成功', fortune: '吉', wuxing: '水', lines: [0,1,0,1,1,1] },
    '坎坤': { name: '水地比', symbol: '比', judgment: '吉。原筮元永贞，无咎', image: '地上有水，比', interpretation: '亲近辅佐，团结合作，吉利', fortune: '吉', wuxing: '水', lines: [0,1,0,0,0,0] },
    '坎兑': { name: '水泽节', symbol: '节', judgment: '亨，苦节不可贞', image: '泽上有水，节', interpretation: '节制有度，适可而止，过度则苦', fortune: '中', wuxing: '金', lines: [0,1,0,1,1,0] },
    '坎离': { name: '水火既济', symbol: '既济', judgment: '亨，小利贞', image: '水在火上，既济', interpretation: '成功完成，但盛极必衰，宜守成', fortune: '吉', wuxing: '火', lines: [0,1,0,1,0,1] },
    '坎震': { name: '水雷屯', symbol: '屯', judgment: '元亨利贞', image: '云雷屯，君子以经纶', interpretation: '创业艰难，但终有收获，宜坚忍', fortune: '中', wuxing: '木', lines: [0,1,0,0,0,1] },
    '坎巽': { name: '水风井', symbol: '井', judgment: '改邑不改井', image: '木上有水，井', interpretation: '取之不尽，用之不竭，宜付出', fortune: '吉', wuxing: '木', lines: [0,1,0,1,1,0] },
    '坎坎': { name: '坎为水', symbol: '坎', judgment: '习坎，有孚，维心亨', image: '水洊至，习坎，君子以常德行', interpretation: '险难重重，但心诚则通，宜坚守', fortune: '凶', wuxing: '水', lines: [0,1,0,0,1,0] },
    '坎艮': { name: '水山蹇', symbol: '蹇', judgment: '利西南', image: '山上有水，蹇', interpretation: '行走艰难，宜退守反思，不宜冒进', fortune: '凶', wuxing: '土', lines: [0,1,0,0,0,1] },

    // 艮宫八卦
    '艮乾': { name: '山天大畜', symbol: '大畜', judgment: '利贞，不家食吉', image: '天在山中，大畜', interpretation: '大有积蓄，力量充足，利于大业', fortune: '大吉', wuxing: '土', lines: [0,0,1,1,1,1] },
    '艮坤': { name: '山地剥', symbol: '剥', judgment: '不利有攸往', image: '山附于地，剥', interpretation: '剥落之象，运势衰退，宜静守', fortune: '凶', wuxing: '土', lines: [0,0,1,0,0,0] },
    '艮兑': { name: '山泽损', symbol: '损', judgment: '有孚，元吉', image: '山下有泽，损', interpretation: '有所损失，但终有回报，宜付出', fortune: '中', wuxing: '金', lines: [0,0,1,1,1,0] },
    '艮离': { name: '山火贲', symbol: '贲', judgment: '亨，小利有攸往', image: '山下有火，贲', interpretation: '文饰之美，利于文化艺术，小利', fortune: '吉', wuxing: '火', lines: [0,0,1,1,0,1] },
    '艮震': { name: '山雷颐', symbol: '颐', judgment: '贞吉，观颐', image: '山下有雷，颐', interpretation: '颐养之道，注意言行，修养身心', fortune: '吉', wuxing: '木', lines: [0,0,1,0,0,1] },
    '艮巽': { name: '山风蛊', symbol: '蛊', judgment: '元亨，利涉大川', image: '山下有风，蛊', interpretation: '整饬弊端，革故鼎新，利于改革', fortune: '中', wuxing: '木', lines: [0,0,1,1,1,0] },
    '艮坎': { name: '山水蒙', symbol: '蒙', judgment: '亨，匪我求童蒙', image: '山下出泉，蒙', interpretation: '蒙昧初开，宜学习求教，启蒙养正', fortune: '中', wuxing: '水', lines: [0,0,1,0,1,0] },
    '艮艮': { name: '艮为山', symbol: '艮', judgment: '艮其背，不获其身', image: '兼山艮，君子以思不出其位', interpretation: '止而不动，宜静守本分，不宜妄动', fortune: '中', wuxing: '土', lines: [0,0,1,0,0,1] },

    // 兑宫八卦
    '兑乾': { name: '泽天夬', symbol: '夬', judgment: '扬于王庭', image: '泽上于天，夬', interpretation: '决断之象，果断行动，但需谨慎', fortune: '吉', wuxing: '金', lines: [1,1,0,1,1,1] },
    '兑坤': { name: '泽地萃', symbol: '萃', judgment: '亨，王假有庙', image: '泽上于地，萃', interpretation: '聚集之象，利于团聚，集合力量', fortune: '吉', wuxing: '金', lines: [1,1,0,0,0,0] },
    '兑兑': { name: '兑为泽', symbol: '兑', judgment: '亨，利贞', image: '丽泽兑，君子以朋友讲习', interpretation: '喜悦和乐，人际和谐，利于交友', fortune: '吉', wuxing: '金', lines: [1,1,0,1,1,0] },
    '兑离': { name: '泽火革', symbol: '革', judgment: '己日乃孚，元亨利贞', image: '泽中有火，革', interpretation: '变革之象，除旧布新，时机成熟', fortune: '吉', wuxing: '火', lines: [1,1,0,1,0,1] },
    '兑震': { name: '泽雷随', symbol: '随', judgment: '元亨利贞，无咎', image: '泽中有雷，随', interpretation: '随顺之象，顺应时势，灵活应变', fortune: '吉', wuxing: '木', lines: [1,1,0,0,0,1] },
    '兑巽': { name: '泽风大过', symbol: '大过', judgment: '栋桡，利有攸往，亨', image: '泽灭木，大过', interpretation: '非常之时，需非常之策，宜果断', fortune: '中', wuxing: '木', lines: [1,1,0,1,1,0] },
    '兑坎': { name: '泽水困', symbol: '困', judgment: '亨，贞，大人吉', image: '泽无水，困', interpretation: '困境之象，但守正则吉，宜忍耐', fortune: '凶', wuxing: '水', lines: [1,1,0,0,1,0] },
    '兑艮': { name: '泽山咸', symbol: '咸', judgment: '亨，利贞', image: '山上有泽，咸', interpretation: '感应之象，心灵相通，利于感情', fortune: '大吉', wuxing: '土', lines: [1,1,0,0,0,1] }
};

// 十神数据
const SHI_SHEN = {
    same: '比肩',
    sameReverse: '劫财',
    output: '食神',
    outputReverse: '伤官',
    wealth: '偏财',
    wealthReverse: '正财',
    control: '七杀',
    controlReverse: '正官',
    resource: '偏印',
    resourceReverse: '正印'
};

// 天干五合
const TIAN_GAN_WU_HE = {
    '甲己': '土',
    '乙庚': '金',
    '丙辛': '水',
    '丁壬': '木',
    '戊癸': '火'
};

// 地支六合
const DI_ZHI_LIU_HE = {
    '子丑': '土',
    '寅亥': '木',
    '卯戌': '火',
    '辰酉': '金',
    '巳申': '水',
    '午未': '火'
};

// 地支三合局
const DI_ZHI_SAN_HE = {
    '申子辰': '水局',
    '寅午戌': '火局',
    '巳酉丑': '金局',
    '亥卯未': '木局'
};

// 地支相冲
const DI_ZHI_XIANG_CHONG = {
    '子午': true,
    '丑未': true,
    '寅申': true,
    '卯酉': true,
    '辰戌': true,
    '巳亥': true
};

// 纳音五行
const NA_YIN_WU_XING = [
    '海中金', '炉中火', '大林木', '路旁土', '剑锋金',
    '山头火', '涧下水', '城头土', '白蜡金', '杨柳木',
    '泉中水', '屋上土', '霹雳火', '松柏木', '长流水',
    '砂中金', '山下火', '平地木', '壁上土', '金箔金',
    '覆灯火', '天河水', '大驿土', '钗钏金', '桑柘木',
    '大溪水', '沙中土', '天上火', '石榴木', '大海水'
];

// 运势描述模板
const FORTUNE_TEMPLATES = {
    career: {
        high: ['事业运势旺盛，有贵人相助，适合开拓新领域。', '工作顺利，有望获得晋升或重要项目。', '创业或投资会有不错回报，把握时机。'],
        medium: ['事业运势平稳，宜守成不宜冒进。', '工作上有小成就，需耐心等待机会。', '适合学习新技能，为未来发展做准备。'],
        low: ['事业运势欠佳，宜谨慎行事。', '工作上可能遇到阻碍，需保持耐心。', '避免重大决策，稳中求变为上策。']
    },
    wealth: {
        high: ['财运亨通，正财偏财皆有收获。', '投资理财收益可观，但需见好就收。', '意外之财可期，但不可过于贪心。'],
        medium: ['财运平稳，收支基本平衡。', '不宜大额投资，稳健理财为佳。', '开源节流，积少成多。'],
        low: ['财运欠佳，需谨慎理财。', '避免冲动消费，量入为出。', '不宜进行高风险投资。']
    },
    love: {
        high: ['桃花运旺，单身者易遇良缘。', '感情甜蜜，适合表白或求婚。', '夫妻和睦，家庭幸福美满。'],
        medium: ['感情运势平稳，需用心经营。', '单身者可多参加社交活动。', '伴侣间需多沟通理解。'],
        low: ['感情运势欠佳，易生口角。', '单身者缘分未到，不宜强求。', '需包容理解，避免冲动。']
    },
    health: {
        high: ['身体健康，精力充沛。', '适合运动锻炼，增强体质。', '注意劳逸结合，保持良好状态。'],
        medium: ['健康状况一般，需注意保养。', '避免过度劳累，规律作息。', '适当运动，饮食均衡。'],
        low: ['健康运势较弱，需多加注意。', '避免熬夜，注意休息。', '定期体检，防患未然。']
    }
};

// 开运建议
const LUCKY_ADVICE = {
    metal: ['佩戴金银首饰', '多穿白色、金色衣物', '西方为吉方', '秋季运势较佳'],
    wood: ['多接触绿色植物', '多穿绿色衣物', '东方为吉方', '春季运势较佳'],
    water: ['多接触水相关活动', '多穿黑色、蓝色衣物', '北方为吉方', '冬季运势较佳'],
    fire: ['多接触阳光', '多穿红色衣物', '南方为吉方', '夏季运势较佳'],
    earth: ['多接触大自然', '多穿黄色衣物', '中央为吉方', '四季交替时运势较佳']
};

// 月份数据（用于月柱计算）
const MONTH_DATA = [
    { month: 1, gan_index: 0, zhi_index: 2 }, // 寅月
    { month: 2, gan_index: 2, zhi_index: 3 }, // 卯月
    { month: 3, gan_index: 4, zhi_index: 4 }, // 辰月
    { month: 4, gan_index: 6, zhi_index: 5 }, // 巳月
    { month: 5, gan_index: 8, zhi_index: 6 }, // 午月
    { month: 6, gan_index: 0, zhi_index: 7 }, // 未月
    { month: 7, gan_index: 2, zhi_index: 8 }, // 申月
    { month: 8, gan_index: 4, zhi_index: 9 }, // 酉月
    { month: 9, gan_index: 6, zhi_index: 10 }, // 戌月
    { month: 10, gan_index: 8, zhi_index: 11 }, // 亥月
    { month: 11, gan_index: 0, zhi_index: 0 }, // 子月
    { month: 12, gan_index: 2, zhi_index: 1 }  // 丑月
];

// 时辰对应地支索引
const HOUR_TO_ZHI = [
    { start: 23, end: 1, zhi_index: 0 },   // 子时
    { start: 1, end: 3, zhi_index: 1 },     // 丑时
    { start: 3, end: 5, zhi_index: 2 },     // 寅时
    { start: 5, end: 7, zhi_index: 3 },     // 卯时
    { start: 7, end: 9, zhi_index: 4 },     // 辰时
    { start: 9, end: 11, zhi_index: 5 },    // 巳时
    { start: 11, end: 13, zhi_index: 6 },   // 午时
    { start: 13, end: 15, zhi_index: 7 },   // 未时
    { start: 15, end: 17, zhi_index: 8 },   // 申时
    { start: 17, end: 19, zhi_index: 9 },   // 酉时
    { start: 19, end: 21, zhi_index: 10 },  // 戌时
    { start: 21, end: 23, zhi_index: 11 }   // 亥时
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TIAN_GAN,
        DI_ZHI,
        WU_XING,
        WU_XING_RELATIONS,
        WU_XING_NAMES,
        BA_GUA,
        SIXTY_FOUR_GUA,
        SHI_SHEN,
        TIAN_GAN_WU_HE,
        DI_ZHI_LIU_HE,
        DI_ZHI_SAN_HE,
        DI_ZHI_XIANG_CHONG,
        NA_YIN_WU_XING,
        FORTUNE_TEMPLATES,
        LUCKY_ADVICE,
        MONTH_DATA,
        HOUR_TO_ZHI
    };
}