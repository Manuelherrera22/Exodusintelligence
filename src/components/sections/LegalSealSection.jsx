import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LegalSealSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {t('legal_seal_title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('legal_seal_subtitle')}
          </p>
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 inline-flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-green-400" />
            <span className="text-xl font-bold">{t('legal_seal_tag')}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center"
        >
          <div className="relative w-80 h-40">
            <img 
              className="w-full h-full object-contain"
              alt={t('legal_seal_title')}
             src="https://images.unsplash.com/photo-1675473086331-bfd4aebb45ac" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LegalSealSection;