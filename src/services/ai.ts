import { calculateScores } from '../logic/scoring';
import { MASKS } from '../data/masks';
import { REPORT_TEMPLATES } from '../data/reportTemplates';

export interface RadarDataPoint {
    label: string;
    value: number; // 0-5
    avg: number;   // 0-5
}

export interface ReportData {
    type: string;
    archetype: string; // e.g. "鸩羽"
    description: string;
    scores: {
        stress: number;  // Map to Block I
        social: number;  // Map to Block II
        resilience: number; // Map to Block III
    };
    radarData: RadarDataPoint[];
    summaryQuote: string;
    fullReport?: string; // Markdown or HTML content
}


// Helper to generate distinct radar profiles per mask
function generateRadarData(maskId: string): { data: RadarDataPoint[], quote: string } {
    const base = (int: number, sl: number, rec: number, anx: number) => [
        { label: "内部归因", value: int, avg: 3.2 },
        { label: "自我厌恶", value: sl, avg: 2.5 },
        { label: "恢复时长", value: rec, avg: 3.8 },
        { label: "焦虑指数", value: anx, avg: 3.0 }
    ];

    switch (maskId) {
        case "I": // Contempt (Shame hidden)
            return {
                data: base(2.0, 4.5, 3.5, 2.5),
                quote: "你的冷漠是防御羞耻的盔甲。通过向外投射鄙夷，你暂时逃避了内心深处那个害怕被看见的、脆弱的自己。"
            };
        case "II": // Cynicism
            return {
                data: base(2.0, 3.5, 2.5, 3.0),
                quote: "你不是真的憎恨世界，你只是憎恨世界不符合你的理想。你的愤世嫉俗是一种智力上的防御机制。"
            };
        case "III": // Remorse
            return {
                data: base(5.0, 4.8, 1.5, 4.2),
                quote: "你的情感成本高昂。高神经质使你的情绪波动剧烈，而极端的内部归因又使你必须承担全部的恢复成本。"
            };
        case "IV": // Anxiety
            return {
                data: base(2.5, 3.5, 2.0, 5.0),
                quote: "你对未来的恐惧正在透支当下的能量。这种持续的警觉状态，让你不仅难以放松，更在无形中筑起了自我保护的围墙。"
            };
        case "V": // Righteous Indignation
            return {
                data: base(2.0, 1.5, 3.5, 4.5),
                quote: "你的义愤，是你力量最清晰的信号。它赋予你惊人的勇气，但你的挑战在于，如何控制这股火焰，让它不焚烧自身。"
            };
        case "VI": // Admiration
            return {
                data: base(3.5, 2.0, 4.0, 2.0),
                quote: "你的钦佩，是世界上最纯净的驱动力之一。这枚面具为你带来了温暖的人际关系，但你的挑战是，如何将这股信任感反射回自己身上。"
            };
        case "VII": // Pride
            return {
                data: base(4.5, 1.5, 4.5, 3.5),
                quote: "你将自我价值与成就深度绑定。这种强大的驱动力虽然让你不断攀登高峰，但也让你在面对失败时感到格外脆弱。"
            };
        case "VIII": // Flow
            return {
                data: base(3.5, 1.5, 4.0, 2.0),
                quote: "你的心流，是你的思维与环境的完美共振。然而，你的情感成本在于对环境的极度依赖：心流一旦被破坏，你可能会产生巨大的烦躁。"
            };
        case "IX": // Fervor
            return {
                data: base(4.0, 2.0, 3.0, 3.5),
                quote: "你的狂热，是你信念最纯粹的表达。你的生命，就是一场为实现目标而进行的宏大献祭，但请小心不要燃烧了所有无辜的船员。"
            };
        case "X": // Nostalgia
            return {
                data: base(3.5, 3.0, 2.0, 3.0),
                quote: "你的怀旧，是一种甜美而危险的锚定。你总是在绿色的灯光下等待过去重现，这阻碍了你全身心地投入到充满不确定性的当下。"
            };
        case "XI": // Awe
            return {
                data: base(2.5, 1.0, 4.5, 2.5),
                quote: "你的敬畏，是认知的扩展。它打破了以自我为中心的局限，让你看到自己与宇宙的宏大关联。你的挑战是如何将宏大落地为微小的行动。"
            };
        case "XII": // Compassion
            return {
                data: base(3.0, 2.0, 3.0, 3.5),
                quote: "你的悲悯，是超越立场的理解。它赋予你无与伦比的道德勇气，但你的挑战是，在伸出援手时，如何保护好自己的光源。"
            };
        default:
            return {
                data: base(3.5, 2.5, 3.8, 3.0),
                quote: "你的情绪模式显示出独特的张力。在自我归因与外界环境之间，你正在寻找一种动态的平衡。"
            };
    }
}

export async function generateReport(answers: Record<number, number>): Promise<ReportData> {
    // 1. Calculate Scores
    const { dominant, allScores } = calculateScores(answers);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 2. Generate Prompt / Content
    // In a real app, we would send 'dominant.mask.name' and 'scores' to an LLM.
    // For now, we return the hardcoded template if available, or a generic one.

    const template = REPORT_TEMPLATES[dominant.mask.id];
    const { data: radarData, quote: summaryQuote } = generateRadarData(dominant.mask.id);

    const description = template
        ? "报告生成成功。请阅读下方的详细解读。"
        : `你的主导面具是 ${dominant.mask.name} (${dominant.mask.archetype})。`;

    return {
        type: `${dominant.mask.name} (${dominant.mask.archetype})`,
        archetype: dominant.mask.archetype,
        description,
        scores: {
            stress: Math.round(allScores[0].score * 20), // Scale 5.0 to 100
            social: Math.round(allScores[1].score * 20),
            resilience: Math.round(allScores[2].score * 20)
        },
        radarData,
        summaryQuote,
        fullReport: template || `此处将显示 ${dominant.mask.name} 的完整深度解析报告...`
    };
}

// Debug Helper to view a specific report directly
export async function getDebugReport(maskId: string): Promise<ReportData> {
    const mask = MASKS.find(m => m.id === maskId);
    if (!mask) throw new Error("Mask not found");

    const template = REPORT_TEMPLATES[maskId];
    const { data: radarData, quote: summaryQuote } = generateRadarData(maskId);

    // Simulate delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        type: `${mask.name}`,
        archetype: mask.archetype,
        description: "【开发者预览模式】不做评分计算，直接展示对应的详情报告。",
        scores: {
            stress: 85,
            social: 60,
            resilience: 92
        },
        radarData,
        summaryQuote,
        fullReport: template || `(此面具暂无完整报告: ${mask.name})`
    };
}
