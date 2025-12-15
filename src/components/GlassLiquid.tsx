import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Generate random particles
const generateParticles = (count: number) => {
    return Array.from({ length: count }).map(() => ({
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        size: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5
    }));
};

const WaveLayer: React.FC<{
    delay: number;
    opacity: number;
    color: string;
    direction?: number; // 1 or -1
    duration?: number;
}> = ({ delay, opacity, color, direction = 1, duration = 8 }) => {
    return (
        <motion.div
            className="absolute bottom-0 left-[-50%] right-[-50%] h-[200%]"
            initial={{ x: direction === 1 ? "-25%" : "0%" }}
            animate={{
                x: direction === 1 ? "0%" : "-25%"
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
                delay: delay
            }}
            style={{
                opacity: opacity,
            }}
        >
            {/* SVG Wave */}
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full">
                <path
                    d="M0,500 C200,450 300,550 500,500 C700,450 800,550 1000,500 L1000,1000 L0,1000 Z"
                    fill={color}
                />
            </svg>
        </motion.div>
    );
};

export const GlassLiquid: React.FC = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        setParticles(generateParticles(12));
    }, []);

    return (
        <div className="relative w-72 h-96 mx-auto my-16 group">
            {/* Breathing Glow Container */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full blur-[80px] -z-10"
                animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 6, // 6s Breath Cycle
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Glass Container */}
            <div className="absolute inset-0 rounded-[3rem] border border-white/30 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden z-20">

                {/* Surface Shine */}
                <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-white/20 to-transparent opacity-60 z-30" />

                {/* Liquid Area - Masked by container */}
                <div className="absolute inset-0 z-10 overflow-hidden rounded-[3rem]">

                    {/* Breathing Liquid Level - Now centered at ~50% */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-transparent"
                        initial={{ height: "50%" }}
                        animate={{
                            height: ["48%", "52%", "48%"] // Hovers around 50%
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Layer 1: Deep Base (Darker Rich Gold) */}
                        <WaveLayer
                            delay={0}
                            opacity={1}
                            color="#C6A664"
                            direction={1}
                            duration={12}
                        />

                        {/* Layer 2: Mid Tone (Vibrant Gold) */}
                        <WaveLayer
                            delay={2}
                            opacity={0.8}
                            color="#E6C875"
                            direction={-1}
                            duration={9}
                        />

                        {/* Layer 3: Surface Highlights */}
                        <WaveLayer
                            delay={1}
                            opacity={0.5}
                            color="#FFFFFF"
                            direction={1}
                            duration={7}
                        />

                        {/* Layer 4: Top Interference */}
                        <WaveLayer
                            delay={0.5}
                            opacity={0.3}
                            color="#FFFFFF"
                            direction={-1}
                            duration={5}
                        />
                    </motion.div>
                </div>

                {/* Floating Particles (Fireflies) */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            style={{
                                width: p.size,
                                height: p.size,
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                            }}
                            animate={{
                                y: [0, -40, 0],
                                x: [0, Math.random() * 20 - 10, 0],
                                opacity: [0, 0.8, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Reflection/Shadow */}
            <div className="absolute -bottom-8 left-10 right-10 h-4 bg-black/10 blur-xl rounded-[100%]" />
        </div>
    );
};
