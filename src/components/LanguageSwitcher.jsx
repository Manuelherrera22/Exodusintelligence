import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LanguageSwitcher = ({ compact = false }) => {
  const { i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-[var(--surface-alpha)] transition-colors"
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark
            ? <Sun className="w-3.5 h-3.5 text-amber-400/60" />
            : <Moon className="w-3.5 h-3.5 text-indigo-400/60" />}
        </button>
        <span className="text-[var(--text-muted)]">·</span>
        <Globe className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
        <button
          onClick={() => changeLanguage('es')}
          className={`text-[11px] font-medium px-1 transition-colors ${
            currentLanguage.startsWith('es')
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >ES</button>
        <button
          onClick={() => changeLanguage('en')}
          className={`text-[11px] font-medium px-1 transition-colors ${
            currentLanguage.startsWith('en')
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >EN</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl hover:bg-[var(--surface-alpha)] transition-all duration-300 group"
        title={isDark ? 'Modo claro' : 'Modo oscuro'}
      >
        {isDark
          ? <Sun className="w-4 h-4 text-amber-400/50 group-hover:text-amber-400 transition-colors" />
          : <Moon className="w-4 h-4 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />}
      </button>

      <span className="text-[var(--text-muted)]">|</span>

      {/* Language */}
      <Globe className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      <button
        onClick={() => changeLanguage('es')}
        className={`text-xs font-semibold px-1.5 py-1 rounded-md transition-all duration-200 ${
          currentLanguage.startsWith('es')
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
        }`}
      >ES</button>
      <span style={{ color: 'var(--text-muted)' }}>|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-xs font-semibold px-1.5 py-1 rounded-md transition-all duration-200 ${
          currentLanguage.startsWith('en')
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
        }`}
      >EN</button>
    </div>
  );
};

export default LanguageSwitcher;