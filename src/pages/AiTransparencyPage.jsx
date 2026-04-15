import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/sections/Footer';
import { Bot, Scale, Shield, BrainCircuit } from 'lucide-react';

const AiTransparencyPage = () => {
  const { t } = useTranslation('common');

  const content = {
    title: t('ai_transparency_title'),
    sections: [
      {
        icon: <Bot className="w-8 h-8 text-purple-400" />,
        title: "What our AI does",
        points: [
          "Analyzes your profile to calculate a Migratory Score™.",
          "Suggests potential migration destinations based on your data.",
          "Identifies strengths and weaknesses in your profile.",
          "Recommends concrete actions to improve your score."
        ]
      },
      {
        icon: <Scale className="w-8 h-8 text-purple-400" />,
        title: "What our AI does NOT do",
        points: [
          "It does not provide binding legal advice.",
          "It does not guarantee the approval of any visa or residency.",
          "It does not make final decisions; it provides recommendations.",
          "It does not replace consultation with a human legal expert."
        ]
      },
      {
        icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
        title: "How it's trained and its limitations",
        points: [
          "Our AI is trained with anonymized data from thousands of successful migration cases and public immigration legislation.",
          "The model is constantly updated, but there may be delays with respect to the latest legal changes.",
          "The recommendations are probabilistic and are not a guarantee of success."
        ]
      },
      {
        icon: <Shield className="w-8 h-8 text-purple-400" />,
        title: "Ethical Commitment and Bias",
        points: [
          "We conduct periodic audits to detect and mitigate algorithmic biases related to nationality, gender, or other factors.",
          "All critical results are reviewable by our team of human experts.",
          "We are committed to the responsible and transparent use of artificial intelligence."
        ]
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
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            {content.title}
          </motion.h1>

          <div className="space-y-12">
            {content.sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  {section.icon}
                  <h2 className="text-2xl font-bold text-gray-200">{section.title}</h2>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  {section.points.map((point, pIndex) => (
                    <li key={pIndex}>{point}</li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default AiTransparencyPage;