import React from 'react';
import { motion } from 'framer-motion';

interface RadarData {
    label: string;
    value: number; // 0-5
    avg: number;   // 0-5
}

interface EmotionalRadarProps {
    data: RadarData[];
}

export const EmotionalRadar: React.FC<EmotionalRadarProps> = ({ data }) => {
    // Configuration
    const size = 300;
    const center = size / 2;
    const radius = size * 0.4;
    const levels = 4; // 1.25, 2.5, 3.75, 5.0

    // Helper to calculate coordinates
    const getPoint = (value: number, index: number, total: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (value / 5) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    // Construct path strings
    const userPath = data.map((d, i) => {
        const p = getPoint(d.value, i, data.length);
        return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
    }).join(' ') + ' Z';

    const avgPath = data.map((d, i) => {
        const p = getPoint(d.avg, i, data.length);
        return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
    }).join(' ') + ' Z';

    return (
        <div className="relative flex flex-col items-center">
            {/* Legend inside Chart Area for print feel or outside? Let's keep it clean inside SVG or below */}

            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {/* Background Grid (Web) */}
                {[...Array(levels)].map((_, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={(radius / levels) * (i + 1)}
                        fill="none"
                        stroke="#E5E7EB" // gray-200
                        strokeWidth="1"
                    />
                ))}

                {/* Axes */}
                {data.map((_, i) => {
                    const p = getPoint(5, i, data.length);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={p.x}
                            y2={p.y}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Average Polygon (Gray/Outline) */}
                <path
                    d={avgPath}
                    fill="none"
                    stroke="#9CA3AF" // gray-400
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                />

                {/* User Polygon (Gold/Filled) */}
                <motion.path
                    d={userPath}
                    fill="rgba(234, 179, 8, 0.2)" // yellow-500 equivalent with opacity
                    stroke="rgba(234, 179, 8, 1)"    // yellow-500
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />

                {/* Data Points (User) */}
                {data.map((d, i) => {
                    const p = getPoint(d.value, i, data.length);
                    return (
                        <motion.circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            fill="#FFFFFF"
                            stroke="rgba(234, 179, 8, 1)"
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + i * 0.1 }}
                        />
                    );
                })}

                {/* Labels */}
                {data.map((d, i) => {
                    // Push labels out a bit
                    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
                    // Distance factor: 1.25x radius
                    const labelR = radius * 1.35;
                    const lx = center + labelR * Math.cos(angle);
                    const ly = center + labelR * Math.sin(angle);

                    // Determine text anchor based on position to avoid overlapping chart
                    // If x is center, middle. If x < center, end. If x > center, start.
                    // Actually, simple middle is fine if we have enough padding, but let's be dynamic if needed.
                    // For 4 points (top, right, bottom, left), middle works well for top/bottom.
                    // For left/right, we might want to align towards the outside.
                    // But with only 4 points, fixed middle is usually safe.

                    return (
                        <g key={i}>
                            <text
                                x={lx}
                                y={ly - 6} // Shift up slightly for label
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[11px] fill-[var(--color-primary)] font-bold tracking-widest"
                            >
                                {d.label}
                            </text>
                            <text
                                x={lx}
                                y={ly + 8} // Shift down for values
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[9px] fill-gray-400 font-mono"
                            >
                                {d.value.toFixed(1)} <tspan fill="#ccc">/</tspan> <tspan className="fill-gray-300">{d.avg.toFixed(1)} (均值)</tspan>
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="flex gap-6 mt-4 text-xs font-medium text-gray-400 tracking-wider">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-accent)]/20" />
                    <span>您的数值</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-gray-400 border-dashed" />
                    <span>人群均值</span>
                </div>
            </div>
        </div>
    );
};
