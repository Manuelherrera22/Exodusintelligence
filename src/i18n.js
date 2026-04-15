import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import modularized translation files
import enPremium from './locales/en/premium.json';
import esPremium from './locales/es/premium.json';
import enGeneral from './locales/en/general.json';
import esGeneral from './locales/es/general.json';
import enDashboard from './locales/en/dashboard.json';
import esDashboard from './locales/es/dashboard.json';
import enAuth from './locales/en/auth.json';
import esAuth from './locales/es/auth.json';
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';
import enExodus from './locales/en/exodus.json';
import esExodus from './locales/es/exodus.json';
import enCamino from './locales/en/caminoMigratorio.json';
import esCamino from './locales/es/caminoMigratorio.json';
import enLifePlanner from './locales/en/life_planner.json';
import esLifePlanner from './locales/es/life_planner.json';
import enProModules from './locales/en/pro_modules.json';
import esProModules from './locales/es/pro_modules.json';
import enFooter from './locales/en/footer.json';
import esFooter from './locales/es/footer.json';
import enSimulator from './locales/en/simulator.json';
import esSimulator from './locales/es/simulator.json';
import enBasicInfo from './locales/en/basic_info.json';
import esBasicInfo from './locales/es/basic_info.json';
import enStateMap from './locales/en/state_map.json';
import esStateMap from './locales/es/state_map.json';
import enLanding from './locales/en/landing.json';
import esLanding from './locales/es/landing.json';

const resources = {
  en: {
    premium: enPremium,
    general: enGeneral,
    dashboard: enDashboard,
    auth: enAuth,
    common: enCommon,
    exodus: enExodus,
    caminoMigratorio: enCamino,
    life_planner: enLifePlanner,
    pro_modules: enProModules,
    footer: enFooter,
    simulator: enSimulator,
    basic_info: enBasicInfo,
    state_map: enStateMap,
    landing: enLanding
  },
  es: {
    premium: esPremium,
    general: esGeneral,
    dashboard: esDashboard,
    auth: esAuth,
    common: esCommon,
    exodus: esExodus,
    caminoMigratorio: esCamino,
    life_planner: esLifePlanner,
    pro_modules: esProModules,
    footer: esFooter,
    simulator: esSimulator,
    basic_info: esBasicInfo,
    state_map: esStateMap,
    landing: esLanding
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    // Specify namespaces
    ns: ['common', 'general', 'premium', 'auth', 'dashboard', 'exodus', 'caminoMigratorio', 'life_planner', 'pro_modules', 'footer', 'simulator', 'state_map', 'landing'],
    defaultNS: 'general', // Default namespace
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    debug: import.meta.env.DEV, // Enable debug mode in development
  });

export default i18n;