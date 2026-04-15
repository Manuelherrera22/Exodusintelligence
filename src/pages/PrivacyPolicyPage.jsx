import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/sections/Footer';

const PrivacyPolicyPage = () => {
  const { t } = useTranslation('common');

  const content = {
    title: t('privacy_policy_title'),
    lastUpdated: "July 9, 2025",
    sections: [
      {
        title: "1. Information We Collect",
        text: "We collect information you provide directly to us, such as when you create an account, fill out our migration simulator, or communicate with us. This may include personal data such as your name, email, nationality, educational level, work experience, and economic situation. We also collect technical data automatically, such as your IP address and browsing data through cookies."
      },
      {
        title: "2. Purpose of Data Processing",
        text: "The data collected is used to: provide and personalize our services, including the generation of your Migratory Score™; communicate with you about our services; improve and develop new products; and comply with our legal obligations. The use of AI is central to our service to analyze your profile and offer personalized recommendations."
      },
      {
        title: "3. Data Retention",
        text: "We retain your personal data for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements. You can request the deletion of your data at any time."
      },
      {
        title: "4. Your Rights",
        text: "In accordance with GDPR, Habeas Data, and other applicable laws, you have the right to access, rectify, or delete your personal data. You can also object to or restrict the processing of your data. To exercise these rights, please contact us at legal@exodus.com."
      },
      {
        title: "5. Data Security",
        text: "We implement robust security measures, such as data encryption and access controls, to protect your information against unauthorized access, alteration, or destruction. We are committed to complying with standards like ISO/IEC 27001."
      },
      {
        title: "6. Data Controller",
        text: "The data controller is Exodus Intelligence Inc., located in Panama City, Panama. For any questions related to this policy, you can contact our Data Protection Officer at dpo@exodus.com."
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-slate-900 text-white min-h-screen"
    >
      <Helmet>
        <title>{content.title} - Exodus Intelligence</title>
      </Helmet>
      <MainHeader />
      <main className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            {content.title}
          </motion.h1>
          <p className="text-center text-gray-500 mb-12">Last Updated: {content.lastUpdated}</p>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            {content.sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-100 mb-3">{section.title}</h2>
                <p>{section.text}</p>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicyPage;