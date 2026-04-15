import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Save, Sparkles, X } from 'lucide-react';
import { useRoutePreferences } from '@/hooks/useRoutePreferences';
import { useToast } from '@/components/ui/use-toast';

const RouteSelectorWidget = () => {
    const { t } = useTranslation('dashboard');
    const { toast } = useToast();
    const {
        countries,
        loading,
        saving,
        savePreferences,
        initialPreferences
    } = useRoutePreferences();

    const [isOpen, setIsOpen] = useState(false);
    const [primaryRoute, setPrimaryRoute] = useState('');
    const [alternative1, setAlternative1] = useState('');
    const [alternative2, setAlternative2] = useState('');

    useEffect(() => {
        if (initialPreferences) {
            setPrimaryRoute(initialPreferences.primary || '');
            setAlternative1(initialPreferences.alternatives?.[0] || '');
            setAlternative2(initialPreferences.alternatives?.[1] || '');
        }
    }, [initialPreferences]);

    const handleSave = async () => {
        const alternatives = [alternative1, alternative2].filter(Boolean);
        const { success, error } = await savePreferences(primaryRoute, alternatives);

        if (success) {
            toast({
                title: t('route_selector.success_title'),
                description: t('route_selector.success_description'),
                variant: "success",
            });
            setIsOpen(false);
        } else {
            toast({
                title: t('route_selector.error_title'),
                description: error || t('route_selector.error_description'),
                variant: "destructive",
            });
        }
    };

    const availableAlternatives1 = countries.filter(c => c.value !== primaryRoute);
    const availableAlternatives2 = countries.filter(c => c.value !== primaryRoute && c.value !== alternative1);

    const widgetVariants = {
        closed: { opacity: 0, y: 50, scale: 0.9 },
        open: { opacity: 1, y: 0, scale: 1 }
    };

    return (
        <>
            <motion.div
                className="fixed bottom-8 right-8 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
            >
                <Button
                    size="lg"
                    className="rounded-full p-4 h-16 w-16 bg-gradient-to-br from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/30 hover:scale-110 transition-transform duration-300 animate-pulse-slow"
                    onClick={() => setIsOpen(true)}
                >
                    <MapPin className="h-8 w-8" />
                </Button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            variants={widgetVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className="w-[350px] bg-slate-900/80 border-fuchsia-500/50 backdrop-blur-lg shadow-2xl shadow-fuchsia-500/20">
                                <CardHeader className="text-center">
                                    <Sparkles className="w-10 h-10 mx-auto text-fuchsia-400 bg-fuchsia-500/10 p-2 rounded-full" />
                                    <CardTitle className="text-white">{t('route_selector.title')}</CardTitle>
                                    <CardDescription>{t('route_selector.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-32">
                                            <Loader2 className="w-8 h-8 animate-spin text-fuchsia-400" />
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-slate-300">{t('route_selector.primary_label')}</label>
                                                <Select value={primaryRoute} onValueChange={setPrimaryRoute}>
                                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                        <SelectValue placeholder={t('route_selector.placeholder')} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                        {countries.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-300">{t('route_selector.alternative1_label')}</label>
                                                <Select value={alternative1} onValueChange={setAlternative1} disabled={!primaryRoute}>
                                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                        <SelectValue placeholder={t('route_selector.placeholder')} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                        {availableAlternatives1.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-300">{t('route_selector.alternative2_label')}</label>
                                                <Select value={alternative2} onValueChange={setAlternative2} disabled={!primaryRoute || !alternative1}>
                                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                        <SelectValue placeholder={t('route_selector.placeholder')} />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                                        {availableAlternatives2.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}
                                    <Button onClick={handleSave} disabled={saving || loading || !primaryRoute} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold">
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        {t('route_selector.save_cta')}
                                    </Button>
                                </CardContent>
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default RouteSelectorWidget;