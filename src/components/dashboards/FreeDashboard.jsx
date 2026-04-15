import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, TrendingUp, CheckCircle2, Lock, ArrowRight, Zap, Target, Bot } from 'lucide-react';
import PricingModal from '@/components/PricingModal';

const PremiumScoreRing = ({ score }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r={radius} className="stroke-white/10" strokeWidth="8" fill="none" />
                <motion.circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="url(#score-gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    style={{ strokeDasharray: circumference }}
                />
                <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="text-center relative z-10">
                <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-4xl font-black bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                >
                    {score}%
                </motion.span>
            </div>
            {/* Glowing effect behind ring */}
            <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-full pb-0" />
        </div>
    );
};

const StatBadge = ({ icon: Icon, label, value, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="flex flex-col items-center justify-center p-4 rounded-2xl border bg-white/5 backdrop-blur-sm relative overflow-hidden group"
        style={{ borderColor: 'var(--chat-border)' }}
    >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-6 h-6 text-cyan-400 mb-2 opacity-80" />
        <span className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">{label}</span>
        <span className="text-lg font-bold text-white">{value}</span>
    </motion.div>
);

const FreeDashboard = ({ profile, migProfile, analysis, basicInfo, handleAction }) => {
    const { t } = useTranslation('dashboard');
    const navigate = useNavigate();
    const [showPricing, setShowPricing] = useState(false);
    
    // Si no está registrado por chat (onboarding_completed=false) igual le mostramos un dashboard premium vacío
    const hasData = profile?.onboarding_completed || migProfile;

    const percentage = migProfile?.score || profile?.migratory_score || 0;
    const country = migProfile?.targetCountry || migProfile?.country_name || basicInfo?.country_of_origin || "¿?";
    const potential = analysis?.nivel || migProfile?.crsTotal ? 'Alto' : 'Pendiente';
    const userName = basicInfo?.nombre_completo || profile?.full_name || 'Futuro Residente';

    return (
        <main className="flex-1 w-full h-full min-h-screen relative overflow-y-auto bg-slate-950 text-white selection:bg-purple-500/30">
            {/* Dark Premium Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative z-10 flex flex-col items-center">
                
                {/* Saludo Premium */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    {hasData && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" /> Análisis Completado
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        Bienvenido, <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto font-light">
                        {hasData 
                            ? `Hemos procesado tus datos. Estás un paso más cerca de tu objetivo migratorio.` 
                            : `Realiza la evaluación CRS para desbloquear tu predicción migratoria.`}
                    </p>
                </motion.div>

                {/* HUD Centralizado */}
                {hasData ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="w-full max-w-3xl rounded-[2rem] border p-8 md:p-12 relative overflow-hidden backdrop-blur-md bg-slate-900/50 shadow-2xl"
                        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                        
                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                            {/* Anillo de Score */}
                            <div className="flex-shrink-0">
                                <PremiumScoreRing score={percentage} />
                                <div className="text-center mt-4 text-sm text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                                    <Target className="w-4 h-4 text-purple-400" />
                                    Match Global
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow w-full">
                                <StatBadge icon={Compass} label="Destino Ideal" value={country} delay={0.3} />
                                <StatBadge icon={TrendingUp} label="Oportunidad" value={potential} delay={0.4} />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-3xl rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-md p-12 text-center"
                    >
                        <Bot className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
                        <h2 className="text-2xl font-bold text-white mb-3">Información Pendiente</h2>
                        <p className="text-slate-400 mb-8">Vuelve a inicio y conversa con KAI para llenar tu diagnóstico.</p>
                        <Button onClick={() => navigate('/')} variant="outline" className="border-white/10 text-white">
                            Ir al Simulador KAI
                        </Button>
                    </motion.div>
                )}

                {/* Call To Action MASIVO (Reemplaza los 5 mini candados) */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full max-w-3xl mt-8"
                >
                    <div className="relative rounded-[2rem] p-[1px] overflow-hidden group cursor-pointer" onClick={() => setShowPricing(true)}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-cyan-500 to-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-[calc(2rem-1px)] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                            <div>
                                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-widest mb-3">
                                    <Lock className="w-4 h-4" /> Desbloquea tu Camino
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Generar Plan Migratorio</h3>
                                <ul className="space-y-2">
                                    {["Ruta legal paso a paso garantizada", "Formatos de documentos oficiales", "Soporte de Abogado IA ilimitado"].map((benefit, i) => (
                                        <li key={i} className="flex items-center text-slate-300 text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button 
                                size="lg" 
                                className="w-full md:w-auto shrink-0 font-bold px-8 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
                                style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
                            >
                                Iniciar Pro <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

            </div>
            
            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                highlightPlan="pro"
            />
        </main>
    );
};

export default FreeDashboard;