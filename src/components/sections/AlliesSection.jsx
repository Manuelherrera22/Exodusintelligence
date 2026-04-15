import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

const AlliesSection = () => {
    const { t } = useTranslation('common');

    const logos = [
        { name: 'Bufete Panamá', alt: 'Logo de Bufete Panamá' },
        { name: 'Legal Experts', alt: 'Logo de Legal Experts' },
        { name: 'Global Trust', alt: 'Logo de Global Trust' },
        { name: 'MigraTech', alt: 'Logo de MigraTech' },
    ];

    return (
        <section className="py-16 bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="flex-shrink-0 flex items-center gap-3 text-green-400">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="font-bold text-lg">{t('allies_seal_text')}</span>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 grayscale opacity-60">
                        {logos.map((logo) => (
                            <img  key={logo.name} class="h-7" alt={logo.alt} src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AlliesSection;