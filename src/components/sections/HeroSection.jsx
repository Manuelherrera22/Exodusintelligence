import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Briefcase, Star, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const { t } = useTranslation(['general', 'common']);
    const navigate = useNavigate();

    const handleCTAClick = () => {
        const simulator = document.querySelector('#simulator');
        if (simulator) {
            simulator.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative flex items-center justify-center px-4 pt-32 pb-20 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-5xl mx-auto relative z-10"
            >
                <motion.h1
                    className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-purple-100 to-slate-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    {t('general:s1_title', 'Descubre tu Destino Ideal')}
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    {t('general:s1_subtitle', 'IA predictiva y asesoría legal para guiar tu estrategia migratoria global de forma segura y transparente.')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    {/* Free / AI Evaluation Path */}
                    <div className="w-full md:w-auto">
                        <Button
                            onClick={() => navigate('/register')}
                            className="w-full md:w-auto h-auto py-4 px-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(8,145,178,0.3)] transition-all hover:scale-105 border border-cyan-400/20 flex flex-col items-center"
                        >
                            <div className="flex items-center text-lg font-bold">
                                <Briefcase className="w-6 h-6 mr-3" />
                                Evaluación IA Gratuita
                            </div>
                            <span className="text-xs text-cyan-100 mt-1 font-normal">Obtén tu historial migratorio instantáneo</span>
                        </Button>
                    </div>

                    {/* Premium / Legal Audit Path */}
                    <div className="w-full md:w-auto">
                        <Button
                            onClick={() => navigate('/premium')}
                            variant="outline"
                            className="w-full md:w-auto h-auto py-4 px-8 rounded-full bg-slate-900/50 hover:bg-purple-900/40 text-purple-300 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all hover:scale-105 border flex flex-col items-center"
                        >
                            <div className="flex items-center text-lg font-bold text-white">
                                <Star className="w-6 h-6 mr-3 text-purple-400" />
                                Auditoría Legal Premium
                            </div>
                            <span className="text-xs text-purple-200 mt-1 font-normal">Acompañamiento legal avanzado</span>
                        </Button>
                    </div>
                </motion.div>

                {/* Scroll to Simulator anchor */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16"
                >
                    <button 
                        onClick={handleCTAClick}
                        className="text-slate-400 hover:text-white flex flex-col items-center mx-auto transition-colors group"
                    >
                        <span className="text-sm mb-2 uppercase tracking-widest">O explora el simulador de destinos</span>
                        <Search className="w-6 h-6 animate-bounce text-purple-400 group-hover:text-purple-300" />
                    </button>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default HeroSection;