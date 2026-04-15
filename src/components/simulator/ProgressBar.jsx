import React from 'react';
import { motion } from 'framer-motion';
import { useSimulator } from '@/contexts/SimulatorContext';

const ProgressBar = ({ totalSteps }) => {
  const { step } = useSimulator();
  const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full bg-slate-700/50 rounded-full h-2.5 mb-8">
      <motion.div
        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default ProgressBar;