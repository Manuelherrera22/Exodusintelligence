import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SegmentSelectorSection = ({ isStandalone = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const Wrapper = isStandalone ? 'div' : 'section';
  const wrapperProps = isStandalone 
    ? { className: "min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900" } 
    : { className: "py-20 px-4 bg-slate-900/50" };

  return (
    <Wrapper {...wrapperProps}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-200 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            {t('selector_title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('selector_subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="glass-card p-8 flex flex-col text-center items-center hover-glow"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{t('selector_general_title')}</h3>
            <p className="text-gray-400 mb-8 flex-grow">
              {t('selector_general_desc')}
            </p>
            <Button
              onClick={() => navigate('/general')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg py-3 rounded-md"
            >
              {t('selector_general_cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-8 flex flex-col text-center items-center hover-glow"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{t('selector_premium_title')}</h3>
            <p className="text-gray-400 mb-8 flex-grow">
              {t('selector_premium_desc')}
            </p>
            <Button
              onClick={() => navigate('/premium')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-3 rounded-md"
            >
              {t('selector_premium_cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Wrapper>
  );
};

export default SegmentSelectorSection;