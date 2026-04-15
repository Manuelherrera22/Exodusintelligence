import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';

import DiscoveryFlow from '@/components/DiscoveryFlow';
import GeneralPage from '@/pages/GeneralPage';
import PremiumPage from '@/pages/PremiumPage';
import RegistrationPage from '@/pages/RegistrationPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import AiTransparencyPage from '@/pages/AiTransparencyPage';
import PaymentPage from '@/pages/PaymentPage';
import MigrationRoutePage from '@/pages/MigrationRoutePage';
import OptionsMapPage from '@/pages/OptionsMapPage';
import DocumentsPage from '@/pages/DocumentsPage';
import AlertsPage from '@/pages/AlertsPage';
import SupportPage from '@/pages/SupportPage';
import BenefitsPage from '@/pages/BenefitsPage';
import PlansComparisonPage from '@/pages/PlansComparisonPage';
import DocumentVerificationPage from '@/pages/pro/DocumentVerificationPage';
import LifePlannerPage from '@/pages/pro/LifePlannerPage';
import UpdateProfilePage from '@/pages/UpdateProfilePage';
import TestPage from '@/pages/TestPage';
import BasicInfoPage from '@/pages/BasicInfoPage';
import MyMigrationRoutePage from '@/pages/pro/MyMigrationRoutePage';
import StateMapPage from '@/pages/StateMapPage';

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from 'react-i18next';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { SimulatorProvider } from '@/contexts/SimulatorContext';
import ProtectedRoute from '@/components/layouts/ProtectedRoute';
import DashboardLayout from '@/components/layouts/DashboardLayout';

function App() {
  const location = useLocation();
  const { session, loading } = useAuth();
  const { t } = useTranslation('common');

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* Zero Friction Entry — the Discovery Flow */}
          <Route path="/" element={<DiscoveryFlow />} />
          <Route path="/explore" element={<SimulatorProvider><GeneralPage /></SimulatorProvider>} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/ai-transparency" element={<AiTransparencyPage />} />
          <Route path="/test-form" element={<TestPage />} />

          {/* Auth Routes */}
          <Route path="/register" element={!session ? <RegistrationPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" replace />} />

          {/* Protected Routes Without Dashboard Background */}
          <Route element={<ProtectedRoute />}>
             <Route path="/basic-info" element={<BasicInfoPage />} />
             <Route path="/update-profile" element={<UpdateProfilePage />} />
          </Route>

          {/* Protected Routes With Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/dashboard-free" element={<DashboardPage />} />
                  <Route path="/my-migration-route" element={<MyMigrationRoutePage />} />
                  <Route path="/options-map" element={<OptionsMapPage />} />
                  <Route path="/map/:countryCode" element={<StateMapPage />} />
                  <Route path="/payment/:planId" element={<PaymentPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/pro/document-verification" element={<DocumentVerificationPage />} />
                  <Route path="/pro/life-planner" element={<LifePlannerPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/benefits" element={<BenefitsPage />} />
                  <Route path="/compare-plans" element={<PlansComparisonPage />} />
              </Route>
          </Route>

        </Routes>
      </AnimatePresence>
      <Toaster />
      <CookieConsentBanner />
    </div>
  );
}

export default App;