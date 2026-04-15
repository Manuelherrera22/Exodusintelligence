import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FeaturedCountriesSection = () => {
    const { t } = useTranslation('premium');
    const countries = [
        { country: t('premium_s6_c1_country'), residency: t('premium_s6_c1_residency'), requirements: t('premium_s6_c1_req'), taxes: t('premium_s6_c1_tax'), confidentiality: t('premium_s6_c1_conf') },
        { country: t('premium_s6_c2_country'), residency: t('premium_s6_c2_residency'), requirements: t('premium_s6_c2_req'), taxes: t('premium_s6_c2_tax'), confidentiality: t('premium_s6_c2_conf') },
        { country: t('premium_s6_c3_country'), residency: t('premium_s6_c3_residency'), requirements: t('premium_s6_c3_req'), taxes: t('premium_s6_c3_tax'), confidentiality: t('premium_s6_c3_conf') },
    ];
    return (
        <section id="featured-countries" className="py-24 px-4 bg-slate-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-300 to-amber-200 bg-clip-text text-transparent mb-4">
                        {t('premium_s6_title')}
                    </h2>
                    <p className="text-lg text-gray-400">{t('premium_s6_countries')}</p>
                </motion.div>
                <div className="overflow-x-auto glass-card rounded-lg">
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="border-b border-slate-700/60">
                                <th className="p-4 text-amber-300">{t('premium_s6_h_country')}</th>
                                <th className="p-4 text-amber-300">{t('premium_s6_h_residency')}</th>
                                <th className="p-4 text-amber-300">{t('premium_s6_h_req')}</th>
                                <th className="p-4 text-amber-300">{t('premium_s6_h_tax')}</th>
                                <th className="p-4 text-amber-300">{t('premium_s6_h_conf')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {countries.map((c, index) => (
                                <motion.tr 
                                    key={index} 
                                    className="border-b border-slate-800/80 last:border-b-0"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                >
                                    <td className="p-4 font-bold text-white">{c.country}</td>
                                    <td className="p-4 text-gray-300">{c.residency}</td>
                                    <td className="p-4 text-gray-300">{c.requirements}</td>
                                    <td className="p-4 text-gray-300">{c.taxes}</td>
                                    <td className="p-4 text-gray-300">{c.confidentiality}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCountriesSection;