import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Check, X, Sparkles, ArrowLeft } from 'lucide-react';

const FeatureRow = ({ name, free, pro, t }) => {
    const renderIcon = (value) => {
        if (value === true) return <Check className="w-6 h-6 text-green-400 mx-auto" />;
        if (value === false) return <X className="w-6 h-6 text-red-500/70 mx-auto" />;
        if (value === 'partial') return <Sparkles className="w-5 h-5 text-yellow-400 mx-auto" />;
        return null;
    };

    return (
        <tr className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
            <td className="p-3 font-semibold text-left">{t(name)}</td>
            <td className="p-3 text-center">{renderIcon(free)}</td>
            <td className="p-3 text-center">{renderIcon(pro)}</td>
        </tr>
    );
}

const PlansComparisonModal = ({ isOpen, onOpenChange }) => {
    const { t } = useTranslation('dashboard');
    const navigate = useNavigate();

    const features = [
        { name: 'plans_feature_score', free: true, pro: true },
        { name: 'plans_feature_support', free: true, pro: true },
        { name: 'plans_feature_docs', free: false, pro: true },
        { name: 'plans_feature_map', free: false, pro: true },
        { name: 'plans_feature_path', free: false, pro: true },
        { name: 'plans_feature_ai', free: false, pro: true },
        { name: 'plans_feature_doc_rec', free: false, pro: true },
        { name: 'plans_feature_priority', free: false, pro: true },
        { name: 'plans_feature_updates', free: false, pro: true },
        { name: 'plans_feature_promo', free: false, pro: true }
    ];
    
    const handleSubscribe = (planId) => {
        onOpenChange(false);
        navigate(`/payment/${planId}`);
    };

    const handleReturnToDashboard = () => {
        navigate('/dashboard');
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900/90 backdrop-blur-lg border-purple-500/30 text-white sm:max-w-4xl p-0">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
                    <DialogHeader className="p-6 text-center">
                        <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{t('plans_modal_title')}</DialogTitle>
                         <p className="text-purple-200/80 text-sm mt-2 p-2 bg-purple-500/10 rounded-lg">{t('plans_discount_banner')}</p>
                    </DialogHeader>
                    
                    <div className="px-6 pb-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-slate-700">
                                    <th className="p-4 text-left font-bold text-lg">{t('plans_modal_feature')}</th>
                                    <th className="p-4 font-bold">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg">✅ {t('plans_modal_free')}</span>
                                            <span className="text-xs text-gray-400">{t('plans_label_free_sub')}</span>
                                        </div>
                                    </th>
                                    <th className="p-4 font-bold relative">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-900 px-2 py-0.5 text-xs font-bold rounded-full">{t('plans_label_popular')}</div>
                                        <div className="flex flex-col items-center text-cyan-300">
                                            <span className="text-lg">🔥 {t('plans_modal_pro')}</span>
                                            <span className="text-xs">{t('plans_label_pro_sub')}</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map(feature => <FeatureRow key={feature.name} {...feature} t={t} />)}
                                 <tr className="border-t-2 border-slate-700">
                                    <td></td>
                                    <td className="p-4 text-center">
                                         <Button onClick={handleReturnToDashboard} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white w-full">
                                            {t('plans_cta_current_plan')}
                                        </Button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Button onClick={() => handleSubscribe('pro')} className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold w-full shadow-lg shadow-cyan-500/20">
                                            {t('plans_cta_pro')}
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 pt-0 text-center">
                       <Button variant="link" className="text-slate-400 hover:text-white" onClick={handleReturnToDashboard}>
                           <ArrowLeft className="w-4 h-4 mr-2" />
                           {t('plans_return_to_free', 'O volver al plan gratuito')}
                       </Button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

export default PlansComparisonModal;