import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateReport, getDebugReport } from '../services/ai';
import type { ReportData } from '../services/ai';
import { Loader2, Home, ChevronDown, Quote, Sparkles } from 'lucide-react';
import { GlassLiquid } from '../components/GlassLiquid';
import { EmotionalRadar } from '../components/EmotionalRadar';
import { motion } from 'framer-motion';

// --- Types for Structured Content ---
interface ParsedSections {
    flavor: string[];
    philosophy: string;
    deepDive: {
        title: string;
        intro: string[]; // Paragraphs before the scene
        sceneTitle: string;
        sceneContent: string;
        outro: string[]; // Paragraphs after the scene (if any, before Part 2)
    };
    part2: string; // Data Data Analysis
    part3: string; // Decision (Fallback)
    part3Items?: { title: string; content: string[] }[]; // Decision (Structured)
    part4: string; // Growth (Fallback)
    part4Items?: { title: string; content: string[] }[]; // Growth (Structured)
}

const Report: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [report, setReport] = useState<ReportData | null>(null);
    const [parsed, setParsed] = useState<ParsedSections | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                let data: ReportData;
                if (state?.debugMaskId) {
                    data = await getDebugReport(state.debugMaskId);
                } else if (state?.answers) {
                    data = await generateReport(state.answers);
                } else {
                    navigate('/');
                    return;
                }
                setReport(data);
                try {
                    const parsedData = parseReportContent(data.fullReport || "");
                    setParsed(parsedData);
                } catch (parseError) {
                    console.error("Parsing failed:", parseError);
                    setError("解析报告内容失败，请检查数据格式。");
                }

            } catch (e) {
                console.error(e);
                setError("获取报告数据失败，请重试。");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [state, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)]">
                <Loader2 className="w-12 h-12 text-[var(--color-secondary)] animate-spin mb-4" />
                <h2 className="text-xl font-serif text-[var(--color-primary)]">AI 正在深度解析...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2] p-8 text-center">
                <h2 className="text-2xl font-serif text-red-500 mb-4">报告生成出错</h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full">
                    返回首页
                </button>
            </div>
        );
    }

    if (!report || !parsed) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2] p-8 text-center">
                <h2 className="text-2xl font-serif text-gray-500 mb-4">数据为空</h2>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full">
                    返回首页
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] text-[var(--color-text)] font-sans selection:bg-[var(--color-accent)] selection:text-white">

            {/* --- PAGE 1: HERO (Cover) --- */}
            <section className="min-h-screen relative flex flex-col items-center pt-24 pb-12 px-6 text-center">
                {/* Header Actions */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <Home className="w-6 h-6 text-[var(--color-secondary)]" />
                    </button>
                    <div className="text-xs font-bold tracking-[0.2em] text-[var(--color-secondary)] uppercase">
                        Personality ID
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-2 z-10"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)]">
                        你的主导情绪面具
                    </h1>
                    <div className="text-5xl md:text-6xl font-serif text-[var(--color-accent)] font-bold mt-2">
                        - {report.archetype}
                    </div>
                    <p className="text-sm text-gray-400 tracking-widest uppercase mt-4">
                        Thinking / Emotion / Ego
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <GlassLiquid />
                </motion.div>

                {/* Status Text & Flavor Chips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="space-y-8 max-w-md mx-auto z-10"
                >
                    <div className="space-y-4">
                        <h3 className="font-bold text-[var(--color-primary)] border-b-2 border-[var(--color-accent)]/20 pb-2 inline-block px-4">
                            核心底色
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {parsed.flavor.map((tag, i) => (
                                <span key={i} className="px-4 py-2 bg-[#EFEBE0] text-[var(--color-primary)] text-sm rounded-full shadow-sm font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-secondary)]/10 mt-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)]" />
                        <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Quote className="w-3 h-3" /> Mask Philosophy
                        </div>
                        <p className="text-lg font-serif text-[var(--color-primary)] italic">
                            “{parsed.philosophy}”
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <ChevronDown className="w-6 h-6 text-[var(--color-secondary)]" />
                </motion.div>
            </section>


            {/* --- PAGE 2: DEEP DIVE (Visualized Part 1 Continued) --- */}
            <section className="min-h-screen bg-white rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] relative z-20 px-6 py-16 md:px-12 md:py-24 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-20" />

                <div className="max-w-3xl mx-auto">
                    {/* Level 1 Title: The Sparkle Title */}
                    <div className="mb-12 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 text-[var(--color-accent)] text-sm tracking-widest uppercase mb-4 font-bold">
                            <Sparkles className="w-4 h-4" /> Deep Dive Analysis
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-primary)] leading-tight">
                            {parsed.deepDive.title.replace('✨ 标题：', '').replace('✨', '')}
                        </h2>
                    </div>

                    {/* Intro Text */}
                    <div className="prose prose-stone prose-lg max-w-none text-gray-600 leading-loose mb-16">
                        {parsed.deepDive.intro.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    {/* Scene Substitution Card */}
                    {(parsed.deepDive.sceneContent) && (
                        <div className="relative bg-[#F4F4F9] rounded-2xl p-8 md:p-10 my-12 border-l-4 border-[var(--color-secondary)]">
                            <div className="absolute -top-4 left-8 bg-[var(--color-secondary)] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider">
                                {parsed.deepDive.sceneTitle || "SCENARIO"}
                            </div>
                            <div className="font-serif italic text-xl text-gray-700 leading-relaxed opacity-90">
                                {parsed.deepDive.sceneContent}
                            </div>
                        </div>
                    )}

                    {/* Outro Text (if any) */}
                    <div className="prose prose-stone prose-lg max-w-none text-gray-600 leading-loose">
                        {parsed.deepDive.outro.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    {/* Visual spacer before Data Section */}
                    <div className="h-24 w-px bg-gradient-to-b from-gray-200 to-transparent mx-auto mt-24" />
                </div>
            </section>


            {/* --- PAGE 3: DATA & REMAINING CONTENT --- */}
            <section className="min-h-screen bg-[#F9F7F2] relative z-20 px-6 py-16 md:px-12 md:py-24">
                <div className="max-w-3xl mx-auto space-y-24">

                    {/* Part 2: Data Visualization */}
                    {/* Part 2: Data & Insight - Side by Side */}
                    <div className="min-h-screen flex flex-col justify-center py-20">
                        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 items-start">
                            {/* Left: Sticky Chart & Summary */}
                            <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-32 space-y-12">
                                {/* Header (Left Aligned) */}
                                <div className="space-y-4">
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-primary)] leading-tight">
                                        情绪光谱与<br />心跳频率
                                    </h2>
                                    <p className="text-[var(--color-secondary)]/60 text-xs tracking-[0.2em] uppercase">
                                        Data Visualization & Analysis
                                    </p>
                                </div>

                                <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-sm border border-[var(--color-primary)]/5">
                                    <EmotionalRadar data={report.radarData} />
                                </div>

                                {/* Summary Card */}
                                <div className="bg-[var(--color-primary)] text-[#F9F7F2] p-8 rounded-2xl shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 font-serif">
                                        <Sparkles className="w-5 h-5 text-[var(--color-accent)]" /> 核心洞察
                                    </h4>
                                    <p className="text-white/90 leading-relaxed italic text-justify text-sm">
                                        {report.summaryQuote}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Scrollable Analysis */}
                            <div className="md:col-span-7 lg:col-span-7 space-y-12">
                                <div className="relative pl-8 md:pl-12 border-l border-[var(--color-primary)]/10">
                                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full" />
                                    <div className="text-xs font-bold text-[var(--color-accent)] tracking-widest uppercase mb-8">Deep Interpretation</div>

                                    <article className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--color-primary)] prose-p:leading-loose text-justify prose-p:text-gray-600">
                                        <SimpleMarkdown content={parsed.part2} />
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Part 3: Decision & Life (New 3-Page Layout) */}
                    {parsed.part3Items && parsed.part3Items.length > 0 ? (
                        <PaginatedSection
                            title="决策与生活方式的影响"
                            subtitle="你如何在生活中追求卓越"
                            items={parsed.part3Items}
                            startIdx={1}
                        />
                    ) : (
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm">
                            <div className="text-xs font-bold text-[var(--color-accent)] tracking-widest uppercase mb-6">Part 3: Decision & Life</div>
                            <article className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:text-[var(--color-primary)] prose-p:leading-loose text-justify">
                                <SimpleMarkdown content={parsed.part3} />
                            </article>
                        </div>
                    )}

                    {/* Part 4: Growth (New Timeline Layout) */}
                    {parsed.part4Items && parsed.part4Items.length > 0 ? (
                        <GrowthGuideSection
                            title="成长指导与生命之流"
                            subtitle="放下重担，重新定义你的力量"
                            items={parsed.part4Items}
                            startIdx={1}
                        />
                    ) : (
                        <div className="bg-[var(--color-primary)] text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-white/60 tracking-widest uppercase mb-6">Part 4: Growth Guide</div>
                                {/* Custom white prose for dark background */}
                                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-white prose-p:leading-loose prose-p:text-gray-300 text-justify">
                                    <SimpleMarkdown content={parsed.part4} />
                                </article>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-10 border-t border-gray-200 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl"
                        >
                            重新测试
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ... helper to parse numbered lists ...
function parseNumberedItems(textBlock: string): { title: string; content: string[] }[] {
    const lines = textBlock.split('\n');
    const items: { title: string; content: string[] }[] = [];
    let currentItem: { title: string; content: string[] } | null = null;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Match "1、", "1.", "1【"
        if (trimmed.match(/^[0-9]+[、\.【]/)) {
            if (currentItem) items.push(currentItem);
            currentItem = { title: trimmed, content: [] };
        } else if (currentItem) {
            currentItem.content.push(trimmed);
        }
    });
    if (currentItem) items.push(currentItem);
    return items;
}

// --- Parsing Logic Implementation ---
function parseReportContent(fullText: string): ParsedSections {
    const lines = fullText.split('\n');
    const sections: ParsedSections = {
        flavor: [],
        philosophy: "",
        deepDive: {
            title: "",
            intro: [],
            sceneTitle: "场景代入",
            sceneContent: "",
            outro: []
        },
        part2: "",
        part3: "",
        part3Items: [],
        part4: "",
        part4Items: []
    };

    // 1. Core Flavor (Usually line 1 or 2, containing "底色" or "风味")
    const flavorLine = lines.find(l => l.includes("核心底色") || l.includes("风味") || l.includes("苦涩") || l.includes("辛辣") || l.includes("醇厚"));
    if (flavorLine) {
        sections.flavor = flavorLine.split(/[:：]/)[1]?.split(/[,，、]/).map(s => s.trim()).filter(Boolean) || ["独特特质"];
    }

    // 2. Split by Main Sections (一、 二、 三、 四、)
    // We strictly use the Chinese markers present in the text files.
    // Fixed: Use strict Chinese numeral matching to avoid matching "4、" (list item) as Part 4 header.

    // Find Indices
    const part1Idx = lines.findIndex(l => l.trim().match(/^[一][、\.]/));
    const part2Idx = lines.findIndex(l => l.trim().match(/^[二][、\.]/));
    const part3Idx = lines.findIndex(l => l.trim().match(/^[三][、\.]/));
    const part4Idx = lines.findIndex(l => l.trim().match(/^[四][、\.]/));

    // Extract raw text blocks
    const part1Text = lines.slice(part1Idx, part2Idx > -1 ? part2Idx : undefined);
    // Remove the title line "一、..."
    if (part1Text.length > 0) {
        const titleLine = part1Text[0]; // e.g. "一、面具的心声...：你内心的..."
        // Extract philosophy from the title line after colon, or the next line
        const titleParts = titleLine.split(/[:：]/);
        if (titleParts.length > 1) {
            sections.philosophy = titleParts[1].trim();
        } else {
            // Fallback if no colon in title line
            sections.philosophy = titleLine.replace(/^[一1][、\.]/, '').trim();
        }
        part1Text.shift(); // Remove title line
    }

    // Parse Deep Dive (Part 1 Internal Structure)
    // Looking for "✨ 标题：" and "场景代入："
    let inScene = false;
    part1Text.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.includes("✨") || trimmed.startsWith("标题：")) {
            sections.deepDive.title = trimmed.replace(/✨|标题[:：]/g, '').trim();
            return;
        }

        if (trimmed.startsWith("场景代入") || trimmed.includes("情境代入")) {
            inScene = true;
            // Sometimes "场景代入：" is followed immediately by text, sometimes on next line
            const sceneParts = trimmed.split(/[:：]/);
            if (sceneParts.length > 1 && sceneParts[1].trim()) {
                sections.deepDive.sceneContent += sceneParts[1].trim() + "\n";
            }
            return;
        }

        // Logic to exit scene? Usually scene is one block. 
        // If we hit another heavy marker or just assume scene lasts until end of Part 1 intro?
        // Let's assume Scene typically ends when we hit "你不需要..." or typical transition paragraphs, 
        // BUT simpler: Scene is the rest of deep dive OR until a clear break. 
        // Given user example: "你不需要外界的批评..." is AFTER Sample Scene. 
        // So we need a heuristic to close the scene.
        // Heuristic: If we are inScene, and line starts with specific transition keywords or is just a new paragraph?
        // Use simple logic: Scene is just the paragraph(s) immediately following the marker header.

        // Actually, let's treat "Scene" as a block. 
        // If we see "你是..." or "你不需要..." (Analysis return), we exit scene.
        if (inScene) {
            if (trimmed.startsWith("你不需要") || trimmed.startsWith("你不是") || trimmed.startsWith("你的")) {
                inScene = false;
                sections.deepDive.outro.push(trimmed);
            } else {
                sections.deepDive.sceneContent += trimmed + "\n";
            }
        } else {
            // Intro or Outro logic is tricky if order varies.
            // Default to Intro if we haven't hit scene yet.
            if (!sections.deepDive.sceneContent) {
                sections.deepDive.intro.push(trimmed);
            } else {
                sections.deepDive.outro.push(trimmed);
            }
        }
    });


    // Extract Parts 2, 3, 4
    if (part2Idx > -1) {
        const end = part3Idx > -1 ? part3Idx : undefined;
        // Remove the header line "二、..."
        const rawLines = lines.slice(part2Idx + 1, end);

        // Strategy: Look for "·数据解读：" or "数据透视：" to separate the text analysis from the table/chart data (which is handled by visual component)
        const interpretationIdx = rawLines.findIndex(l => l.includes("·数据解读") || l.includes("Data Interpretation") || l.includes("数据透视："));

        if (interpretationIdx > -1) {
            // Keep everything after the marker
            sections.part2 = rawLines.slice(interpretationIdx).join('\n');
        } else {
            // Fallback: Try to skip the table rows (usually contain "Block" or tabs)
            // Or just return everything
            sections.part2 = rawLines.join('\n');
        }
    }
    // Part 3 Parsing into Items
    if (part3Idx > -1) {
        const end = part4Idx > -1 ? part4Idx : undefined;
        // Remove header line
        const rawLines = lines.slice(part3Idx + 1, end);
        sections.part3 = rawLines.join('\n');
        sections.part3Items = parseNumberedItems(sections.part3);
    }

    // Part 4 Parsing
    if (part4Idx > -1) {
        const rawLines = lines.slice(part4Idx + 1);
        sections.part4 = rawLines.join('\n');
        sections.part4Items = parseNumberedItems(sections.part4);
    }

    return sections;
}

// Helper Component for Paginated Sections
const PaginatedSection: React.FC<{
    title: string;
    subtitle: string;
    items: { title: string; content: string[] }[];
    startIdx?: number;
}> = ({ title, subtitle, items, startIdx = 1 }) => {
    return (
        <div className="space-y-32 py-12">
            {/* Loop through items in chunks of 2 */}
            {Array.from({ length: Math.ceil(items.length / 2) }).map((_, pageIdx) => {
                const pageItems = items.slice(pageIdx * 2, pageIdx * 2 + 2);
                return (
                    <div key={pageIdx} className="min-h-[70vh] flex flex-col justify-center space-y-12">
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-primary)]">
                                {title}
                            </h2>
                            <p className="text-[var(--color-secondary)]/60 text-xs tracking-widest uppercase">
                                {subtitle} — PART {pageIdx + startIdx}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {pageItems.map((item, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
                                    <div className="text-4xl font-serif text-[var(--color-accent)]/20 font-bold mb-4">
                                        {(pageIdx * 2 + i + 1).toString().padStart(2, '0')}
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6 border-b border-gray-100 pb-2">
                                        {item.title.replace(/^[0-9]+[、\.【]/, '').replace('】', '')}
                                    </h3>

                                    <div className="space-y-6 flex-grow">
                                        {item.content.map((line, lid) => {
                                            if (line.includes("情境描绘") || line.includes("练习：")) {
                                                return <div key={lid} className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-widest mt-4">{line.replace(/[:：]/g, '')}</div>;
                                            }
                                            if (line.includes("转化建议") || line.includes("效果：") || line.includes("情感引导：")) {
                                                return <div key={lid} className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest mt-4 pt-4 border-t border-dashed border-gray-200">{line.replace(/[:：]/g, '')}</div>;
                                            }
                                            if (line.includes("微观干预")) {
                                                return <div key={lid} className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest mt-4 pt-4 border-t border-dashed border-gray-200">微观干预</div>;
                                            }
                                            if ((line.startsWith("【") && line.endsWith("】")) || line.startsWith("1、") || line.startsWith("2、")) {
                                                // Bold intervention title
                                                return <strong key={lid} className="block text-[var(--color-primary)] font-bold">{line.replace(/【|】/g, '')}</strong>;
                                            }
                                            return <p key={lid} className="text-gray-600 text-sm leading-loose text-justify">{line.replace(/^(练习：|效果：|情感引导：)/, '')}</p>;
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const GrowthGuideSection: React.FC<{
    title: string;
    subtitle: string;
    items: { title: string; content: string[] }[];
    startIdx?: number;
}> = ({ title, subtitle, items, startIdx = 1 }) => {
    return (
        <div className="space-y-48 py-20">
            {/* Loop through items in chunks of 2 */}
            {Array.from({ length: Math.ceil(items.length / 2) }).map((_, pageIdx) => {
                const pageItems = items.slice(pageIdx * 2, pageIdx * 2 + 2);
                return (
                    <div key={pageIdx} className="min-h-[80vh] flex flex-col items-center">
                        {/* Header */}
                        <div className="text-center space-y-4 mb-24 relative z-10 bg-[#F9F7F2] px-8">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-primary)]">
                                {title}
                            </h2>
                            <p className="text-[var(--color-secondary)]/60 text-xs tracking-[0.2em] uppercase">
                                {subtitle} — PART {pageIdx + startIdx}
                            </p>
                        </div>

                        {/* Timeline Container */}
                        <div className="relative w-full max-w-4xl space-y-24">
                            {/* Central Line */}
                            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px border-l border-dashed border-[var(--color-accent)]/30 -translate-x-1/2 hidden md:block" />
                            <div className="absolute left-6 top-0 bottom-0 w-px border-l border-dashed border-[var(--color-accent)]/30 md:hidden" />

                            {pageItems.map((item, i) => {
                                const isLeft = i % 2 === 0;
                                return (
                                    <div key={i} className={`relative flex flex-col md:flex-row items-center md:items-start ${isLeft ? 'md:flex-row-reverse' : ''} group`}>

                                        {/* Content Card */}
                                        <div className="w-full md:w-[45%] pl-16 md:pl-0 md:px-0">
                                            <div className="bg-white/80 backdrop-blur-sm p-8 md:p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--color-primary)]/5 relative overflow-hidden group-hover:bg-white">
                                                {/* Decorative Growth Circle */}
                                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--color-accent)]/5 rounded-full blur-2xl transition-all group-hover:bg-[var(--color-accent)]/10" />

                                                <div className="relative z-10">
                                                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-6 flex items-center gap-3">
                                                        <span className="inline-block w-8 h-8 rounded-full bg-[var(--color-primary)] text-[#F9F7F2] text-center leading-8 font-serif text-sm">
                                                            {(pageIdx * 2 + i + 1)}
                                                        </span>
                                                        {item.title.replace(/^[0-9]+[、\.【]/, '').replace('】', '')}
                                                    </h3>

                                                    <div className="space-y-4 text-sm leading-loose text-gray-600">
                                                        {item.content.map((line, lid) => {
                                                            const isIntervention = line.includes("微观干预") || line.includes("行动建议");
                                                            if (isIntervention) {
                                                                return (
                                                                    <div key={lid} className="mt-6 pt-4 border-t border-[var(--color-accent)]/20">
                                                                        <div className="text-[10px] uppercase font-bold text-[var(--color-accent)] tracking-widest mb-2">Micro Intervention</div>
                                                                        <p className="font-medium text-[var(--color-primary)]">{line.replace(/[:：]/g, '')}</p>
                                                                    </div>
                                                                );
                                                            }
                                                            return <p key={lid} className="text-justify">{line}</p>;
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spacer for Center Line Alignment */}
                                        <div className="md:w-[10%]" />

                                        {/* Timeline Node */}
                                        <div className="absolute left-6 md:left-[50%] top-10 w-3 h-3 bg-[var(--color-accent)] rounded-full -translate-x-[6.5px] z-20 outline outline-4 outline-[#F9F7F2] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_20px_rgba(200,166,100,0.6)]" />

                                        {/* Empty Side for balance (Tablet/Desktop) */}
                                        <div className="hidden md:block md:w-[45%]" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div className="space-y-6">
            {content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-2" />;

                // Simple headers
                if (trimmed.match(/^[0-9]+[、\.].+/)) {
                    // 1、... or 2、... Subheaders
                    return <h3 key={i} className="text-xl font-bold mt-6 mb-2">{trimmed}</h3>;
                }
                if (trimmed.includes("情境描绘")) {
                    return <div key={i} className="font-bold text-[var(--color-secondary)] uppercase text-sm tracking-widest mt-6 mb-2">情境描绘</div>;
                }
                if (trimmed.includes("微观干预") || trimmed.includes("转化建议")) {
                    return <div key={i} className="font-bold text-[var(--color-accent)] uppercase text-sm tracking-widest mt-6 mb-2">{trimmed}</div>;
                }
                if (trimmed.startsWith('【') && trimmed.endsWith('】')) {
                    // Bold bracketed items
                    return <strong key={i} className="block text-lg mt-4 mb-1">{trimmed}</strong>;
                }

                return <p key={i}>{trimmed}</p>;
            })}
        </div>
    );
};

export default Report;

