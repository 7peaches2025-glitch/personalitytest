
export interface MaskDef {
    id: string; // e.g., "I", "II"
    name: string; // e.g., "鄙夷 (Contempt/Sneer)"
    archetype: string; // e.g., "鸩羽"
    blend: string; // e.g., "[愤怒] + [厌恶]"
    description: string;
}

export const MASKS: MaskDef[] = [
    { id: "I", name: "鄙夷 (Contempt/Sneer)", archetype: "鸩羽", blend: "[愤怒] + [厌恶]", description: "以冷漠和优越感将他人推开。通过建立心理高墙来防御世界。" },
    { id: "II", name: "愤世嫉俗 (Cynicism)", archetype: "山魈", blend: "[期待] + [厌恶]", description: "预设世界的黑暗和失望。是一种防御性的、带有酸味的失望。" },
    { id: "III", name: "懊悔 (Remorse)", archetype: "伯奇", blend: "[哀伤] + [厌恶] (向己)", description: "对过去行为的自我审判和惩罚。内心向内卷曲，极度自责。" },
    { id: "IV", name: "焦虑 (Anxiety/Tension)", archetype: "耳鼠", blend: "[恐惧] + [期待]", description: "对未来的不确定性预演。体内能量极高，但全部用来内耗和担忧。" },
    { id: "V", name: "义愤 (Righteous Outrage)", archetype: "烛龙", blend: "[愤怒] + [道德感]", description: "对违背道德或规则的现象产生的灼热怒火，相信自己站在正义的一方。" },
    { id: "VI", name: "钦佩 (Admiration)", archetype: "文鳐", blend: "[快乐] + [信任]", description: "对他人卓越品质和成就发自内心的认可和尊重，是积极的社会联结。" },
    { id: "VII", name: "自豪 (Pride)", archetype: "夫诸", blend: "[快乐] + [信心/掌控]", description: "基于个人努力和成就获得的满足感和自我肯定。健康的自信和自我价值感。" },
    { id: "VIII", name: "心流 (Flow)", archetype: "息壤", blend: "[专注] + [快乐] + [惊讶]", description: "完全沉浸于某项挑战与技能匹配的任务中，时间和自我意识消失的极致体验。" },
    { id: "IX", name: "狂热 (Fanaticism)", archetype: "傒囊", blend: "[期待] + [专注]", description: "极度的聚焦和执念。视野被单一目标占据，多巴胺过载，盲目扩张。" },
    { id: "X", name: "怀旧 (Nostalgia)", archetype: "望帝", blend: "[快乐] + [哀伤]", description: "甜美与痛苦交织，渴望重塑过去美好的时光，是一种对时间的深情凝视。" },
    { id: "XI", name: "敬畏 (Awe)", archetype: "重明", blend: "[恐惧] + [惊讶]", description: "面对宏大、超越性的存在时，自我缩小，同时感受到联结和恐惧。" },
    { id: "XII", name: "悲悯 (Compassion)", archetype: "姑获", blend: "[哀伤] + [爱/信任]", description: "感同身受他人的痛苦，并将痛苦转化为温柔的承载和付出。" }
];
