import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Sparkles, ArrowRight, Shield, RefreshCw, Lock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const plans = (isEn) => [
  {
    id: 'free',
    name: isEn ? 'Explorer' : 'Explorador',
    price: '$0',
    period: isEn ? 'forever' : 'siempre',
    description: isEn ? 'Start your migration journey' : 'Inicia tu camino migratorio',
    icon: Sparkles,
    color: 'from-slate-500 to-slate-400',
    ring: 'ring-white/10',
    features: isEn ? [
      { text: 'Chat with KAI Coach', included: true },
      { text: 'Basic migration score', included: true },
      { text: 'Top 3 destinations', included: true },
      { text: '3 action items', included: true },
      { text: 'Basic PDF report', included: true },
      { text: 'Score simulator', included: false },
      { text: 'Full action plan', included: false },
      { text: 'Weekly updates', included: false },
    ] : [
      { text: 'Chat con KAI Coach', included: true },
      { text: 'Score migratorio básico', included: true },
      { text: 'Top 3 destinos', included: true },
      { text: '3 tareas prioritarias', included: true },
      { text: 'Informe PDF básico', included: true },
      { text: 'Simulador de score', included: false },
      { text: 'Plan completo', included: false },
      { text: 'Actualizaciones semanales', included: false },
    ],
    cta: isEn ? 'Current Plan' : 'Plan Actual',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: isEn ? '/month' : '/mes',
    yearlyPrice: '$79',
    yearlyPeriod: isEn ? '/year (save 34%)' : '/año (ahorra 34%)',
    description: isEn ? 'Maximize your chances' : 'Maximiza tus posibilidades',
    icon: Zap,
    color: 'from-purple-600 to-cyan-500',
    ring: 'ring-purple-500/30',
    popular: true,
    features: isEn ? [
      { text: 'Everything in Explorer', included: true },
      { text: 'Score Simulator (what-if)', included: true, highlight: true },
      { text: '45+ programs analyzed', included: true, highlight: true },
      { text: 'Complete action plan', included: true, highlight: true },
      { text: 'Weekly progress tracker', included: true },
      { text: 'Cutoff change alerts', included: true },
      { text: 'Document checklist', included: true },
      { text: '1-on-1 deep analysis', included: false },
    ] : [
      { text: 'Todo lo de Explorador', included: true },
      { text: 'Simulador de Score (qué pasa si...)', included: true, highlight: true },
      { text: '45+ programas analizados', included: true, highlight: true },
      { text: 'Plan de acción completo', included: true, highlight: true },
      { text: 'Tracker semanal de progreso', included: true },
      { text: 'Alertas de cambios en cortes', included: true },
      { text: 'Checklist de documentos', included: true },
      { text: 'Análisis profundo 1 a 1', included: false },
    ],
    cta: isEn ? 'Start 7-day free trial' : 'Prueba gratis 7 días',
    disabled: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$29.99',
    period: isEn ? '/month' : '/mes',
    yearlyPrice: '$199',
    yearlyPeriod: isEn ? '/year (save 44%)' : '/año (ahorra 44%)',
    description: isEn ? 'Full migration support' : 'Soporte migratorio completo',
    icon: Crown,
    color: 'from-amber-500 to-orange-500',
    ring: 'ring-amber-500/20',
    features: isEn ? [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited KAI deep analysis', included: true, highlight: true },
      { text: 'AI document review', included: true, highlight: true },
      { text: 'Consultant matching', included: true },
      { text: 'Application timeline builder', included: true },
      { text: 'Priority new route alerts', included: true },
      { text: 'Visa interview prep', included: true },
      { text: 'Community access', included: true },
    ] : [
      { text: 'Todo lo de Pro', included: true },
      { text: 'Análisis profundo KAI ilimitado', included: true, highlight: true },
      { text: 'Revisión de documentos con IA', included: true, highlight: true },
      { text: 'Matching con consultores', included: true },
      { text: 'Constructor de timeline', included: true },
      { text: 'Alertas prioritarias de rutas', included: true },
      { text: 'Prep para entrevista de visa', included: true },
      { text: 'Acceso a comunidad', included: true },
    ],
    cta: isEn ? 'Start 7-day free trial' : 'Prueba gratis 7 días',
    disabled: false,
  },
];

const PricingModal = ({ isOpen, onClose, highlightPlan = 'pro' }) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const [billing, setBilling] = useState('monthly');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const allPlans = plans(isEn);

  const handleUpgrade = async (planId) => {
    if (!user) {
      toast({
        title: isEn ? 'Account Required' : 'Cuenta Requerida',
        description: isEn ? 'Please create an account to start your trial' : 'Crea una cuenta para iniciar tu prueba',
      });
      localStorage.setItem('pending_checkout', 'pro');
      navigate('/register');
      return;
    }

    setLoadingPlan(planId);
    setLoadingPlan(planId);
    
    try {
        const response = await fetch('/.netlify/functions/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                planId: planId,
                billing: billing // 'monthly' or 'yearly'
            }),
        });

        const data = await response.json();

        if (response.ok && data.url) {
            // Redirect physically to Stripe
            window.location.href = data.url;
        } else {
            // Si no hay Stripe configurado AÚN, aplicamos bypass para pruebas
            console.warn("Stripe Checkout not configured, using test bypass:", data);
            
            const { error } = await supabase.from('profiles').update({ plan: planId }).eq('user_id', user.id);
            localStorage.setItem(`fallback_plan_${user.id}`, planId);
            setLoadingPlan(null);
            if (error) {
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            } else {
                toast({
                  title: isEn ? 'TEST MODE: Welcome to PRO!' : 'MODO PRUEBA: ¡Bienvenido a PRO!',
                  description: isEn ? 'Stripe not detected, bypass activated for testing.' : 'Stripe no configurado, activando acceso de prueba.',
                });
                onClose();
                if (window.location.pathname.includes('dashboard')) {
                  window.location.reload();
                } else {
                  navigate('/dashboard');
                }
            }
        }
    } catch (e) {
        console.warn("Fetch Error (Offline/No Stripe), applying test bypass:", e);
        const { error } = await supabase.from('profiles').update({ plan: planId }).eq('user_id', user.id);
        localStorage.setItem(`fallback_plan_${user.id}`, planId);
        setLoadingPlan(null);
        if (!error) {
             onClose();
             window.location.href = '/dashboard';
        }
    }

  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0d0b1a]/95 backdrop-blur-2xl shadow-[0_0_80px_rgba(139,92,246,0.12)] p-6 md:p-8"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white mb-2"
            >
              {isEn ? 'Unlock Your Full Potential' : 'Desbloquea Tu Potencial Completo'}
            </motion.h2>
            <p className="text-white/30 text-sm max-w-md mx-auto">
              {isEn
                ? 'Your score can improve. Get the tools to make it happen.'
                : 'Tu score puede mejorar. Obtén las herramientas para lograrlo.'}
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  billing === 'monthly'
                    ? 'bg-white/10 text-white'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                {isEn ? 'Monthly' : 'Mensual'}
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  billing === 'yearly'
                    ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-purple-300 border border-purple-500/20'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                {isEn ? 'Yearly' : 'Anual'}
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-semibold">
                  –34%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {allPlans.map((plan, index) => {
              const Icon = plan.icon;
              const isHighlighted = plan.id === highlightPlan;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className={`relative rounded-2xl p-5 border transition-all duration-300 ${
                    isHighlighted
                      ? 'border-purple-500/30 bg-purple-500/[0.06] shadow-[0_0_30px_rgba(139,92,246,0.1)] scale-[1.02]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-[10px] font-bold text-white uppercase tracking-wider">
                      {isEn ? 'Most Popular' : 'Más Popular'}
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-0.5">{plan.name}</h3>
                  <p className="text-[11px] text-white/25 mb-3">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-extrabold text-white">
                      {billing === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-xs text-white/30">
                      {billing === 'yearly' && plan.yearlyPeriod ? plan.yearlyPeriod : plan.period}
                    </span>
                  </div>

                  <button
                    disabled={plan.disabled || loadingPlan}
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-4 flex items-center justify-center gap-2 ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] active:scale-[0.98]'
                        : plan.disabled
                          ? 'bg-white/[0.04] text-white/20 cursor-default'
                          : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1] active:scale-[0.98]'
                    }`}
                  >
                    {loadingPlan === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
                    {!plan.disabled && loadingPlan !== plan.id && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>

                  <div className="space-y-2">
                    {plan.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2">
                        {feat.included ? (
                          <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${feat.highlight ? 'text-purple-400' : 'text-emerald-400/60'}`} />
                        ) : (
                          <X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/10" />
                        )}
                        <span className={`text-xs ${
                          feat.included
                            ? feat.highlight ? 'text-white/70 font-medium' : 'text-white/40'
                            : 'text-white/15'
                        }`}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-8 mt-6 text-[10px] text-white/20">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> {isEn ? 'Secure payment' : 'Pago seguro'}</span>
            <span className="flex items-center gap-1.5"><X className="w-3 h-3" /> {isEn ? 'Cancel anytime' : 'Cancela cuando quieras'}</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> {isEn ? '7-day free trial' : '7 días gratis'}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PricingModal;
