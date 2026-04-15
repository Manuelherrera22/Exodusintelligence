import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const MainHeader = () => {
  const { t } = useTranslation('common');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 p-4 sm:p-6 z-30 transition-all duration-300",
        scrolled ? 'bg-slate-900/80 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/a142684d-77a5-43f1-b9b2-81e9712c26e6/1feb47db5ac07aac7ceff6449b65b095.png" alt="Exodus Logo" className="h-12" />
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button asChild variant="outline" className="hidden sm:flex border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-slate-900 bg-transparent hover:bg-opacity-100">
            <Link to="/login">{t('header_login_button')}</Link>
          </Button>
           <Button asChild className="hidden sm:flex bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold group">
            <Link to="/register">
              {t('header_register_button')}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;