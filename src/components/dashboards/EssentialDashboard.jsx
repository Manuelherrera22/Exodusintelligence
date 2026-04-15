import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Compass, CheckCircle, RefreshCw, Clock, Lock, ArrowRight, Lightbulb, UploadCloud, BookOpen, GraduationCap, Gem, Sparkles } from 'lucide-react';
import KaiAssistantBubble from '@/components/KaiAssistantBubble';
import GridPattern from '@/components/GridPattern';
import { useSupabaseFunctions } from '@/hooks/useSupabaseFunctions.js';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import MigrationScoreGauge from '@/components/camino/MigrationScoreGauge';

const StepperItem = ({ label, status, isLast, tooltip, delay, onComplete, stepKey }) => {
    const { t } = useTranslation('dashboard');
    const statusConfig = {
        completed: { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20', line: 'bg-green-400' },
        in_progress: { icon: RefreshCw, color: 'text-amber-400', bgColor: 'bg-amber-500/20', line: 'bg-slate-600' },
        pending: { icon: Clock, color: 'text-slate-400', bgColor: 'bg-slate-700', line: 'bg-slate-600' },
        locked: { icon: Lock, color: 'text-purple-400', bgColor: 'bg-purple-500/20', line: 'bg-slate-600' }
    };
    const { icon: Icon, color, bgColor, line } = statusConfig[status];

    const content = (
        <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <div className={`relative w-12 h-12 rounded-full ${bgColor} flex items-center justify-center border border-white/10`}>
                <Icon className={`w-6 h-6 ${color} ${status === 'in_progress' ? 'animate-spin' : ''}`} />
            </div>
            <p className={`font-semibold text-lg ${status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>{label}</p>
            {status === 'pending' && (
                 <Button size="sm" variant="outline" className="ml-auto border-green-500 text-green-300 hover:bg-green-500/10" onClick={() => onComplete(stepKey)}>
                    Mark as Done
                </Button>
            )}
        </motion.div>
    );

    return (
        <div className="relative">
            {tooltip ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-white border-purple-500/50">
                            <p>{t(tooltip)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : content}
            {!isLast && <div className={`absolute left-6 top-14 h-12 w-0.5 ${line}`}></div>}
        </div>
    );
};

const TipItem = ({ text, cta, icon: Icon, onAction, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
    >
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/80 transition-colors border border-slate-700 hover:border-cyan-500/50">
            <div className="p-2 bg-cyan-500/10 rounded-md">
                <Icon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
            </div>
            <p className="text-sm text-slate-300 flex-grow">{text}</p>
            <Button size="sm" variant="ghost" className="text-cyan-300 hover:bg-cyan-500/20" onClick={onAction}>
                {cta} <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
        </div>
    </motion.div>
);

const ScoreAnalysisCardEssential = ({ profile, analysis, onUpgrade }) => {
    const { t } = useTranslation('dashboard');
    const navigate = useNavigate();
    const score = analysis?.puntaje_total;
    const country = analysis?.pais_sugerido || profile.target_country || "Canada";

    return (
        <Card className="bg-slate-800/50 border border-slate-700 backdrop-blur-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-700">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    {t('score_analysis_essential.title')}
                </CardTitle>
                {score && (
                    <CardDescription className="text-slate-400">
                        {t('score_analysis_essential.subtitle', { score, country })}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-6">
                {!score ? (
                    <div className="text-center">
                        <p className="text-slate-300 mb-4">
                            {t('score_analysis_essential.no_score_message_1')}
                            <br />
                            {t('score_analysis_essential.no_score_message_2')}
                        </p>
                        <Button
                            onClick={() => navigate('/update-profile')}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
                        >
                            {t('score_analysis_essential.complete_profile_cta')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="flex justify-center">
                            <MigrationScoreGauge score={score} size={180} />
                        </div>
                        <div className="text-center md:text-left bg-slate-900/40 p-6 rounded-lg border border-purple-500/20">
                            <h3 className="text-lg font-bold text-white mb-2">{t('score_analysis_essential.unlock_title')}</h3>
                            <p className="text-slate-400 text-sm mb-4">{t('score_analysis_essential.unlock_subtitle')}</p>
                            <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20">
                                <Gem className="w-4 h-4 mr-2" />
                                {t('score_analysis_essential.unlock_cta')}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

const EssentialDashboard = ({ profile, analysis, handleAction }) => {
    const { t } = useTranslation('dashboard');
    const navigate = useNavigate();
    const { user } = useAuth();
    const percentage = 46;

    const [steps, setSteps] = useState([
        { key: 'initial_evaluation', status: 'completed' },
        { key: 'language_level', status: 'in_progress' },
        { key: 'base_documentation', status: 'pending' },
        { key: 'visa_options', status: 'locked', tooltip: 'essential_dashboard.locked_tooltip' },
        { key: 'legal_roadmap', status: 'locked', tooltip: 'essential_dashboard.locked_tooltip' },
    ]);
    const { getSuggestion, suggestionData: suggestion, saveSuggestionLog, completeStep, unlockStep } = useSupabaseFunctions();

     useEffect(() => {
        const fetchSuggestion = async () => {
            if (!user?.id) return;

            const { data } = await getSuggestion({ user_id: user.id });
            if (data) {
                // Log that the suggestion was shown
                await saveSuggestionLog({
                    user_id: user.id,
                    suggestion: data.suggestion,
                    area: data.area,
                    score: data.score
                });
            }
        };
        fetchSuggestion();
    }, [user?.id]);
    
    const handleCompleteStep = async (stepKey) => {
        if (!user?.id) return;
        await completeStep({
            user_id: user.id,
            step: stepKey,
            evidencia: 'User marked as complete'
        });

        const { data: unlockedData } = await unlockStep({
            user_id: user.id, current_step: stepKey
        });
        
        // This is a mock update. In a real scenario, you'd fetch the new steps state from your backend.
        setSteps(prevSteps => prevSteps.map(s => s.key === stepKey ? {...s, status: 'completed'} : s));
    };

    const tips = [
        { textKey: 'essential_dashboard.tips_items.item1', ctaKey: 'essential_dashboard.tips_cta.upload', icon: UploadCloud },
        { textKey: 'essential_dashboard.tips_items.item2', ctaKey: 'essential_dashboard.tips_cta.guides', icon: BookOpen },
        { textKey: 'essential_dashboard.tips_items.item3', ctaKey: 'essential_dashboard.tips_cta.profile', icon: GraduationCap },
    ];

    const handleUpgrade = () => navigate('/payment/pro');

    return (
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto relative">
             <GridPattern color="rgba(251, 191, 36, 0.08)" />
             <KaiAssistantBubble 
                message={suggestion?.suggestion || t('kai_assistant.greeting', { ns: 'caminoMigratorio', name: profile.full_name || 'User' })}
                userType="premium"
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20">
                            <Compass className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                                {t('essential_dashboard.title')}
                            </h1>
                            <p className="text-slate-400">{t('essential_dashboard.subtitle')}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-300 self-start sm:self-center text-sm py-1 px-3">
                        {t('essential_dashboard.badge')}
                    </Badge>
                </header>

                <ScoreAnalysisCardEssential profile={profile} analysis={analysis} onUpgrade={handleUpgrade} />

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">{t('essential_dashboard.progress_card_title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Progress value={percentage} className="w-full [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500 h-3 rounded-full" />
                        <p className="text-sm text-slate-400 mt-3">{t('essential_dashboard.progress_card_text', { percentage })}</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-1 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" /> {t('essential_dashboard.stepper_title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {steps.map((step, index) => (
                                <StepperItem
                                    key={step.key}
                                    label={t(`essential_dashboard.steps.${step.key}`)}
                                    status={step.status}
                                    isLast={index === steps.length - 1}
                                    tooltip={step.tooltip}
                                    delay={0.2 + index * 0.1}
                                    onComplete={handleCompleteStep}
                                    stepKey={step.key}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                            <CardHeader className="flex-row items-center gap-3 space-y-0">
                                <Lightbulb className="w-6 h-6 text-cyan-400" />
                                <CardTitle>{t('essential_dashboard.tips_title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {tips.map((tip, index) => (
                                    <TipItem 
                                        key={tip.textKey}
                                        text={t(tip.textKey)}
                                        cta={t(tip.ctaKey)}
                                        icon={tip.icon}
                                        onAction={() => handleAction(t(tip.ctaKey))}
                                        delay={0.3 + index * 0.1}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card className="bg-gradient-to-br from-purple-600/30 to-blue-600/20 border-purple-500/50 text-center p-8 rounded-xl hover-glow">
                                <Gem className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{t('essential_dashboard.upgrade_cta_title')}</h3>
                                <p className="text-slate-300 mb-6 max-w-md mx-auto">{t('essential_dashboard.upgrade_cta_description')}</p>
                                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20" onClick={handleUpgrade}>
                                    {t('essential_dashboard.upgrade_cta_button')}
                                </Button>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default EssentialDashboard;