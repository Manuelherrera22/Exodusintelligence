import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, BrainCircuit, Globe, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhyTrustUsSection = () => {
  const { t } = useTranslation();
  const trustPoints = [
    { icon: ShieldCheck, text: t('s4_point1') },
    { icon: Lock, text: t('s4_point2') },
    { icon: BrainCircuit, text: t('s4_point3') },
    { icon: Globe, text: t('s4_point4') },
    { icon: UserCheck, text: t('s4_point5') },
  ];

  return (
    <section className="py-24 px-4 bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            {t('s4_title')}
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-700">
                <point.icon className="w-10 h-10 text-green-400" />
              </div>
              <p className="text-gray-300">{point.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTrustUsSection;