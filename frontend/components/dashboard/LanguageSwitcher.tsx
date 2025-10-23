'use client';

import { useState } from 'react';
import { Globe, Check, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (newLocale: 'fr' | 'en') => {
    setLocale(newLocale);
    setIsOpen(false);
    
    // Show a brief notification
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in';
      notification.textContent = newLocale === 'fr' ? '🇫🇷 Langue changée en Français' : '🇬🇧 Language changed to English';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  };

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
        title="Changer la langue / Change language"
      >
        <Languages className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">
          {locale.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code as 'fr' | 'en')}
                className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-gray-700">{lang.name}</span>
                </div>
                {locale === lang.code && (
                  <Check className="h-4 w-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
