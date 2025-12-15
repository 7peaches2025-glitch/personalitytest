import { MASKS } from '../data/masks';
import type { MaskDef } from '../data/masks';

// 20 Questions x 12 Masks Matrix
// Structure: Record<QuestionID, Record<MaskID, { weight: number, reverse?: boolean }>>
export const WEIGHT_MATRIX: Record<number, Record<string, { weight: number, reverse?: boolean }>> = {
    // Q1: 我经常感受到压力，需要很长时间才能平静下来。 (焦虑 5, 义愤 3)
    1: { "IV": { weight: 5 }, "V": { weight: 3 } },

    // Q2: 我通常是一个充满活力，愿意主动社交的人。 (自豪 5, 狂热 4)
    2: { "VII": { weight: 5 }, "IX": { weight: 4 } },

    // Q3: 即使遇到小麻烦，我也很容易烦躁或感到受伤。 (焦虑 4, 懊悔 3)
    3: { "IV": { weight: 4 }, "III": { weight: 3 } },

    // Q4: 我能比大多数人更强烈地体验到快乐和兴奋。 (自豪 4, 狂热 5)
    4: { "VII": { weight: 4 }, "IX": { weight: 5 } },

    // Q5: 我发现我的情绪经常在一天内发生剧烈的起伏。 (焦虑 5, 义愤 5)
    5: { "IV": { weight: 5 }, "V": { weight: 5 } },

    // Q6: 当看到别人的成功时，我更容易去分析他们的缺陷或运气。 (鄙夷 5, 愤世嫉俗 4)
    6: { "I": { weight: 5 }, "II": { weight: 4 } },

    // Q7: 我深信人性本恶，人们在多数情况下只会为自己考虑。 (愤世嫉俗 5, 鄙夷 3)
    7: { "II": { weight: 5 }, "I": { weight: 3 } },

    // Q8: 如果我搞砸了一件事情，我倾向于认为这是我性格中不可改变的缺陷造成的。 (懊悔 5, 悲悯 2(R))
    8: { "III": { weight: 5 }, "XII": { weight: 2, reverse: true } },

    // Q9: 当朋友遇到困难时，我能清晰地感受到他们的痛苦，并愿意付出时间去帮助他们。 (悲悯 5, 愤世嫉俗 4(R))
    9: { "XII": { weight: 5 }, "II": { weight: 4, reverse: true } },

    // Q10: 我认为世界上大多数问题都源于他人道德的缺失。 (义愤 5, 鄙夷 4)
    10: { "V": { weight: 5 }, "I": { weight: 4 } },

    // Q11: 我经常被科学、艺术或自然界中的宏大现象深深震撼。 (敬畏 5, 心流 3)
    11: { "XI": { weight: 5 }, "VIII": { weight: 3 } },

    // Q12: 当我专注于一项具有挑战性的任务时，我常常忘记时间的流逝。 (心流 5, 敬畏 3)
    12: { "VIII": { weight: 5 }, "XI": { weight: 3 } },

    // Q13: 我有时会沉溺于对过去美好时光的回忆和想象中。 (怀旧 5, 心流 2(R))
    13: { "X": { weight: 5 }, "VIII": { weight: 2, reverse: true } },

    // Q14: 我愿意为了达成一个长期的、宏伟的目标而牺牲短期的舒适。 (狂热 5, 敬畏 3)
    14: { "IX": { weight: 5 }, "XI": { weight: 3 } },

    // Q15: 我喜欢思考人生的意义和抽象的哲学问题。 (敬畏 4, 怀旧 3)
    15: { "XI": { weight: 4 }, "X": { weight: 3 } },

    // Q16: 当我感到焦虑时，我倾向于立即制定详细的计划来对抗这种感觉。 (焦虑 5, 心流 3)
    16: { "IV": { weight: 5 }, "VIII": { weight: 3 } },

    // Q17: 我很难对那些我感到失望的人保持礼貌或尊敬。 (鄙夷 5, 义愤 4)
    17: { "I": { weight: 5 }, "V": { weight: 4 } },

    // Q18: 当我的努力得到肯定时，我内心会涌起强烈的、光荣的成就感。 (自豪 5, 狂热 3)
    18: { "VII": { weight: 5 }, "IX": { weight: 3 } },

    // Q19: 我常常发现自己对某件事情怀有近乎偏执的信念和热情。 (狂热 5, 自豪 3)
    19: { "IX": { weight: 5 }, "VII": { weight: 3 } },

    // Q20: 我发现我能有效地接纳并处理别人的负面情绪，而不会被其拖垮。 (悲悯 5, 鄙夷 3(R))
    20: { "XII": { weight: 5 }, "I": { weight: 3, reverse: true } }
};

export interface ScoreResult {
    mask: MaskDef;
    score: number; // 1.0 - 5.0
}

export interface ReportContext {
    dominant: ScoreResult;
    latent?: ScoreResult;
    allScores: ScoreResult[];
    isSignificant: boolean; // Rule 1: S_Mask-1 >= 3.5
    hasLatentConflict: boolean; // Rule 2: Diff < 0.2
}

export function calculateScores(answers: Record<number, number>): ReportContext {
    // 1. Calculate Raw Weighted Scores for each Mask
    const rawScores: Record<string, { total: number; count: number }> = {};

    MASKS.forEach(m => {
        rawScores[m.id] = { total: 0, count: 0 };
    });

    Object.entries(answers).forEach(([qIdStr, rawAnswer]) => {
        const qId = parseInt(qIdStr);
        const weights = WEIGHT_MATRIX[qId] || {};

        Object.entries(weights).forEach(([maskId, { weight, reverse }]) => {
            // Apply Reverse Scoring: 6 - Q
            const finalAnswer = reverse ? (6 - rawAnswer) : rawAnswer;

            if (!rawScores[maskId]) rawScores[maskId] = { total: 0, count: 0 };

            rawScores[maskId].total += finalAnswer * weight;
            rawScores[maskId].count += weight;
        });
    });

    // 2. Normalize to 1.0 - 5.0 scale
    const results: ScoreResult[] = MASKS.map(m => {
        const { total, count } = rawScores[m.id];
        const finalScore = count === 0 ? 0 : total / count;
        return {
            mask: m,
            score: parseFloat(finalScore.toFixed(2))
        };
    });

    // 3. Rank
    results.sort((a, b) => b.score - a.score);

    // 4. Apply Rules
    const dominant = results[0];
    const latent = results[1];

    // Rule 1: Absolute Threshold (>= 3.5)
    const isSignificant = dominant.score >= 3.5;

    // Rule 2: Difference Threshold (< 0.2)
    // "If Diff < 0.2, the 2nd mask is Latent and significant"
    // User said: "Determine 2nd highest as Latent Mask... show in report"
    // But also said: "Scene Zero... S_Mask-2 = Latent"
    // And Rule 2B: "S1 - S2 < 0.2 -> Highly Close"

    const diff = dominant.score - latent.score;
    const hasLatentConflict = diff < 0.2;

    return {
        dominant,
        latent: latent, // Always return it, UI decides how to show it based on flags
        allScores: results,
        isSignificant,
        hasLatentConflict
    };
}
