import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString('en-US')
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const TrustSection = () => {
  const { t } = useTranslation();
  const [currentTicker, setCurrentTicker] = useState(0);

  const tickers = [
    t('trust_ticker1'),
    t('trust_ticker2'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTicker((prev) => (prev + 1) % tickers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickers.length]);

  const logos = [
    { name: 'Forbes', alt: 'Logo de Forbes' },
    { name: 'TechCrunch', alt: 'Logo de TechCrunch' },
    { name: 'Bloomberg', alt: 'Logo de Bloomberg' },
    { name: 'Wired', alt: 'Logo de Wired' },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-900 to-purple-900/20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wider mb-8">
            {t('trust_as_seen_on')}
          </h3>
          <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap grayscale opacity-60">
            {logos.map((logo) => (
              <img  key={logo.name} class="h-8" alt={logo.alt} src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-2xl border border-cyan-500/20"
        >
          <div className="text-4xl md:text-5xl font-bold text-white">
            +<AnimatedNumber value={4328} />
          </div>
          <div className="mt-2 text-lg text-cyan-300 h-8">
            <motion.p
              key={currentTicker}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ ease: 'easeInOut', duration: 0.5 }}
            >
              {tickers[currentTicker]}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;