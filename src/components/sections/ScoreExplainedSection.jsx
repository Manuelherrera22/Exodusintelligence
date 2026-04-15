import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, CheckCircle, TrendingUp, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ScoreExplainedSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    { icon: BarChart, text: t('s3_feature1') },
    { icon: CheckCircle, text: t('s3_feature2') },
    { icon: TrendingUp, text: t('s3_feature3') },
    { icon: Unlock, text: t('s3_feature4') },
  ];

  const handleRegisterClick = () => {
    navigate('/registro');
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-900 to-purple-900/40">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            {t('s3_title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('s3_subtitle')}
          </p>
          <div className="space-y-4 mb-8">
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
          <Button
            onClick={handleRegisterClick}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-lg py-6 px-8 rounded-full shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300"
          >
            {t('s3_cta')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img  class="w-full h-auto object-contain rounded-lg" alt={t('s3_image_alt')} src="https://images.unsplash.com/photo-1666892666066-abe5c4865e9c" />
        </motion.div>
      </div>
    </section>
  );
};

export default ScoreExplainedSection;