import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LockedFeaturesCard = () => {
    const { t } = useTranslation('caminoMigratorio');
    const navigate = useNavigate();
    const features = Object.values(t('locked_features.features', { returnObjects: true }));

    const handleUpgrade = () => {
        navigate('/compare-plans');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Card className="bg-gradient-to-br from-purple-900/50 via-slate-900 to-slate-900 border-purple-600/50 h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg text-purple-300">{t('locked_features.title')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6 flex-grow">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-slate-400">
                                <Lock size={14} className="text-purple-400 flex-shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                    <Button onClick={handleUpgrade} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-base py-6 mt-auto">
                         <Star size={16} className="mr-2" /> {t('locked_features.cta_button.text')}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default LockedFeaturesCard;