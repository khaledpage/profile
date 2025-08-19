'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { themes, Theme } from '@/lib/themes';

// Import config with dynamic import to avoid issues
let config: any = {};
try {
  config = require('@/config/config.json');
} catch (error) {
  console.warn('Could not load config/config.json, using defaults');
}

interface ThemeContextType {
  currentTheme: string;
  theme: Theme;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
  themeMenuEnabled: boolean;
  randomOnRefresh: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get configuration from config/config.json
  const defaultTheme = config.ui?.theme?.active || 'midnight-gradient';
  const randomOnRefresh = config.ui?.theme?.randomOnRefresh || false;
  const randomThemeList = config.ui?.theme?.randomThemeList || Object.keys(themes);
  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme);
  
  const availableThemes = Object.keys(themes);
  const theme = themes[currentTheme];
  const themeMenuEnabled = config.ui?.theme?.showSwitcher !== false; // Default to true if not specified

  // Function to get a random theme from the configured list
  const getRandomTheme = () => {
    // Use configured theme list or fall back to all available themes
    const themePool = randomThemeList.filter(themeName => themes[themeName]); // Only valid themes
    if (themePool.length === 0) {
      // Fallback to all themes if config list is invalid
      const randomIndex = Math.floor(Math.random() * availableThemes.length);
      return availableThemes[randomIndex];
    }
    const randomIndex = Math.floor(Math.random() * themePool.length);
    return themePool[randomIndex];
  };

  // Load theme on mount with random or saved/default logic
  useEffect(() => {
    if (randomOnRefresh) {
      // If random on refresh is enabled, always pick a random theme
      const randomTheme = getRandomTheme();
      setCurrentTheme(randomTheme);
      // Don't save random themes to localStorage - they should be random each time
    } else {
      // Normal behavior: use saved theme or default
      const savedTheme = localStorage.getItem('portfolio-theme');
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      } else {
        // If no saved theme, use the one from config
        setCurrentTheme(defaultTheme);
      }
    }
  }, [defaultTheme, randomOnRefresh]);

  // Apply theme CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--surface', theme.colors.surface);
    root.style.setProperty('--text', theme.colors.text);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--border', theme.colors.border);
    root.style.setProperty('--gradient', theme.colors.gradient);
    root.style.setProperty('--card-bg', theme.colors.surface);
    
    // Set shadow properties if they exist
    if (theme.colors.primaryShadow) {
      root.style.setProperty('--primary-shadow', theme.colors.primaryShadow);
    }
    if (theme.colors.primaryShadowStrong) {
      root.style.setProperty('--primary-shadow-strong', theme.colors.primaryShadowStrong);
    }
    
    // Set font families
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
    
    // Set glass effect
    root.style.setProperty('--glass-bg', theme.effects.glass);
    root.style.setProperty('--shadow', theme.effects.shadow);
    root.style.setProperty('--blur', theme.effects.blur);
    
    // Apply body background
    document.body.style.background = theme.colors.background;
    document.body.style.color = theme.colors.text;
    document.body.style.fontFamily = theme.fonts.body;
  }, [theme]);

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      // Only save to localStorage if random mode is disabled
      if (!randomOnRefresh) {
        localStorage.setItem('portfolio-theme', themeName);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      theme,
      setTheme,
      availableThemes,
      themeMenuEnabled,
      randomOnRefresh
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
