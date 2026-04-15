import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, BrainCircuit, FileCheck, Bell, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PotentialProfileSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    { icon: Target, text: t('potential_feature1') },
    { icon: BrainCircuit, text: t('potential_feature2') },
    { icon: FileCheck, text: t('potential_feature3') },
    { icon: Bell, text: t('potential_feature4') },
    { icon: Compass, text: t('potential_feature5') },
  ];

  const handleRegisterClick = () => {
    navigate('/registro');
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-900 to-purple-900/40">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            {t('potential_title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('potential_subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 mb-6">
              {t('potential_dev_text')}
            </p>
            <p className="text-lg font-semibold text-purple-300 mb-8">
              {t('potential_dev_text2')}
            </p>
            <h3 className="text-2xl font-bold mb-6">{t('potential_includes_title')}</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <p className="text-gray-300">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-8 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 text-center"
          >
            <img  class="w-full h-auto object-contain rounded-lg mb-6" alt="Visualización animada de un perfil de usuario completándose con barras de progreso y estadísticas." src="https://images.unsplash.com/photo-1666892666066-abe5c4865e9c" />
            <p className="text-2xl font-bold text-white mb-4">
              {t('potential_emotional_close')}
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-300 to-cyan-300 bg-clip-text text-transparent mb-8">
              {t('potential_emotional_close2')}
            </p>
            <Button
              onClick={handleRegisterClick}
              className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white text-lg py-6 rounded-full shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300"
            >
              {t('potential_cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PotentialProfileSection;