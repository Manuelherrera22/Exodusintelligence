import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const FeatureRow = ({ name, free, pro, t }) => {
    const renderContent = (value) => {
        if (value === true) return <Check className="w-6 h-6 text-green-400 mx-auto" />;
        if (value === false) return <X className="w-6 h-6 text-red-500/70 mx-auto" />;
        if (typeof value === 'string') return <span className="text-xs font-semibold text-yellow-300">{t(value)}</span>
        return null;
    };

    return (
        <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
            <td className="p-3 font-semibold text-left text-slate-300">{t(name)}</td>
            <td className="p-3 text-center">{renderContent(free)}</td>
            <td className="p-3 text-center">{renderContent(pro)}</td>
        </tr>
    );
}

const PlansComparisonPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('dashboard');
    const [isAnnual, setIsAnnual] = useState(false);

    const features = [
        { name: 'plans_feature_score', free: true, pro: true },
        { name: 'plans_feature_path', free: false, pro: true },
        { name: 'plans_feature_ai_recommendations', free: false, pro: 'plans_feature_status_advanced' },
        { name: 'plans_feature_verified_docs', free: false, pro: true },
        { name: 'plans_feature_lawyer_contact', free: false, pro: true },
        { name: 'plans_feature_migration_feed', free: 'plans_feature_status_basic', pro: 'plans_feature_status_predictive' },
        { name: 'plans_feature_ai_assistant', free: false, pro: 'plans_feature_status_human' },
        { name: 'plans_feature_premium_maps', free: false, pro: 'plans_feature_status_comparative' },
        { name: 'plans_feature_pdf_report', free: false, pro: true },
    ];
    
    const plans = [
        { id: 'free', name: 'plans_free_name', desc: 'plans_free_desc', cta: 'plans_cta_start_now', price: 0, action: () => navigate('/dashboard') },
        { id: 'pro', name: 'plans_pro_name', desc: 'plans_pro_desc', cta: 'plans_cta_go_pro', price: 29.99, isPopular: true, action: () => navigate('/payment/pro') },
    ];

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white p-4 sm:p-8">
            <Helmet>
                <title>{t('plans_comparison_page_title')}</title>
                <meta name="description" content={t('plans_comparison_page_description')} />
            </Helmet>
            <div className="absolute top-4 left-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_dashboard')}
                </Button>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
            >
                <header className="text-center my-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{t('plans_section_title')}</h1>
                    <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">{t('plans_section_subtitle')}</p>
                </header>

                <div className="flex items-center justify-center space-x-3 mb-10">
                    <Label htmlFor="annual-toggle" className="font-medium">{t('payment_monthly')}</Label>
                    <Switch id="annual-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
                    <Label htmlFor="annual-toggle" className="font-medium">{t('payment_annual')}</Label>
                    <span className="text-xs bg-green-500/20 text-green-300 font-bold px-2 py-1 rounded-full">{t('plans_annual_discount')}</span>
                </div>

                {/* Cards for plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {plans.map(plan => (
                        <Card key={plan.id} className={cn("bg-slate-800/50 border-slate-700 flex flex-col p-6 text-center hover:border-purple-500/50 transition-all", { "border-cyan-400 border-2 shadow-lg shadow-cyan-500/10": plan.isPopular })}>
                            <h3 className="text-2xl font-bold mb-2">{t(plan.name)}</h3>
                            <p className="text-slate-400 mb-6 flex-grow">{t(plan.desc)}</p>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">
                                    ${isAnnual && plan.price > 0 ? (plan.price * 12 * 0.8).toFixed(0) : plan.price > 0 ? plan.price.toFixed(2) : t('common:free')}
                                </span>
                                {plan.price > 0 && 
                                    <span className="text-slate-400">/{isAnnual ? t('common:year_short') : t('common:month_short')}</span>
                                }
                            </div>
                            <Button onClick={plan.action} size="lg" disabled={plan.id === 'free'} className={cn({"bg-cyan-500 hover:bg-cyan-600": plan.isPopular})}>
                                {t(plan.cta)}
                            </Button>
                        </Card>
                    ))}
                </div>


                {/* Comparison Table */}
                <div className="bg-slate-800/40 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr className="border-b-2 border-slate-700">
                                <th className="p-4 text-left font-bold text-lg text-white">{t('plans_feature_name')}</th>
                                <th className="p-4 font-bold text-lg text-white">{t('plans_free_name')}</th>
                                <th className="p-4 font-bold text-lg text-cyan-300">{t('plans_pro_name')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map(feature => <FeatureRow key={feature.name} {...feature} t={t} />)}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default PlansComparisonPage;