import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

const FinalCtaSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('exodus');
  const { t: tGeneral } = useTranslation('general');
  const { toast } = useToast();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <section className="py-24 px-4 bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center bg-slate-800/50 p-10 rounded-2xl border border-purple-500/20 shadow-lg"
      >
        <Sparkles className="w-12 h-12 mx-auto mb-6 text-purple-400" />
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t('cta.title')}
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            {t('cta.subtitle')}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 text-left">
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta.benefit1')}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta.benefit2')}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta.benefit3')}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta.benefit4')}
            </div>
        </div>
        
        <p className="text-gray-500 max-w-xl mx-auto mb-8">{t('cta.text')}</p>

        <Button
          onClick={handleRegisterClick}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-purple-500/20 transform hover:scale-105 transition-all duration-300 group"
        >
          {t('cta.button')}
          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
};

export default FinalCtaSection;