import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FloatingChat = () => {
    const { t } = useTranslation('general');
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
            setIsInitialLoad(false);
        }, 3000); 

        return () => clearTimeout(timer);
    }, []);

    const handleAnalysisClick = () => {
        const simulator = document.querySelector('#simulator');
        if (simulator) {
            simulator.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-72 bg-slate-800 rounded-xl shadow-2xl shadow-purple-900/30 p-4 mb-4 border border-slate-700"
                    >
                        <p className="text-white text-sm mb-4">{t('chat_welcome')}</p>
                        <Button onClick={handleAnalysisClick} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                            {t('chat_cta')}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{ scale: isOpen ? 0.8 : 1 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-full h-16 w-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl shadow-purple-500/30 hover:scale-110 transition-transform duration-300"
                    size="icon"
                >
                    {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                </Button>
            </motion.div>
        </div>
    );
};

export default FloatingChat;