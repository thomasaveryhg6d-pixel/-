/**
 * 道家命理推演 - 主应用逻辑
 * 传承千年智慧，天人合一之道
 */

// 当前选择的起卦方法
let currentMethod = 'time';
// 当前选择的问题分类
let currentCategory = '事业';
// 最近一次推演结果
let lastDivinationResult = null;

/**
 * 推演过场动画 - 符合道家风格的深奥文字
 * 根据起卦方法返回不同的过场语
 */
function getDivinationLoadingTexts(method) {
    const texts = {
        time: [
            '"天行健，君子以自强不息。" —— 时运流转，观天之道，执天之行',
            '"一阴一阳之谓道。" —— 刚柔交错，天文也；文明以止，人文也',
            '"仰以观于天文，俯以察于地理。" —— 幽明之故，原始反终',
            '"易有太极，是生两仪，两仪生四象，四象生八卦。" —— 混沌初开，万象归一'
        ],
        question: [
            '"至诚之道，可以前知。" —— 心诚则灵，意动则卦成',
            '"《易》无思也，无为也，寂然不动，感而遂通天下之故。" —— 凝神静气，观想所问',
            '"洗心退藏于密。" —— 杂念尽去，唯存一问，卦象自显',
            '"吉凶悔吝者，生乎动者也。" —— 心有所感，卦有所应'
        ],
        number: [
            '"天一地二，天三地四，天五地六，天七地八，天九地十。" —— 万物皆数，数中有理',
            '"参伍以变，错综其数。" —— 极其数，遂定天下之象',
            '"数往者顺，知来者逆。" —— 以数演理，以理推势',
            '"大衍之数五十，其用四十有九。" —— 筮法精微，天地之数备焉'
        ]
    };
    const pool = texts[method] || texts.time;
    // 随机打乱顺序
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled;
}

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initTheme();
});

/**
 * 初始化事件监听
 */
function initEventListeners() {
    // 推演按钮
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            startDivination();
        });
    }
    
    // 问题输入框回车提交
    const questionInput = document.getElementById('question');
    if (questionInput) {
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                startDivination();
            }
        });
    }
}

/**
 * 初始化主题
 */
function initTheme() {
    // 检查是否支持暗色模式
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-theme', prefersDark);
}

/**
 * 选择问题分类
 */
function selectCategory(category) {
    currentCategory = category;
    
    // 更新分类按钮状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
}

/**
 * 选择起卦方法
 */
