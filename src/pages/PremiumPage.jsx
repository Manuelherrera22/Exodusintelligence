import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import MainHeader from '@/components/MainHeader';
import PremiumHeroSection from '@/components/sections/premium/PremiumHeroSection';
import WhatIsPremiumSection from '@/components/sections/premium/WhatIsPremiumSection';
import ForWhomIsPremiumSection from '@/components/sections/premium/ForWhomIsPremiumSection';
import PremiumServicesSection from '@/components/sections/premium/PremiumServicesSection';
import PremiumDifferenceSection from '@/components/sections/premium/PremiumDifferenceSection';
import FeaturedCountriesSection from '@/components/sections/premium/FeaturedCountriesSection';
import PremiumPlansSection from '@/components/sections/premium/PremiumPlansSection';
import ConfidentialitySection from '@/components/sections/premium/ConfidentialitySection';
import PremiumExodusCtaSection from '@/components/sections/premium/PremiumExodusCtaSection';
import Footer from '@/components/sections/Footer';
import StickyCTA from '@/components/StickyCTA';
import PremiumTrustSection from '@/components/sections/premium/PremiumTrustSection';

const PremiumPage = () => {
    const { t } = useTranslation('premium');

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
            className="bg-slate-950"
        >
            <Helmet>
                <title>{t('premium_page_title')}</title>
                <meta name="description" content={t('premium_page_description')} />
            </Helmet>
            <MainHeader />
            <main>
                <PremiumHeroSection />
                <WhatIsPremiumSection />
                <ForWhomIsPremiumSection />
                <PremiumServicesSection />
                <PremiumDifferenceSection />
                <FeaturedCountriesSection />
                <PremiumTrustSection />
                <PremiumPlansSection />
                <ConfidentialitySection />
                <PremiumExodusCtaSection />
            </main>
            <Footer />
            <StickyCTA />
        </motion.div>
    );
};

export default PremiumPage;