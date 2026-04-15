import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Briefcase, Home, HeartPulse, BookOpen, Briefcase as BriefcaseBusiness, Car, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GridPattern from '@/components/GridPattern';
import KaiAssistantBubble from '@/components/KaiAssistantBubble';
import PlannerCard from '@/components/pro/PlannerCard';

const LifePlannerPage = () => {
    const { t } = useTranslation('life_planner');
    const navigate = useNavigate();
    const { toast } = useToast();
    const [selectedCountry, setSelectedCountry] = useState('es');

    const handleAction = (module) => {
        toast({
            title: `Abriendo planificador: ${module}`,
            description: "Esta función está en desarrollo y estará disponible pronto.",
        });
    };

    const plannerModules = [
        { id: 'housing', icon: Home },
        { id: 'health', icon: HeartPulse },
        { id: 'education', icon: BookOpen },
        { id: 'employment', icon: BriefcaseBusiness },
        { id: 'transport', icon: Car },
        { id: 'family', icon: Users },
    ];
    
    const countries = t('countries_list', { returnObjects: true });
    const countriesList = Array.isArray(countries) ? countries : [];


    return (
        <div className="min-h-screen w-full bg-slate-900 text-white p-4 sm:p-8 relative overflow-hidden">
            <Helmet>
                <title>{t('title')}</title>
            </Helmet>
            <GridPattern color="rgba(217, 70, 239, 0.08)" />
            <KaiAssistantBubble 
                message={t('kai_assistant_message')}
                userType="pro"
            />
            <div className="max-w-7xl mx-auto relative z-10">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="absolute top-4 left-4 text-slate-300 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_dashboard', { ns: 'dashboard' })}
                </Button>

                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center my-12"
                >
                    <Briefcase className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-fuchsia-600 to-pink-600 p-3 rounded-full text-white" />
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">{t('title')}</h1>
                    <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                            <label htmlFor="country-select" className="text-lg font-semibold text-slate-200 flex-shrink-0">{t('country_selector_label')}</label>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger id="country-select" className="w-full sm:w-auto flex-grow bg-slate-900/80 border-fuchsia-500/50 text-white">
                                    <SelectValue placeholder={t('country_selector_placeholder')} />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    {countriesList.map(country => (
                                        <SelectItem key={country.value} value={country.value} className="focus:bg-fuchsia-500/20">
                                            {country.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {plannerModules.map((module, index) => (
                        <PlannerCard
                            key={module.id}
                            icon={module.icon}
                            title={t(`cards.${module.id}.title`)}
                            subtitle={t(`cards.${module.id}.subtitle`)}
                            status={t(`cards.${module.id}.status`)}
                            onAction={() => handleAction(t(`cards.${module.id}.title`))}
                            delay={0.3 + index * 0.1}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LifePlannerPage;