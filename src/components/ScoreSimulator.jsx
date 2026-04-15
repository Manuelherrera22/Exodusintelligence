import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Zap, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { calculateOverallScore, calculateCRS } from '@/lib/migrationEngine';

/**
 * Score Simulator with blur paywall.
 * Uses the REAL migration engine to compute what-if scenarios.
 */

function buildScenarios(profile, isEn) {
  if (!profile) return [];
  const scenarios = [];
  const base = calculateOverallScore(profile);
  const baseCRS = calculateCRS(profile);

  // Scenario 1: Improve English to C1 (if not already C1+)
  const currentLang = profile.englishLevel || 'none';
  if (!['c1', 'c2', 'native'].includes(currentLang)) {
    const upgraded = { ...profile, englishLevel: 'c1' };
    const newScore = calculateOverallScore(upgraded);
    const newCRS = calculateCRS(upgraded);
    const crsDelta = newCRS.total - baseCRS.total;
    scenarios.push({
      id: 'ielts',
      icon: TrendingUp,
      label: isEn ? 'Improve English to C1 (IELTS 7.0+)' : 'Mejorar inglés a C1 (IELTS 7.0+)',
      delta: `+${newScore - base}`,
      crsDelta: crsDelta > 0 ? `+${crsDelta} CRS` : null,
      newScore,
    });
  }

  // Scenario 2: Get postgraduate if not already
  if (profile.education !== 'postgraduate') {
    const upgraded = { ...profile, education: 'postgraduate' };
    const newScore = calculateOverallScore(upgraded);
    const newCRS = calculateCRS(upgraded);
    const crsDelta = newCRS.total - baseCRS.total;
    scenarios.push({
      id: 'edu',
      icon: TrendingUp,
      label: isEn ? 'Complete a postgraduate degree' : 'Completar un posgrado',
      delta: `+${newScore - base}`,
      crsDelta: crsDelta > 0 ? `+${crsDelta} CRS` : null,
      newScore,
    });
  }

  // Scenario 3: More work experience (if < 5 years)
  if ((profile.workYears || 0) < 5) {
    const targetYears = Math.min((profile.workYears || 0) + 2, 5);
    const upgraded = { ...profile, workYears: targetYears };
    const newScore = calculateOverallScore(upgraded);
    const newCRS = calculateCRS(upgraded);
    const crsDelta = newCRS.total - baseCRS.total;
    scenarios.push({
      id: 'exp',
      icon: TrendingUp,
      label: isEn
        ? `Gain ${targetYears - (profile.workYears || 0)} more years of experience`
        : `Ganar ${targetYears - (profile.workYears || 0)} años más de experiencia`,
      delta: `+${newScore - base}`,
      crsDelta: crsDelta > 0 ? `+${crsDelta} CRS` : null,
      newScore,
    });
  }

  // Scenario 4: Learn French B2
  if (!profile.frenchLevel || profile.frenchLevel === 'none' || profile.frenchLevel === 'a1' || profile.frenchLevel === 'a2') {
    const upgraded = { ...profile, frenchLevel: 'b2' };
    const newScore = calculateOverallScore(upgraded);
    const newCRS = calculateCRS(upgraded);
    const crsDelta = newCRS.total - baseCRS.total;
    scenarios.push({
      id: 'french',
      icon: TrendingUp,
      label: isEn ? 'Learn French (B2 level)' : 'Aprender francés (nivel B2)',
      delta: `+${newScore - base}`,
      crsDelta: crsDelta > 0 ? `+${crsDelta} CRS` : null,
      newScore,
    });
  }

  // Scenario 5: All improvements combined
  const bestProfile = {
    ...profile,
    englishLevel: 'c1',
    education: 'postgraduate',
    workYears: 5,
    frenchLevel: 'b2',
  };
  const maxScore = calculateOverallScore(bestProfile);

  return { scenarios: scenarios.slice(0, 4), maxScore, baseScore: base };
}

const ScoreSimulator = memo(({ currentScore = 67, profile, onUnlock }) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const { scenarios, maxScore } = useMemo(
    () => buildScenarios(profile, isEn),
    [profile, isEn]
  );

  if (!scenarios || scenarios.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4 }}
      className="relative mb-5 rounded-2xl overflow-hidden"
    >
      <div className="relative">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            {isEn ? 'Score Simulator' : 'Simulador de Score'}
          </p>

          {/* Score scenarios - blurred */}
          <div className="space-y-2.5 filter blur-[3px] select-none pointer-events-none">
            {scenarios.map(scenario => {
              const Icon = scenario.icon;
              return (
                <div
                  key={scenario.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-purple-400/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 font-medium truncate">{scenario.label}</p>
                    {scenario.crsDelta && (
                      <p className="text-[10px] text-emerald-400/60">{scenario.crsDelta}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-emerald-400/80 font-bold">{scenario.delta}</span>
                    <ArrowUpRight className="w-3 h-3 text-emerald-400/60" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white/60">{scenario.newScore}</p>
                    <p className="text-[8px] text-white/20">/100</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Max potential (blurred) */}
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/[0.06] to-cyan-500/[0.06] border border-purple-500/10 filter blur-[3px] select-none pointer-events-none">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30">
                {isEn ? 'Maximum potential score' : 'Score máximo potencial'}
              </span>
              <span className="text-lg font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {maxScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Unlock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-transparent via-[#0d0b1a]/60 to-[#0d0b1a]/90">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.6 }}
            className="text-center px-6"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1">
              {isEn
                ? `Your score could reach ${maxScore}`
                : `Tu score podría llegar a ${maxScore}`}
            </h3>
            <p className="text-white/30 text-[11px] mb-4 max-w-xs">
              {isEn
                ? 'See exactly which actions will maximize your migration chances'
                : 'Descubre exactamente qué acciones maximizarán tus posibilidades'}
            </p>
            <button
              onClick={onUnlock}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-semibold
                hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] active:scale-[0.97] transition-all flex items-center gap-2 mx-auto"
            >
              <Zap className="w-3.5 h-3.5" />
              {isEn ? 'Unlock Simulator' : 'Desbloquear Simulador'}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

export default ScoreSimulator;
