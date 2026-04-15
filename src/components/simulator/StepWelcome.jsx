import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useSimulator } from '@/contexts/SimulatorContext';
import { Sparkles } from 'lucide-react';

const StepWelcome = () => {
  const { t } = useTranslation('exodus');
  const { nextStep } = useSimulator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
        {t('simulator.s1_title')}
      </h2>
      <p className="text-gray-400 mb-8 max-w-xl mx-auto">{t('simulator.s1_subtitle')}</p>
      <Button
        onClick={nextStep}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-lg"
      >
        Comenzar Test <Sparkles className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
};

export default StepWelcome;