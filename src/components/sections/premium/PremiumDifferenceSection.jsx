import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';

const PremiumDifferenceSection = () => {
    const { t } = useTranslation('premium');
    const differences = [
        { exodus: t('premium_s5_e1'), traditional: t('premium_s5_t1') },
        { exodus: t('premium_s5_e2'), traditional: t('premium_s5_t2') },
        { exodus: t('premium_s5_e3'), traditional: t('premium_s5_t3') },
        { exodus: t('premium_s5_e4'), traditional: t('premium_s5_t4') },
        { exodus: t('premium_s5_e5'), traditional: t('premium_s5_t5') },
    ];
    return (
        <section className="py-24 px-4 bg-slate-900/50">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                        {t('premium_s5_title')}
                    </h2>
                </motion.div>
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 text-center font-bold text-xl p-6 bg-slate-800/50">
                        <h3 className="text-amber-300">{t('premium_s5_col1')}</h3>
                        <h3 className="text-gray-500">{t('premium_s5_col2')}</h3>
                    </div>
                    {differences.map((diff, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                            className="grid grid-cols-2 gap-4 p-6 border-t border-slate-700/60 items-start"
                        >
                            <div className="flex gap-3">
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <span className="text-gray-300">{diff.exodus}</span>
                            </div>
                            <div className="flex gap-3">
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                                <span className="text-gray-400">{diff.traditional}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumDifferenceSection;