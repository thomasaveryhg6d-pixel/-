// 命理计算核心类
class BaziCalculator {
    constructor() {
        this.tian_gan = TIAN_GAN;
        this.di_zhi = DI_ZHI;
    }

    // 计算年柱
    calculateYearPillar(date) {
        const year = date.getFullYear();
        // 年柱天干：(年份 - 3) % 10
        const gan_index = ((year - 3) % 10 + 10) % 10;
        // 年柱地支：(年份 - 3) % 12
        const zhi_index = ((year - 3) % 12 + 12) % 12;
        
        return {
            gan: this.tian_gan[gan_index],
            zhi: this.di_zhi[zhi_index],
            gan_index,
            zhi_index
        };
    }

    // 计算月柱
    calculateMonthPillar(date, yearGanIndex) {
        const month = date.getMonth() + 1; // 1-12
        
        // 根据年干确定月干起点
        // 年上起月法：甲己之年丙作首，乙庚之年戊为头
        let monthGanStart;
        const yearGanMod = yearGanIndex % 5;
        switch(yearGanMod) {
            case 0: case 5: // 甲己年
                monthGanStart = 2; // 丙寅月开始
                break;
            case 1: case 6: // 乙庚年
                monthGanStart = 4; // 戊寅月开始
                break;
            case 2: case 7: // 丙辛年
                monthGanStart = 6; // 庚寅月开始
                break;
            case 3: case 8: // 丁壬年
                monthGanStart = 8; // 壬寅月开始
                break;
            case 4: case 9: // 戊癸年
                monthGanStart = 0; // 甲寅月开始
                break;
        }
        
        // 月份对应地支（以节气为准，简化处理）
        // 正月寅、二月卯...十二月丑
        const monthZhiIndex = (month + 1) % 12;
        const monthGanIndex = (monthGanStart + month - 1) % 10;
        
        return {
            gan: this.tian_gan[monthGanIndex],
            zhi: this.di_zhi[monthZhiIndex],
            gan_index: monthGanIndex,
            zhi_index: monthZhiIndex
        };
    }

    // 计算日柱（使用简化的公式算法）
    calculateDayPillar(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 使用基姆拉尔森公式的变体计算日柱
        // 简化算法：基于已知基准日推算
        // 基准：1900年1月1日为甲戌日（天干0，地支10）
        const baseDate = new Date(1900, 0, 1);
        const daysDiff = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
        
        const gan_index = ((daysDiff % 10) + 10) % 10;
        const zhi_index = ((daysDiff % 12) + 12) % 12;
        
        return {
            gan: this.tian_gan[gan_index],
            zhi: this.di_zhi[zhi_index],
            gan_index,
            zhi_index
        };
    }

    // 计算时柱
    calculateHourPillar(hour, dayGanIndex) {
        // 确定时辰地支
        let zhi_index;
        if (hour >= 23 || hour < 1) zhi_index = 0; // 子时
        else if (hour < 3) zhi_index = 1;   // 丑时
        else if (hour < 5) zhi_index = 2;   // 寅时
        else if (hour < 7) zhi_index = 3;   // 卯时
        else if (hour < 9) zhi_index = 4;   // 辰时
        else if (hour < 11) zhi_index = 5;  // 巳时
        else if (hour < 13) zhi_index = 6;  // 午时
        else if (hour < 15) zhi_index = 7;  // 未时
        else if (hour < 17) zhi_index = 8;  // 申时
        else if (hour < 19) zhi_index = 9;  // 酉时
        else if (hour < 21) zhi_index = 10; // 戌时
        else zhi_index = 11;                 // 亥时
        
        // 日上起时法：甲己还加甲，乙庚丙作初
        // 丙辛从戊起，丁壬庚子居
        let hourGanStart;
        const dayGanMod = dayGanIndex % 5;
        switch(dayGanMod) {
            case 0: case 5: // 甲己日
                hourGanStart = 0; // 甲子时开始
                break;
            case 1: case 6: // 乙庚日
                hourGanStart = 2; // 丙子时开始
                break;
            case 2: case 7: // 丙辛日
                hourGanStart = 4; // 戊子时开始
                break;
            case 3: case 8: // 丁壬日
                hourGanStart = 6; // 庚子时开始
                break;
            case 4: case 9: // 戊癸日
                hourGanStart = 8; // 壬子时开始
                break;
        }
        
        const gan_index = (hourGanStart + zhi_index) % 10;
        
        return {
            gan: this.tian_gan[gan_index],
            zhi: this.di_zhi[zhi_index],
            gan_index,
            zhi_index
        };
    }

    // 计算完整八字
    calculate(birthday, birthtime, gender) {
        const date = new Date(birthday);
        const hour = parseInt(birthtime);
        
        const yearPillar = this.calculateYearPillar(date);
        const monthPillar = this.calculateMonthPillar(date, yearPillar.gan_index);
        const dayPillar = this.calculateDayPillar(date);
        const hourPillar = this.calculateHourPillar(hour, dayPillar.gan_index);
        
        const result = {
            year: yearPillar,
            month: monthPillar,
            day: dayPillar,
            hour: hourPillar,
            gender
        };
        
        // 计算附加信息
        result.shishen = this.calculateShishen(result);
        result.nayin = this.calculateNayin(result);
        result.bagua = this.calculateBagua(result);
        
        return result;
    }

    // 计算五行数量
    countWuxing(bazi) {
        const counts = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
        
        // 统计天干地支的五行
        const elements = [
            bazi.year.gan.element,
            bazi.year.zhi.element,
            bazi.month.gan.element,
            bazi.month.zhi.element,
            bazi.day.gan.element,
            bazi.day.zhi.element,
            bazi.hour.gan.element,
            bazi.hour.zhi.element
        ];
        
        elements.forEach(el => {
            counts[el]++;
        });
        
        return counts;
    }

    // 分析五行强弱
    // 修复：增加 bazi 参数以获取日主信息
    analyzeWuxing(counts, bazi) {
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const analysis = [];
        
        // 找出最强和最弱的五行
        let maxElement = 'metal';
        let minElement = 'metal';
        let maxCount = 0;
        let minCount = Infinity;
        
        for (const [element, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count;
                maxElement = element;
            }
            if (count < minCount) {
                minCount = count;
                minElement = element;
            }
        }
        
        // 分析五行平衡
        const wuxingNames = {
            metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
        };
        
        if (maxCount >= 3) {
            analysis.push(`您的八字中${wuxingNames[maxElement]}元素较强，可能影响其他五行的平衡。`);
        }
        
        if (minCount === 0) {
            analysis.push(`您的八字中缺少${wuxingNames[minElement]}元素，可能需要通过后天调理来补充。`);
        } else if (minCount === 1) {
            analysis.push(`您的八字中${wuxingNames[minElement]}元素较弱，需注意相关方面的调和。`);
        }
        
        // 五行相生相克分析
        // 修复：安全获取日主，如果bazi不存在则使用默认值
        const dayMaster = (bazi && bazi.day && bazi.day.gan) ? bazi.day.gan.element : maxElement;
        const dayMasterName = wuxingNames[dayMaster];
        analysis.push(`您的日主属${dayMasterName}，代表您的核心特质。`);
        
        // 分析其他五行与日主的关系
        for (const [element, count] of Object.entries(counts)) {
            if (element === dayMaster) continue;
            
            const elementName = wuxingNames[element];
            
            // 相生关系
            if (WU_XING_RELATIONS.generate[dayMaster] === element) {
                analysis.push(`${elementName}生${dayMasterName}，为您的印星，有利于学习、贵人运。`);
            } else if (WU_XING_RELATIONS.generate[element] === dayMaster) {
                analysis.push(`${dayMasterName}生${elementName}，为您的食伤星，有利于才华发挥、创作。`);
            }
            
            // 相克关系
            if (WU_XING_RELATIONS.overcome[dayMaster] === element) {
                analysis.push(`${dayMasterName}克${elementName}，为您的财星，有利于财运、物质。`);
            } else if (WU_XING_RELATIONS.overcome[element] === dayMaster) {
                analysis.push(`${elementName}克${dayMasterName}，为您的官杀星，有利于事业、权力。`);
            }
        }
        
        return analysis;
    }

    // 计算十神
    calculateShishen(bazi) {
        const dayMaster = bazi.day.gan;
        const shishen = [];
        
        const pillars = ['年柱', '月柱', '日柱', '时柱'];
        const elements = ['metal', 'wood', 'water', 'fire', 'earth'];
        const yin_yang = ['yang', 'yin'];
        
        const wuxingNames = {
            metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
        };
        
        // 分析每个天干与日主的关系
        const ganPillars = [
            { name: '年干', gan: bazi.year.gan },
            { name: '月干', gan: bazi.month.gan },
            { name: '日干', gan: bazi.day.gan },
            { name: '时干', gan: bazi.hour.gan }
        ];
        
        ganPillars.forEach(pillar => {
            const gan = pillar.gan;
            
            // 计算十神关系
            let shishenName = '';
            const sameElement = gan.element === dayMaster.element;
            const sameYinyang = gan.yin_yang === dayMaster.yin_yang;
            
            if (sameElement) {
                shishenName = sameYinyang ? '比肩' : '劫财';
            } else if (WU_XING_RELATIONS.generate[dayMaster.element] === gan.element) {
                // 日主生的五行
                shishenName = sameYinyang ? '食神' : '伤官';
            } else if (WU_XING_RELATIONS.generate[gan.element] === dayMaster.element) {
                // 生日主的五行
                shishenName = sameYinyang ? '偏印' : '正印';
            } else if (WU_XING_RELATIONS.overcome[dayMaster.element] === gan.element) {
                // 日主克的五行
                shishenName = sameYinyang ? '偏财' : '正财';
            } else if (WU_XING_RELATIONS.overcome[gan.element] === dayMaster.element) {
                // 克日主的五行
                shishenName = sameYinyang ? '七杀' : '正官';
            }
            
            shishen.push({
                position: pillar.name,
                gan: gan.name,
                shishen: shishenName,
                element: wuxingNames[gan.element]
            });
        });
        
        return shishen;
    }

    // 计算纳音五行
    calculateNayin(bazi) {
        const yearIndex = bazi.year.gan_index * 12 + bazi.year.zhi_index;
        const monthIndex = bazi.month.gan_index * 12 + bazi.month.zhi_index;
        
        return {
            yearNayin: NA_YIN_WU_XING[yearIndex % 30],
            monthNayin: NA_YIN_WU_XING[monthIndex % 30]
        };
    }

    // 推算八卦
    calculateBagua(bazi) {
        // 根据日主五行选择本命卦
        const dayMasterElement = bazi.day.gan.element;
        
        // 找到对应五行的卦
        let mainGua = BA_GUA.find(gua => gua.element === dayMasterElement);
        if (!mainGua) mainGua = BA_GUA[0];
        
        // 根据年支和时支推算变卦
        const yearZhi = bazi.year.zhi.number;
        const hourZhi = bazi.hour.zhi.number;
        
        // 简单算法：取年支和时支的平均值索引
        const guaIndex = Math.floor((yearZhi + hourZhi) / 2) % 8;
        const changedGua = BA_GUA[guaIndex];
        
        return {
            mainGua,
            changedGua,
            yearGua: BA_GUA[yearZhi % 8],
            hourGua: BA_GUA[hourZhi % 8]
        };
    }

    // 生成运势分析
    generateFortune(bazi, wuxingCounts) {
        // 根据五行平衡判断运势等级
        const dayMaster = bazi.day.gan.element;
        const dayMasterCount = wuxingCounts[dayMaster];
        
        // 简单判断：日主五行的数量
        let fortuneLevel = 'medium';
        if (dayMasterCount >= 3) {
            fortuneLevel = 'high';
        } else if (dayMasterCount <= 1) {
            fortuneLevel = 'low';
        }
        
        // 事业运
        const careerIndex = Math.floor(Math.random() * FORTUNE_TEMPLATES.career[fortuneLevel].length);
        const careerFortune = FORTUNE_TEMPLATES.career[fortuneLevel][careerIndex];
        
        // 财运
        const wealthIndex = Math.floor(Math.random() * FORTUNE_TEMPLATES.wealth[fortuneLevel].length);
        const wealthFortune = FORTUNE_TEMPLATES.wealth[fortuneLevel][wealthIndex];
        
        // 感情运
        const loveIndex = Math.floor(Math.random() * FORTUNE_TEMPLATES.love[fortuneLevel].length);
        const loveFortune = FORTUNE_TEMPLATES.love[fortuneLevel][loveIndex];
        
        // 健康运
        const healthIndex = Math.floor(Math.random() * FORTUNE_TEMPLATES.health[fortuneLevel].length);
        const healthFortune = FORTUNE_TEMPLATES.health[fortuneLevel][healthIndex];
        
        // 开运建议
        const luckyIndex = Math.floor(Math.random() * LUCKY_ADVICE[dayMaster].length);
        const luckyAdvice = LUCKY_ADVICE[dayMaster][luckyIndex];
        
        return {
            careerFortune,
            wealthFortune,
            loveFortune,
            healthFortune,
            luckyAdvice
        };
    }

    // 获取五行分析文本
    getWuxingAnalysisText(wuxingCounts) {
        const total = Object.values(wuxingCounts).reduce((a, b) => a + b, 0);
        const wuxingNames = {
            metal: '金', wood: '木', water: '水', fire: '火', earth: '土'
        };
        
        let analysisText = '五行分布：';
        for (const [element, count] of Object.entries(wuxingCounts)) {
            analysisText += `${wuxingNames[element]}${count}个 `;
        }
        
        // 分析五行平衡
        const maxCount = Math.max(...Object.values(wuxingCounts));
        const minCount = Math.min(...Object.values(wuxingCounts));
        
        if (maxCount - minCount >= 3) {
            analysisText += '\n五行分布不够均衡，建议通过后天调理来平衡五行。';
        } else if (maxCount - minCount <= 1) {
            analysisText += '\n五行分布较为均衡，命局较为和谐。';
        } else {
            analysisText += '\n五行分布基本均衡，但仍有调和空间。';
        }
        
        return analysisText;
    }

    // 获取八卦解释
    getBaguaExplanation(bagua) {
        const mainGua = bagua.mainGua;
        const changedGua = bagua.changedGua;
        
        let explanation = `您的本命卦为${mainGua.name}卦（${mainGua.nature}），五行属${WU_XING[mainGua.element].name}。\n`;
        explanation += `卦辞：${mainGua.natureText}\n`;
        explanation += `方位：${mainGua.direction}\n\n`;
        
        explanation += `变卦为${changedGua.name}卦（${changedGua.nature}），五行属${WU_XING[changedGua.element].name}。\n`;
        explanation += `卦辞：${changedGua.natureText}\n`;
        explanation += `方位：${changedGua.direction}\n\n`;
        
        // 根据五行关系分析
        const mainElement = mainGua.element;
        const changedElement = changedGua.element;
        
        if (WU_XING_RELATIONS.generate[mainElement] === changedElement) {
            explanation += '本命卦生变卦，表示您的人生发展趋势是由内向外、由己及人的过程。';
        } else if (WU_XING_RELATIONS.generate[changedElement] === mainElement) {
            explanation += '变卦生本命卦，表示外界环境对您有助益，贵人运较好。';
        } else if (WU_XING_RELATIONS.overcome[mainElement] === changedElement) {
            explanation += '本命卦克变卦，表示您具有开拓能力，但需注意人际关系。';
        } else if (WU_XING_RELATIONS.overcome[changedElement] === mainElement) {
            explanation += '变卦克本命卦，表示外界压力较大，需增强自身实力。';
        } else {
            explanation += '本命卦与变卦五行相同，表示您的人生较为稳定，变化不大。';
        }
        
        return explanation;
    }

    // 根据问题生成卦象
    generateQuestionHexagram(question) {
        // 使用问题文本生成伪随机数
        let hash = 0;
        for (let i = 0; i < question.length; i++) {
            const char = question.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // 根据hash值确定上卦、下卦和动爻
        const absHash = Math.abs(hash);
        const upperGuaIndex = absHash % 8;
        const lowerGuaIndex = (absHash >> 3) % 8;
        const movingYao = (absHash % 6) + 1; // 动爻1-6
        
        const upperGua = BA_GUA[upperGuaIndex];
        const lowerGua = BA_GUA[lowerGuaIndex];
        
        // 组合六爻（从下到上：下卦三爻 + 上卦三爻）
        const lines = [...lowerGua.lines, ...upperGua.lines];
        // 翻转动爻对应的爻
        lines[movingYao - 1] = lines[movingYao - 1] === 1 ? 0 : 1;
        
        // 查找六十四卦
        const guaKey = upperGua.name + lowerGua.name;
        let hexagram = SIXTY_FOUR_GUA[guaKey];
        
        // 如果找不到对应的六十四卦，使用默认值
        if (!hexagram) {
            hexagram = {
                name: upperGua.nature + lowerGua.nature,
                symbol: upperGua.symbol,
                judgment: '元亨利贞',
                image: '天地之道，阴阳相济',
                interpretation: '顺应自然，把握时机，循序渐进',
                fortune: '中',
                wuxing: upperGua.element,
                lines: lines
            };
        }
        
        return {
            ...hexagram,
            lines: lines,
            upperGua: upperGua,
            lowerGua: lowerGua,
            movingYao: movingYao,
            method: 'question'
        };
    }
}

// 创建Calculator对象供外部使用
const Calculator = new BaziCalculator();

// 导出计算器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BaziCalculator, Calculator };
}