function selectMethod(method) {
    currentMethod = method;
    
    // 更新按钮状态
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('active');

    // 联动详细解释面板：展开对应方法的解读，关闭其他的
    const detailMap = { time: 'detailTime', question: 'detailQuestion', number: 'detailNumber' };
    document.querySelectorAll('.method-details-panel details').forEach(d => {
        d.removeAttribute('open');
    });
    const targetDetail = document.getElementById(detailMap[method]);
    if (targetDetail) {
        targetDetail.setAttribute('open', '');
        targetDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 显示/隐藏对应的输入区域
    document.querySelectorAll('.method-content').forEach(content => {
        content.style.display = 'none';
    });
    
    if (method === 'question') {
        document.getElementById('questionMethod').style.display = 'block';
        document.getElementById('question').focus();
    } else if (method === 'number') {
        document.getElementById('numberMethod').style.display = 'block';
        document.getElementById('divinationNumber').focus();
    }
}

/**
 * 八卦名称转五行
 */
const TRIGRAM_WUXING_MAP = {
    '乾': '金', '兑': '金', '离': '火', '震': '木',
    '巽': '木', '坎': '水', '艮': '土', '坤': '土'
};

function getGuaWuxing(trigramName) {
    return TRIGRAM_WUXING_MAP[trigramName] || '土';
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 生成时间卦象（梅花易数）
 */
function generateTimeHexagram() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    
    const upperNum = (year + month + day) % 8 || 8;
    const lowerNum = (year + month + day + hour) % 8 || 8;
    const yaoNum = (year + month + day + hour) % 6 || 6;
    
    const trigrams = Object.values(BA_GUA);
    const upperGua = trigrams.find(g => g.number === upperNum) || trigrams[0];
    const lowerGua = trigrams.find(g => g.number === lowerNum) || trigrams[0];
    
    const lines = [...lowerGua.lines, ...upperGua.lines];
    lines[yaoNum - 1] = lines[yaoNum - 1] === 1 ? 0 : 1;
    
    const hexagramData = findHexagram(upperGua, lowerGua);
    
    return {
        ...hexagramData,
        lines: lines,
        upperGua: upperGua,
        lowerGua: lowerGua,
        movingYao: yaoNum,
        method: 'time'
    };
}

/**
 * 生成数字卦象
 */
function generateNumberHexagram(number) {
    const numStr = String(number);
    const sum = numStr.split('').reduce((a, b) => a + parseInt(b), 0);
    
    const upperNum = number % 8 || 8;
    const lowerNum = sum % 8 || 8;
    const yaoNum = sum % 6 || 6;
    
    const trigrams = Object.values(BA_GUA);
    const upperGua = trigrams.find(g => g.number === upperNum) || trigrams[0];
    const lowerGua = trigrams.find(g => g.number === lowerNum) || trigrams[0];
    
    const lines = [...lowerGua.lines, ...upperGua.lines];
    lines[yaoNum - 1] = lines[yaoNum - 1] === 1 ? 0 : 1;
    
    const hexagramData = findHexagram(upperGua, lowerGua);
    
    return {
        ...hexagramData,
        lines: lines,
        upperGua: upperGua,
        lowerGua: lowerGua,
        movingYao: yaoNum,
        method: 'number'
    };
}

/**
 * 查找六十四卦
 */
function findHexagram(upperGua, lowerGua) {
    if (typeof SI_SHI_SI_GUA !== 'undefined') {
        for (const key in SI_SHI_SI_GUA) {
            const hex = SI_SHI_SI_GUA[key];
            if (hex.upperGua === upperGua.nature && hex.lowerGua === lowerGua.nature) {
                return {
                    name: hex.name,
                    symbol: hex.symbol,
                    judgment: hex.judgment,
                    image: hex.image,
                    interpretation: hex.interpretation,
                    fortune: hex.fortune,
                    wuxing: hex.wuxing || upperGua.element
                };
            }
        }
    }
    
    return {
        name: `${upperGua.name}${lowerGua.name}卦`,
        symbol: '☯',
        judgment: '易有太极，是生两仪。',
        image: '天地定位，山泽通气。',
        interpretation: '此卦象显示事物处于变化之中，需要审时度势。',
        fortune: '中等偏上',
        wuxing: upperGua.element
    };
}

/**
 * 显示推演过程
 */
function displayDivinationProcess(method, hexagram) {
    const principleEl = document.getElementById('qiguaPrinciple');
    const processEl = document.getElementById('qiguaProcess');
    const animEl = document.getElementById('hexagramAnim');
    
    let principle = '';
    let process = '';
    
    if (method === 'time') {
        principle = `梅花易数时间起卦法：以当前年、月、日、时的数理推算卦象。此法源于宋代邵雍，讲究"天人感应"，认为事物的发生发展与时间密切相关。古人云："易与天地准，故能弥纶天地之道。"`;
        
        const now = new Date();
        const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        const zodiac = zodiacs[now.getFullYear() % 12];
        process = `
            <strong>【起卦过程】</strong><br>
            年数：${now.getFullYear()}年（${zodiac}年）<br>
            月数：${now.getMonth() + 1}月<br>
            日数：${now.getDate()}日<br>
            时辰：${getShichenName(now.getHours())}<br><br>
            <strong>【上卦推算】</strong><br>
            （年数+月数+日数）÷ 8 取余 = 上卦<br>
            <strong>【下卦推算】</strong><br>
            （年数+月数+日数+时数）÷ 8 取余 = 下卦<br>
            <strong>【动爻推算】</strong><br>
            （年数+月数+日数+时数）÷ 6 取余 = 动爻
        `;
    } else if (method === 'question') {
        principle = `问事起卦法：根据所问之事起卦，讲究"心诚则灵"。《易经·系辞》云："易有太极，是生两仪。"心中所想之事，通过意念与天地感应，形成特定的卦象。此法最能反映问事者当下的心境与事物的状态。`;
        
        process = `
            <strong>【起卦过程】</strong><br>
            问事者心诚意专，观想所问之事...<br>
            通过文字笔画或意念感应推算卦象...<br>
            上卦：${hexagram.upperGua.name}（${hexagram.upperGua.nature}）<br>
            下卦：${hexagram.lowerGua.name}（${hexagram.lowerGua.nature}）<br>
            动爻：第${hexagram.movingYao}爻
        `;
    } else if (method === 'number') {
        principle = `数字起卦法：以任意数字起卦，体现了"万物皆数"的道家思想。《易经·系辞》云："天一，地二，天三，地四，天五，地六，天七，地八，天九，地十。"数字蕴含着天地之理，通过数理推演可得卦象。`;
        
        const number = document.getElementById('divinationNumber').value;
        process = `
            <strong>【起卦过程】</strong><br>
            所选数字：${number}<br>
            数字各位之和：${String(number).split('').reduce((a, b) => a + parseInt(b), 0)}<br><br>
            <strong>【上卦推算】</strong><br>
            ${number} ÷ 8 取余 = 上卦<br>
            <strong>【下卦推算】</strong><br>
            数字之和 ÷ 8 取余 = 下卦<br>
            <strong>【动爻推算】</strong><br>
            数字之和 ÷ 6 取余 = 动爻
        `;
    }
    
    if (principleEl) principleEl.innerHTML = principle;
    if (processEl) processEl.innerHTML = process;
    
    // 显示卦象动画（从下到上逐爻生成）
    if (!animEl) return;
    animEl.innerHTML = '';
    hexagram.lines.forEach((line, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = `line ${line === 1 ? 'solid' : 'broken'}`;
        lineDiv.style.opacity = '0';
        lineDiv.style.transform = 'scaleX(0)';
        lineDiv.style.animationDelay = `${index * 0.2}s`;
        
        setTimeout(() => {
            lineDiv.style.transition = 'all 0.4s ease-out';
            lineDiv.style.opacity = '1';
            lineDiv.style.transform = 'scaleX(1)';
        }, 100 + index * 200);
        
        animEl.appendChild(lineDiv);
    });
}

/**
 * 获取时辰名称
 */
function getShichenName(hour) {
    const shichens = [
        { name: '子时', start: 23, end: 1 },
        { name: '丑时', start: 1, end: 3 },
        { name: '寅时', start: 3, end: 5 },
        { name: '卯时', start: 5, end: 7 },
        { name: '辰时', start: 7, end: 9 },
        { name: '巳时', start: 9, end: 11 },
        { name: '午时', start: 11, end: 13 },
        { name: '未时', start: 13, end: 15 },
        { name: '申时', start: 15, end: 17 },
        { name: '酉时', start: 17, end: 19 },
        { name: '戌时', start: 19, end: 21 },
        { name: '亥时', start: 21, end: 23 }
    ];
    
    for (const sc of shichens) {
        if (sc.start <= hour && hour < sc.end) {
            return sc.name;
        }
    }
    return '子时';
}

/**
 * AI推演四大模块的提示词（静态定义，不依赖this）
 * 每个模块有独立的 system prompt 和 user prompt 生成器
 */
const SECTION_PROMPTS = {
    analysis: {
        title: '命盘解析',
        icon: '☯️',
        system: `${MASTER_ROLE}

【专精模块：象数定盘 + 理气辩证】
此模块的任务是完整呈现命盘的象数结构与理气逻辑。用列表清晰罗列四柱、卦象、动爻、五行分布，然后通过五行生克找出核心矛盾，引用《易经》原文论证。不做任何运势预测，只做结构分析。`,
        getUserPrompt(guaData, baziData, method, question) {
            const methodNames = { 'time': '梅花易数·时间起卦法', 'question': '心诚则灵·问事起卦法', 'number': '万物皆数·数字起卦法' };
            const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
            const upperGua = guaData.upperGua;
            const lowerGua = guaData.lowerGua;
            const hexLines = guaData.lines.map((l, i) => `  ${i+1}爻：${l === 1 ? '阳爻 ———' : '阴爻 — — —'}`).join('\n');
            let baziInfo = '';
            if (baziData) {
                const wc = Calculator.countWuxing(baziData);
                const wa = Calculator.analyzeWuxing(wc, baziData);
                const waAnalysis = Array.isArray(wa) ? wa.join(' ') : '';
                baziInfo = `
【八字四柱】
年柱：${baziData.year.gan.name}${baziData.year.zhi.name}
月柱：${baziData.month.gan.name}${baziData.month.zhi.name}
日柱：${baziData.day.gan.name}${baziData.day.zhi.name}
时柱：${baziData.hour.gan.name}${baziData.hour.zhi.name}
日主：${baziData.day.gan.name}（${wuxingNames[baziData.day.gan.element]}）
【五行统计】金${wc.metal||0} 木${wc.wood||0} 水${wc.water||0} 火${wc.fire||0} 土${wc.earth||0}
【五行分析】${waAnalysis}`;
            }
            return `请根据以下信息，输出【象数定盘】和【理气辩证】两个部分。

【起卦方法】${methodNames[method] || methodNames['time']}
【求问】${question}

【卦象信息】
本卦：${guaData.name}（上${upperGua.name}下${lowerGua.name}）
卦辞：${guaData.judgment}
象辞：${guaData.image}
上卦${upperGua.name}五行属${wuxingNames[upperGua.element]}；下卦${lowerGua.name}五行属${wuxingNames[lowerGua.element]}
六爻排列（初爻至上爻）：
${hexLines}
动爻：第${guaData.movingYao}爻
${baziInfo}

要求：
1.【象数定盘】用列表罗列四柱、本卦互卦变卦结构、动爻爻辞原文、五行分布
2.【理气辩证】用五行生克找出核心矛盾，引用《易经》卦辞或爻辞原文作为论据`;
        }
    },
    career: {
        title: '事业运势',
        icon: '🏛',
        system: `${MASTER_ROLE}

【专精模块：事业与学业运势断解】
此模块只分析事业和学业。结合卦象中官鬼、父母、子孙等六亲关系（六爻）或十神关系（八字），分析职业发展方向、贵人与小人、关键决策时机。给出具体的行动建议。不做其他方面的分析。`,
        getUserPrompt(guaData, baziData, method, question) {
            const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
            const wuxingOfGua = wuxingNames[guaData.upperGua.element] + '、' + wuxingNames[guaData.lowerGua.element];
            let baziRef = '';
            if (baziData) {
                const wc = Calculator.countWuxing(baziData);
                const wa = Calculator.analyzeWuxing(wc, baziData);
                const hasStrong = wa.some(s => s.includes('较强'));
                baziRef = `\n日主：${baziData.day.gan.name}，五行偏${hasStrong ? '强' : '弱'}`;
            }
            return `请针对事业/学业方面，输出详细的【运势断解】和【趋避建议】。

卦象：${guaData.name}（${guaData.upperGua.name}上${guaData.lowerGua.name}下），五行属${wuxingOfGua}
卦辞：${guaData.judgment}
动爻：第${guaData.movingYao}爻
求问：${question}
${baziRef}

要求：
1.【运势断解·事业学业】分析机遇与阻碍、贵人方位、关键决策节点
2.【趋避建议·事业学业】给出方位、颜色、数字、行业方向等具体建议`;
        }
    },
    wealth: {
        title: '财运分析',
        icon: '💰',
        system: `${MASTER_ROLE}

【专精模块：财运分析】
此模块只分析财运。结合卦象中妻财爻（六爻）或财星（八字）的旺衰，分析进财路径、破财风险、投资宜忌。不做其他方面的分析。`,
        getUserPrompt(guaData, baziData, method, question) {
            const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
            const wuxingOfGua = wuxingNames[guaData.upperGua.element] + '、' + wuxingNames[guaData.lowerGua.element];
            let baziRef = '';
            if (baziData) {
                const wc = Calculator.countWuxing(baziData);
                const wa = Calculator.analyzeWuxing(wc, baziData);
                const hasStrong = wa.some(s => s.includes('较强'));
                baziRef = `\n日主：${baziData.day.gan.name}，五行偏${hasStrong ? '强' : '弱'}`;
            }
            return `请针对财运方面，输出详细的【运势断解】和【趋避建议】。

卦象：${guaData.name}（${guaData.upperGua.name}上${guaData.lowerGua.name}下），五行属${wuxingOfGua}
卦辞：${guaData.judgment}
动爻：第${guaData.movingYao}爻
求问：${question}
${baziRef}

要求：
1.【运势断解·财运】分析进财路径、破财风险、投资宜忌、理财建议
2.【趋避建议·财运】给出催财方位、颜色、数字、时机等具体建议`;
        }
    },
    relationship: {
        title: '感情指南',
        icon: '💕',
        system: `${MASTER_ROLE}

【专精模块：感情与人际关系】
此模块只分析感情与人际。结合卦象中妻财爻（六爻）或配偶星（八字）的状态，分析缘分走势、相处之道、桃花方位。不做其他方面的分析。`,
        getUserPrompt(guaData, baziData, method, question) {
            const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
            const wuxingOfGua = wuxingNames[guaData.upperGua.element] + '、' + wuxingNames[guaData.lowerGua.element];
            let baziRef = '';
            if (baziData) {
                baziRef = `\n日主：${baziData.day.gan.name}，性别：${baziData.gender === 'male' ? '男' : '女'}`;
            }
            return `请针对感情/人际方面，输出详细的【运势断解】和【趋避建议】。

卦象：${guaData.name}（${guaData.upperGua.name}上${guaData.lowerGua.name}下），五行属${wuxingOfGua}
卦辞：${guaData.judgment}
动爻：第${guaData.movingYao}爻
求问：${question}
${baziRef}

要求：
1.【运势断解·感情人际】分析缘分走势、桃花方位、相处之道
2.【趋避建议·感情人际】给出增进感情的具体方法、颜色、方位等建议`;
        }
    },
    health: {
        title: '健康建议',
        icon: '🏥',
        system: `${MASTER_ROLE}

【专精模块：健康养生】
此模块只分析健康。结合五行对应五脏（木-肝、火-心、土-脾、金-肺、水-肾），分析脏腑弱点、养生重点、季节调理。不做其他方面的分析。`,
        getUserPrompt(guaData, baziData, method, question) {
            const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
            const upperWuxing = wuxingNames[guaData.upperGua.element];
            const lowerWuxing = wuxingNames[guaData.lowerGua.element];
            let wuxingStats = '';
            if (baziData) {
                const wc = Calculator.countWuxing(baziData);
                wuxingStats = `\n【五行分布】金${wc.metal||0} 木${wc.wood||0} 水${wc.water||0} 火${wc.fire||0} 土${wc.earth||0}`;
            }
            return `请针对健康方面，输出详细的【运势断解】和【趋避建议】。

卦象：${guaData.name}（上卦五行${upperWuxing}，下卦五行${lowerWuxing}）
卦辞：${guaData.judgment}
动爻：第${guaData.movingYao}爻
${wuxingStats}

要求：
1.【运势断解·健康】分析脏腑弱点、季节性健康风险、养生重点
2.【趋避建议·健康】给出饮食、作息、运动、方位等具体调理建议`;
        }
    },
    advice: {
        title: '趋吉避凶',
        icon: '🧭',
        system: `${MASTER_ROLE}

【专精模块：综合趋避指南】
此模块给出综合性的趋吉避凶建议。整合八字喜用神与卦象指引，从方位、颜色、数字、时辰、行为等多维度给出可操作的具体建议。引用爻辞精要概括。不做具体运势分析，只给建议。`,
        getUserPrompt(guaData, baziData, method, question) {
            const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
            const wuxingOfGua = wuxingNames[guaData.upperGua.element] + '、' + wuxingNames[guaData.lowerGua.element];
            let xiYongInfo = '';
            if (baziData) {
                const wc = Calculator.countWuxing(baziData);
                const wa = Calculator.analyzeWuxing(wc, baziData);
                const hasStrong = wa.some(s => s.includes('较强'));
                xiYongInfo = hasStrong ? `\n【五行提示】${wa.join('；')}` : '\n【五行提示】五行较均衡，需结合卦象判断';
            }
            return `请针对综合趋吉避凶，输出详细的【趋避建议】。

卦象：${guaData.name}（${guaData.upperGua.name}上${guaData.lowerGua.name}下），五行属${wuxingOfGua}
卦辞：${guaData.judgment}
象辞：${guaData.image}
动爻：第${guaData.movingYao}爻
求问：${question}
${xiYongInfo}

要求：
1.【趋避建议·综合】从方位、颜色、数字、时辰、行为五方面给出具体建议
2. 用一句爻辞精要概括整体运势
3. 说明每项建议的五行原理`;
        }
    }
};

/**
 * 本地兜底内容（API失败时使用）
 */
function getFallbackContent(id, guaData, baziData, method, question) {
    const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const upperWuxing = wuxingNames[guaData.upperGua.element] || '土';
    const lowerWuxing = wuxingNames[guaData.lowerGua.element] || '土';
    if (id === 'analysis') {
        return `【象数定盘】\n本卦：${guaData.name}（${guaData.upperGua.name}上${guaData.lowerGua.name}下）\n卦辞：${guaData.judgment}\n象辞：${guaData.image}\n动爻：第${guaData.movingYao}爻\n上卦五行：${upperWuxing}  下卦五行：${lowerWuxing}\n\n【理气辩证】\n上下卦五行${upperWuxing === lowerWuxing ? '比和，能量集中' : upperWuxing + '与' + lowerWuxing + '形成生克关系'}。动爻位于第${guaData.movingYao}爻，提示事态变化的关键在此爻位。\n\n（此为本地基础分析，AI深度解读暂不可用）`;
    }
    if (id === 'career') return '事业方面，' + upperWuxing + '与' + lowerWuxing + '的交互暗示当前处于变化期，宜审时度势，把握机遇。（本地基础分析）';
    if (id === 'wealth') return '财运方面，需关注五行中' + upperWuxing + '的旺衰变化，理性理财。（本地基础分析）';
    if (id === 'relationship') return '感情方面，' + guaData.name + '卦提示当前人际关系需以真诚为本，以退为进。（本地基础分析）';
    if (id === 'health') return '健康方面，需注意五行中偏弱元素对应脏腑的保养。（本地基础分析）';
    if (id === 'advice') return '综合建议：保持心态平和，顺应自然规律，遇事冷静分析。趋吉方位：东方。（本地基础分析）';
    return '暂无分析内容。';
}

/**
 * 获取五行学业智慧
 */
function getElementStudyWisdom(element) {
    const wisdoms = {
        metal: '金主收敛，利于知识积累。学习上宜注重整理归纳，巩固基础。',
        wood: '木主生长，利于思维拓展。学习上宜多角度思考，培养创新能力。',
        water: '水主智慧，利于理解记忆。学习上宜灵活运用方法，拓宽知识面。',
        fire: '火主光明，利于灵感激发。学习上宜积极表达，参与讨论交流。',
        earth: '土主厚重，利于基础夯实。学习上宜稳扎稳打，多做练习巩固。'
    };
    return wisdoms[element] || '五行平衡，学业运势平稳。';
}

/**
 * 道家名句列表 - 用于推演过渡动画
 */
const DIVINATION_QUOTES = [
    '"天行健，君子以自强不息。" —— 时运流转，观天之道',
    '"一阴一阳之谓道。" —— 刚柔交错，天文也',
    '"易有太极，是生两仪。" —— 混沌初开，万象归一',
    '"至诚之道，可以前知。" —— 心诚则灵，意动则卦成',
    '"参伍以变，错综其数。" —— 极其数，遂定天下之象',
    '"大衍之数五十，其用四十有九。" —— 筮法精微',
    '"仰以观于天文，俯以察于地理。" —— 幽明之故',
    '"洗心退藏于密。" —— 杂念尽去，唯存一问'
];

/**
 * 推演过渡动画阶段文案
 */
const DIVINATION_STEPS = [
    { main: '起卦演数，推演天机...', sub: '观天之道，执天之行' },
    { main: '排列四柱，推算八字...', sub: '天干地支，阴阳五行' },
    { main: '分析五行，生克制化...', sub: '金木水火土，相生相克' },
    { main: '解读卦象，洞察玄机...', sub: '八卦变化，吉凶悔吝' },
    { main: '综合研判，趋吉避凶...', sub: '道法自然，顺应天道' }
];

/**
 * 显示全屏推演过渡动画
 */
function showDivinationOverlay() {
    const overlay = document.getElementById('divinationOverlay');
    if (!overlay) return;
    
    overlay.classList.remove('hidden');
    
    // 清空并准备名句容器
    const quotesContainer = document.getElementById('overlayQuotes');
    if (quotesContainer) {
        quotesContainer.innerHTML = '';
        // 随机选择4条名句
        const shuffled = [...DIVINATION_QUOTES].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 4);
        selected.forEach((quote, index) => {
            const div = document.createElement('div');
            div.className = 'overlay-quote-item';
            div.textContent = quote;
            quotesContainer.appendChild(div);
            // 依次显示名句
            setTimeout(() => div.classList.add('show'), 500 + index * 600);
        });
    }
    
    // 循环切换推演阶段文案
    let stepIndex = 0;
    const mainTextEl = document.getElementById('overlayMainText');
    const subTextEl = document.getElementById('overlaySubText');
    
    if (mainTextEl && subTextEl) {
        const updateStep = () => {
            if (stepIndex < DIVINATION_STEPS.length) {
                mainTextEl.textContent = DIVINATION_STEPS[stepIndex].main;
                subTextEl.textContent = DIVINATION_STEPS[stepIndex].sub;
                stepIndex++;
            }
        };
        updateStep();
        // 每2秒切换一次文案
        return setInterval(updateStep, 2000);
    }
    return null;
}

/**
 * 隐藏全屏推演过渡动画
 */
function hideDivinationOverlay() {
    const overlay = document.getElementById('divinationOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

/**
 * 收集所有输入数据，统一传给generateAnswer
 */
function startDivination() {
    const questionEl = document.getElementById('question');
    const genderEl = document.getElementById('gender');
    const birthdayEl = document.getElementById('birthday');
    const birthtimeEl = document.getElementById('birthtime');
    const question = questionEl ? questionEl.value.trim() : '';
    const gender = genderEl ? genderEl.value : 'male';
    const category = currentCategory || '事业';

    let baziData = null;
    if (birthdayEl && birthtimeEl && birthdayEl.value && birthtimeEl.value) {
        const birthday = birthdayEl.value;
        const birthtime = birthtimeEl.value;
        baziData = Calculator.calculate(birthday, birthtime, gender);
    }

    let hexagram;
    if (currentMethod === 'number') {
        const numEl = document.getElementById('divinationNumber');
        const num = numEl ? parseInt(numEl.value) : 1;
        hexagram = generateNumberHexagram(num || 1);
    } else {
        hexagram = generateTimeHexagram();
    }

    // 显示全屏推演过渡动画
    showDivinationOverlay();

    // 准备八字和五行数据（在后台计算）
    if (baziData) displayBazi(baziData);
    const wuxingCounts = baziData ? Calculator.countWuxing(baziData) : null;
    const wuxingAnalysis = baziData ? Calculator.analyzeWuxing(wuxingCounts, baziData) : null;
    if (wuxingCounts && wuxingAnalysis) displayWuxing(wuxingCounts, wuxingAnalysis);
    displayDivinationProcess(currentMethod, hexagram);

    // 显示卦象基本信息
    displayHexagramInfo(hexagram);

    // 填充道家智慧卡片（不依赖API，立即显示）
    fillDaoistWisdom(hexagram);

    // 调用AI推演，完成后关闭过渡动画并显示结果
    generateAnswerWithOverlay(hexagram, baziData, currentMethod, question || '当前时运推演', category);
}

/**
 * 带过渡动画的AI推演（完成后显示结果）
 */
async function generateAnswerWithOverlay(hexagram, baziData, method, question, category) {
    // 调用实际的推演函数
    await generateAnswer(hexagram, baziData, method, question, category);
    
    // 推演完成后，关闭过渡动画，显示结果区域
    hideDivinationOverlay();
    
    // 显示结果区域
    const resultSection = document.getElementById('resultSection');
    if (resultSection) {
        resultSection.style.display = 'block';
        resultSection.classList.remove('hidden');
        // 延迟滚动，确保动画完成
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }
}

/**
 * 填充道家智慧卡片
 */
function fillDaoistWisdom(hexagram) {
    const daoistWisdomEl = document.getElementById('daoistWisdom');
    if (!daoistWisdomEl) return;
    const wisdomH4 = daoistWisdomEl.querySelector('h4');
    const wisdomP = daoistWisdomEl.querySelector('p');
    const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const upperWx = wuxingNames[hexagram.upperGua.element];
    const lowerWx = wuxingNames[hexagram.lowerGua.element];
    if (wisdomH4) wisdomH4.textContent = `【${hexagram.name}·卦义】`;
    if (wisdomP) wisdomP.textContent = `${hexagram.judgment}。上卦${hexagram.upperGua.name}属${upperWx}，下卦${hexagram.lowerGua.name}属${lowerWx}。动爻位于第${hexagram.movingYao}爻，提示事物变化之关键。顺应天道，方可趋吉避凶。`;
}

/**
 * 显示卦象基本信息到卦象解读卡片
 */
function displayHexagramInfo(hexagram) {
    const linesEl = document.getElementById('questionHexagramLines');
    const nameEl = document.getElementById('questionHexagramName');
    const interpEl = document.getElementById('questionInterpretation');
    
    if (linesEl) {
        linesEl.innerHTML = '';
        hexagram.lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = `line ${line === 1 ? 'solid' : 'broken'}`;
            linesEl.appendChild(lineDiv);
        });
    }
    
    if (nameEl) {
        nameEl.textContent = hexagram.name;
    }
    
    if (interpEl) {
        interpEl.innerHTML = `
            <div style="margin-top:10px;">
                <p style="color:#fbbf24;font-weight:600;">卦辞</p>
                <p style="color:#cbd5e1;">${hexagram.judgment}</p>
                <p style="color:#fbbf24;font-weight:600;margin-top:8px;">象辞</p>
                <p style="color:#cbd5e1;">${hexagram.image}</p>
            </div>
        `;
    }
}

