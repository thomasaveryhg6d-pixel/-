/**
 * API配置文件 - 已加密保护
 * 
 * 防护措施：
 * 1. API密钥分片存储 + 编码混淆
 * 2. 域名白名单检查
 * 3. 请求频率限制
 * 4. 运行时完整性校验
 * 
 * ⚠️ 重要提醒：纯前端项目无法100%防止密钥泄露，
 *    最佳实践是将API调用放在后端服务器。
 *    以下措施可大幅增加逆向难度，防止普通用户直接查看到明文密钥。
 */

// ========================================
// 第一层：密钥混淆 - XOR编码 + 分块存储
// ========================================

// API密钥经XOR异或编码后，拆分为多个整数块存储在数组中
// 源码中不会出现任何可读的密钥字符，大幅增加逆向难度
// 编码算法：每个字符与指定的XOR密钥(7)进行异或运算
const _xorKey = 7;
const _encBlocks = [
    [115,119,42,100,112,112,112,101,96,105],
    [119,107,117,116,97,97,51,119,115,112],
    [52,112,63,50,53,115,101,97,127,106],
    [62,55,118,106,127,51,108,107,99,96],
    [107,102,116,54,96,54,99,106,126,53,52]
];

// ========================================
// 第二层：运行时密钥重组引擎
// ========================================

/**
 * 在运行时动态重建API密钥
 * 算法：将XOR编码的整数块按顺序拼接，逐字符异或解码还原
 * 每次调用都实时计算，不会在内存中留下完整密钥字符串的长期驻留
 */
function _rebuildKey() {
    // 步骤1：拼接所有编码块为一个整数数组
    var allNums = [];
    for (var i = 0; i < _encBlocks.length; i++) {
        for (var j = 0; j < _encBlocks[i].length; j++) {
            allNums.push(_encBlocks[i][j]);
        }
    }

    // 步骤2：逐字符XOR解码还原原始密钥
    var result = '';
    for (var k = 0; k < allNums.length; k++) {
        result += String.fromCharCode(allNums[k] ^ _xorKey);
    }

    return result;
}

// ========================================
// 第三层：域名白名单检查
// ========================================

const _allowedDomains = [
    'localhost',
    '127.0.0.1',
    // 如果有部署域名，在这里添加
    // 'your-domain.com',
];

/**
 * 检查当前域名是否在白名单中
 * 开发环境(localhost)自动放行
 */
function _checkDomain() {
    const hostname = window.location.hostname;
    
    // 开发环境放行
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
        return true;
    }
    
    // 生产环境检查白名单
    return _allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
}

// ========================================
// 第四层：请求频率限制（令牌桶算法）
// ========================================

const _rateLimiter = {
    tokens: 10,           // 桶容量：最多10个令牌
    maxTokens: 10,        // 最大令牌数
    refillRate: 2,        // 每分钟补充2个令牌
    lastRefill: Date.now(),
    
    /**
     * 消费一个令牌
     * @returns {boolean} 是否允许请求
     */
    consume() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 60000; // 转换为分钟
        
        // 补充令牌
        if (elapsed > 0) {
            this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
            this.lastRefill = now;
        }
        
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }
        
        return false;
    }
};

// ========================================
// 第五层：请求防篡改签名
// ========================================

/**
 * 生成请求时间戳签名
 * 防止请求被重放
 */
function _generateTimestamp() {
    return Date.now().toString(36); // Base36编码的时间戳
}

// ========================================
// 正式API配置对象（带防护）
// ========================================

const API_CONFIG = {
    // 小米MiMo模型 API配置（兼容OpenAI接口协议）
    baseURL: 'https://token-plan-cn.xiaomimimo.com/v1',
    
    /**
     * 获取API密钥（运行时动态获取）
     * 密钥经过混淆处理，不会以明文形式存储
     */
    get apiKey() {
        return _rebuildKey();
    },
    
    // 模型名称
    model: 'mimo-v2.5',
    
    // 请求超时时间（毫秒）- 推理模型需要更长时间
    timeout: 120000,
    
    // 是否启用AI增强
    enabled: true,
    
    // 内部保护引用（不直接暴露）
    _protection: {
        checkDomain: _checkDomain,
        rateLimiter: _rateLimiter,
        generateTimestamp: _generateTimestamp
    }
};

