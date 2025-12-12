
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, detectLanguage, translations, languages } from '../services/i18nService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  availableLanguages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or detector
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('flashai_language');
    if (saved && translations.hasOwnProperty(saved)) {
      return saved as Language;
    }
    return detectLanguage();
  });

  // Wrapper to save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('flashai_language', lang);
  };

  const t = (path: string): any => {
    const keys = path.split('.');
    let current = translations[language];
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if translation missing
        let fallback = translations['en'];
        for (const fbKey of keys) {
            if (fallback && fallback[fbKey] !== undefined) {
                fallback = fallback[fbKey];
            } else {
                return path; // Return key if not found in fallback either
            }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
