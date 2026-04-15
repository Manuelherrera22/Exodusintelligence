import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, GitBranch, Lightbulb, Loader2, AlertTriangle, Info, Clock, ServerCrash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GridPattern from '@/components/GridPattern';
import RouteHeader from '@/components/pro/RouteHeader';
import MigrationStepCard from '@/components/pro/MigrationStepCard';
import { useMigrationRoute } from '@/hooks/useMigrationRoute';
import { useToast } from '@/components/ui/use-toast';
import NoRouteAssigned from '@/components/pro/NoRouteAssigned';

const MyMigrationRoutePage = () => {
    const { t } = useTranslation('my_migration_route');
    const navigate = useNavigate();
    const { toast } = useToast();
    const { 
        steps, 
        alerts, 
        alternatives, 
        routeInfo,
        loading, 
        loadingMarkStep,
        error,
        noRouteAssigned,
        completeStep 
    } = useMigrationRoute();
    
    const handleCompleteStep = async (paso_id) => {
        const { success, error } = await completeStep(paso_id);
        if (success) {
            toast({
                title: t('toast.step_completed_title'),
                description: t('toast.step_completed_desc'),
                className: 'bg-green-500/10 border-green-500/50 text-white',
            });
        } else {
             toast({
                variant: "destructive",
                title: t('toast.error_title'),
                description: error.message || t('toast.error_desc'),
            });
        }
    };

    const getAlertIcon = (criticality) => {
        switch (criticality) {
            case 'alta': return <AlertTriangle className="h-5 w-5 mt-1 text-red-400 flex-shrink-0" />;
            case 'media': return <Clock className="h-5 w-5 mt-1 text-yellow-400 flex-shrink-0" />;
            default: return <Info className="h-5 w-5 mt-1 text-blue-400 flex-shrink-0" />;
        }
    };
    
    if (loading && steps.length === 0 && !noRouteAssigned) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
                <Loader2 className="w-12 h-12 animate-spin text-fuchsia-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-200">{t('loading_state.title')}</h2>
                <p className="text-slate-400">{t('loading_state.subtitle')}</p>
            </div>
        )
    }

    if (noRouteAssigned) {
        return <NoRouteAssigned />;
    }
    
    if (error) {
         return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center">
                <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-red-400">{t('error_state.title')}</h2>
                <p className="text-slate-400 max-w-md">{t('error_state.subtitle')}</p>
                <p className="text-xs text-slate-500 mt-2">{error}</p>
                 <Button onClick={() => navigate('/dashboard')} className="mt-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('back_to_dashboard')}
                </Button>
            </div>
        )
    }

    return (
        <>
            <Helmet>
                <title>{t('page_title')}</title>
                <meta name="description" content={t('page_description')} />
            </Helmet>
            <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 relative overflow-hidden">
                <GridPattern color="rgba(217, 70, 239, 0.08)" />
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 text-fuchsia-300 hover:text-fuchsia-200 hover:bg-fuchsia-500/10">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('back_to_dashboard')}
                        </Button>
                        <RouteHeader 
                            country={routeInfo?.pais || 'Destino'} 
                            visaType={routeInfo?.tipo_visa || 'Visa'} 
                            timeline={routeInfo?.plazo_estimado || 'N/A'}
                        />
                    </motion.div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="relative pl-8">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700"></div>
                                {steps.map((step, index) => (
                                    <MigrationStepCard
                                        key={step.id}
                                        step={step}
                                        index={index}
                                        onCompleteStep={handleCompleteStep}
                                        isLoading={loadingMarkStep}
                                    />
                                ))}
                            </div>
                        </div>

                        <aside className="lg:col-span-1 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className="bg-slate-800/50 border-fuchsia-500/30 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Lightbulb className="text-yellow-400" />
                                            {t('smart_alerts.title')}
                                        </CardTitle>
                                        <CardDescription>{t('smart_alerts.subtitle')}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4 text-sm">
                                            {alerts.length > 0 ? alerts.map(alert => (
                                                <li key={alert.id} className="flex items-start gap-3">
                                                    {getAlertIcon(alert.criticidad)}
                                                    <span><strong>{alert.titulo}:</strong> {alert.descripcion}</span>
                                                </li>
                                            )) : (
                                                <li className="text-slate-400">{t('smart_alerts.no_alerts')}</li>
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <GitBranch className="text-blue-400" />
                                            {t('alternative_routes.title')}
                                        </CardTitle>
                                        <CardDescription>{t('alternative_routes.subtitle')}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {alternatives.length > 0 ? (
                                            <ul className="space-y-2 text-sm">
                                                {alternatives.map(alt => (
                                                    <li key={alt.id}>
                                                        <Badge variant="outline" className="border-blue-400/50 text-blue-300">{alt.nombre_ruta}</Badge>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                             <p className="text-slate-400 text-sm">{t('alternative_routes.no_alternatives')}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyMigrationRoutePage;