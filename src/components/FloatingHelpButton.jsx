import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const FloatingHelpButton = () => {
    const { toast } = useToast();
    const { t } = useTranslation('common');

    const handleClick = () => {
        toast({
            title: t('help_button_toast_title'),
            description: t('help_button_toast_desc'),
        });
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, duration: 0.5, type: 'spring' }}
            className="fixed bottom-6 right-6 z-50"
        >
            <Button
                onClick={handleClick}
                className="rounded-full h-16 w-16 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl shadow-purple-500/30 hover:scale-110 transition-transform duration-300"
                size="icon"
            >
                <MessageSquare className="w-8 h-8" />
            </Button>
        </motion.div>
    );
};

export default FloatingHelpButton;