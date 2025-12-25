import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Zap, Shield } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4 relative overflow-hidden">


            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"></div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)] mb-4 tracking-wide">
                他人所见，非你所是
            </h1>
            <p className="text-[var(--color-secondary)] mb-12 max-w-lg mx-auto text-lg leading-relaxed font-light">
                你被哪一种情绪，劫持了人生剧本？

                你对外展示的“完美人格”，正在消耗真正的你。深入 12 种情绪底层代码，找出你的情绪盲点，启动人格重构。
            </p>

            <button
                onClick={() => navigate('/test')}
                className="group btn-primary flex items-center gap-3 mb-24"
            >
                开始探索
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
                <FeatureCard
                    icon={<Brain className="w-6 h-6" />}
                    title="12种面具深度诊断"
                    desc="融合心理学、神经学和东方哲学，直击你的情绪底层代码和潜意识模式"
                />
                <FeatureCard
                    icon={<Shield className="w-6 h-6" />}
                    title="五大体系核心"
                    desc="AI智能分析，交付高价值实战脚本，将你的情绪消耗转化为独特力量"
                />
                <FeatureCard
                    icon={<Zap className="w-6 h-6" />}
                    title="3000字+专属报告"
                    desc="详细的行动指南，一份值得反复阅读的人生进阶说明书"
                />
            </div>

            <div className="mt-16 text-[var(--color-secondary)] text-sm opacity-60">
                已有报告？ <span className="underline cursor-pointer hover:text-[var(--color-primary)] transition-colors">点击登录查看</span>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex flex-col items-center gap-3 p-6 text-[var(--color-primary)]">
        <div className="p-3 rounded-full bg-white border border-[var(--color-accent)] text-[var(--color-accent)] mb-2 shadow-sm">
            {icon}
        </div>
        <h3 className="font-serif font-bold text-lg tracking-wide">{title}</h3>
        <p className="text-sm text-[var(--color-secondary)] leading-relaxed font-light">{desc}</p>
    </div>
);

export default Landing;
