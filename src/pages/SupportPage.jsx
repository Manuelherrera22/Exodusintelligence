import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const SupportPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Soporte Prioritario | Exodus Intelligence</title>
                <meta name="description" content="Accede a tu canal de soporte prioritario para resolver tus dudas." />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-4 sm:p-8 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-8 shadow-2xl shadow-amber-500/10 text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-amber-500/10 rounded-full">
                           <ShieldCheck className="w-12 h-12 text-amber-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Soporte Prioritario</h1>
                    <p className="text-gray-400 mb-8">Esta sección está en construcción. Aquí encontrarás tu canal de comunicación directo con nuestro equipo de expertos.</p>
                    <Button onClick={() => navigate('/dashboard')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </Button>
                </motion.div>
            </div>
        </>
    );
};

export default SupportPage;