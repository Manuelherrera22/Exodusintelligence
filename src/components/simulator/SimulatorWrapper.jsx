import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSimulator } from '@/contexts/SimulatorContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

import ProgressBar from './ProgressBar';
import StepWelcome from './StepWelcome';
import Step1_Motivation from './Step1_Motivation';
import Step2_Profile from './Step2_Profile';
import Step3_Commitment from './Step3_Commitment';
import StepResult from './StepResult';

const TOTAL_STEPS = 5; // Welcome, Motivation, Profile, Commitment, Result

const SimulatorWrapper = () => {
  const { step } = useSimulator();
  const navigate = useNavigate();
  const { t: tCommon } = useTranslation('common');

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepWelcome />;
      case 2:
        return <Step1_Motivation />;
      case 3:
        return <Step2_Profile />;
      case 4:
        return <Step3_Commitment />;
      case 5:
        return <StepResult />;
      default:
        return <StepWelcome />;
    }
  };

  return (
    <section id="simulator" className="py-16 sm:py-24 px-4 bg-transparent">
      <div className="max-w-4xl mx-auto glass-card p-6 sm:p-10 overflow-hidden">
        {step > 1 && step < TOTAL_STEPS && <ProgressBar totalSteps={TOTAL_STEPS} />}
        
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step > 1 && step < TOTAL_STEPS && (
          <div className="mt-8 text-center">
            <Button variant="link" onClick={() => navigate('/login')} className="text-gray-400 hover:text-white">
              {tCommon('simulator_already_have_account')}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SimulatorWrapper;