import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Database, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ConfidentialitySection = () => {
    const { t } = useTranslation('premium');

    const points = [
        { icon: Lock, text: t('premium_confidentiality_p1') },
        { icon: ShieldCheck, text: t('premium_confidentiality_p2') },
        { icon: Database, text: t('premium_confidentiality_p3') },
        { icon: Ban, text: t('premium_confidentiality_p4') },
    ];
    
    return (
        <section className="py-24 px-4 bg-slate-950">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">{t('premium_confidentiality_title')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {points.map((point, index) => (
                            <motion.div 
                                key={index} 
                                className="flex flex-col items-center gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                            >
                                <point.icon className="w-10 h-10 text-slate-400"/>
                                <p className="text-slate-400 text-sm">{point.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ConfidentialitySection;