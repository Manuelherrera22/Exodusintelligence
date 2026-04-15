import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LandingSelectorPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    const pageVariants = {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 },
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.8,
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({ 
            opacity: 1, 
            y: 0, 
            transition: { 
                duration: 0.6, 
                ease: 'easeOut',
                delay: i * 0.2 + 0.6
            } 
        })
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen flex flex-col items-center justify-center p-4 bg-transparent relative overflow-hidden"
        >
            <Helmet>
                <title>{t('selector_page_title')}</title>
                <meta name="description" content={t('selector_page_description')} />
            </Helmet>
            <div className="aurora-background"></div>
            <div className="absolute top-4 right-4 z-20">
                <LanguageSwitcher />
            </div>
            <div className="text-center mb-12 max-w-3xl relative z-10">
                <motion.h1 
                    className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-gray-200 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    {t('selector_title')}
                </motion.h1>
                <motion.p 
                    className="text-lg md:text-xl text-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    {t('selector_subtitle')}
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
                <motion.div
                    custom={0}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="h-full glass-card p-8 flex flex-col items-center text-center rounded-2xl hover-glow">
                        <Briefcase className="w-12 h-12 mb-4 text-cyan-400" />
                        <h2 className="text-2xl font-bold mb-2 text-white">{t('selector_general_title')}</h2>
                        <p className="text-gray-400 mb-6 flex-grow">{t('selector_general_desc')}</p>
                        <Button onClick={() => navigate('/general')} size="lg" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20">
                            {t('selector_general_cta')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    custom={1}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="h-full glass-card p-8 flex flex-col items-center text-center rounded-2xl hover-glow border-purple-500/50">
                        <Star className="w-12 h-12 mb-4 text-purple-400" />
                        <h2 className="text-2xl font-bold mb-2 text-white">{t('selector_premium_title')}</h2>
                        <p className="text-gray-400 mb-6 flex-grow">{t('selector_premium_desc')}</p>
                        <Button onClick={() => navigate('/premium')} size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                            {t('selector_premium_cta')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LandingSelectorPage;