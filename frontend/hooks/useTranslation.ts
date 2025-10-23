import { useState, useEffect } from 'react';
import frTranslations from '@/locales/fr.json';

type TranslationKeys = typeof frTranslations;

export function useTranslation() {
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  
  const t = (key: string): string => {
    if (locale === 'fr') {
      const keys = key.split('.');
      let value: any = frTranslations;
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return typeof value === 'string' ? value : key;
    }
    
    // Fallback to English (key itself for now)
    return key;
  };
  
  const changeLocale = (newLocale: 'fr' | 'en') => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };
  
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as 'fr' | 'en';
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);
  
  return { t, locale, changeLocale };
}
