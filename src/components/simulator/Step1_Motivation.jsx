import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useSimulator } from '@/contexts/SimulatorContext';
import { ArrowRight, HeartHandshake, Zap, Rocket, GraduationCap, LifeBuoy } from 'lucide-react';

const StepButton = ({ icon, text, onClick, selected }) => (
  <motion.button
    onClick={onClick}
    className={`w-full p-4 border rounded-lg flex items-center gap-4 transition-all duration-300 text-left ${
      selected ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 hover:border-purple-600'
    }`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </motion.button>
);

const Step1_Motivation = () => {
  const { t } = useTranslation('exodus');
  const { answers, setAnswer, nextStep } = useSimulator();

  const options = [
    { value: 'quality_of_life', text: t('simulator.step1_opt1'), icon: <HeartHandshake className="w-6 h-6 text-purple-400" /> },
    { value: 'economic_instability', text: t('simulator.step1_opt2'), icon: <Zap className="w-6 h-6 text-purple-400" /> },
    { value: 'studies', text: t('simulator.step1_opt3'), icon: <GraduationCap className="w-6 h-6 text-purple-400" /> },
    { value: 'entrepreneurship', text: t('simulator.step1_opt4'), icon: <Rocket className="w-6 h-6 text-purple-400" /> },
    { value: 'desperate', text: t('simulator.step1_opt5'), icon: <LifeBuoy className="w-6 h-6 text-red-500" /> },
  ];

  const isNextDisabled = !answers.motivation;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-300">{t('simulator.step1_title')}</h3>
      <div className="grid grid-cols-1 gap-3">
        {options.map(opt => (
          <StepButton 
            key={opt.value} 
            {...opt} 
            onClick={() => setAnswer('motivation', opt.value)} 
            selected={answers.motivation === opt.value} 
          />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button onClick={nextStep} size="lg" disabled={isNextDisabled} className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-6 text-lg">
          Siguiente <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step1_Motivation;