import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../data/portfolioData';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LANG_STORAGE_KEY = 'nl_language';

const LanguageContext = createContext<LanguageContextValue>({
  language: 'DA',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'DA';
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'DA' || saved === 'EN') return saved;
    } catch {
      // ignore storage errors
    }
    return 'DA';
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'DA' ? 'da' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
