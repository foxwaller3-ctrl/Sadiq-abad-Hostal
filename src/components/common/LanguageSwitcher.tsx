import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext.tsx';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, toggleLang } = useI18n();

  return (
    <button
      onClick={toggleLang}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-teal-600 bg-white hover:bg-teal-50/50 text-slate-800 text-xs md:text-sm font-semibold transition-all duration-150 cursor-pointer shadow-2xs ${className}`}
      aria-label={lang === 'en' ? 'Switch to Urdu' : 'Switch to English'}
    >
      <Globe className="w-4 h-4 text-teal-700" />
      <span>{lang === 'en' ? 'اردو' : 'English'}</span>
    </button>
  );
};
