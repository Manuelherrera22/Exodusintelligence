import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Globe, ArrowRight, ChevronDown, CheckCircle2,
  AlertTriangle, TrendingUp, Target, ChevronRight as ChevRight,
  Lock, Sparkles, Send, Download, FileText
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MigrationChat from '@/components/MigrationChat';
import PricingModal from '@/components/PricingModal';
import QuickAuthModal from '@/components/QuickAuthModal';
import ScoreSimulator from '@/components/ScoreSimulator';
import AchievementCards from '@/components/AchievementCards';
import { generateReport } from '@/lib/reportGenerator';
import {
  calculateOverallScore, scoreDestinations, diagnose, generateTasks, normalizeProfile
} from '@/lib/migrationEngine';
import { savePendingProfile } from '@/lib/profileStore';

// ── Typewriter effect ────────────────────────────────────────────────────────
const useTypewriter = (text, speed = 35, delay = 0) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    let i = 0;
    setDisplayed('');
    setDone(false);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
};

// ── Animated Score Ring ──────────────────────────────────────────────────────
const ScoreRing = memo(({ value, size = 120 }) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(value / 100), 300);
    return () => clearTimeout(t);
  }, [value]);

  const color = value >= 70 ? '#34d399' : value >= 45 ? '#fbbf24' : '#f87171';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >{value}</motion.span>
        <span className="text-[9px] text-white/20 uppercase tracking-widest">de 100</span>
      </div>
    </div>
  );
});


// ── Build stories from translations ──────────────────────────────────────────
const buildStories = (t) => [
  {
    label: t('story_label_1', { ns: 'landing' }),
    lines: [
      { text: t('story_1_1', { ns: 'landing' }), delay: 500 },
      { text: t('story_1_2', { ns: 'landing' }), delay: 4000 },
      { text: t('story_1_3', { ns: 'landing' }), delay: 8000 },
      { text: t('story_1_4', { ns: 'landing' }), delay: 13000 },
    ],
    demo: [
      { role: 'kai', text: t('demo_1_kai_1', { ns: 'landing' }), delay: 0 },
      { role: 'user', text: t('demo_1_user_1', { ns: 'landing' }), delay: 3500 },
      { role: 'kai', text: t('demo_1_kai_2', { ns: 'landing' }), delay: 5500 },
      { role: 'user', text: t('demo_1_user_2', { ns: 'landing' }), delay: 9000 },
      { role: 'kai', text: t('demo_1_kai_3', { ns: 'landing' }), delay: 11500 },
    ],
  },
  {
    label: t('story_label_2', { ns: 'landing' }),
    lines: [
      { text: t('story_2_1', { ns: 'landing' }), delay: 500 },
      { text: t('story_2_2', { ns: 'landing' }), delay: 4000 },
      { text: t('story_2_3', { ns: 'landing' }), delay: 8000 },
      { text: t('story_2_4', { ns: 'landing' }), delay: 13000 },
    ],
    demo: [
      { role: 'kai', text: t('demo_2_kai_1', { ns: 'landing' }), delay: 0 },
      { role: 'user', text: t('demo_2_user_1', { ns: 'landing' }), delay: 3500 },
      { role: 'kai', text: t('demo_2_kai_2', { ns: 'landing' }), delay: 5500 },
      { role: 'user', text: t('demo_2_user_2', { ns: 'landing' }), delay: 9000 },
      { role: 'kai', text: t('demo_2_kai_3', { ns: 'landing' }), delay: 11500 },
    ],
  },
  {
    label: t('story_label_3', { ns: 'landing' }),
    lines: [
      { text: t('story_3_1', { ns: 'landing' }), delay: 500 },
      { text: t('story_3_2', { ns: 'landing' }), delay: 4000 },
      { text: t('story_3_3', { ns: 'landing' }), delay: 8000 },
      { text: t('story_3_4', { ns: 'landing' }), delay: 13000 },
    ],
    demo: [
      { role: 'kai', text: t('demo_3_kai_1', { ns: 'landing' }), delay: 0 },
      { role: 'user', text: t('demo_3_user_1', { ns: 'landing' }), delay: 3500 },
      { role: 'kai', text: t('demo_3_kai_2', { ns: 'landing' }), delay: 5500 },
      { role: 'user', text: t('demo_3_user_2', { ns: 'landing' }), delay: 9000 },
      { role: 'kai', text: t('demo_3_kai_3', { ns: 'landing' }), delay: 11500 },
    ],
  },
];

// Pick a random story index (stable across re-renders)
const CHOSEN_STORY_INDEX = Math.floor(Math.random() * 3);

// ── Demo Chat Preview ────────────────────────────────────────────────────────
const DemoChatPreview = ({ conversation = [] }) => {
  const [visibleMsgs, setVisibleMsgs] = useState([]);

  useEffect(() => {
    setVisibleMsgs([]);
    const timers = conversation.map((msg, i) =>
      setTimeout(() => {
        setVisibleMsgs(prev => [...prev, msg]);
      }, msg.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [conversation]);

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visibleMsgs.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`flex ${msg.role === 'kai' ? '' : 'justify-end'}`}
          >
            {msg.role === 'kai' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0 mr-2 mt-0.5 text-[10px] font-bold text-white">K</div>
            )}
            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
              msg.role === 'kai'
                ? 'bg-white/[0.04] border border-white/[0.06] text-white/70 rounded-tl-sm'
                : 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white/90 rounded-tr-sm'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {visibleMsgs.length < conversation.length && visibleMsgs.length > 0 && conversation[visibleMsgs.length]?.role === 'kai' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-9">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400/40"
                animate={{ opacity: [0.3,1,0.3], y: [0,-3,0] }}
                transition={{ duration: 0.6, delay: i*0.12, repeat: Infinity }} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ── Analyzing Screen ─────────────────────────────────────────────────────────
const AnalyzingScreen = memo(() => {
  const { t } = useTranslation('landing');
  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-400 mb-6"
        animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
      <p className="text-white/50 text-sm mb-1">{t('analyzing_title')}</p>
      <p className="text-white/20 text-[11px] max-w-xs text-center">
        {t('analyzing_subtitle')}
      </p>
    </motion.div>
  );
});

// ── Results View ─────────────────────────────────────────────────────────────
const ResultsView = memo(({ profile, score, destinations, diagnosis, tasks, onRegister, onLogin, session, onGoToDashboard }) => {
  const { t, i18n } = useTranslation('landing');
  const isEn = i18n.language?.startsWith('en');
  const [showPricing, setShowPricing] = useState(false);
  
  const crsLabels = isEn
    ? ['Age', 'Education', 'Language', 'Experience', 'Transferability']
    : ['Edad', 'Educación', 'Idioma', 'Experiencia', 'Transferability'];

  return (
    <motion.div className="min-h-screen pt-20 pb-16 px-5 max-w-xl mx-auto relative z-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* Score */}
      <div className="flex flex-col items-center mb-8">
        <ScoreRing value={score} size={140} />
        <motion.p className="text-sm mt-4 text-center max-w-sm" style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          {diagnosis.summary}
        </motion.p>
      </div>

      {/* CRS Breakdown */}
      {diagnosis.crs && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="border rounded-2xl p-5 mb-5" style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)' }}>
          <p className="text-xs uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <TrendingUp className="w-3.5 h-3.5" /> CRS {isEn ? 'Canada' : 'Canadá'} — {diagnosis.crs.total}/600
          </p>
          <div className="space-y-2">
            {[
              { label: crsLabels[0], val: diagnosis.crs.age, max: 110 },
              { label: crsLabels[1], val: diagnosis.crs.education, max: 150 },
              { label: crsLabels[2], val: diagnosis.crs.language, max: 136 },
              { label: crsLabels[3], val: diagnosis.crs.experience, max: 80 },
              { label: crsLabels[4], val: diagnosis.crs.transferability, max: 50 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-[11px] w-24" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--chat-border)' }}>
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500/80 to-cyan-500/80"
                    initial={{ width: 0 }} animate={{ width: (item.val/item.max*100) + '%' }}
                    transition={{ duration: 1.2, delay: 1.5 }} />
                </div>
                <span className="text-[11px] tabular-nums w-14 text-right" style={{ color: 'var(--text-muted)' }}>{item.val}/{item.max}</span>
              </div>
            ))}
          </div>
          {diagnosis.crsGap > 0 && (
            <p className="text-[11px] text-amber-400/60 mt-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              {isEn
                ? `You need ${diagnosis.crsGap} more points for Express Entry cutoff (520)`
                : `Te faltan ${diagnosis.crsGap} puntos para el corte de Express Entry (520)`}
            </p>
          )}
        </motion.div>
      )}

      {/* Top destinations */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="mb-5">
        <p className="text-xs uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Target className="w-3.5 h-3.5" /> {isEn ? 'Best destinations for you' : 'Mejores destinos para ti'}
        </p>
        <div className="space-y-2">
          {destinations.slice(0, 3).map((d, i) => (
            <div key={d.code} className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)' }}>
              <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{d.country}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.bestProgram.name}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>{d.score}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tasks preview */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
        className="border rounded-2xl p-5 mb-8" style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)' }}>
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
          {isEn ? 'Your personalized action plan' : 'Tu plan de acción personalizado'}
        </p>
        {tasks.slice(0, 3).map((task, i) => (
          <div key={task.id} className="flex gap-2.5 py-2.5 px-3 rounded-lg mb-1 border" style={{ backgroundColor: 'var(--chat-border)', borderColor: 'var(--chat-border)' }}>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
              task.priority === 'critical' ? 'border-red-400/50' : task.priority === 'high' ? 'border-amber-400/50' : 'border-gray-500/30'
            }`}>
              <span className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>{i + 1}</span>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{task.title}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{task.duration} · +{task.points} pts</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 🏆 Achievement Cards */}
      <AchievementCards
        profile={profile}
        score={score}
        onUnlock={() => setShowPricing(true)}
      />

      {/* 📊 Score Simulator (blur paywall) */}
      <ScoreSimulator
        currentScore={score}
        onUnlock={() => setShowPricing(true)}
      />

      {/* CTAs — Zero friction: download first, account optional */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }} className="space-y-3 pb-12">
        
        {/* Primary CTA: Download Report (no login!) */}
        <button 
          type="button"
          onClick={() => generateReport({ profile, score, destinations, diagnosis, tasks }, i18n.language)}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm
            hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5
            group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Download className="w-4 h-4" />
          {isEn ? 'Download My Report (PDF)' : 'Descargar Mi Informe (PDF)'}
        </button>
        <p className="text-[10px] text-center" style={{ color: 'var(--text-secondary)' }}>
          {isEn ? 'Free — No registration required' : 'Gratis — Sin registro'}
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--chat-border)' }} />
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {isEn ? 'want more?' : '¿quieres más?'}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--chat-border)' }} />
        </div>

        {/* Upgrade CTA */}
        <button 
          type="button"
          onClick={() => setShowPricing(true)}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/15 font-medium text-sm
            hover:from-purple-600/20 hover:to-cyan-600/20 hover:border-purple-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          {isEn ? 'Unlock Score Simulator & Full Plan — 7 days free' : 'Desbloquear Simulador y Plan Completo — 7 días gratis'}
        </button>

        {/* Secondary: Account */}
        {!session ? (
            <>
                <button 
                  type="button"
                  onClick={onRegister}
                  className="w-full py-3 rounded-xl border font-medium text-xs active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-80"
                  style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'var(--text-secondary)' }}
                >
                  {isEn ? 'Save my results — Create free account' : 'Guardar mis resultados — Crear cuenta gratis'}
                </button>
                <button 
                  type="button"
                  onClick={onLogin} 
                  className="w-full py-2 text-xs transition-colors hover:opacity-100"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {isEn ? 'I already have an account' : 'Ya tengo cuenta'}
                </button>
            </>
        ) : (
            <button 
                  type="button"
                  onClick={onGoToDashboard}
                  className="w-full py-3 rounded-xl border font-medium text-xs active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-100 hover:border-purple-500/50"
                  style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'white' }}
                >
                  {isEn ? 'Save and go to Dashboard' : 'Guardar y volver a mi Dashboard'}
            </button>
        )}
      </motion.div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        highlightPlan="pro"
      />
    </motion.div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN FLOW
// ═══════════════════════════════════════════════════════════════════════════════
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DiscoveryFlow = ({ startPhase = 'hero' }) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t, i18n } = useTranslation('landing');
  const [phase, setPhase] = useState(startPhase); // hero | chat | analyzing | results
  const [results, setResults] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, mode: 'login' });
  const isEn = i18n.language?.startsWith('en');

  // Rebuild stories when language changes
  const allStories = useMemo(() => buildStories(t), [t, i18n.language]);
  const chosenStory = allStories[CHOSEN_STORY_INDEX];
  const STORIES = chosenStory.lines;
  const DEMO_CONVERSATION = chosenStory.demo;
  const STORY_LABEL = chosenStory.label;

  // Progress through stories
  useEffect(() => {
    if (phase !== 'hero') return;
    const timers = [
      setTimeout(() => setStoryIndex(1), 4000),
      setTimeout(() => setStoryIndex(2), 8000),
      setTimeout(() => setStoryIndex(3), 13000),
      setTimeout(() => setShowCTA(true), 16000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const handleChatComplete = useCallback((rawProfile) => {
    setPhase('analyzing');
    setTimeout(() => {
      const profile = normalizeProfile(rawProfile);
      const score = calculateOverallScore(profile);
      const destinations = scoreDestinations(profile);
      const diag = diagnose(profile);
      const tasks = generateTasks(profile, diag);
      savePendingProfile(profile, score, tasks);
      setResults({ profile, score, destinations, diagnosis: diag, tasks });
      setPhase('results');
    }, 2000);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--hero-bg)', transition: 'background-color 0.4s ease' }}>
      {/* Subtle background - NOT aurora, something more minimal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Minimal header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
        <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Globe className="w-4 h-4 text-purple-400/50" />
          <span className="text-sm font-semibold text-white/40 tracking-tight">Exodus</span>
        </motion.div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {phase === 'hero' && (
             !session ? (
                 <button onClick={() => setAuthModalConfig({ isOpen: true, mode: 'login' })} className="text-xs font-medium text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg">
                   {isEn ? 'Log In' : 'Iniciar Sesión'}
                 </button>
             ) : (
                 <button onClick={() => navigate('/dashboard')} className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/20 px-3 py-1.5 rounded-lg">
                   Dashboard
                 </button>
             )
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ HERO — Story-driven, NOT generic ═══ */}
        {phase === 'hero' && (
          <motion.div key="hero" 
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen flex flex-col lg:flex-row relative z-10">

            {/* LEFT — Story + CTA */}
            <div className="flex-1 flex flex-col justify-center px-6 pt-20 pb-8 md:px-16 lg:px-24 lg:pt-0 lg:pb-0 lg:max-w-2xl">
              {/* Micro-label */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="mb-6 md:mb-8">
                <span className="text-[10px] md:text-[11px] text-purple-400/40 uppercase tracking-[0.2em]">
                  {STORY_LABEL}
                </span>
              </motion.div>

              {/* Typewriter story */}
              <div className="min-h-[160px] md:min-h-[200px] mb-8 md:mb-10">
                <AnimatePresence mode="wait">
                  {STORIES.map((story, i) => (
                    i <= storyIndex && (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: i === storyIndex ? 1 : 0.3, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`text-sm md:text-base lg:text-lg leading-relaxed mb-3 md:mb-4`}
                        style={{ color: i === storyIndex ? 'var(--text-secondary)' : 'var(--text-muted)', fontFamily: "'Georgia', serif", fontStyle: 'italic' }}
                      >
                        {story.text}
                      </motion.p>
                    )
                  ))}
                </AnimatePresence>
              </div>

              {/* CTA — appears after story */}
              <AnimatePresence>
                {showCTA && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4 md:mb-5" dangerouslySetInnerHTML={{ __html: t('cta_question') }} />

                    <button
                      onClick={() => setPhase('chat')}
                      className="group w-full max-w-md flex items-center gap-3 px-5 py-4 rounded-2xl border hover:border-purple-500/20 transition-all duration-300 cursor-text"
                      style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)' }}
                    >
                      <span className="text-sm text-white/20 flex-1 text-left">{t('input_placeholder')}</span>
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-shadow">
                        <Send className="w-4 h-4 text-white" />
                      </div>
                    </button>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4 text-[10px] text-white/15">
                      <span>🎤 {i18n.language?.startsWith('en') ? 'Voice dictation' : 'Dictado por voz'}</span>
                      <span>📄 {i18n.language?.startsWith('en') ? 'Upload docs' : 'Sube documentos'}</span>
                      <span>⏱ 2 min</span>
                      <span>🔒 {i18n.language?.startsWith('en') ? 'No signup' : 'Sin registro'}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Skip story link */}
              {!showCTA && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  onClick={() => { setShowCTA(true); setStoryIndex(3); }}
                  className="text-[11px] text-white/10 hover:text-white/25 transition-colors mt-4"
                >
                  {t('skip_button')} →
                </motion.button>
              )}
            </div>

            {/* RIGHT — Demo conversation (desktop) / Mini preview (mobile) */}
            <div className="hidden lg:flex flex-1 items-center justify-center pr-16">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="w-full max-w-sm"
              >
                <div className="rounded-3xl p-6 backdrop-blur-sm shadow-[0_0_60px_rgba(0,0,0,0.3)]" style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', border: '1px solid var(--chat-border)' }}>
                  <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.04]">
                    <div className="w-2 h-2 rounded-full bg-emerald-400/60 animate-pulse" />
                    <span className="text-[11px] text-white/25">{t('demo_header_live')}</span>
                  </div>
                  <DemoChatPreview conversation={DEMO_CONVERSATION} />
                </div>
                <div className="flex items-center justify-center gap-4 mt-6 text-[9px] text-white/10 uppercase tracking-wider">
                  <span>IRCC</span><span>·</span><span>DHA</span><span>·</span><span>BAMF</span><span>·</span><span>USCIS</span>
                </div>
              </motion.div>
            </div>

            {/* Mobile mini-preview — shows a compact snippet below CTA */}
            {showCTA && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:hidden px-6 pb-12"
              >
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.03]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
                    <span className="text-[10px] text-white/20">{i18n.language?.startsWith('en') ? 'Preview · KAI in action' : 'Vista previa · KAI en acción'}</span>
                  </div>
                  {DEMO_CONVERSATION.slice(0, 3).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.3 }}
                      className={`flex ${msg.role === 'kai' ? '' : 'justify-end'} mb-2 last:mb-0`}
                    >
                      {msg.role === 'kai' && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shrink-0 mr-1.5 mt-0.5 flex items-center justify-center text-[7px] font-bold text-white">K</div>
                      )}
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                        msg.role === 'kai'
                          ? 'bg-white/[0.03] text-white/50 rounded-tl-sm'
                          : 'bg-purple-600/50 text-white/70 rounded-tr-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3 mt-4 text-[8px] text-white/10 uppercase tracking-wider">
                  <span>IRCC</span><span>·</span><span>DHA</span><span>·</span><span>BAMF</span><span>·</span><span>USCIS</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══ CHAT ═══ */}
        {phase === 'chat' && (
          <motion.div key="chat" 
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen pt-16 relative z-10">
            <MigrationChat onComplete={handleChatComplete} />
          </motion.div>
        )}

        {/* ═══ ANALYZING ═══ */}
        {phase === 'analyzing' && <AnalyzingScreen key="analyzing" />}

        {/* ═══ RESULTS ═══ */}
        {phase === 'results' && results && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultsView
              {...results}
              session={session}
              onRegister={() => setAuthModalConfig({ isOpen: true, mode: 'register' })}
              onLogin={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
              onGoToDashboard={() => navigate('/dashboard', { replace: true })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zero Friction Auth Modal */}
      <QuickAuthModal 
        isOpen={authModalConfig.isOpen}
        mode={authModalConfig.mode}
        isEn={isEn}
        onClose={() => setAuthModalConfig({ isOpen: false, mode: 'login' })}
      />
    </div>
  );
};

export default DiscoveryFlow;
