import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Compass, FileText, BrainCircuit, ShieldCheck, Award, Sparkles, UserCheck, ArrowRight, Briefcase, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseDashboard } from '@/hooks/useSupabaseDashboard.js';
import ProChat from '@/components/pro/ProChat';

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
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
    >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-6 h-6 text-cyan-400 mb-2 opacity-80" />
        <span className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">{label}</span>
        <span className="text-lg font-bold text-white text-center leading-tight">{value}</span>
    </motion.div>
);



const ProDashboard = ({ profile: initialProfile, analysis: initialAnalysis }) => {
    const { t } = useTranslation(['dashboard', 'life_planner', 'pro_modules']);
    const navigate = useNavigate();
    const { profile, analysis } = useSupabaseDashboard(initialProfile);

    const percentage = profile?.migratory_score || 0;
    const recommendedCountry = analysis?.pais_sugerido || profile?.target_country || "Canadá";
    const potential = percentage > 60 ? 'Sólido' : 'En progreso';

    return (
        <main className="flex-1 w-full h-[calc(100vh-80px)] relative overflow-hidden bg-slate-950 text-white selection:bg-cyan-500/30 flex">
            
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-center py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold z-50">
                {t('dashboard_pro.badge_plan_active', '🚀 AI Agent & PRO Modules Active')}
            </div>

            <div className="w-full flex lg:flex-row flex-col-reverse h-full max-w-7xl mx-auto z-10 pt-8 pb-4 px-4 sm:px-6 lg:px-8 gap-6 md:gap-8">
                
                {/* Left Pane: AI Agent Chat */}
                <div className="w-full lg:w-7/12 h-[600px] lg:h-full flex flex-col pt-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        Tu Agente KAI
                    </h2>
                    <div className="flex-1 min-h-0">
                        <ProChat />
                    </div>
                </div>

                {/* Right Pane: HUD & Modules */}
                <div className="w-full lg:w-5/12 lg:h-full flex flex-col gap-6 pt-4 lg:overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    
                    {/* Header summary */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                            Hola, {profile?.full_name?.split(' ')[0] || 'Pro'}
                        </h1>
                        <p className="text-slate-400 text-sm">Tu progreso se sincroniza con el agente en tiempo real.</p>
                    </div>

                    {/* Score HUD */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="rounded-[2rem] border p-6 relative overflow-hidden backdrop-blur-md bg-slate-900/40 shadow-2xl shrink-0"
                        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                            <div className="flex-shrink-0">
                                <PremiumScoreRing score={percentage} />
                                <div className="text-center mt-3 text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
                                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                                    Match Global
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 flex-grow w-full">
                                <StatBadge icon={Compass} label="Destino Ideal" value={recommendedCountry} delay={0.2} />
                                <StatBadge icon={TrendingUp} label="Oportunidad" value={potential} delay={0.3} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Próximos Pasos Recomendados */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
                        <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Sugerencia de KAI
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            Sube tu CV actualizado en el chat para que evalúe tus competencias frente a los requisitos del Express Entry.
                        </p>
                        <Button 
                            onClick={() => {
                                const input = document.querySelector('input[type="text"]');
                                if(input) {
                                  input.focus();
                                  input.value = "Por favor evalúa mi perfil profesional";
                                  // Trigger react change event
                                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                                  nativeInputValueSetter.call(input, "Por favor evalúa mi perfil profesional");
                                  const event = new Event('input', { bubbles: true});
                                  input.dispatchEvent(event);
                                }
                            }}
                            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            <BrainCircuit className="w-4 h-4 mr-2" />
                            Iniciar Evaluación
                        </Button>
                    </motion.div>

                </div>
            </div>
        </main>
    );
};

export default ProDashboard;