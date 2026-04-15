import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Plane, BrainCircuit, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PersonalizedAnalysisCTA = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('exodus'); // Corrected namespace

    const benefits = [
        t('cta.benefit1'),
        t('cta.benefit2'),
        t('cta.benefit3'),
        t('cta.benefit4'),
    ];

    return (
        <section id="personalized-cta" className="py-20 bg-slate-900/50">
            <div className="container mx-auto px-4">
                <motion.div 
                    className="glass-card max-w-4xl mx-auto text-center p-8 sm:p-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <Plane className="w-8 h-8 text-cyan-400" />
                        <Compass className="w-8 h-8 text-purple-400" />
                        <BrainCircuit className="w-8 h-8 text-cyan-400" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        {t('cta.title')}
                    </h2>

                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                        {t('cta.subtitle')}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {benefits.map((benefit, index) => (
                            <motion.div 
                                key={index}
                                className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-center gap-2 text-sm"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            >
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span className="text-slate-300">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-slate-400 mb-8">{t('cta.text')}</p>

                    <Button 
                        size="lg" 
                        className="px-10 py-6 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-transform"
                        onClick={() => navigate('/register')}
                    >
                        {t('cta.button')}
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default PersonalizedAnalysisCTA;