import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { toast } = useToast();
  const { t } = useTranslation('footer');

  const handleWipLinkClick = () => {
    toast({
      title: t('toast_wip_title'),
      description: t('toast_wip_desc'),
    });
  };

  const footerLinks = [
    {
      titleKey: 'nav_legal',
      links: [
        { key: 'nav_privacy', path: '/privacy-policy' },
        { key: 'nav_terms', path: '/terms-of-service' },
        { key: 'nav_cookies', action: handleWipLinkClick },
        { key: 'nav_ai', path: '/ai-transparency' }
      ]
    },
    {
      titleKey: 'nav_support',
      links: [
        { key: 'nav_contact', action: handleWipLinkClick },
        { key: 'nav_about', action: handleWipLinkClick },
        { key: 'nav_blog', action: handleWipLinkClick }
      ]
    },
    {
      titleKey: 'nav_social',
      links: [
        { key: 'nav_whatsapp', action: handleWipLinkClick },
        { key: 'nav_instagram', action: handleWipLinkClick },
        { key: 'nav_tiktok', action: handleWipLinkClick }
      ]
    }
  ];

  return (
    <footer className="py-16 px-4 bg-slate-900 border-t border-gray-700/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/a142684d-77a5-43f1-b9b2-81e9712c26e6/a9e01740d8e0a942be8848bbb0a593f0.png" alt="Exodus Logo" className="h-10" />
            </div>
            <p className="text-gray-400">{t('subtitle')}</p>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.titleKey}>
              <span className="text-lg font-semibold text-white mb-4 block">{t(section.titleKey)}</span>
              <div className="space-y-3">
                {section.links.map((link) => (
                  link.path ? (
                    <Link
                      key={link.key}
                      to={link.path}
                      className="block text-gray-400 hover:text-purple-400 transition-colors text-left"
                    >
                      {t(link.key)}
                    </Link>
                  ) : (
                    <button
                      key={link.key}
                      onClick={link.action}
                      className="block text-gray-400 hover:text-purple-400 transition-colors text-left"
                    >
                      {t(link.key)}
                    </button>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700/50 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-500 gap-4">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};

export default Footer;