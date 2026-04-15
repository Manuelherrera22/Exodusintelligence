import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useSimulator } from '@/contexts/SimulatorContext';
import { ArrowRight, BookOpen, Briefcase, FileText, BrainCircuit, Laptop } from 'lucide-react';

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

const Step3_Commitment = () => {
  const { t } = useTranslation('exodus');
  const { answers, toggleCommitment, calculateResult } = useSimulator();

  const options = [
    { value: 'study', text: t('simulator.step3_opt1'), icon: <BookOpen className="w-6 h-6 text-cyan-400" /> },
    { value: 'basic_job', text: t('simulator.step3_opt2'), icon: <Briefcase className="w-6 h-6 text-cyan-400" /> },
    { value: 'paperwork', text: t('simulator.step3_opt3'), icon: <FileText className="w-6 h-6 text-cyan-400" /> },
    { value: 'consulting', text: t('simulator.step3_opt4'), icon: <BrainCircuit className="w-6 h-6 text-cyan-400" /> },
    { value: 'platforms', text: t('simulator.step3_opt5'), icon: <Laptop className="w-6 h-6 text-cyan-400" /> },
  ];

  const isNextDisabled = !answers.commitment || answers.commitment.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-300">{t('simulator.step3_title')}</h3>
      <p className="text-center text-gray-400 mb-6">Puedes elegir varias opciones.</p>
      <div className="grid grid-cols-1 gap-3">
        {options.map(opt => (
          <StepButton 
            key={opt.value} 
            {...opt} 
            onClick={() => toggleCommitment(opt.value)} 
            selected={(answers.commitment || []).includes(opt.value)} 
          />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button onClick={calculateResult} size="lg" disabled={isNextDisabled} className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-6 text-lg">
          Ver mi Evaluación <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step3_Commitment;