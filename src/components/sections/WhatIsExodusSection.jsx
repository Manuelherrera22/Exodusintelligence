import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Route, HeartHandshake as Handshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhatIsExodusSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: BrainCircuit,
      title: t('s2_block1_title'),
      description: t('s2_block1_desc'),
    },
    {
      icon: Route,
      title: t('s2_block2_title'),
      description: t('s2_block2_desc'),
    },
    {
      icon: Handshake,
      title: t('s2_block3_title'),
      description: t('s2_block3_desc'),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section className="py-24 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('s2_title')}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-8 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 mx-auto">
                <step.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatIsExodusSection;