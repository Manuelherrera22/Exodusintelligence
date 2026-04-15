import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Lock, Compass, FileText, Bot, FileDown, Briefcase, Sparkles, Unlock, ArrowRight, CheckCircle, TrendingUp, UserPlus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import GridPattern from '@/components/GridPattern';

const LockedFeatureCard = ({ icon: Icon, title, text, cta, onClick, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
        <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors h-full flex flex-col cursor-pointer hover-glow"
            onClick={onClick}
        >
            <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                <div className="p-4 bg-slate-700/50 rounded-full mb-4 border border-slate-600">
                    <Icon className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-bold text-slate-100 text-lg mb-2">{title}</h4>
                <p className="text-sm text-slate-400 mb-6 flex-grow">{text}</p>
                <Button size="sm" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 mt-auto">
                    <Lock className="w-3 h-3 mr-2" />
                    {cta}
                </Button>
            </CardContent>
        </Card>
    </motion.div>
);


const WelcomeBanner = ({ title, subtitle, cta, onDismiss }) => (
    <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-xl mb-8 text-center relative shadow-lg shadow-purple-500/20"
    >
        <button onClick={onDismiss} className="absolute top-3 right-3 text-purple-200 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-purple-200 mb-4">{subtitle}</p>
        <Button onClick={onDismiss} variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            {cta}
        </Button>
    </motion.div>
);

const BasicInfoBanner = ({ onAction }) => {
    const { t } = useTranslation('dashboard');
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-slate-800/50 border border-purple-500/30 p-8 rounded-xl text-center shadow-lg shadow-purple-500/10"
        >
            <UserPlus className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">{t('basic_info_banner_title')}</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-6">{t('basic_info_banner_subtitle')}</p>
            <Button onClick={onAction} size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 mr-2" />
                {t('basic_info_banner_cta')}
            </Button>
        </motion.div>
    );
};

const ScoreAnalysisCard = ({ profile, analysis, onUpgrade }) => {
    const { t } = useTranslation('dashboard');
    const score = profile.migratory_score || 0;
    const country = analysis?.pais_sugerido || profile.target_country || "Canada";
    const potential = analysis?.nivel || t('score_analysis_free.potential_value');

    return (
        <Card className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 border-b md:border-b-0 md:border-r border-slate-700">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            {t('score_analysis_free.title')}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {t('score_analysis_free.subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-bold text-white">{score}%</span>
                            <span className="text-slate-400">{t('score_analysis_free.compatibility_label')}</span>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><strong className="text-slate-200">{t('score_analysis_free.viable_country_label')}:</strong> <span className="text-green-400 font-semibold">{country}</span></p>
                            <p><strong className="text-slate-200">{t('score_analysis_free.opportunity_label')}:</strong> {t('score_analysis_free.opportunity_value')}</p>
                            <p><strong className="text-slate-200">{t('score_analysis_free.potential_label')}:</strong> <span className="text-amber-400">{potential}</span></p>
                        </div>
                    </CardContent>
                </div>
                <div className="p-6 bg-slate-900/40 flex flex-col justify-center items-center text-center">
                    <h3 className="text-lg font-bold text-white mb-2">{t('score_analysis_free.unlock_title')}</h3>
                    <p className="text-slate-400 text-sm mb-4">{t('score_analysis_free.unlock_subtitle')}</p>
                    <Button onClick={onUpgrade} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-500/20">
                        <Unlock className="w-4 h-4 mr-2" />
                        {t('score_analysis_free.unlock_cta')}
                    </Button>
                </div>
            </div>
        </Card>
    )
};

const FreeDashboard = ({ profile, analysis, basicInfo, handleAction, title: welcomeTitle, subtitle: welcomeSubtitle, cta: welcomeCta, onDismiss }) => {
    const { t } = useTranslation('dashboard');
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(!!welcomeTitle);
    
    const handleUpgrade = () => {
        navigate('/compare-plans');
    };

    const handleBasicInfo = () => {
        navigate('/basic-info');
    };

    const percentage = profile.migratory_score || 42;
    const country = "Canadá";

    const ctaText = percentage < 60 ? t('free_dashboard.progress_bar_cta_improve') : t('free_dashboard.progress_bar_cta_unlock');

    const lockedFeatures = [
        { icon: Compass, titleKey: 'free_dashboard.locked_path_title', textKey: 'free_dashboard.free_path_desc', ctaKey: 'free_dashboard.locked_path_cta' },
        { icon: FileText, titleKey: 'free_dashboard.locked_docs_title', textKey: 'free_dashboard.locked_docs_text', ctaKey: 'free_dashboard.free_docs_cta' },
        { icon: Bot, titleKey: 'free_dashboard.locked_ai_title', textKey: 'free_dashboard.locked_ai_text', ctaKey: 'free_dashboard.free_support_cta' },
        { icon: FileDown, titleKey: 'free_dashboard.locked_report_title', textKey: 'free_dashboard.locked_report_text', ctaKey: 'free_dashboard.free_path_cta' },
        { icon: Briefcase, titleKey: 'free_dashboard.locked_lawyer_title', textKey: 'free_dashboard.locked_lawyer_text', ctaKey: 'free_dashboard.free_path_cta' },
    ];

    const handleDismissWelcome = () => {
        setShowWelcome(false);
        if(onDismiss) onDismiss();
    };

    if (!basicInfo) {
        return (
            <main className="flex-1 p-4 sm:p-8 flex items-center justify-center relative">
                <GridPattern color="rgba(139, 92, 246, 0.08)" />
                <BasicInfoBanner onAction={handleBasicInfo} />
            </main>
        );
    }

    const userName = basicInfo?.nombre_completo || profile?.full_name || 'Usuario';

    return (
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto relative">
            <GridPattern color="rgba(139, 92, 246, 0.08)" />
            {showWelcome && <WelcomeBanner title={welcomeTitle} subtitle={welcomeSubtitle} cta={welcomeCta} onDismiss={handleDismissWelcome} />}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <header className="text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                        {t('free_welcome_title', { name: userName })}
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-3xl mx-auto">{t('free_welcome_subtitle')}</p>
                </header>

                <ScoreAnalysisCard profile={profile} analysis={analysis} onUpgrade={handleUpgrade} />

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-200 mb-2">{t('free_dashboard.unlock_title')}</h2>
                    <p className="text-slate-400 mb-6">{t('free_dashboard.unlock_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lockedFeatures.map((feature, index) => (
                        <LockedFeatureCard 
                            key={index}
                            icon={feature.icon}
                            title={t(feature.titleKey)}
                            text={t(feature.textKey)}
                            cta={t(feature.ctaKey)}
                            onClick={handleUpgrade}
                            delay={0.2 + index * 0.1}
                        />
                    ))}
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + lockedFeatures.length * 0.1 }}
                        className="md:col-span-2 lg:col-span-3"
                    >
                        <div className="bg-gradient-to-r from-purple-600/80 to-indigo-600/80 p-6 rounded-lg text-center flex flex-col sm:flex-row items-center justify-between gap-4 hover-glow">
                            <div>
                                <h3 className="text-xl font-bold text-white">{t('free_dashboard.final_cta_title')}</h3>
                                <p className="text-purple-200">{t('free_dashboard.final_cta_subtitle')}</p>
                            </div>
                            <Button onClick={handleUpgrade} size="lg" className="bg-white text-purple-700 font-bold hover:bg-purple-100 flex-shrink-0">
                                {t('free_dashboard.final_cta_button')}
                            </Button>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </main>
    );
};

export default FreeDashboard;