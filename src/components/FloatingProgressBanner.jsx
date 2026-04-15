import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const FloatingProgressBanner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t } = useTranslation('onboarding'); // Correct namespace for onboarding
  const [isVisible, setIsVisible] = React.useState(true);

  const welcomeMessage = location.state?.welcomeMessage;

  const handleClose = () => {
    setIsVisible(false);
    // Clean up location state to prevent banner from reappearing on refresh
    navigate(location.pathname, { replace: true, state: {} });
  };

  if (!welcomeMessage || !isVisible || !profile) {
    return null;
  }
  
  const welcomeSubMessage = t('onboarding_welcome_submessage', {
    puntaje: profile.migratory_score || 0,
    plan: profile.plan || 'Gratuito'
  });

  const welcomeCta = t('onboarding_welcome_cta');

  const translatedWelcomeMessage = t('onboarding_welcome_message', {
      nombre: profile.full_name || profile.nombre || 'viajero'
  });


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed bottom-5 left-5 right-5 md:left-auto md:right-5 z-50 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-6 max-w-md w-full"
        >
          <button onClick={handleClose} className="absolute top-3 right-3 text-purple-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-2">{translatedWelcomeMessage}</h3>
            <p className="text-purple-200 text-sm mb-4">{welcomeSubMessage}</p>
            <Button 
              variant="outline" 
              className="bg-transparent border-purple-300 text-purple-200 hover:bg-white/10 hover:text-white hover:border-white"
              onClick={() => navigate('/dashboard')}
            >
              {welcomeCta}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingProgressBanner;