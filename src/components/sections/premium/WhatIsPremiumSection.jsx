import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart, Landmark, Globe, Briefcase, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhatIsPremiumSection = () => {
    const { t } = useTranslation('premium');
    const items = [
        { icon: Landmark, text: t('premium_s2_item1') },
        { icon: BarChart, text: t('premium_s2_item2') },
        { icon: Shield, text: t('premium_s2_item3') },
        { icon: Globe, text: t('premium_s2_item4') },
        { icon: Briefcase, text: t('premium_s2_item5') },
        { icon: Bot, text: t('premium_s2_item6') },
    ];

    return (
        <section className="py-24 px-4 bg-slate-950">
            <div className="max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-300 to-amber-200 bg-clip-text text-transparent">
                        {t('premium_s2_title')}
                    </h2>
                    <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                        {t('premium_s2_text')}
                    </p>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="flex flex-col items-center gap-4 p-4"
                        >
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/60">
                                <item.icon className="w-8 h-8 text-amber-300" />
                            </div>
                            <span className="text-gray-300 text-center">{item.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhatIsPremiumSection;