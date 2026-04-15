import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ExternalLink, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SuggestedActionsCard = ({ onAction }) => {
    const { t } = useTranslation('caminoMigratorio');
    const actions = Object.values(t('suggested_actions.actions', { returnObjects: true }));
    const motivational_phrase = t('suggested_actions.motivational_phrase');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Card className="bg-slate-800/60 border-slate-700 h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-cyan-400">{t('suggested_actions.title')}</CardTitle>
                    <Lightbulb className="w-5 h-5 text-cyan-400" />
                </CardHeader>
                <CardContent>
                    <div className="p-3 mb-4 text-center bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <Sparkles className="w-4 h-4 text-cyan-300 inline-block mr-2" />
                        <span className="text-sm text-cyan-200 italic">{motivational_phrase}</span>
                    </div>
                    <ul className="space-y-3">
                        {actions.map((action, index) => (
                             <li key={index} className="flex items-center justify-between text-sm p-2 bg-slate-700/50 rounded-md">
                                <span className="text-slate-300">{action}</span>
                                <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300" onClick={() => onAction(action)}>
                                    {t('suggested_actions.cta')} <ExternalLink size={14} className="ml-2" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SuggestedActionsCard;