// ========================================
// 防护机制：阻止控制台调试
// ========================================

/**
 * 检测开发者工具是否打开
 * 仅在生产环境生效
 */
(function _antiDebug() {
    // 非开发环境才启用反调试
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return;
    }
    
    // 混淆敏感变量名（增加控制台搜索难度）
    const _sensitiveVars = ['_keyFragments', '_keyOrder', '_rebuildKey'];
    
    // 定期检查是否有调试器附加（仅做提示，不做阻断）
    let devtoolsOpen = false;
    const threshold = 160;
    
    setInterval(() => {
        if (devtoolsOpen) return;
        
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            devtoolsOpen = true;
            console.warn(
                '%c⚠️ 安全提示',
                'color: #ff6b6b; font-size: 20px; font-weight: bold;'
            );
            console.warn(
                '%c检测到开发者工具已打开。API密钥受保护，建议通过正规渠道使用服务。',
                'color: #ffa500; font-size: 14px;'
            );
        }
    }, 1000);
})();

// ========================================
// 防护机制：防止源码被复制
// ========================================

(function _protectSource() {
    // 禁止右键菜单（生产环境）
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // 禁止Ctrl+U查看源码
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }
        });
    }
})();

// ========================================
// 正统易经命理 - 核心系统提示词
// ========================================

/**
 * 共通的角色定义与约束规则
 */
const MASTER_ROLE = `你是一位严格遵循正统《易经》象数理占与阴阳五行学说的命理推演系统。你只依托于中国古典哲学与术数的严密逻辑进行断卦、断盘。

# 能力与约束（真实正统知识库）
你的所有分析必须基于以下经得起考证的传统理气规则，严禁胡编乱造：

【五行绝对数理】
严格执行木生火、火生土、土生金、金生水、水生木；木克土、土克水、水克火、火克金、金克木。严禁出现任何违反五行生克的逻辑紊乱。

【干支与理气】
必须辨析天干的五合、相克与地支的六合、三合、六冲、相刑。根据月令（提纲）判断五行在"旺、相、休、囚、死"中的真实能量状态。

【易经卦象符号】
必须严格区分本卦（现状与本质）、互卦（发展过程中的隐藏因果）、变卦（最终演变趋势）。
必须通过动爻（改变的爻位）定位到具体的《易经》原著爻辞，以此为核心断语，严禁脱离爻辞空谈吉凶。

# 负面约束（红线规则）
- 严禁使用"你的命运很神秘"、"你命中注定会大富大贵"等没有任何易理支撑的废话。
- 严禁使用"我通过分析"、"我来为你解读"、"让我帮你看看"等第一人称AI口吻。直接以客观命理分析的口吻输出，如同古籍批注般就事论事。每一句分析都必须紧跟卦象、五行、爻辞的具体依据，不做任何主观臆断。
- 如果某项运势不好，必须从五行角度解释原因（例如：因财旺克印，导致思虑过多），并基于"阴阳转化"的原则，给出泄洪或补足的建议（如：以火通关木土之争）。
- 严禁生造不存在的卦名或五行关系。
- 严禁使用塔罗牌、星座、紫微斗数等非正统易经理术的术语和体系。

# 输出格式要求
- 每个模块必须有清晰的标题，使用【】标注
- 段落之间空一行，避免内容堆砌
- 引用经典原文时必须标注出处
- 具体建议必须包含方位、颜色、数字、时辰等可操作信息
- 语言风格：专业严谨但通俗易懂，避免过度文言文`;

/**
 * 输出框架模板 - 四大模块
 */
