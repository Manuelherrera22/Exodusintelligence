import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { SupabaseAuthProvider as AuthProvider } from '@/contexts/SupabaseAuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import i18next from 'i18next';
import './i18n'; // Import i18n configuration
import esMigratoryProfile from './locales/es/migratory_profile.json';
import enMigratoryProfile from './locales/en/migratory_profile.json';
import esOnboarding from './locales/es/onboarding.json';
import enOnboarding from './locales/en/onboarding.json';
import esMyMigrationRoute from './locales/es/my_migration_route.json';
import enMyMigrationRoute from './locales/en/my_migration_route.json';
import esStateMap from './locales/es/state_map.json';
import enStateMap from './locales/en/state_map.json';
import esCaminoMigratorio from './locales/es/caminoMigratorio.json';
import enCaminoMigratorio from './locales/en/caminoMigratorio.json';
import esLifePlanner from './locales/es/life_planner.json';
import enLifePlanner from './locales/en/life_planner.json';


// Add new namespace resources
i18next.addResourceBundle('es', 'migratory_profile', esMigratoryProfile);
i18next.addResourceBundle('en', 'migratory_profile', enMigratoryProfile);
i18next.addResourceBundle('es', 'onboarding', esOnboarding);
i18next.addResourceBundle('en', 'onboarding', enOnboarding);
i18next.addResourceBundle('es', 'my_migration_route', esMyMigrationRoute);
i18next.addResourceBundle('en', 'my_migration_route', enMyMigrationRoute);
i18next.addResourceBundle('es', 'state_map', esStateMap);
i18next.addResourceBundle('en', 'state_map', enStateMap);
i18next.addResourceBundle('es', 'caminoMigratorio', esCaminoMigratorio);
i18next.addResourceBundle('en', 'caminoMigratorio', enCaminoMigratorio);
i18next.addResourceBundle('es', 'life_planner', esLifePlanner);
i18next.addResourceBundle('en', 'life_planner', enLifePlanner);

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      Cargando...
    </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
              <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);