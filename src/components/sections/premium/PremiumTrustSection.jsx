import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, ShieldCheck, Ban, FileDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

const PremiumTrustSection = () => {
    const { t } = useTranslation('premium');
    const { toast } = useToast();

    const points = [
        { key: 'premium_trust_point1', icon: Eye },
        { key: 'premium_trust_point2', icon: ShieldCheck },
        { key: 'premium_trust_point3', icon: Ban },
    ];

    const handleCtaClick = () => {
        toast({
            title: t('premium_trust_cta'),
            description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    return (
        <section className="py-24 px-4 bg-slate-900/50">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto glass-card p-8 md:p-12 text-center"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
                    {t('premium_trust_title')}
                </h2>
                <div className="grid md:grid-cols-3 gap-8 mb-10">
                    {points.map((point, index) => {
                        const Icon = point.icon;
                        return (
                            <div key={index} className="flex items-center justify-center md:justify-start gap-3">
                                <Icon className="w-6 h-6 text-amber-400 flex-shrink-0" />
                                <span className="text-gray-300">{t(point.key)}</span>
                            </div>
                        );
                    })}
                </div>
                <Button onClick={handleCtaClick} variant="outline" className="border-amber-300/50 text-amber-300 hover:bg-amber-300/10 hover:text-amber-200">
                    <FileDown className="w-4 h-4 mr-2" />
                    {t('premium_trust_cta')}
                </Button>
            </motion.div>
        </section>
    );
};

export default PremiumTrustSection;