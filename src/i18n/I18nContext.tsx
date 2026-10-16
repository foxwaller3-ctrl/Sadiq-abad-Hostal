import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '../types/index.ts';
import enTranslations from './en.json';
import urTranslations from './ur.json';

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  dir: 'ltr' | 'rtl';
  t: (keyPath: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('hostel_lang');
      if (saved === 'en' || saved === 'ur') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const dir: 'ltr' | 'rtl' = lang === 'ur' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      localStorage.setItem('hostel_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (keyPath: string): string => {
    const dict = lang === 'ur' ? urTranslations : enTranslations;
    const fallbackDict = enTranslations;

    const parts = keyPath.split('.');
    let cur: any = dict;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p];
      } else {
        cur = undefined;
        break;
      }
    }

    if (typeof cur === 'string') {
      return cur;
    }

    // Fallback to English dictionary
    let fallback: any = fallbackDict;
    for (const p of parts) {
      if (fallback && typeof fallback === 'object' && p in fallback) {
        fallback = fallback[p];
      } else {
        fallback = undefined;
        break;
      }
    }

    if (typeof fallback === 'string') {
      return fallback;
    }

    return keyPath;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, dir, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
