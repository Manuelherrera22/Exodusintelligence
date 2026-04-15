import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const KaiAssistantBubble = ({ message, ctaText, ctaLink, userType = 'premium' }) => {
    const { t } = useTranslation('common');
    const [isOpen, setIsOpen] = useState(false);
    const [hasBeenShown, setHasBeenShown] = useState(false);

    useEffect(() => {
        if (!hasBeenShown) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                setHasBeenShown(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [hasBeenShown]);

    const handleCTAClick = () => {
        // This can be extended to navigate or scroll
        console.log(`CTA clicked, link: ${ctaLink}`);
        setIsOpen(false);
    };

    const colorSchemes = {
        general: {
            gradient: 'from-blue-500 to-cyan-500',
            shadow: 'shadow-blue-500/30',
            border: 'border-blue-500/50',
            text: 'text-cyan-300'
        },
        premium: {
            gradient: 'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-500/30',
            border: 'border-amber-500/50',
            text: 'text-amber-300'
        },
        pro: {
            gradient: 'from-fuchsia-600 to-pink-600',
            shadow: 'shadow-fuchsia-500/30',
            border: 'border-fuchsia-500/50',
            text: 'text-fuchsia-300'
        },
        guest: {
            gradient: 'from-purple-600 to-indigo-600',
            shadow: 'shadow-purple-500/30',
            border: 'border-purple-500/50',
            text: 'text-purple-300'
        }
    };

    const theme = colorSchemes[userType] || colorSchemes.guest;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`w-80 bg-slate-800/80 backdrop-blur-md rounded-xl shadow-2xl ${theme.shadow} p-4 mb-4 border ${theme.border}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className={`font-bold ${theme.text}`}>Kai</p>
                                <p className="text-white text-sm mb-4">{message}</p>
                            </div>
                        </div>
                        {ctaText && (
                            <Button onClick={handleCTAClick} className={`w-full bg-gradient-to-r ${theme.gradient} text-white`}>
                                {ctaText}
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{ scale: isOpen ? 0.9 : 1 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`rounded-full h-16 w-16 bg-gradient-to-br ${theme.gradient} text-white shadow-2xl ${theme.shadow} hover:scale-110 transition-transform duration-300`}
                    size="icon"
                >
                    {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                </Button>
            </motion.div>
        </div>
    );
};

export default KaiAssistantBubble;