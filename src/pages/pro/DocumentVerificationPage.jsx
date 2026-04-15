import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, ArrowLeft, Bot, Check, Clock, RefreshCw, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileUploadField from '@/components/pro/FileUploadField';
import KaiAssistantBubble from '@/components/KaiAssistantBubble';

const VerificationTimeline = () => {
    const { t } = useTranslation('pro_modules');
    const timelineEvents = [
        { label: t('docs_verification.timeline_events.uploaded'), status: 'completed' },
        { label: t('docs_verification.timeline_events.automated_analysis'), status: 'in_progress' },
        { label: t('docs_verification.timeline_events.professional_validation'), status: 'pending' },
        { label: t('docs_verification.timeline_events.legal_recommendation'), status: 'locked' },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <Check className="w-5 h-5 text-green-400" />;
            case 'in_progress': return <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />;
            case 'pending': return <Clock className="w-5 h-5 text-slate-400" />;
            case 'locked': return <Lock className="w-5 h-5 text-fuchsia-400" />;
            default: return null;
        }
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
                <CardTitle>{t('docs_verification.timeline_title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {timelineEvents.map((event, index) => (
                        <div key={event.label} className="flex items-start gap-4">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                    {getStatusIcon(event.status)}
                                </div>
                                {index < timelineEvents.length - 1 && (
                                    <div className="absolute left-1/2 top-10 h-8 w-px bg-slate-600 -translate-x-1/2" />
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{event.label}</p>
                                <p className="text-sm text-slate-400">{t(`docs_verification.status.${event.status}`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const DocumentVerificationPage = () => {
    const { t } = useTranslation('pro_modules');
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        toast({
            title: "Enviando documentos...",
            description: "Estamos procesando tu solicitud de validación.",
        });

        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "¡Documentos enviados!",
                description: "Recibirás una notificación cuando el análisis esté completo.",
                className: 'bg-green-500/10 border-green-500/50 text-white',
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white p-4 sm:p-8">
            <Helmet>
                <title>{t('docs_verification.title')}</title>
            </Helmet>
            <KaiAssistantBubble 
                message="Sube tus documentos aquí. Me aseguraré de que nuestro sistema los revise de forma segura y rápida."
                userType="pro"
            />
            <div className="max-w-7xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="absolute top-4 left-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
                </Button>

                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center my-12"
                >
                    <FileCheck className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-fuchsia-600 to-pink-600 p-3 rounded-full text-white" />
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">{t('docs_verification.title')}</h1>
                    <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">{t('docs_verification.subtitle')}</p>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <form onSubmit={handleSubmit}>
                            <Card className="bg-slate-800/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle>{t('docs_verification.form_title')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FileUploadField label={t('docs_verification.fields.passport')} />
                                    <FileUploadField label={t('docs_verification.fields.education_cert')} />
                                    <FileUploadField label={t('docs_verification.fields.language_cert')} />
                                    <FileUploadField label={t('docs_verification.fields.income_statement')} />
                                    <Button type="submit" size="lg" className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold" disabled={isSubmitting}>
                                        {isSubmitting ? "Enviando..." : t('docs_verification.upload_button')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </motion.div>

                    {/* Diagnosis and Timeline Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-8"
                    >
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader className="flex-row items-center gap-3 space-y-0">
                                <Bot className="w-6 h-6 text-fuchsia-400" />
                                <CardTitle>{t('docs_verification.diagnosis_title')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm bg-fuchsia-500/10 text-fuchsia-300 p-3 rounded-lg flex items-center gap-2">
                                    <span className="font-semibold">{t('docs_verification.diagnosis_status')}:</span>
                                    <span>{t('docs_verification.diagnosis_text')}</span>
                                </p>
                            </CardContent>
                        </Card>
                        <VerificationTimeline />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DocumentVerificationPage;