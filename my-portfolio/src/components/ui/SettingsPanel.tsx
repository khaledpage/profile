"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
};

type UserPreferences = {
  colorProfile?: string;
  animationsEnabled?: boolean;
  skillsDesign?: string;
  cookieConsent?: boolean;
  language?: string;
};

export default function SettingsPanel({ config }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [hasConsent, setHasConsent] = useState(false);

  const settingsConfig = config.settings;
  const shouldShow = settingsConfig?.enabled && settingsConfig?.showIcon;

  useEffect(() => {
    // Check for existing consent and preferences
    const consent = localStorage.getItem('cookie-consent');
    const storedPrefs = localStorage.getItem('user-preferences');
    
    if (consent === 'accepted') {
      setHasConsent(true);
      if (storedPrefs) {
        try {
          const prefs = JSON.parse(storedPrefs);
          setPreferences(prefs);
        } catch {
          console.warn('Failed to parse stored preferences');
        }
      }
    } else if (consent === null && settingsConfig?.cookieConsent) {
      setShowCookieConsent(true);
    }
  }, [settingsConfig?.cookieConsent]);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setHasConsent(true);
    setShowCookieConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowCookieConsent(false);
  };

  const savePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    if (hasConsent) {
      localStorage.setItem('user-preferences', JSON.stringify(updated));
    }
    
    // Dispatch custom event for immediate updates in the same tab
    window.dispatchEvent(new CustomEvent('preferencesUpdated', { detail: newPrefs }));
    
    // Apply changes immediately
    if (newPrefs.colorProfile && typeof window !== 'undefined' && window.__themeController) {
      window.__themeController.changeTheme(newPrefs.colorProfile);
    }
    if (newPrefs.animationsEnabled !== undefined && typeof window !== 'undefined' && window.__themeController) {
      window.__themeController.toggleAnimations(newPrefs.animationsEnabled);
    }
  };

  const handleThemeChange = (profileKey: string) => {
    // Update local state immediately for UI responsiveness
    setPreferences(prev => ({ ...prev, colorProfile: profileKey }));
    savePreferences({ colorProfile: profileKey });
  };

  const handleSkillsDesignChange = (design: string) => {
    // Update local state immediately for UI responsiveness
    setPreferences(prev => ({ ...prev, skillsDesign: design }));
    savePreferences({ skillsDesign: design });
  };

  const handleAnimationToggle = (enabled: boolean) => {
    // Update local state immediately for UI responsiveness
    setPreferences(prev => ({ ...prev, animationsEnabled: enabled }));
    savePreferences({ animationsEnabled: enabled });
  };

  const handleLanguageChange = (language: string) => {
    // Update local state immediately for UI responsiveness
    setPreferences(prev => ({ ...prev, language: language }));
    savePreferences({ language: language });
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Settings Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full glass hover:scale-105 transition-transform"
        aria-label="Open settings"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-2xl glass rounded-2xl p-6 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close settings"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Theme Selection */}
            {settingsConfig?.allowThemeChange && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Color Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(config.palettes).map(([key, palette]) => (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        (preferences.colorProfile || config.colorProfile) === key
                          ? 'ring-2 ring-white/40 scale-105'
                          : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: palette.card,
                        color: palette.foreground,
                        border: `1px solid ${palette.cardContrast}`,
                      }}
                    >
                      <div className="text-xs font-medium">{palette.name}</div>
                      <div className="flex gap-1 mt-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: palette.accent1 }}
                        />
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: palette.accent2 }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Animation Toggle */}
            {settingsConfig?.allowAnimationToggle && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Animations</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.animationsEnabled ?? config.animation?.enabled ?? true}
                    onChange={(e) => handleAnimationToggle(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Enable background animations</span>
                </label>
              </div>
            )}

            {/* Language Selection */}
            {settingsConfig?.allowLanguageChange && config.i18n?.languages && Object.keys(config.i18n.languages).length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Language</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(config.i18n.languages).map(([key, lang]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageChange(key)}
                      className={`p-3 rounded-lg text-left transition-all text-sm ${
                        (preferences.language || config.i18n?.defaultLocale) === key
                          ? 'ring-2 ring-accent-1 bg-white/10'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-medium">
                        {key === 'de' ? '🇩🇪 Deutsch' : key === 'en' ? '🇺🇸 English' : key.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {lang.nav.about} • {lang.nav.projects}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Design Selection */}
            {config.skillsDisplay?.allowDesignChange && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Skills Layout</h3>
                <div className="grid grid-cols-1 gap-2">
                  {config.skillsDisplay.availableDesigns?.map((design) => (
                    <button
                      key={design}
                      onClick={() => handleSkillsDesignChange(design)}
                      className={`p-3 rounded-lg text-left transition-all text-sm ${
                        (preferences.skillsDesign || config.skillsDisplay?.design) === design
                          ? 'ring-2 ring-accent-1 bg-white/10'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-medium capitalize">{design}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {design === 'marquee' && 'Scrolling animation with hover controls'}
                        {design === 'grid' && 'Clean organized grid layout'}
                        {design === 'carousel' && 'Interactive slideshow format'}
                        {design === 'masonry' && 'Pinterest-style varied heights'}
                        {design === 'timeline' && 'Chronological flow design'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Info */}
            {settingsConfig?.cookieConsent && (
              <div className="text-xs text-gray-400 mt-4 p-3 rounded-lg bg-white/5">
                {hasConsent ? (
                  <>✓ Settings are saved in your browser</>
                ) : (
                  <>Settings are temporary (cookies declined)</>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 glass-dark border-t border-white/10">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">Cookie Consent</h3>
                <p className="text-xs text-gray-300">
                  We use browser storage to save your theme preferences and settings. 
                  No tracking or analytics cookies are used.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={declineCookies}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={acceptCookies}
                  className="px-3 py-1.5 text-xs rounded-lg btn-primary"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
