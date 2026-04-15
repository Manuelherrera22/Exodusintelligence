import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSimulator } from '@/contexts/SimulatorContext';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { countryData } from '@/data/countries';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const StepResult = () => {
  const { t } = useTranslation('exodus');
  const navigate = useNavigate();
  const { result, resetSimulator } = useSimulator();

  if (!result) return null;

  const { viability, recommendedCountries } = result;
  
  const viabilityInfo = {
    low: {
      label: t('simulator.viability_level_low'),
      msg: t('simulator.viability_msg_low'),
      color: "text-red-400",
    },
    medium: {
      label: t('simulator.viability_level_medium'),
      msg: t('simulator.viability_msg_medium', { country: countryData[recommendedCountries[0]].name }),
      color: "text-yellow-400",
    },
    high: {
      label: t('simulator.viability_level_high'),
      msg: t('simulator.viability_msg_high', { country: countryData[recommendedCountries[0]].name }),
      color: "text-green-400",
    }
  };

  const currentViability = viabilityInfo[viability];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
        {t('simulator.final_step_title')}
      </h2>
      <p className="text-gray-400 mb-4">{t('simulator.final_step_subtitle')}</p>
      
      <div className="relative aspect-[16/10] w-full max-w-2xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden my-6">
        <ComposableMap projectionConfig={{ scale: 120 }} className="w-full h-full">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#2E3A59"
                  stroke="#1E293B"
                  style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                />
              ))
            }
          </Geographies>
          {recommendedCountries.map(code => {
            const country = countryData[code];
            return (
              <Marker key={country.name} coordinates={country.coordinates}>
                <motion.g animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <circle r={8} fill="#FBBF24" stroke="#fff" strokeWidth={2} />
                </motion.g>
              </Marker>
            )
          })}
        </ComposableMap>
      </div>

      <div className="bg-slate-800/60 p-6 rounded-lg max-w-2xl w-full">
        <h3 className={`text-xl font-bold ${currentViability.color}`}>{currentViability.label}</h3>
        <p className="text-gray-300 mt-2">{currentViability.msg}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button onClick={() => navigate('/register')} size="lg" className="px-10 py-6 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
          {t('simulator.final_step_cta')}
        </Button>
        <Button onClick={resetSimulator} size="lg" variant="outline" className="px-10 py-6 text-lg border-slate-600 hover:bg-slate-700">
          <RefreshCw className="w-5 h-5 mr-2" /> Volver a intentar
        </Button>
      </div>
    </motion.div>
  );
};

export default StepResult;