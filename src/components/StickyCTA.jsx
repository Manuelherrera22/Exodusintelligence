import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const StickyCTA = () => {
    const { t } = useTranslation('general');
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg p-3 border-t border-slate-700 z-40"
                >
                    <div className="max-w-4xl mx-auto flex items-center justify-center">
                        <Button
                            onClick={() => navigate('/registro')}
                            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                        >
                            {t('sticky_cta_text')}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyCTA;