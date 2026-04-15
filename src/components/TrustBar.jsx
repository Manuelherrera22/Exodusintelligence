import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, BrainCircuit, Briefcase, Award } from 'lucide-react';

const TrustBar = () => {
    const { t } = useTranslation('general');

    const items = [
        { icon: ShieldCheck, text: t('trust_bar_data') },
        { icon: BrainCircuit, text: t('trust_bar_ai') },
        { icon: Briefcase, text: t('trust_bar_alliances') },
        { icon: Award, text: t('trust_bar_tech') },
    ];

    return (
        <div className="bg-slate-900/30 py-4 overflow-hidden border-y border-slate-800">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ['0%', '-100%'] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 30,
                        ease: 'linear',
                    },
                }}
            >
                {[...items, ...items].map((item, index) => (
                    <div key={index} className="flex items-center mx-8 text-sm text-gray-400 flex-shrink-0">
                        <item.icon className="w-5 h-5 mr-2.5 text-cyan-400" />
                        <span className="font-medium">{item.text}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default TrustBar;