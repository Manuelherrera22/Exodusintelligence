import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Target, Cpu, Heart, GraduationCap, Rocket, Briefcase, Gift, Zap, Lock } from 'lucide-react';

/**
 * Achievement cards based on REAL profile data.
 * Each achievement is a fact derived from the user's actual profile.
 */

function getAchievements(profile, score, isEn) {
  const achievements = [];

  if (profile?.age && profile.age >= 20 && profile.age <= 35) {
    achievements.push({
      id: 'prime-age',
      icon: Target,
      title: isEn ? 'Prime Age Range' : 'Edad Ideal',
      desc: isEn
        ? `At ${profile.age}, you're in the optimal bracket for most programs`
        : `A los ${profile.age}, estás en el rango óptimo para la mayoría de programas`,
      color: 'from-emerald-500/15 to-teal-500/15',
      border: 'border-emerald-500/15',
      iconColor: 'text-emerald-400',
      unlocked: true,
    });
  }

  if (profile?.field === 'stem') {
    achievements.push({
      id: 'stem-elite',
      icon: Cpu,
      title: isEn ? 'STEM Profile' : 'Perfil STEM',
      desc: isEn ? 'Eligible for priority programs in 8+ countries' : 'Elegible para programas prioritarios en 8+ países',
      color: 'from-blue-500/15 to-indigo-500/15',
      border: 'border-blue-500/15',
      iconColor: 'text-blue-400',
      unlocked: true,
    });
  }

  if (profile?.field === 'health') {
    achievements.push({
      id: 'health-priority',
      icon: Heart,
      title: isEn ? 'Healthcare Priority' : 'Prioridad Salud',
      desc: isEn ? 'Fast-track immigration routes available in 6 countries' : 'Rutas express disponibles en 6 países',
      color: 'from-rose-500/15 to-pink-500/15',
      border: 'border-rose-500/15',
      iconColor: 'text-rose-400',
      unlocked: true,
    });
  }

  if (profile?.education === 'university' || profile?.education === 'postgraduate') {
    achievements.push({
      id: 'educated',
      icon: GraduationCap,
      title: isEn ? 'University Educated' : 'Formación Universitaria',
      desc: isEn ? 'Higher education maximizes your CRS points' : 'La educación superior maximiza tus puntos CRS',
      color: 'from-purple-500/15 to-violet-500/15',
      border: 'border-purple-500/15',
      iconColor: 'text-purple-400',
      unlocked: true,
    });
  }

  if (score >= 70) {
    achievements.push({
      id: 'high-ready',
      icon: Rocket,
      title: isEn ? 'High Readiness' : 'Alta Preparación',
      desc: isEn ? 'Your profile is competitive for immediate application' : 'Tu perfil es competitivo para aplicar de inmediato',
      color: 'from-emerald-500/15 to-cyan-500/15',
      border: 'border-emerald-500/15',
      iconColor: 'text-emerald-400',
      unlocked: true,
    });
  }

  if (profile?.workYears && profile.workYears >= 3) {
    achievements.push({
      id: 'experienced',
      icon: Briefcase,
      title: isEn ? 'Skilled Worker' : 'Trabajador Calificado',
      desc: isEn
        ? `${profile.workYears}+ years of experience significantly strengthen your profile`
        : `${profile.workYears}+ años de experiencia fortalecen significativamente tu perfil`,
      color: 'from-amber-500/15 to-orange-500/15',
      border: 'border-amber-500/15',
      iconColor: 'text-amber-400',
      unlocked: true,
    });
  }

  // Locked achievements (teasers for PRO)
  achievements.push({
    id: 'scholarship',
    icon: Gift,
    title: isEn ? 'Scholarship Match' : 'Match de Becas',
    desc: isEn ? 'Discover scholarships you qualify for' : 'Descubre becas a las que puedes aplicar',
    color: 'from-white/[0.02] to-white/[0.02]',
    border: 'border-white/[0.06]',
    iconColor: 'text-white/20',
    unlocked: false,
  });

  achievements.push({
    id: 'fast-track',
    icon: Zap,
    title: isEn ? 'Express Routes' : 'Rutas Express',
    desc: isEn ? 'See fast-track immigration paths' : 'Accede a rutas migratorias express',
    color: 'from-white/[0.02] to-white/[0.02]',
    border: 'border-white/[0.06]',
    iconColor: 'text-white/20',
    unlocked: false,
  });

  return achievements;
}

const AchievementCards = memo(({ profile, score, onUnlock }) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const achievements = getAchievements(profile, score, isEn);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8 }}
      className="mb-5"
    >
      <p className="text-xs text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
        <Target className="w-3.5 h-3.5" />
        {isEn ? 'Profile Strengths' : 'Fortalezas del Perfil'}
        <span className="ml-auto text-[10px] text-purple-400/50 font-semibold tabular-nums">
          {unlockedCount}/{achievements.length}
        </span>
      </p>

      <div className="grid grid-cols-2 gap-2">
        {achievements.map((ach, i) => {
          const Icon = ach.icon;
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9 + i * 0.08 }}
              onClick={!ach.unlocked ? onUnlock : undefined}
              className={`relative p-3 rounded-xl bg-gradient-to-br ${ach.color} border ${ach.border} transition-all duration-200 ${
                !ach.unlocked ? 'cursor-pointer hover:border-purple-500/20 group' : ''
              }`}
            >
              {!ach.unlocked && (
                <div className="absolute inset-0 rounded-xl bg-[#0d0b1a]/50 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-[10px] text-purple-400/60 font-medium flex items-center gap-1.5 group-hover:text-purple-300 transition-colors">
                    <Lock className="w-3 h-3" /> PRO
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className={`w-3.5 h-3.5 ${ach.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white/70 truncate">{ach.title}</p>
                  <p className="text-[9px] text-white/25 leading-snug mt-0.5 line-clamp-2">{ach.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
});

export default AchievementCards;
