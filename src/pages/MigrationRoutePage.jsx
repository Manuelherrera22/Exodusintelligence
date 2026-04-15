import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, FileText, Flag, GraduationCap, HeartPulse, Lightbulb, Lock, MapPin, Milestone } from 'lucide-react';
import VideoBackgroundHeader from '@/components/VideoBackgroundHeader';
import KaiAssistantBubble from '@/components/KaiAssistantBubble';

const StepCard = ({ step, index, totalSteps }) => {
    const { t } = useTranslation('dashboard');
    const isLocked = step.status === 'Bloqueado';
    const isCompleted = step.status === 'Completado';
    const isInProgress = step.status === 'En progreso';

    const getStatusColor = () => {
        if (isCompleted) return 'bg-green-500/10 text-green-300 border-green-500/30';
        if (isInProgress) return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
        if (isLocked) return 'bg-slate-800/50 text-gray-400 border-slate-700/50';
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    };

    const getIcon = () => {
        switch(index) {
            case 0: return <Flag className="w-6 h-6" />;
            case 1: return <FileText className="w-6 h-6" />;
            case 2: return <GraduationCap className="w-6 h-6" />;
            case 3: return <HeartPulse className="w-6 h-6" />;
            case 4: return <MapPin className="w-6 h-6" />;
            case 5: return <Milestone className="w-6 h-6" />;
            default: return <CheckCircle className="w-6 h-6" />;
        }
    };

    return (
        <motion.div 
            className="relative pl-12 pb-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {index < totalSteps - 1 && <div className="absolute left-[22px] top-5 h-full w-0.5 bg-slate-700"></div>}
            
            <div className={`absolute left-0 top-0 flex items-center justify-center w-11 h-11 rounded-full ${getStatusColor().replace('text-','bg-').split(' ')[0]}`}>
                {isLocked ? <Lock className="w-5 h-5 text-gray-400" /> : getIcon()}
            </div>

            <div className={`ml-4 p-6 rounded-2xl transition-all duration-300 glass-card ${getStatusColor()} ${isLocked ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <Badge variant="outline" className={getStatusColor()}>{step.status}</Badge>
                </div>
                <div className="text-sm space-y-3">
                    {step.summary && <p>{step.summary}</p>}
                    {step.pending && <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-400" /> {step.pending}</p>}
                    {step.uploaded && <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> {step.uploaded}</p>}
                    {step.recommendation && <p>{step.recommendation} <a href="#" className="text-cyan-400 hover:underline">Link</a></p>}
                    {step.note && <p>{step.note}</p>}
                </div>
                {step.ai_recommendation && (
                    <div className="mt-4 p-3 bg-slate-900/50 rounded-lg flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                        <p className="text-xs text-amber-200">{step.ai_recommendation}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const MigrationRoutePage = () => {
    const { t } = useTranslation('dashboard');
    const navigate = useNavigate();

    const routeData = t('migration_route', { returnObjects: true });

    // Check if translation data is available before rendering
    if (!routeData || !routeData.steps) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                {t('loading', { ns: 'common' })}...
            </div>
        );
    }

    const steps = Object.values(routeData.steps).filter(v => typeof v === 'object');

    return (
        <>
            <Helmet>
                <title>{routeData.page_title}</title>
                <meta name="description" content={routeData.page_description} />
            </Helmet>
            <div className="min-h-screen bg-slate-950 text-white">
                <VideoBackgroundHeader
                    videoUrl="https://assets.mixkit.co/videos/preview/mixkit-world-map-with-a-grid-and-glowing-dots-1175-large.mp4"
                    posterUrl="https://images.unsplash.com/photo-1571390689710-c1c4d41a83bc?w=1920&q=80"
                    title={routeData.emotional_banner_title}
                    subtitle={routeData.emotional_banner_desc}
                />

                <div className="max-w-4xl mx-auto p-4 sm:p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-8">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {routeData.back_to_dashboard}
                        </Button>
                    </motion.div>

                    <div className="relative">
                        {steps.map((step, index) => (
                            <StepCard key={index} step={step} index={index} totalSteps={steps.length} />
                        ))}
                    </div>

                    <motion.div 
                        className="mt-8 p-4 bg-slate-800/50 rounded-lg text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: steps.length * 0.1 + 0.5 }}
                    >
                        <p className="text-sm text-gray-400">{routeData.steps.alerts}</p>
                    </motion.div>
                </div>
                <KaiAssistantBubble 
                    message="👋 ¡Hola! Soy Kai. Esta es tu ruta personalizada. ¿Necesitas ayuda con algún paso?"
                    userType="premium"
                />
            </div>
        </>
    );
};

export default MigrationRoutePage;