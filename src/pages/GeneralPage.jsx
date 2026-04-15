import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import MainHeader from '@/components/MainHeader';
import HeroSection from '@/components/sections/HeroSection';
import TrustBar from '@/components/TrustBar';
import ImpactCounter from '@/components/ImpactCounter';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import InteractiveMapSection from '@/components/sections/InteractiveMapSection';
import PersonalizedAnalysisCTA from '@/components/sections/PersonalizedAnalysisCTA';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import DataPrivacySection from '@/components/sections/DataPrivacySection';
import Footer from '@/components/sections/Footer';
import FloatingChat from '@/components/FloatingChat';
import StickyCTA from '@/components/StickyCTA';
import ParticlesBackground from '@/components/ParticlesBackground';
import SimulatorWrapper from '@/components/simulator/SimulatorWrapper';

const GeneralPage = () => {
  const { t } = useTranslation('general');

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.8,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-slate-900"
    >
      <Helmet>
        <title>{t('seo_title')}</title>
        <meta name="description" content={t('seo_description')} />
      </Helmet>
      
      <ParticlesBackground />
      <MainHeader />
      <StickyCTA />
      <main className="relative z-10">
        <HeroSection />
        <TrustBar />
        <ImpactCounter />
        <HowItWorksSection />
        <SimulatorWrapper />
        <TestimonialsSection />
        <InteractiveMapSection />
        <PersonalizedAnalysisCTA />
        <DataPrivacySection />
      </main>
      <Footer />
      <FloatingChat />
    </motion.div>
  );
};

export default GeneralPage;