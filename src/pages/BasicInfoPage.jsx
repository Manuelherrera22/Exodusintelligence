import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuroraBackground } from '@/components/ui/aurora-background';
import BasicInfoForm from '@/components/BasicInfoForm';

const BasicInfoPage = () => {
    const { t } = useTranslation('basic_info');

    return (
        <AuroraBackground>
            <Helmet>
                <title>{t('page_title')}</title>
            </Helmet>
            <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 py-12">
                <BasicInfoForm />
            </div>
        </AuroraBackground>
    );
};

export default BasicInfoPage;