/**
 * 生成AI解读（6个独立非流式API调用，全部完成后填入DOM）
 * 每个模块独立调用，使用新的prompt体系（无AI味，贴近卜卦师语气）
 */
async function generateAnswer(hexagram, baziData, method, question, category) {
    const questionAnalysisEl = document.getElementById('questionAnalysis');
    const hexagramAnswerEl = document.getElementById('hexagramAnswer');
    const adviceEl = document.getElementById('advice');
    const luckyTipsEl = document.getElementById('luckyTips');

    if (!questionAnalysisEl || !hexagramAnswerEl || !adviceEl || !luckyTipsEl) return;

    // 显示步骤式加载动画
    const loadingSteps = [
        { el: questionAnalysisEl, icon: '☯', title: '象数定盘', desc: '起卦演数，推演天干地支，排列四柱八字，定五行格局' },
        { el: hexagramAnswerEl, icon: '📖', title: '运势断解', desc: '观卦象变化，察五行生克，断事业财运之吉凶' },
        { el: adviceEl, icon: '🧭', title: '感情健康', desc: '审阴阳消长，辨十神情状，明人际健康之趋向' },
        { el: luckyTipsEl, icon: '✨', title: '趋吉避凶', desc: '综合天道人事，融汇方位时辰，指引趋避之方' }
    ];
    const loadingHtml = (step) => `<div class="divination-loading-card" style="text-align:center;padding:20px;">
        <div class="loading-icon" style="font-size:2rem;animation:pulse 1.5s infinite;">${step.icon}</div>
        <div style="color:#fbbf24;font-weight:bold;margin:10px 0 6px;font-size:1.1em;">【${step.title}】</div>
        <div style="color:#94a3b8;font-size:0.9em;line-height:1.6;">${step.desc}</div>
        <div class="loading-dots" style="color:#fbbf24;margin-top:8px;">推演中<span>.</span><span>.</span><span>.</span></div>
    </div>`;
    // 先全部显示第一阶段的加载卡片
    loadingSteps.forEach((s, i) => { s.el.innerHTML = loadingHtml(loadingSteps[0]); });
    // 每隔一段时间切换加载提示，模拟逐步推进
    let loadStepIdx = 0;
    const loadingTimer = setInterval(() => {
        loadStepIdx++;
        if (loadStepIdx < loadingSteps.length) {
            for (let i = loadStepIdx; i < loadingSteps.length; i++) {
                loadingSteps[i].el.innerHTML = loadingHtml(loadingSteps[loadStepIdx]);
            }
        }
    }, 3000);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // 构建八字信息字符串
    let baziInfoStr = '';
    let wuxingCounts = null;
    let wuxingAnalysis = null;
    if (baziData) {
        wuxingCounts = Calculator.countWuxing(baziData);
        wuxingAnalysis = Calculator.analyzeWuxing(wuxingCounts, baziData);
        baziInfoStr = `\n【八字信息】\n年柱：${baziData.year.gan.name}${baziData.year.zhi.name}\n月柱：${baziData.month.gan.name}${baziData.month.zhi.name}\n日柱：${baziData.day.gan.name}${baziData.day.zhi.name}\n时柱：${baziData.hour.gan.name}${baziData.hour.zhi.name}\n日主：${baziData.day.gan.name}\n五行：金${wuxingCounts.metal||0} 木${wuxingCounts.wood||0} 水${wuxingCounts.water||0} 火${wuxingCounts.fire||0} 土${wuxingCounts.earth||0}\n${wuxingAnalysis.join(' ')}`;
    }

    // 卦象基础信息
    const hexLines = hexagram.lines.map((l, i) => `  ${i+1}爻：${l === 1 ? '阳爻 ———' : '阴爻 — — —'}`).join('\n');
    const methodNames = { 'time': '梅花易数·时间起卦法', 'question': '心诚则灵·问事起卦法', 'number': '万物皆数·数字起卦法' };

    const hexBaseInfo = `【求问事项】${question}\n【问题分类】${category}\n【起卦方法】${methodNames[method] || methodNames['time']}\n\n【卦象信息】\n本卦：${hexagram.name}\n卦辞：${hexagram.judgment}\n象辞：${hexagram.image}\n\n【六爻排列】（从初爻到上爻）\n${hexLines}\n【动爻】第${hexagram.movingYao}爻`;

    const baziCrossRef = baziData ? '\n\n【八字信息】' + baziInfoStr + '\n请务必进行八字与卦象的交叉验证分析，确保结论一致。' : '\n\n【注意】用户未提供生辰信息，请仅根据卦象进行深入分析。';

    // === 6个模块并行独立API调用 ===
    const sectionIds = ['analysis', 'career', 'wealth', 'relationship', 'health', 'advice'];
    const apiCalls = sectionIds.map(id => {
        const sec = SECTION_PROMPTS[id];
        return AIService.generate(sec.system, sec.getUserPrompt(hexagram, baziData, method, question))
            .then(text => {
                if (!text || text.trim() === '') throw new Error('empty');
                return { id, text: text.trim(), fromApi: true };
            })
            .catch(() => {
                return { id, text: getFallbackContent(id, hexagram, baziData, method, question), fromApi: false };
            });
    });

    // 等待全部6个完成，停止加载动画
    const results = await Promise.all(apiCalls);
    clearInterval(loadingTimer);
    const collected = {};
    results.forEach(r => { collected[r.id] = r.text; });

    // 一次性填入DOM（保留结果）
    const formatResult = (text) => {
        return text.split('\n').filter(l => l.trim()).map(l => {
            // 标题行用strong
            if (/^【.+】/.test(l.trim())) {
                return `<p style="color:#fbbf24;font-weight:600;margin:12px 0 6px;">${l}</p>`;
            }
            return `<p style="margin:4px 0;">${l}</p>`;
        }).join('');
    };

    questionAnalysisEl.innerHTML = formatResult(collected.analysis);
    questionAnalysisEl.classList.add('fade-in');

    hexagramAnswerEl.innerHTML = formatResult(collected.career) + '<hr style="border-color:rgba(251,191,36,0.2);margin:20px 0;">' + formatResult(collected.wealth);
    hexagramAnswerEl.classList.add('fade-in');

    adviceEl.innerHTML = formatResult(collected.relationship) + '<hr style="border-color:rgba(251,191,36,0.2);margin:20px 0;">' + formatResult(collected.health);
    adviceEl.classList.add('fade-in');

    luckyTipsEl.innerHTML = formatResult(collected.advice);
    luckyTipsEl.classList.add('fade-in');

    // 添加淡入动画
    [questionAnalysisEl, hexagramAnswerEl, adviceEl, luckyTipsEl].forEach(el => {
        el.classList.add('fade-in');
    });
}

