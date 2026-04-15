import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const SimulatorSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('simulator');
  const [selections, setSelections] = useState({ country: null, reason: null, age: null });
  const [showResult, setShowResult] = useState(false);

  const options = {
    country: t('country_options', { returnObjects: true }),
    reason: t('reason_options', { returnObjects: true }),
    age: t('age_options', { returnObjects: true })
  };

  const handleSelect = (category, value) => {
    const newSelections = { ...selections, [category]: value };
    setSelections(newSelections);
    if (Object.values(newSelections).every(v => v !== null)) {
      setShowResult(true);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 space-y-8"
        >
          <SimulatorRow
            label={t('country_label')}
            options={options.country}
            selected={selections.country}
            onSelect={(val) => handleSelect('country', val)}
          />
          <SimulatorRow
            label={t('reason_label')}
            options={options.reason}
            selected={selections.reason}
            onSelect={(val) => handleSelect('reason', val)}
          />
          <SimulatorRow
            label={t('age_label')}
            options={options.age}
            selected={selections.age}
            onSelect={(val) => handleSelect('age', val)}
          />

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: '32px' }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="text-center bg-green-500/10 border border-green-500/30 p-6 rounded-lg"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-lg text-white mb-6">
                  <Trans i18nKey="result_text" ns="simulator">
                    Tus primeras respuestas indican que puedes migrar legalmente. <span className="font-bold text-green-300 cursor-pointer hover:underline" onClick={handleRegisterClick}></span>
                  </Trans>
                </p>
                <Button
                  onClick={handleRegisterClick}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white text-lg px-8 py-6"
                >
                  {t('result_cta')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const SimulatorRow = ({ label, options, selected, onSelect }) => (
  <div className="flex flex-col sm:flex-row items-center gap-4">
    <span className="text-lg font-semibold w-full sm:w-48 text-center sm:text-left">{label}</span>
    <div className="flex flex-wrap gap-2 justify-center">
      {options.map(opt => (
        <Button
          key={opt}
          variant={selected === opt ? 'default' : 'outline'}
          onClick={() => onSelect(opt)}
          className={`transition-all duration-200 ${selected === opt ? 'bg-purple-600 border-purple-500' : 'border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'}`}
        >
          {opt}
        </Button>
      ))}
    </div>
  </div>
);

export default SimulatorSection;