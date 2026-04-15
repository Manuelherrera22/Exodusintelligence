import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MigratoryProfileForm from '@/components/MigratoryProfileForm';

const UpdateProfilePage = () => {
    const { t } = useTranslation('dashboard');

    return (
        <>
            <Helmet>
                <title>{t('migratory_profile.page_title')}</title>
            </Helmet>
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <MigratoryProfileForm />
                </motion.div>
            </div>
        </>
    );
};

export default UpdateProfilePage;