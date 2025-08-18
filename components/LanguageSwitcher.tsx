'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/languages';

interface LanguageSwitcherProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangConfig = SUPPORTED_LANGUAGES[currentLanguage];

  const handleLanguageSelect = (language: SupportedLanguage) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Current Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg glass hover:opacity-80 transition-all duration-200 ${
          className.includes('w-full') ? 'w-full justify-between' : ''
        }`}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" role="img" aria-label={currentLangConfig.name}>
            {currentLangConfig.flag}
          </span>
          <span className="text-sm font-medium text-theme-primary lg:hidden">
            {currentLangConfig.nativeName}
          </span>
          <span className="text-sm font-medium text-theme-primary hidden lg:inline">
            {currentLangConfig.code.toUpperCase()}
          </span>
          <span className="text-xs text-theme-secondary hidden xl:inline ml-1">
            {currentLangConfig.nativeName}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-theme-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full mt-2 py-2 glass shadow-xl z-50 ${
          className.includes('w-full') ? 'left-0 right-0 w-full' : 'right-0 w-56'
        }`}>
          <div className="px-3 py-2 text-xs font-semibold text-theme-secondary uppercase tracking-wider border-b border-primary/10">
            Choose Language
          </div>
          
          {Object.values(SUPPORTED_LANGUAGES).map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-primary/10 transition-colors duration-200 ${
                currentLanguage === language.code ? 'bg-primary/5 border-l-2 border-primary' : ''
              }`}
              role="option"
              aria-selected={currentLanguage === language.code}
            >
              <span className="text-lg" role="img" aria-label={language.name}>
                {language.flag}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-theme-primary">
                  {language.nativeName}
                </div>
                <div className="text-xs text-theme-secondary">
                  {language.name}
                </div>
              </div>
              {currentLanguage === language.code && (
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