/**
 * 生成问题分析（四模块格式） - 本地兜底
 */
function generateQuestionAnalysis(question, category, hexagram, method) {
    const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const upperGua = hexagram.upperGua;
    const lowerGua = hexagram.lowerGua;
    const wuxingRelation = analyzeWuxingRelation(upperGua.element, lowerGua.element);

    let methodDesc = '';
    if (method === 'time') {
        const now = new Date();
        methodDesc = `起卦方法：梅花易数·时间起卦法。以当前时间（${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日${getShichenName(now.getHours())}）的数理推算卦象。此法源于宋代邵雍，讲究"天人感应"，认为事物的发生发展与时间密切相关。`;
    } else if (method === 'question') {
        methodDesc = `起卦方法：问事起卦法。根据所问之事"${question}"起卦，讲究"心诚则灵"。《易经·系辞》云："易有太极，是生两仪。"心中所想之事，通过意念与天地感应，形成特定的卦象。`;
    } else if (method === 'number') {
        methodDesc = `起卦方法：数字起卦法。以数字起卦，体现了"万物皆数"的道家思想。`;
    }

    return `【象数定盘】\n${methodDesc}\n本卦：${hexagram.name}（上${upperGua.name}下${lowerGua.name}）\n上卦${upperGua.name}（${upperGua.nature}，五行属${wuxingNames[upperGua.element]}）；下卦${lowerGua.name}（${lowerGua.nature}，五行属${wuxingNames[lowerGua.element]}）\n卦辞："${hexagram.judgment}"\n象辞："${hexagram.image}"\n动爻：第${hexagram.movingYao}爻\n${wuxingRelation}\n\n【理气辩证】\n${upperGua.name}卦象征${upperGua.natureText}，${lowerGua.name}卦象征${lowerGua.natureText}。从五行角度看，${wuxingNames[upperGua.element]}与${wuxingNames[lowerGua.element]}的组合揭示了事物的核心矛盾。\n\n【运势断解】\n针对"${category}"类问题，卦象【${hexagram.name}】给出了相应的启示。\n\n【趋避建议】\n道法自然，顺应天道，方能趋吉避凶。`;
}

/**
 * 获取五行综合智慧
 */
function getElementGeneralWisdom(element) {
    const wisdoms = {
        metal: '金主义，代表刚毅果断。处世上宜坚守原则，但需注意变通。',
        wood: '木主仁，代表生长发展。处世上宜积极进取，但需循序渐进。',
        water: '水主智，代表灵活变通。处世上宜审时度势，但需坚守底线。',
        fire: '火主礼，代表热情光明。处世上宜热情主动，但需控制情绪。',
        earth: '土主信，代表稳重包容。处世上宜稳扎稳打，但需避免保守。'
    };
    return wisdoms[element] || '五行平衡，运势平稳。';
}

/**
 * 显示八字
 */
function displayBazi(bazi) {
    const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    
    // 年柱
    document.getElementById('yearGan').textContent = bazi.year.gan.name;
    document.getElementById('yearGan').style.color = WU_XING[bazi.year.gan.element].color;
    document.getElementById('yearZhi').textContent = bazi.year.zhi.name;
    document.getElementById('yearZhi').style.color = WU_XING[bazi.year.zhi.element].color;
    
    // 月柱
    document.getElementById('monthGan').textContent = bazi.month.gan.name;
    document.getElementById('monthGan').style.color = WU_XING[bazi.month.gan.element].color;
    document.getElementById('monthZhi').textContent = bazi.month.zhi.name;
    document.getElementById('monthZhi').style.color = WU_XING[bazi.month.zhi.element].color;
    
    // 日柱
    document.getElementById('dayGan').textContent = bazi.day.gan.name;
    document.getElementById('dayGan').style.color = WU_XING[bazi.day.gan.element].color;
    document.getElementById('dayZhi').textContent = bazi.day.zhi.name;
    document.getElementById('dayZhi').style.color = WU_XING[bazi.day.zhi.element].color;
    
    // 时柱
    document.getElementById('hourGan').textContent = bazi.hour.gan.name;
    document.getElementById('hourGan').style.color = WU_XING[bazi.hour.gan.element].color;
    document.getElementById('hourZhi').textContent = bazi.hour.zhi.name;
    document.getElementById('hourZhi').style.color = WU_XING[bazi.hour.zhi.element].color;
    
    // 显示十神
    const shishenDisplay = document.getElementById('shishenDisplay');
    shishenDisplay.innerHTML = '';
    
    const dayMaster = bazi.day.gan;
    const ganPillars = [
        { name: '年干', gan: bazi.year.gan },
        { name: '月干', gan: bazi.month.gan },
        { name: '日干', gan: bazi.day.gan },
        { name: '时干', gan: bazi.hour.gan }
    ];
    
    ganPillars.forEach(pillar => {
        const gan = pillar.gan;
        const sameElement = gan.element === dayMaster.element;
        const sameYinyang = gan.yin_yang === dayMaster.yin_yang;
        
        let shishenName = '';
        if (sameElement) {
            shishenName = sameYinyang ? '比肩' : '劫财';
        } else if (WU_XING_RELATIONS.generate[dayMaster.element] === gan.element) {
            shishenName = sameYinyang ? '食神' : '伤官';
        } else if (WU_XING_RELATIONS.generate[gan.element] === dayMaster.element) {
            shishenName = sameYinyang ? '偏印' : '正印';
        } else if (WU_XING_RELATIONS.overcome[dayMaster.element] === gan.element) {
            shishenName = sameYinyang ? '偏财' : '正财';
        } else if (WU_XING_RELATIONS.overcome[gan.element] === dayMaster.element) {
            shishenName = sameYinyang ? '七杀' : '正官';
        }
        
        const div = document.createElement('div');
        div.className = 'shishen-item';
        div.innerHTML = `
            <div class="name">${shishenName}</div>
            <div class="element">${pillar.name}: ${gan.name}(${wuxingNames[gan.element]})</div>
        `;
        shishenDisplay.appendChild(div);
    });
    
    // 显示生肖
    const animalDiv = document.createElement('div');
    animalDiv.className = 'shishen-item';
    animalDiv.innerHTML = `
        <div class="name">生肖</div>
        <div class="element">${bazi.year.zhi.animal}</div>
    `;
    shishenDisplay.appendChild(animalDiv);
    
    // 显示日主
    const dayMasterDiv = document.createElement('div');
    dayMasterDiv.className = 'shishen-item';
    dayMasterDiv.innerHTML = `
        <div class="name">日主</div>
        <div class="element">${bazi.day.gan.name}${wuxingNames[bazi.day.gan.element]}</div>
    `;
    shishenDisplay.appendChild(dayMasterDiv);
}

/**
 * 显示五行
 */
function displayWuxing(counts, analysis) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    
    const elements = ['metal', 'wood', 'water', 'fire', 'earth'];
    const countIds = ['metalCount', 'woodCount', 'waterCount', 'fireCount', 'earthCount'];
    const fillIds = ['metalFill', 'woodFill', 'waterFill', 'fireFill', 'earthFill'];
    
    elements.forEach((element, index) => {
        const count = counts[element] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        // 动画更新
        const fillEl = document.getElementById(fillIds[index]);
        fillEl.style.width = '0%';
        setTimeout(() => {
            fillEl.style.transition = 'width 0.8s ease-out';
            fillEl.style.width = percentage + '%';
        }, 100 + index * 100);
        
        document.getElementById(countIds[index]).textContent = count;
    });
    
    const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const distribution = elements.map(el => `${wuxingNames[el]}${counts[el] || 0}`).join(' ');
    
    const analysisDiv = document.getElementById('wuxingAnalysis');
    analysisDiv.innerHTML = `
        <div class="term-explanation">
            <h4>【五行分布】</h4>
            <p>${distribution}</p>
        </div>
        <div class="term-explanation">
            <h4>【五行分析】</h4>
            <p>${analysis.join(' ')}</p>
        </div>
    `;
}


/**
 * 格式化文本 - 支持Markdown风格的格式化
 */
function formatTextWithLineBreaks(text) {
    if (!text) return '';
    
    // 先处理换行
    let html = escapeHtml(text);
    
    // 处理粗体 **text**
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // 处理模块标题 【xxx】
    html = html.replace(/【(.+?)】/g, '<strong style="color:#fbbf24;font-size:1.05em;">【$1】</strong>');
    
    // 处理标题行 ## xxx
    html = html.replace(/^## (.+)$/gm, '<h4 style="color:#fbbf24;margin:16px 0 8px;">$1</h4>');
    
    // 处理列表项 - xxx
    html = html.replace(/^- (.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px;">$1</li>');
    
    // 处理编号列表 1. xxx
    html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin-left:16px;margin-bottom:4px;">$1</li>');
    
    // 处理空行
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');
    
    return html;
}


/**
 * 分析五行关系
 */
function analyzeWuxingRelation(element1, element2) {
    const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const e1 = wuxingNames[element1];
    const e2 = wuxingNames[element2];
    
    if (WU_XING_RELATIONS.generate[element1] === element2) {
        return `${e1}生${e2}，形成相生关系，气场和谐。`;
    } else if (WU_XING_RELATIONS.generate[element2] === element1) {
        return `${e2}生${e1}，形成相生关系，有助于运势提升。`;
    } else if (WU_XING_RELATIONS.overcome[element1] === element2) {
        return `${e1}克${e2}，形成相克关系，需要平衡。`;
    } else if (WU_XING_RELATIONS.overcome[element2] === element1) {
        return `${e2}克${e1}，形成相克关系，需谨慎应对。`;
    } else {
        return `${e1}与${e2}五行相同，气场稳定。`;
    }
}

/**
 * 分享推演结果
 */
function shareResult() {
    if (!lastDivinationResult) {
        showToast('请先进行一次推演！');
        return;
    }
    
    const result = lastDivinationResult;
    const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
    const methodNames = {
        'time': '梅花易数·时间起卦',
        'question': '心诚则灵·问事起卦',
        'number': '万物皆数·数字起卦'
    };
    
    // 生成专业分享内容
    let shareText = '';
    
    // 标题
    shareText += '═════════════════════\n';
    shareText += '      ☯ 道 家 命 理 推 演 ☯\n';
    shareText += '═════════════════════\n\n';
    
    // 起卦信息
    shareText += `【起卦法门】${methodNames[result.method] || '时间起卦'}\n`;
    shareText += `【推演时间】${new Date(result.timestamp).toLocaleString('zh-CN')}\n`;
    
    // 问题
    if (result.question && result.question !== '当前时运推演') {
        shareText += `【所问之事】${result.question}\n`;
    }
    
    // 卦象信息
    shareText += '\n───────────────────────\n';
    shareText += `【本卦】${result.hexagram.name}\n`;
    shareText += `【卦辞】${result.hexagram.judgment}\n`;
    shareText += `【象曰】${result.hexagram.image}\n`;
    shareText += `【卦运】${result.hexagram.fortune}\n`;
    
    // 动爻
    if (result.hexagram.movingYao) {
        shareText += `【动爻】第${result.hexagram.movingYao}爻动\n`;
    }
    
    // 八字信息
    if (result.bazi) {
        shareText += '\n───────────────────────\n';
        shareText += '【八 字 命 盘】\n';
        const bazi = result.bazi;
        shareText += `年柱：${bazi.year.gan.name}${bazi.year.zhi.name}（${bazi.year.zhi.animal}）\n`;
        shareText += `月柱：${bazi.month.gan.name}${bazi.month.zhi.name}\n`;
        shareText += `日柱：${bazi.day.gan.name}${bazi.day.zhi.name}（日主：${bazi.day.gan.name}${wuxingNames[bazi.day.gan.element]}）\n`;
        shareText += `时柱：${bazi.hour.gan.name}${bazi.hour.zhi.name}\n`;
        
        // 五行分布
        const wuxingCounts = Calculator.countWuxing(bazi);
        shareText += `\n【五行分布】`;
        shareText += `金${wuxingCounts.metal || 0} `;
        shareText += `木${wuxingCounts.wood || 0} `;
        shareText += `水${wuxingCounts.water || 0} `;
        shareText += `火${wuxingCounts.fire || 0} `;
        shareText += `土${wuxingCounts.earth || 0}\n`;
    }
    
    // 卦象解读（截取前200字）
    const interpretation = result.hexagram.interpretation || '';
    if (interpretation) {
        shareText += '\n───────────────────────\n';
        shareText += '【卦 象 解 读】\n';
        shareText += interpretation.substring(0, 200) + (interpretation.length > 200 ? '...' : '') + '\n';
    }
    
    // 底部
    shareText += '\n═════════════════════\n';
    shareText += '道法自然 · 天人合一\n';
    shareText += 'Powered by 道家命理推演\n';
    shareText += '═════════════════════';
    
    // 显示分享弹窗
    showShareModal(shareText);
}

/**
 * 显示分享弹窗
 */
function showShareModal(shareText) {
    // 移除旧弹窗
    const oldModal = document.getElementById('shareModal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>📤 分享推演结果</h3>
                <button class="share-close" onclick="closeShareModal()">&times;</button>
            </div>
            <div class="share-preview">
                <pre id="sharePreviewText">${escapeHtml(shareText)}</pre>
            </div>
            <div class="share-actions">
                <button class="share-action-btn copy-btn" onclick="copyShareText()">
                    📋 复制到剪贴板
                </button>
                <button class="share-action-btn wechat-btn" onclick="shareToWechat()">
                    💬 分享到微信
                </button>
                <button class="share-action-btn weibo-btn" onclick="shareToWeibo()">
                    📱 分享到微博
                </button>
            </div>
            <div class="share-tip">点击复制后，可粘贴到微信、QQ等社交平台</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 动画显示
    setTimeout(() => modal.classList.add('show'), 10);
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeShareModal();
        }
    });
}

/**
 * 关闭分享弹窗
 */
function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * 复制分享文本
 */
function copyShareText() {
    const previewText = document.getElementById('sharePreviewText').textContent;
    
    navigator.clipboard.writeText(previewText).then(() => {
        showToast('✅ 推演结果已复制到剪贴板！');
        // 更新按钮状态
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.textContent = '✅ 已复制';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = '📋 复制到剪贴板';
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = previewText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('✅ 推演结果已复制到剪贴板！');
    });
}

/**
 * 分享到微信（提示用户复制）
 */
function shareToWechat() {
    copyShareText();
    showToast('📋 已复制，请打开微信粘贴分享');
}

/**
 * 分享到微博
 */
function shareToWeibo() {
    if (!lastDivinationResult) return;
    
    const result = lastDivinationResult;
    const weiboText = `☯道家命理推演☯\n【${result.hexagram.name}】${result.hexagram.judgment}\n#道家命理# #易经八卦# #八字命理#`;
    
    // 打开微博分享页面
    const weiboUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(weiboText)}`;
    window.open(weiboUrl, '_blank', 'width=600,height=400');
}

/**
 * 显示Toast提示
 */
function showToast(message) {
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 重新推演
 */
function resetDivination() {
    const resultSection = document.getElementById('resultSection');
    if (resultSection) {
        resultSection.style.display = 'none';
        resultSection.classList.add('hidden');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 清空问题输入
    if (currentMethod === 'question') {
        document.getElementById('question').value = '';
    } else if (currentMethod === 'number') {
        document.getElementById('divinationNumber').value = '';
    }
}
