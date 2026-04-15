import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cookie, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CookieConsentBanner = () => {
  // Using the default namespace which points to translation.json
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 20, opacity: 0, scale: 0.95, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-xl"
        >
          <div 
            className="rounded-2xl p-4 shadow-[0_0_40px_rgba(0,0,0,0.15)] backdrop-blur-xl border flex flex-col sm:flex-row items-center gap-4"
            style={{ 
              backgroundColor: 'var(--surface-alpha)', 
              borderColor: 'var(--chat-border)',
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {t('cookie_banner_text')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              <button 
                onClick={handleDecline} 
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border hover:bg-black/5"
                style={{ borderColor: 'var(--chat-border)', color: 'var(--text-muted)' }}
              >
                {t('cookie_banner_decline')}
              </button>
              <button 
                onClick={handleAccept} 
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-200 active:scale-[0.98]"
              >
                {t('cookie_banner_accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;