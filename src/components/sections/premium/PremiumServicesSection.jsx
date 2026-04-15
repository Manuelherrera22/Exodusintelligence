import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Landmark, Globe, Banknote, AreaChart, UserCog } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PremiumServicesSection = () => {
    const { t } = useTranslation('premium');
    
    const services = [
        { icon: Lock, title: t('premium_s4_s1_title'), desc: t('premium_s4_s1_desc') },
        { icon: Landmark, title: t('premium_s4_s2_title'), desc: t('premium_s4_s2_desc') },
        { icon: Globe, title: t('premium_s4_s3_title'), desc: t('premium_s4_s3_desc') },
        { icon: Banknote, title: t('premium_s4_s4_title'), desc: t('premium_s4_s4_desc') },
        { icon: AreaChart, title: t('premium_s4_s5_title'), desc: t('premium_s4_s5_desc') },
        { icon: UserCog, title: t('premium_s4_s6_title'), desc: t('premium_s4_s6_desc') },
    ];

    return (
        <section className="py-24 px-4 bg-slate-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-300 to-amber-200 bg-clip-text text-transparent">
                        {t('premium_s4_title')}
                    </h2>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-slate-800/50 p-8 rounded-lg border border-slate-700/60 hover:border-amber-400/50 transition-colors duration-300"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <service.icon className="w-8 h-8 text-amber-400 flex-shrink-0" />
                                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                            </div>
                            <p className="text-gray-400">{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumServicesSection;