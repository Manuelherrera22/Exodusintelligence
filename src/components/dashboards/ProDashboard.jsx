import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Map, Compass, FileText, BrainCircuit, ShieldCheck, Award, Sparkles, UserCheck, ArrowRight, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import GridPattern from '@/components/GridPattern';
import KaiAssistantBubble from '@/components/KaiAssistantBubble';
import { useSupabaseDashboard } from '@/hooks/useSupabaseDashboard.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import RouteSelectorWidget from '@/components/pro/RouteSelectorWidget';

const FeatureCard = ({ icon: Icon, title, description, ctaText, onAction, delay = 0, status, tooltipContent }) => {
    const { t } = useTranslation('dashboard');
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 300 }}
            className="bg-slate-800/50 p-6 rounded-2xl h-full flex flex-col justify-between border border-fuchsia-500/20 hover:border-fuchsia-500/50 transition-all cursor-pointer hover-glow"
            onClick={onAction}
        >
            <div>
                <div className="flex justify-between items-start">
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="p-3 bg-fuchsia-500/10 rounded-lg">
                                    <Icon className="w-8 h-8 text-fuchsia-400" />
                                </div>
                            </TooltipTrigger>
                            {tooltipContent && (
                               <TooltipContent className="bg-slate-800 text-white border-fuchsia-500/50 max-w-xs">
                                    <p>{tooltipContent}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>

                    {status && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-semibold flex items-center gap-1"><UserCheck size={12}/> {status}</span>}
                </div>
                <h3 className="text-xl font-bold mt-4 text-white">{title}</h3>
                <p className="text-gray-400 text-sm mt-1">{description}</p>
            </div>
            <Button variant="link" className="text-fuchsia-400 p-0 mt-4 justify-start hover:text-fuchsia-300">
                {ctaText} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </motion.div>
    );
};

const ScoreHistoryChart = ({ history, loading }) => {
    const { t } = useTranslation('dashboard');

    if (loading) return <div className="text-center text-slate-400 py-10">{t('loading', { ns: 'common' })}</div>;
    
    if (!history || history.length === 0) {
        return <div className="text-center text-slate-400 py-10">{t('score_history.no_data')}</div>;
    }

    const chartData = history.map(item => ({
        date: new Date(item.created_at).toLocaleDateString(),
        score: item.score
    })).reverse();

    return (
        <Card className="bg-slate-800/50 border-fuchsia-500/30 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>{t('score_history.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 70, 239, 0.1)" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                            borderColor: 'rgba(217, 70, 239, 0.5)',
                            borderRadius: '0.75rem'
                          }}
                          labelStyle={{ color: '#f8fafc' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '14px' }} />
                        <Line name={t('score_history.legend_score')} type="monotone" dataKey="score" stroke="#d946ef" strokeWidth={2} dot={{ r: 4, fill: '#d946ef' }} activeDot={{ r: 8, stroke: '#d946ef', strokeWidth: 2, fill: '#1e293b' }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

const ScoreBreakdownCard = ({ analysis, profile }) => {
    const { t } = useTranslation('dashboard');
    const loading = !analysis; // Simple loading state

    const scoreDetails = analysis?.score_details || {};
    const recommendedCountry = analysis?.pais_sugerido || profile.target_country || "Canada";
    const alternateCountries = analysis?.paises_alternativos || ["Australia", "New Zealand"];
    const keyRecommendation = analysis?.recomendacion_clave || t('score_breakdown.key_recommendation_value');

    return (
        <Card className="bg-slate-800/50 border-fuchsia-500/30 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                    {t('score_breakdown.title')}
                </CardTitle>
                 <CardDescription>{t('score_breakdown.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center p-8">{t('loading', { ns: 'common' })}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-3 text-slate-200">{t('score_breakdown.breakdown_title')}</h4>
                            <ul className="space-y-2 text-sm">
                                {Object.entries(scoreDetails).map(([key, value]) => (
                                    <li key={key} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md">
                                        <span className="capitalize text-slate-300">{t(`score_breakdown.categories.${key}`, key)}</span>
                                        <span className="font-bold text-fuchsia-300">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-200">{t('score_breakdown.recommended_country_label')}</h4>
                                <p className="text-green-400 font-bold text-lg">{recommendedCountry}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200">{t('score_breakdown.alternate_countries_label')}</h4>
                                <p className="text-slate-300">{alternateCountries.join(', ')}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200">{t('score_breakdown.key_recommendation_label')}</h4>
                                <p className="text-slate-300">{keyRecommendation}</p>
                            </div>
                             <div className="pt-4 space-y-2">
                                <Button variant="outline" className="w-full border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-500/10">
                                    {t('score_breakdown.download_report_cta')}
                                </Button>
                                <Button variant="ghost" className="w-full text-slate-400 hover:bg-slate-700/50">
                                    {t('score_breakdown.contact_expert_cta')}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

const ProDashboard = ({ profile: initialProfile, analysis: initialAnalysis, onAction }) => {
    const { t } = useTranslation(['dashboard', 'life_planner', 'pro_modules']);
    const navigate = useNavigate();
    const { profile, analysis, scoreHistory, loading } = useSupabaseDashboard(initialProfile);
    
    const getScoreColor = (score) => {
        if (score < 40) return "text-yellow-400";
        if (score < 70) return "text-blue-400";
        return "text-green-400";
    };

    const getRiskLevel = (score) => {
        if (score < 40) return t('free_score_risk_low');
        if (score < 70) return t('free_score_risk_medium');
        return t('free_score_risk_high');
    };

    const handleNavigation = (path) => {
        navigate(path);
    };
    
    return (
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto relative">
            <GridPattern color="rgba(217, 70, 239, 0.08)" />
            <KaiAssistantBubble 
                message={t('kai_assistant.pro_greeting')}
                userType="pro"
            />
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white text-center py-2 text-sm font-bold shadow-lg shadow-fuchsia-500/20">
                {t('dashboard_pro.badge_plan_active')}
            </div>
            
            <motion.div 
                className="mt-12 space-y-8"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        opacity: 1,
                        transition: {
                            when: "beforeChildren",
                            staggerChildren: 0.1,
                        },
                    },
                    hidden: { opacity: 0 },
                }}
            >
                <header className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                        {t('essential_welcome_title', { name: profile.full_name || 'Usuario' })}
                    </h1>
                    <p className="text-gray-400 text-lg mt-2">{t('dashboard_pro.welcome_subtitle')}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                     <motion.div 
                        className="lg:col-span-1 flex flex-col gap-8"
                        variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    >
                        <Card className="bg-slate-800/50 border-fuchsia-500/30 backdrop-blur-sm text-center">
                            <CardHeader>
                                <CardTitle>{t('free_score_title')}</CardTitle>
                                <CardDescription>{t('dashboard_pro.score_description')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-8xl font-bold ${getScoreColor(profile.migratory_score)}`}>
                                    {profile.migratory_score}
                                </div>
                                <div className="font-semibold text-lg">{getRiskLevel(profile.migratory_score)}</div>
                                 <Progress value={profile.migratory_score} className="mt-4 h-2 [&>div]:bg-gradient-to-r from-fuchsia-500 to-pink-500" />
                            </CardContent>
                        </Card>
                        <ScoreHistoryChart history={scoreHistory} loading={loading} />
                    </motion.div>

                    <ScoreBreakdownCard profile={profile} analysis={analysis} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <FeatureCard
                        icon={Compass}
                        title={t('dashboard_essential.title')}
                        description={t('dashboard_pro.path_unlocked')}
                        ctaText={t('dashboard_pro.path_cta')}
                        onAction={() => navigate('/my-migration-route')}
                        delay={0.1}
                        status={t('dashboard_pro.status_active')}
                        tooltipContent={t('dashboard_pro.tooltip_path')}
                    />
                    <FeatureCard
                        icon={Briefcase}
                        title={t('life_planner:title')}
                        description={t('life_planner:description')}
                        ctaText={t('life_planner:cta')}
                        onAction={() => navigate('/pro/life-planner')}
                        delay={0.2}
                        status={t('dashboard_pro.status_active')}
                        tooltipContent={t('life_planner:tooltip')}
                    />
                    <FeatureCard
                        icon={FileText}
                        title={t('pro_modules:docs_verification.title')}
                        description={t('pro_modules:docs_verification.desc')}
                        ctaText={t('pro_modules:docs_verification.cta')}
                        onAction={() => navigate('/pro/document-verification')}
                        delay={0.3}
                        status={t('pro_modules:docs_verification.status')}
                        tooltipContent={t('dashboard_pro.tooltip_docs')}
                    />
                    <FeatureCard
                        icon={BrainCircuit}
                        title={t('pro_modules:ai_alerts.title')}
                        description={t('pro_modules:ai_alerts.desc')}
                        ctaText={t('pro_modules:ai_alerts.cta')}
                        onAction={() => navigate('/alerts')}
                        delay={0.4}
                        status={t('pro_modules:ai_alerts.status')}
                        tooltipContent={t('dashboard_pro.tooltip_ai')}
                    />
                     <FeatureCard
                        icon={ShieldCheck}
                        title={t('pro_modules:priority_support.title')}
                        description={t('pro_modules:priority_support.desc')}
                        ctaText={t('pro_modules:priority_support.cta')}
                        onAction={() => navigate('/support')}
                        delay={0.5}
                        status={t('dashboard_pro.status_active')}
                        tooltipContent={t('dashboard_pro.tooltip_support')}
                    />
                     <FeatureCard
                        icon={Award}
                        title={t('pro_modules:exclusive_benefits.title')}
                        description={t('pro_modules:exclusive_benefits.desc')}
                        ctaText={t('pro_modules:exclusive_benefits.cta')}
                        onAction={() => navigate('/benefits')}
                        delay={0.6}
                        status={t('dashboard_pro.status_active')}
                        tooltipContent={t('dashboard_pro.tooltip_benefits')}
                    />
                </div>
                
                <motion.div 
                    className="text-center bg-gradient-to-r from-fuchsia-600/10 to-pink-600/10 p-8 rounded-2xl border border-fuchsia-500/30 hover-glow"
                    variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                >
                    <h3 className="text-2xl font-bold mb-2 text-white">
                        <Sparkles className="w-6 h-6 inline-block mr-2 text-fuchsia-400" />
                        {t('cta_pro_footer.title')}
                    </h3>
                    <p className="text-slate-400 mb-6 max-w-xl mx-auto">{t('cta_pro_footer.subtitle')}</p>
                    <Button onClick={() => navigate('/my-migration-route')} size="lg" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold shadow-lg shadow-fuchsia-500/20">
                        {t('cta_pro_footer.button')}
                    </Button>
                </motion.div>
            </motion.div>
            <RouteSelectorWidget />
        </div>
    );
};

export default ProDashboard;