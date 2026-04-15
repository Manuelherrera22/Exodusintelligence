import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MissingRequirementsCard = ({ onAction }) => {
    const { t } = useTranslation('caminoMigratorio');

    const items = Object.values(t('missing_requirements.items', { returnObjects: true }));
    const tooltipText = t('missing_requirements.tooltip');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className="bg-slate-800/60 border-slate-700 h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-amber-400">{t('missing_requirements.title')}</CardTitle>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-5 h-5 text-amber-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-white border-amber-500/50">
                                <p>{tooltipText}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-amber-200/70 mb-4 bg-amber-500/10 p-2 rounded-md border border-amber-500/20">{t('missing_requirements.alert')}</p>
                    <ul className="space-y-3">
                        {items.map((item, index) => (
                            <li key={index} className="flex items-center justify-between text-sm p-2 bg-slate-700/50 rounded-md">
                                <span className="text-slate-300">{item.text}</span>
                                <span className="font-bold text-green-400 flex items-center gap-1">
                                    <PlusCircle size={14} /> {item.points}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MissingRequirementsCard;