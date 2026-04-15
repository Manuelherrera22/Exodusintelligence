import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { countryData } from '@/data/countries';
import { CheckCircle, XCircle, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UsaVisaModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const usaData = countryData.US;

    const handleCTAClick = () => {
        onClose();
        navigate('/registro');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[625px] bg-slate-900/80 backdrop-blur-lg border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                        <span className="text-4xl">{usaData.flag}</span>
                        {t('map_country_estados unidos')}
                    </DialogTitle>
                    <DialogDescription className="text-amber-300 font-semibold pt-2">
                        🔥 {t('map_usa_tagline')}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                            <TabsTrigger value="overview">{t('map_usa_tab_overview')}</TabsTrigger>
                            <TabsTrigger value="visas">{t('map_usa_tab_visas')}</TabsTrigger>
                            <TabsTrigger value="pros_cons">{t('map_usa_tab_pros_cons')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <p className="text-gray-300 mb-4">{t('map_usa_overview_text')}</p>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(usaData.details).map(([key, value]) => (
                                    <div key={key} className="bg-slate-800 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">{t(key)}</p>
                                        <p className="font-semibold">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="visas" className="mt-4">
                             <h4 className="font-semibold text-lg mb-2 text-purple-300">{t('map_usa_accessible_visas_title')}</h4>
                             <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
                                {usaData.visaInfo.accessibleVisas.map(v => <li key={v}>{v}</li>)}
                             </ul>
                             <h4 className="font-semibold text-lg mb-2 text-cyan-300">{t('map_usa_alternative_routes_title')}</h4>
                             <ul className="list-disc list-inside space-y-1 text-gray-300">
                                {usaData.visaInfo.alternativeRoutes.map(r => <li key={r}>{r}</li>)}
                             </ul>
                        </TabsContent>
                        <TabsContent value="pros_cons" className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-green-400">{t('map_usa_benefits_title')}</h4>
                                    <ul className="space-y-2">
                                        {usaData.visaInfo.benefits.map(b => <li key={b} className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" /><span>{b}</span></li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-red-400">{t('map_usa_challenges_title')}</h4>
                                    <ul className="space-y-2">
                                        {usaData.visaInfo.challenges.map(c => <li key={c} className="flex items-start gap-2"><XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" /><span>{c}</span></li>)}
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="mt-4">
                    <Button onClick={handleCTAClick} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-6">
                        {t('map_usa_cta')} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UsaVisaModal;