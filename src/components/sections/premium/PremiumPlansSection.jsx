import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumPlansSection = () => {
    const { t } = useTranslation('premium');
    const { toast } = useToast();
    const navigate = useNavigate();

    const plans = [
        { 
            nameKey: 'premium_plans_p1_name', 
            idealKey: 'premium_plans_p1_ideal', 
            price: '$1,500',
            pricePeriodKey: 'premium_plans_p1_period',
            features: ['premium_plans_p1_f1'],
            ctaKey: 'premium_plans_p1_cta'
        },
        { 
            nameKey: 'premium_plans_p2_name', 
            idealKey: 'premium_plans_p2_ideal', 
            price: '$5,000',
            pricePeriodKey: 'premium_plans_p2_period',
            features: ['premium_plans_p2_f1', 'premium_plans_p2_f2'], 
            isFeatured: true,
            ctaKey: 'premium_plans_p2_cta'
        },
        { 
            nameKey: 'premium_plans_p3_name', 
            idealKey: 'premium_plans_p3_ideal', 
            priceKey: 'premium_plans_p3_price',
            pricePeriodKey: 'premium_plans_p3_period',
            features: ['premium_plans_p3_f1', 'premium_plans_p3_f2'],
            ctaKey: 'premium_plans_p3_cta'
        },
    ];

    const handleCta = (ctaKey) => {
        navigate('/register');
    };

    return (
        <section className="py-24 px-4 bg-slate-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                        {t('premium_plans_title')}
                    </h2>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className={`relative flex flex-col p-8 rounded-2xl border hover-glow ${plan.isFeatured ? 'bg-slate-800 border-amber-400' : 'bg-slate-800/50 border-slate-700'}`}
                        >
                            {plan.isFeatured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    {t('common:most_popular')}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{t(plan.nameKey)}</h3>
                            <p className="text-amber-300 mb-4 h-10">{t(plan.idealKey)}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">{plan.price ? plan.price : t(plan.priceKey)}</span>
                                <span className="text-gray-400 ml-2">{t(plan.pricePeriodKey)}</span>
                            </div>
                            <div className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((featureKey, fIndex) => (
                                    <div key={fIndex} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                        <span className="text-gray-300">{t(featureKey)}</span>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={() => handleCta(plan.ctaKey)} className={`w-full mt-auto font-bold ${plan.isFeatured ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                {t(plan.ctaKey)}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PremiumPlansSection;