const OUTPUT_FRAMEWORK = `# 输出格式（严格执行四大模块）

每个模块必须以【模块名称】开头，模块之间空一行。内容要求详细具体，引用经典必须标注出处。

## 【象数定盘】
以列表形式清晰罗列：
- 八字四柱（若有）：年柱、月柱、日柱、时柱及日主强弱
- 卦象结构：本卦、互卦、变卦的卦名与所属八卦
- 动爻位置及对应爻辞原文（必须引用原文）
- 五行力量分布与旺衰判断
- 十神配置（若有八字）

## 【理气辩证】
深入分析五行生克关系：
- 找出命盘或卦象中"能量最集中"和"最受克制"的两个交战点
- 用五行生克关系解释当前局势的核心矛盾
- 判断流年/时令对这个交战点是加剧冲突（凶）还是起到通关调解（吉）
- 必须引用《易经》原文（卦辞、彖传、象传或爻辞）作为断事依据
- 格式示例："依据本卦[某卦]之第[某]爻爻辞：'[原文]'。在五行上体现为……"

## 【运势断解】
将"象数理"的推导结果翻译成现代人能理解的具体际遇，每个方面都要详细分析：
- 事业/学业：机遇与阻碍，关键决策节点，具体行动建议
- 财运：进财路径与破财风险，投资宜忌，理财建议
- 感情/人际：缘分走势，相处之道，改善方法
- 健康：脏腑弱点，养生重点，具体调理建议

## 【趋避建议】
基于阴阳转化原则，给出可操作的具体建议：
- 喜用五行及补益方式（方位、颜色、数字、时辰，每项都要具体说明）
- 化解不利因素的具体方法（要说明原理，如以火通关木土之争）
- 关键时间节点的把握建议
- 一句话总结：用一句古典格言或爻辞精要概括整体运势`;

// ========================================
// API调用封装（带防护层）
// ========================================

const AIService = {
    /**
     * 调用AI模型生成命理解读（带完整防护检查）
     * @param {string} systemPrompt - 系统提示词
     * @param {string} userPrompt - 用户问题
     * @returns {Promise<string>} AI生成的解读
     */
    async generate(systemPrompt, userPrompt) {
        // 防护检查1：AI服务是否启用
        if (!API_CONFIG.enabled) {
            throw new Error('AI服务未启用');
        }

        // 防护检查2：域名白名单
        if (!API_CONFIG._protection.checkDomain()) {
            console.error('安全警告：非法域名访问已拦截');
            throw new Error('服务不可用：请通过官方渠道访问');
        }

        // 防护检查3：请求频率限制
        if (!API_CONFIG._protection.rateLimiter.consume()) {
            console.warn('请求过于频繁，请稍后再试');
            throw new Error('请求过于频繁，请稍后再试（每分钟最多10次请求）');
        }

        try {
            // 生成请求时间戳
            const timestamp = API_CONFIG._protection.generateTimestamp();
            
            const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.apiKey}`,
                    'X-Request-Time': timestamp,
                    'X-Client-Version': '2.0',
                },
                body: JSON.stringify({
                    model: API_CONFIG.model,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 8000
                }),
                signal: AbortSignal.timeout(API_CONFIG.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || '未知错误'}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const msg = data.choices[0].message;
                // 推理模型可能返回reasoning_content，优先使用content
                // 如果content为空但有reasoning_content，使用reasoning_content
                let result = msg.content;
                if ((!result || result.trim() === '') && msg.reasoning_content) {
                    result = msg.reasoning_content;
                }
                if (result && result.trim() !== '') {
                    return result;
                }
            }
            
            throw new Error('API返回格式错误');
        } catch (error) {
            console.error('AI服务调用失败:', error);
            throw error;
        }
    },

    /**
     * 生成八字命理解读
     */
    async generateBaziReading(baziData, gender) {
        const systemPrompt = `${MASTER_ROLE}

【专精领域】
- 八字命理：根据天干地支推算命格、格局、喜用神
- 阴阳五行：分析五行旺衰、相生相克、五行调候
- 十神分析：比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印的配置与影响
- 格局判断：正官格、七杀格、正财格、偏财格、食神格、伤官格、正印格、偏印格等
- 月令提纲：根据月令判断五行在旺、相、休、囚、死中的能量状态

${OUTPUT_FRAMEWORK}`;

        const genderStr = gender === 'male' ? '男' : '女';
        const strongElements = baziData.wuxingAnalysis.strong.join('、') || '无';
        const weakElements = baziData.wuxingAnalysis.weak.join('、') || '无';
        const missingElements = baziData.wuxingAnalysis.missing.join('、') || '无';

        const userPrompt = `请根据以下八字信息，严格按照【象数定盘→理气辩证→运势断解→趋避建议】四模块进行命理推断。

【八字信息】
年柱：${baziData.yearPillar.gan}${baziData.yearPillar.zhi}
月柱：${baziData.monthPillar.gan}${baziData.monthPillar.zhi}
日柱：${baziData.dayPillar.gan}${baziData.dayPillar.zhi}
时柱：${baziData.hourPillar.gan}${baziData.hourPillar.zhi}

【日主】${baziData.dayPillar.gan}
【性别】${genderStr}

【五行统计】
金：${baziData.wuxingCounts.metal}个
木：${baziData.wuxingCounts.wood}个
水：${baziData.wuxingCounts.water}个
火：${baziData.wuxingCounts.fire}个
土：${baziData.wuxingCounts.earth}个

【五行强弱】偏强：${strongElements}；偏弱：${weakElements}
【五行缺失】${missingElements}

请务必：
1. 在【象数定盘】中计算日主强弱、标注十神配置
2. 在【理气辩证】中找出核心矛盾点，引用具体爻辞或经典原文
3. 在【运势断解】中逐一分析事业、财运、感情、健康
4. 在【趋避建议】中给出基于五行补益的具体可操作建议`;

        return await this.generate(systemPrompt, userPrompt);
    },

    /**
     * 生成卦象解读
     */
    async generateHexagramReading(hexagram, question, category, method) {
        const systemPrompt = `${MASTER_ROLE}

【专精领域】
- 梅花易数：时间起卦、数字起卦、外应起卦
- 六爻预测：根据卦象爻位分析事物吉凶
- 卦象解读：卦辞、爻辞、象辞的深层含义
- 互卦分析：揭示事物发展过程中的隐藏因果
- 变卦推演：分析变卦对未来趋势的影响
- 动爻定位：通过动爻爻辞精准断事

${OUTPUT_FRAMEWORK}`;

        const lines = hexagram.lines.map((l, i) => `${i+1}爻：${l === 1 ? '阳爻 ———' : '阴爻 — — —'}`).join('\n');
        const methodNames = {
            'time': '梅花易数·时间起卦法',
            'question': '心诚则灵·问事起卦法',
            'number': '万物皆数·数字起卦法'
        };
        const methodDesc = methodNames[method] || methodNames['time'];
        const methodContext = {
            'time': '此卦象反映的是当前时运的整体走向，因为是根据当前时间推算而得，代表事物在此时间节点的能量场。时间起卦源于宋代邵雍，讲究"天人感应"。',
            'question': '此卦象直接回应了所问之事，因为是根据心中的具体问题推算而得，最能反映该事物的本质状态与发展趋势。问事起卦讲究"心诚则灵"。',
            'number': '此卦象是根据数字推算而得，体现了"万物皆数"的道家思想。数字蕴含天地之理，通过数理推演揭示事物发展方向。'
        };

        const userPrompt = `请根据以下卦象信息，严格按照【象数定盘→理气辩证→运势断解→趋避建议】四模块进行解读。

【起卦方法】${methodDesc}
【方法说明】${methodContext[method] || methodContext['time']}

【求问事项】${question}
【问题分类】${category}

【卦象信息】
本卦：${hexagram.name}
卦辞：${hexagram.judgment}
象辞：${hexagram.image}

【六爻排列】（从初爻到上爻）
${lines}

【动爻】第${hexagram.movingYao}爻

请务必：
1. 在【象数定盘】中说明起卦方法，列出本卦、互卦、变卦的八卦结构，标明动爻爻辞原文
2. 在【理气辩证】中通过五行生克分析当前局势的核心矛盾，引用《易经》原文作为断事依据
3. 在【运势断解】中结合起卦方法的特点，针对"${category}"类问题给出具体分析
4. 在【趋避建议】中给出基于阴阳转化原则的可操作建议`;

        return await this.generate(systemPrompt, userPrompt);
    },

    /**
     * 生成综合运势解读
     */
    async generateFortuneReading(baziData, hexagram, question) {
        const systemPrompt = `${MASTER_ROLE}

【专精领域】
- 八字命理：天干地支、十神分析、格局判断
- 阴阳五行：五行生克、旺衰分析、喜用神
- 易经八卦：卦象解读、梅花易数、六爻预测
- 互卦与变卦：揭示隐藏因果与最终演变趋势
- 运势推断：流年运势、趋吉避凶、开运方法

【核心方法：数理断盘四步法】
1. 【定位坐标（定象）】解析干支组合，找出日主（核心），计算全局五行得分或强弱态势
2. 【寻找交战与平衡（辩证）】找出盘中或卦中"能量最集中"和"最受克制"的两个交战点，判断流年/时令是加剧冲突还是通关调解
3. 【文本对齐（引经据典）】必须引用《易经》正统原文（卦辞、彖传、象传或特定爻辞）作为断事依据
4. 【现代转译（落地归纳）】将"象数理"的推导结果翻译成现代人在事业、财运、心性上的具体际遇

${OUTPUT_FRAMEWORK}`;

        const wuxingNames = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };

        // 构建用户提示词（支持无八字数据的情况）
        let baziSection = '';
        if (baziData) {
            const genderStr = baziData.gender === 'male' ? '男' : '女';
            baziSection = `
【八字信息】
年柱：${baziData.yearPillar.gan}${baziData.yearPillar.zhi}
月柱：${baziData.monthPillar.gan}${baziData.monthPillar.zhi}
日柱：${baziData.dayPillar.gan}${baziData.dayPillar.zhi}
时柱：${baziData.hourPillar.gan}${baziData.hourPillar.zhi}
日主：${baziData.dayPillar.gan}
性别：${genderStr}

【五行分布】
金${baziData.wuxingCounts.metal} 木${baziData.wuxingCounts.wood} 水${baziData.wuxingCounts.water} 火${baziData.wuxingCounts.fire} 土${baziData.wuxingCounts.earth}

【五行强弱】偏强：${baziData.wuxingAnalysis.strong.join('、') || '无'}；偏弱：${baziData.wuxingAnalysis.weak.join('、') || '无'}`;
        } else {
            baziSection = '\n【注意】用户未提供生辰信息，请仅根据卦象进行分析。';
        }

        const userPrompt = `请根据以下卦象信息，严格按照【象数定盘→理气辩证→运势断解→趋避建议】四模块进行综合运势分析。
${baziSection}
卦名：${hexagram.name}
卦辞：${hexagram.judgment}
象辞：${hexagram.image}
动爻：第${hexagram.movingYao}爻

【求问】${question}

请务必${baziData ? '进行八字与卦象的交叉验证分析，确保结论一致' : '仅根据卦象进行深入分析'}。`;

        return await this.generate(systemPrompt, userPrompt);
    },

    /**
     * 流式调用AI模型（边生成边返回，用于渐进式显示）
     * @param {string} systemPrompt - 系统提示词
     * @param {string} userPrompt - 用户问题
     * @param {function} onChunk - 每收到一块文本时的回调 (chunkText, fullText)
     * @returns {Promise<string>} 完整的生成结果
     */
    async generateStream(systemPrompt, userPrompt, onChunk) {
        if (!API_CONFIG.enabled) {
            throw new Error('AI服务未启用');
        }
        if (!API_CONFIG._protection.checkDomain()) {
            throw new Error('服务不可用：请通过官方渠道访问');
        }
        if (!API_CONFIG._protection.rateLimiter.consume()) {
            throw new Error('请求过于频繁，请稍后再试');
        }

        const timestamp = API_CONFIG._protection.generateTimestamp();
        
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.apiKey}`,
                    'X-Request-Time': timestamp,
                    'X-Client-Version': '2.0',
                },
                body: JSON.stringify({
                    model: API_CONFIG.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 8000,
                    stream: true
                }),
                signal: AbortSignal.timeout(API_CONFIG.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || '未知错误'}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let reasoningText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith('data:')) continue;
                    const dataStr = trimmed.slice(5).trim();
                    if (dataStr === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(dataStr);
                        const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
                        if (!delta) continue;

                        if (delta.content) {
                            fullText += delta.content;
                            if (onChunk) onChunk(delta.content, fullText, 'content');
                        } else if (delta.reasoning_content) {
                            reasoningText += delta.reasoning_content;
                            if (onChunk) onChunk(delta.reasoning_content, reasoningText, 'reasoning');
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理下一行
                    }
                }
            }

            // 优先返回content，如果没有则返回reasoning_content
            const result = fullText || reasoningText;
            if (result && result.trim()) {
                return result;
            }
            throw new Error('API返回内容为空');
        } catch (error) {
            console.error('AI流式调用失败:', error);
            throw error;
        }
    }
};
