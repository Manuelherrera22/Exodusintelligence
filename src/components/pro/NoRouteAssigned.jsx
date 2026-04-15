import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Map, ArrowRight } from 'lucide-react';
import GridPattern from '@/components/GridPattern';

const NoRouteAssigned = () => {
    const { t } = useTranslation('my_migration_route');
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
             <GridPattern color="rgba(217, 70, 239, 0.08)" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-slate-800/50 backdrop-blur-lg border border-fuchsia-500/30 rounded-2xl p-8 sm:p-12 text-center max-w-2xl z-10"
            >
                <div className="w-20 h-20 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-fuchsia-500/20">
                    <Map className="w-10 h-10 text-fuchsia-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">{t('no_route_assigned.title')}</h1>
                <p className="text-slate-400 mb-8">{t('no_route_assigned.description')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                        size="lg" 
                        onClick={() => navigate('/options-map')} 
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold shadow-lg shadow-fuchsia-500/20"
                    >
                        {t('no_route_assigned.cta_select')} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                     <Button 
                        size="lg" 
                        variant="outline"
                        onClick={() => navigate('/dashboard')} 
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                     >
                        {t('back_to_dashboard')}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NoRouteAssigned;