import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Shield, Search, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhyExodusSection = () => {
  const { t } = useTranslation();
  const cards = [
    {
      icon: MessageSquare,
      text: t('why_exodus_card1'),
      color: "text-cyan-400"
    },
    {
      icon: Shield,
      text: t('why_exodus_card2'),
      color: "text-green-400"
    },
    {
      icon: Search,
      text: t('why_exodus_card3'),
      color: "text-purple-400"
    },
    {
      icon: Compass,
      text: t('why_exodus_card4'),
      color: "text-pink-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {t('why_exodus_title_1')}
          </h2>
          <p className="text-4xl md:text-5xl font-bold">{t('why_exodus_title_2')}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 flex items-start gap-6 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2"
            >
              <card.icon className={`w-10 h-10 flex-shrink-0 mt-1 ${card.color}`} />
              <p className="text-xl text-gray-300">{card.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyExodusSection;