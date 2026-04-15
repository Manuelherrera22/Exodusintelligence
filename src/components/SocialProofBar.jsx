import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, Briefcase } from 'lucide-react';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 20, damping: 20 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString('en-US')
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const SocialProofBar = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const stats = [
    { icon: Users, text: t('social_proof_stat1'), value: 4235 },
    { icon: CheckCircle, text: t('social_proof_stat2'), value: 1028 },
    { icon: Briefcase, text: t('social_proof_stat3'), value: 345 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % stats.length);
    }, 5000); // Change stat every 5 seconds

    return () => clearInterval(timer);
  }, [stats.length]);

  const CurrentIcon = stats[index].icon;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50">
      <div className="bg-slate-800/50 backdrop-blur-lg border border-purple-500/30 rounded-full p-2 overflow-hidden shadow-2xl shadow-purple-500/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-white"
          >
            <CurrentIcon className="w-5 h-5 text-cyan-300" />
            <p className="text-sm font-medium">
              <span className="font-bold">+<AnimatedNumber value={stats[index].value} /></span> {stats[index].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialProofBar;