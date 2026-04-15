import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, LogIn, UserPlus } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const AuthHeader = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  return (
    <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <Globe className="w-7 h-7 text-purple-400" />
          <span className="font-bold text-lg">{t('auth_header_brand')}</span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/login')}>
              <LogIn className="mr-2 h-4 w-4" />
              {t('header_login_button')}
            </Button>
            <Button onClick={() => navigate('/register')}>
              <UserPlus className="mr-2 h-4 w-4" />
              {t('header_register_button')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;