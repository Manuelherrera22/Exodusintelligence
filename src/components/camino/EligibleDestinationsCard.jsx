import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Tag = ({ status, text, tooltipText }) => {
    const styles = {
        'Casi elegible': 'bg-amber-500/20 text-amber-400',
        'Residencia inmediata por nacionalidad': 'bg-green-500/20 text-green-400',
        'No elegible aún': 'bg-red-500/20 text-red-400',
        'Pre-aprobación parcial': 'bg-cyan-400/20 text-cyan-300 animate-pulse',
    };
    const icons = {
        'Casi elegible': <AlertTriangle size={12} />,
        'Residencia inmediata por nacionalidad': <CheckCircle size={12} />,
        'No elegible aún': <Lock size={12} />,
        'Pre-aprobación parcial': <CheckCircle size={12} />,
    };

    const content = (
         <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${styles[status]}`}>
            {icons[status]}
            {text}
        </span>
    );
    
    if (tooltipText) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-slate-700">
                        <p>{tooltipText}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return content;
};

const EligibleDestinationsCard = () => {
    const { t } = useTranslation('caminoMigratorio');
    const destinations = Object.values(t('eligible_destinations.destinations', { returnObjects: true }));
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Card className="bg-slate-800/60 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-purple-400">{t('eligible_destinations.title')}</CardTitle>
                    <Globe className="w-5 h-5 text-purple-400" />
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                       {destinations.map((dest, index) => (
                           <li key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                               <span className="font-bold text-slate-200">{dest.country}</span>
                               <Tag status={dest.status} text={dest.status} tooltipText={dest.tooltip} />
                           </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default EligibleDestinationsCard;