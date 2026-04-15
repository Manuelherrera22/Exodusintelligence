import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flag, Map } from 'lucide-react';

const RouteHeader = ({ country, visaType, timeline }) => {
    const { t } = useTranslation('my_migration_route');

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/50 p-6 rounded-2xl border border-fuchsia-500/30 backdrop-blur-sm"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                        {t('header.title')}
                    </h1>
                    <p className="text-slate-400 mt-1">{t('header.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20 text-sm py-1 px-3">
                        <Map className="w-4 h-4 mr-2" />
                        {country}
                    </Badge>
                </div>
            </div>
            <div className="mt-6 border-t border-slate-700/50 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-fuchsia-400" />
                    <span><strong>{t('header.recommended_visa')}:</strong> {visaType}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-fuchsia-400" />
                    <span><strong>{t('header.estimated_timeline')}:</strong> {timeline}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default RouteHeader;