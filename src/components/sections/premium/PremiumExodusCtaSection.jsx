import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Gem } from 'lucide-react';

const PremiumExodusCtaSection = () => {
  const { t } = useTranslation('exodus');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUnlock = () => {
    navigate('/register');
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-t from-slate-950 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center bg-slate-800/50 p-10 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/10"
      >
        <Gem className="w-12 h-12 mx-auto mb-6 text-amber-400" />
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
          {t('cta_premium.title')}
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            {t('cta_premium.subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta_premium.benefit1')}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta_premium.benefit2')}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta_premium.benefit3')}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0" /> {t('cta_premium.benefit4')}
            </div>
        </div>
        
        <p className="text-gray-500 max-w-xl mx-auto mb-8">{t('cta_premium.text')}</p>

        <Button
          onClick={handleUnlock}
          size="lg"
          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-amber-500/20 transform hover:scale-105 transition-all duration-300 group"
        >
          {t('cta_premium.button')}
          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </section>
  );
};

export default PremiumExodusCtaSection;