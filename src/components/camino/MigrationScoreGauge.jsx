import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const MigrationScoreGauge = ({ score }) => {
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, Math.round);

    useEffect(() => {
        const animation = animate(motionValue, score, { 
            duration: 2,
            ease: "easeOut" 
        });
        return animation.stop;
    }, [score]);

    const getScoreColor = (s) => {
        if (s < 50) return { main: '#F87171', gradient: 'from-red-500 to-red-400' }; // red
        if (s < 76) return { main: '#FBBF24', gradient: 'from-amber-500 to-yellow-400' }; // yellow
        return { main: '#4ADE80', gradient: 'from-green-500 to-teal-400' }; // green
    };

    const { main: color, gradient } = getScoreColor(score);
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={gradient.split(' ')[0].replace('from-', '')} />
                        <stop offset="100%" stopColor={gradient.split(' ')[1].replace('to-', '')} />
                    </linearGradient>
                </defs>
                <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    strokeWidth="12"
                    className="stroke-slate-700/50"
                />
                <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className="text-5xl sm:text-6xl font-bold" style={{ color }}>
                    {rounded}
                </motion.span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
        </div>
    );
};

export default MigrationScoreGauge;