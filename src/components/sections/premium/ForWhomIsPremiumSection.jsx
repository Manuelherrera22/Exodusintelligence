import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Globe, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ForWhomIsPremiumSection = () => {
  const { t } = useTranslation('premium');

  const profiles = [
    { icon: Briefcase, title: t('premium_s3_p1_title'), desc: t('premium_s3_p1_desc') },
    { icon: Globe, title: t('premium_s3_p2_title'), desc: t('premium_s3_p2_desc') },
    { icon: TrendingUp, title: t('premium_s3_p3_title'), desc: t('premium_s3_p3_desc') },
    { icon: Users, title: t('premium_s3_p4_title'), desc: t('premium_s3_p4_desc') }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
            {t('premium_s3_title')}
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {profiles.map((profile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-card p-8 rounded-xl text-center hover-glow"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                <profile.icon className="w-10 h-10 text-amber-300" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{profile.title}</h3>
              <p className="text-gray-400">{profile.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhomIsPremiumSection;