import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumHeroSection = () => {
  const { t } = useTranslation('premium');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRequest = () => {
    navigate('/register');
  };

  const handleDestinations = () => {
    // This could scroll to the featured countries section
    document.getElementById('featured-countries')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          poster="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&auto=format&fit=crop"
        >
          <source src="https://cdn.pixabay.com/video/2022/10/20/13510-762698119_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-300 rounded-full px-4 py-1 mb-6 border border-amber-500/20"
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>{t('premium_s2_item3')}</span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t('premium_s1_title')}
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {t('premium_s1_subtitle')}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={handleRequest}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold text-lg px-8 py-6 rounded-full shadow-lg shadow-amber-500/20 transform hover:scale-105 transition-all duration-300 group"
          >
            {t('premium_s1_cta1')}
            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          <Button
            onClick={handleDestinations}
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 rounded-full border-amber-300 text-amber-300 hover:bg-amber-300/10 hover:text-amber-200"
          >
            {t('premium_s1_cta2')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PremiumHeroSection;