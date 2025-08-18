'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/lib/themes';

interface ThemeOption {
  key: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const themeOptions: ThemeOption[] = Object.entries(themes).map(([key, theme]) => ({
  key,
  name: theme.name,
  colors: {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    accent: theme.colors.accent,
  }
}));

export default function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentThemeData = themes[currentTheme];

  const handleThemeSelect = (themeKey: string) => {
    setTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--text)',
        }}
        aria-label="Switch theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Theme Color Preview */}
        <div className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentThemeData.colors.primary }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentThemeData.colors.secondary }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentThemeData.colors.accent }}
          />
        </div>
        
        {/* Theme Name - Hidden on mobile and small screens, shown on larger screens */}
        <span className="hidden lg:inline text-theme-primary text-xs xl:text-sm truncate max-w-24 xl:max-w-none">
          {currentThemeData.name}
        </span>
        
        {/* Dropdown Arrow */}
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
        <div
          className="absolute top-full mt-2 right-0 min-w-[180px] sm:min-w-[220px] lg:min-w-[260px] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="p-2">
            {themeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleThemeSelect(option.key)}
                className={`group w-full text-left px-3 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  currentTheme === option.key
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Theme Color Preview */}
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: option.colors.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: option.colors.secondary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: option.colors.accent }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    {/* Theme Name */}
                    <div className="text-sm font-medium text-theme-primary group-hover:text-white transition-colors">
                      {option.name}
                    </div>
                    
                    {/* Theme Category Hint */}
                    <div className="text-xs text-theme-secondary opacity-70">
                      {option.key.includes('light') || option.key.includes('frost') || option.key.includes('garden') || option.key.includes('golden') 
                        ? 'Light Theme' 
                        : option.key.includes('monochrome')
                        ? 'Monochrome'
                        : 'Dark Theme'
                      }
                    </div>
                  </div>
                  
                  {/* Current Theme Indicator */}
                  {currentTheme === option.key && (
                    <div className="text-theme-primary">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
