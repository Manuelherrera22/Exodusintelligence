import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Lock, FileText, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegistrationBenefitsSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const benefits = [
    { icon: Lock, text: t('benefit1_text') },
    { icon: FileText, text: t('benefit2_text') },
    { icon: Check, text: t('benefit3_text') },
    { icon: MessageCircle, text: t('benefit4_text') }
  ];

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            {t('benefits_title')}
          </h2>
          <p className="text-lg text-gray-400">{t('benefits_subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-gray-800/30 rounded-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-semibold">{benefit.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={handleRegisterClick}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl px-12 py-7 rounded-full shadow-2xl shadow-red-500/20 transform hover:scale-105 transition-all duration-300"
          >
            {t('benefits_cta')}
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationBenefitsSection;