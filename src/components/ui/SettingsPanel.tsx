'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, Cog6ToothIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import type { SiteConfig } from '@/types/content';
import { canSavePreferences, shouldShowCookieBanner, getCookieConsent, setCookieConsent } from '@/utils/cookies';
import { useLanguage } from '@/utils/i18n';
import { getInitialAdminEnabled, setAdminEnabled, isAdminEnabled } from '@/utils/admin';

type Props = {
  config: SiteConfig;
};

type UserPreferences = {
  colorProfile?: string;
  animationsEnabled?: boolean;
  skillsDesign?: string;
  aboutLayout?: string;
  cookieConsent?: boolean;
  language?: string;
  homeSections?: {
    order: Array<'hero' | 'about' | 'skills' | 'projects' | 'articles' | 'workflow' | 'contact'>;
    hidden: Array<'hero' | 'about' | 'skills' | 'projects' | 'articles' | 'workflow' | 'contact'>;
  };
};

type TabId = 'appearance' | 'behavior' | 'home' | 'advanced';

// Inline editor component for Home Sections with drag & drop
type SectionKey = 'hero' | 'about' | 'skills' | 'projects' | 'articles' | 'workflow' | 'contact';
function HomeSectionsEditor({
  config,
  preferences,
  onChange,
}: {
  config: SiteConfig;
  preferences: UserPreferences;
  onChange: (next: { order: SectionKey[]; hidden: SectionKey[] }) => void;
}) {
  const { translations } = useLanguage(config);
  const defaultOrder: SectionKey[] = ['hero','about','skills','projects','articles','workflow','contact'];
  const order: SectionKey[] = (preferences.homeSections?.order as SectionKey[]) || (config.homeSections?.order as SectionKey[]) || defaultOrder;
  const hidden: SectionKey[] = (preferences.homeSections?.hidden as SectionKey[]) || (config.homeSections?.hidden as SectionKey[]) || [];
  
  const [draggedItem, setDraggedItem] = useState<SectionKey | null>(null);
  const [dragOverItem, setDragOverItem] = useState<SectionKey | null>(null);

  const handleDragStart = (key: SectionKey) => {
    setDraggedItem(key);
  };

  const handleDragOver = (e: React.DragEvent, key: SectionKey) => {
    e.preventDefault();
    setDragOverItem(key);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetKey: SectionKey) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetKey) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newOrder = [...order];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetKey);

    // Remove the dragged item
    newOrder.splice(draggedIndex, 1);
    // Insert at the new position
    newOrder.splice(targetIndex, 0, draggedItem);

    onChange({ order: newOrder, hidden });
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const toggle = (key: SectionKey) => {
    const isHidden = hidden.includes(key);
    const nextHidden = isHidden ? hidden.filter(k => k !== key) : [...hidden, key];
    onChange({ order, hidden: nextHidden });
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...order];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= next.length) return;
    const [item] = next.splice(idx, 1);
    next.splice(newIdx, 0, item);
    onChange({ order: next, hidden });
  };

  const labelMap: Record<SectionKey, string> = {
    hero: (translations?.common && 'home' in translations.common) ? String(translations.common.home) : 'Home',
    about: (translations?.nav && 'about' in translations.nav) ? String(translations.nav.about) : 'About',
    skills: (translations?.nav && 'skills' in translations.nav) ? String(translations.nav.skills) : 'Skills',
    projects: (translations?.nav && 'projects' in translations.nav) ? String(translations.nav.projects) : 'Projects',
    articles: (translations?.nav && 'articles' in translations.nav) ? String(translations.nav.articles) : 'Articles',
    workflow: (translations?.workflow && 'title' in translations.workflow) ? String(translations.workflow.title) : 'Workflow',
    contact: (translations?.nav && 'contact' in translations.nav) ? String(translations.nav.contact) : 'Contact',
  };

  return (
    <div id="home-sections-editor" className="space-y-3">
      <div id="home-sections-description" className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span>🧩</span>
          <span>{'Drag sections to reorder them or use the arrow buttons'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>✅</span>
          <span>{'Check/uncheck to show/hide sections on the home page'}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {order.map((key, idx) => {
          const isHidden = hidden.includes(key);
          const isDragging = draggedItem === key;
          const isDragOver = dragOverItem === key;
          
          return (
            <div 
              id={`section-item-${key}`} 
              key={key} 
              draggable
              onDragStart={() => handleDragStart(key)}
              onDragOver={(e) => handleDragOver(e, key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, key)}
              onDragEnd={handleDragEnd}
              className={`
                group relative p-4 rounded-xl border-2 transition-all duration-200 cursor-move
                ${isHidden ? 'opacity-60' : 'opacity-100'}
                ${isDragging ? 'scale-105 rotate-2 shadow-lg z-10' : 'scale-100 rotate-0'}
                ${isDragOver && !isDragging ? 'scale-102 border-accent-1 shadow-md' : ''}
                hover:shadow-md hover:scale-102
              `} 
              style={{ 
                borderColor: isDragOver && !isDragging 
                  ? 'var(--accent-1)' 
                  : 'color-mix(in srgb, var(--card), transparent 60%)',
                backgroundColor: isDragging 
                  ? 'color-mix(in srgb, var(--accent-1), transparent 90%)' 
                  : 'color-mix(in srgb, var(--card), transparent 80%)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {/* Drag indicator */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                </div>
              </div>

              <div id={`section-item-content-${key}`} className="flex items-center gap-4 ml-6">
                {/* Visibility toggle */}
                <div id={`section-item-checkbox-container-${key}`} className="flex items-center">
                  <label className="relative cursor-pointer">
                    <input 
                      id={`section-checkbox-${key}`} 
                      type="checkbox" 
                      checked={!hidden.includes(key)} 
                      onChange={() => toggle(key)}
                      className="sr-only"
                    />
                    <div className={`
                      w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
                      ${!isHidden 
                        ? 'bg-accent-1 border-accent-1' 
                        : 'border-gray-400 bg-transparent'
                      }
                    `}>
                      {!isHidden && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </label>
                </div>

                {/* Section info */}
                <div id={`section-item-info-${key}`} className="flex-1">
                  <div id={`section-item-name-${key}`} className="text-sm font-semibold flex items-center gap-2">
                    <span className="text-lg">
                      {key === 'hero' && '🏠'}
                      {key === 'about' && '👋'}
                      {key === 'skills' && '💪'}
                      {key === 'projects' && '🚀'}
                      {key === 'articles' && '📚'}
                      {key === 'workflow' && '⚙️'}
                      {key === 'contact' && '📧'}
                    </span>
                    <span>{labelMap[key]}</span>
                  </div>
                  <div id={`section-item-key-${key}`} className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Section: {key}
                  </div>
                </div>

                {/* Manual controls */}
                <div id={`section-item-controls-${key}`} className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    id={`section-move-up-${key}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      move(idx, -1);
                    }}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    id={`section-move-down-${key}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      move(idx, 1);
                    }}
                    disabled={idx === order.length - 1}
                    className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Order indicator */}
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-accent-1 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                {idx + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SettingsPanel({ config }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('appearance');
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [hasConsent, setHasConsent] = useState(false);
  const { translations } = useLanguage(config);
  const [adminEnabled, setAdmin] = useState<boolean>(false);

  const settingsConfig = config.settings;
  const shouldShow = settingsConfig?.enabled && (
    settingsConfig?.adminOnly ? isAdminEnabled(config) : settingsConfig?.showIcon
  );

  // Helper function to get all palettes (support both legacy and grouped structure)
  const getAllPalettes = () => {
    if (config.paletteGroups) {
      return config.paletteGroups;
    }
    // Legacy support
    if (config.palettes) {
      return {
        all: {
          name: "All Themes",
          palettes: config.palettes
        }
      };
    }
    return {};
  };

  const allPaletteGroups = getAllPalettes();

  useEffect(() => {
    setAdmin(getInitialAdminEnabled(config));
    const adminHandler = (ev: Event) => {
      const e = ev as CustomEvent<{ enabled?: boolean }>;
      setAdmin(!!e?.detail?.enabled);
    };
    window.addEventListener('adminModeChanged', adminHandler as EventListener);

    // Check for existing consent and preferences
    const consent = getCookieConsent();
    const storedPrefs = localStorage.getItem('user-preferences');
    
    if (consent && consent.preferences) {
      setHasConsent(true);
      if (storedPrefs) {
        try {
          const prefs = JSON.parse(storedPrefs);
          setPreferences(prefs);
          // Apply stored preferences immediately on load
      if (typeof window !== 'undefined' && window.__themeController) {
            if (prefs.colorProfile) {
        window.__themeController.changeTheme(prefs.colorProfile);
            }
            if (typeof prefs.animationsEnabled === 'boolean') {
        window.__themeController.toggleAnimations(prefs.animationsEnabled);
            }
          }
        } catch {
          console.warn('Failed to parse stored preferences');
        }
      }
    } else if (!consent && settingsConfig?.cookieConsent) {
      setShowCookieConsent(true);
    }

    // Listen for cookie consent changes
    const handleConsentChange = () => {
      const newConsent = getCookieConsent();
      if (newConsent && newConsent.preferences) {
        setHasConsent(true);
        setShowCookieConsent(false);
      } else if (!newConsent) {
        setHasConsent(false);
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    window.addEventListener('cookieConsentGiven', handleConsentChange);
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
      window.removeEventListener('cookieConsentGiven', handleConsentChange);
      window.removeEventListener('adminModeChanged', adminHandler as EventListener);
    };
  }, [settingsConfig?.cookieConsent, config]);

  // Switch away from advanced tab if admin is disabled
  useEffect(() => {
    if (activeTab === 'advanced' && !adminEnabled) {
      setActiveTab('appearance');
    }
  }, [adminEnabled, activeTab]);

  // acceptCookies removed; use handleAcceptCookies instead to persist and apply settings

  const declineCookies = () => {
    // Store explicit decline with only necessary allowed
    setCookieConsent({
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    });
    setHasConsent(false);
    setShowCookieConsent(false);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged'));
  };

  const handleAcceptCookies = () => {
    // Set cookie consent with proper preferences
    setCookieConsent({
      necessary: true,
      analytics: false,
      preferences: true,
      marketing: false,
    });
    
    setHasConsent(true);
    setShowCookieConsent(false);
    
    // Save current preferences now that consent is given
    if (Object.keys(preferences).length > 0) {
      localStorage.setItem('user-preferences', JSON.stringify(preferences));
      
      // Apply preferences immediately
    if (typeof window !== 'undefined' && window.__themeController) {
        if (preferences.colorProfile) {
      window.__themeController.changeTheme(preferences.colorProfile);
        }
        if (typeof preferences.animationsEnabled === 'boolean') {
      window.__themeController.toggleAnimations(preferences.animationsEnabled);
        }
      }
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('cookieConsentGiven'));
    window.dispatchEvent(new CustomEvent('cookieConsentChanged'));
  };

  const savePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    // Check if user has given consent to save preferences
    if (canSavePreferences()) {
      localStorage.setItem('user-preferences', JSON.stringify(updated));
    } else if (shouldShowCookieBanner()) {
      // Show cookie consent banner if preferences cannot be saved
      setShowCookieConsent(true);
      // Don't save to localStorage until consent is given
      console.log('Cookie consent required to save preferences');
      return;
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

  const handleAboutLayoutChange = (layout: string) => {
    // Update local state immediately for UI responsiveness
    setPreferences(prev => ({ ...prev, aboutLayout: layout }));
    savePreferences({ aboutLayout: layout });
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

  const downloadConfiguration = () => {
    const configToDownload = {
      colorProfile: preferences.colorProfile || config.colorProfile,
      skillsDisplay: {
        design: preferences.skillsDesign || config.skillsDisplay?.design || 'grid'
      },
      i18n: {
        defaultLocale: preferences.language || config.i18n?.defaultLocale || 'en'
      },
      animation: {
        enabled: preferences.animationsEnabled ?? config.animation?.enabled ?? true
      },
      homeSections: {
        order: preferences.homeSections?.order || config.homeSections?.order || ['hero','about','skills','projects','articles','workflow','contact'],
        hidden: preferences.homeSections?.hidden || config.homeSections?.hidden || []
      }
    };

    const dataStr = JSON.stringify(configToDownload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-defaults.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Settings Icon */}
      <button
        id="settings-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full glass hover:scale-105 transition-transform"
        aria-label="Open settings"
      >
        <Cog6ToothIcon id="settings-icon" className="h-5 w-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div 
          id="settings-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            id="settings-panel"
            className="w-full max-w-4xl rounded-2xl p-6 h-[80vh] flex flex-col"
            style={{
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(12px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div id="settings-header" className="flex items-center justify-between mb-6">
              <div id="settings-title-section">
                <h2 id="settings-title" className="text-xl font-semibold">Settings</h2>
                {!hasConsent && settingsConfig?.cookieConsent && (
                  <div id="cookie-consent-warning" className="flex items-center gap-3 mt-2">
                    <p id="cookie-warning-text" className="text-sm text-orange-400">
                      ⚠️ Settings cannot be saved without cookie consent
                    </p>
                    <button
                      id="accept-cookies-button"
                      onClick={handleAcceptCookies}
                      className="px-3 py-1 text-xs rounded-lg font-medium transition-all"
                      style={{
                        backgroundColor: 'var(--accent-1)',
                        color: 'white',
                      }}
                    >
                      Accept Cookies
                    </button>
                  </div>
                )}
              </div>
              <button
                id="settings-close-button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 40%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Close settings"
              >
                <XMarkIcon id="settings-close-icon" className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Navigation */}
      <div id="settings-tab-navigation" className="flex mb-6" style={{ borderBottom: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)' }}>
              {[
        { id: 'appearance' as TabId, label: 'Appearance', icon: '🎨' },
        { id: 'behavior' as TabId, label: 'Behavior', icon: '⚙️' },
        { id: 'home' as TabId, label: 'Home Sections', icon: '🧩' },
        ...(adminEnabled ? [{ id: 'advanced' as TabId, label: 'Advanced', icon: '🔧' }] : [])
              ].map((tab) => (
                <button
                  id={`settings-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors`}
                  style={{
                    borderBottom: activeTab === tab.id 
                      ? '2px solid var(--accent-1)' 
                      : '2px solid transparent',
                    color: activeTab === tab.id 
                      ? 'var(--accent-1)' 
                      : 'var(--muted)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = 'var(--accent-1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.color = 'var(--muted)';
                    }
                  }}
                >
                  <span id={`settings-tab-icon-${tab.id}`}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

      <div id="settings-content" className="flex-1 overflow-y-auto scrollbar-hide">
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div id="appearance-tab-content" className="space-y-6">
                  {/* Theme Selection */}
                  {settingsConfig?.allowThemeChange && (
                    <div id="theme-selection-section">
                      <h3 id="theme-selection-title" className="text-sm font-medium mb-3">
                        {translations?.common && 'colorThemes' in translations.common 
                          ? String(translations.common.colorThemes)
                          : 'Color Themes'}
                      </h3>
                      <div id="theme-groups-container" className="space-y-4">
                        {Object.entries(allPaletteGroups).map(([groupKey, group]) => (
                          <div id={`theme-group-${groupKey}`} key={groupKey}>
                            <h4 id={`theme-group-title-${groupKey}`} className="text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                              {group.name}
                            </h4>
                            <div id={`theme-grid-${groupKey}`} className="grid grid-cols-3 gap-3 p-1">
                              {Object.entries(group.palettes).map(([key, palette]) => (
                                <button
                                  id={`theme-option-${key}`}
                                  key={key}
                                  onClick={() => handleThemeChange(key)}
                                  className={`p-2.5 rounded-lg text-left transition-all border-2 border-transparent ${
                                    (preferences.colorProfile || config.colorProfile) === key
                                      ? 'scale-105'
                                      : 'hover:scale-105'
                                  }`}
                                  style={{
                                    backgroundColor: palette.card,
                                    color: palette.foreground,
                                    border: `1px solid ${palette.cardContrast}`,
                                    ...(((preferences.colorProfile || config.colorProfile) === key) && {
                                      boxShadow: 'inset 0 0 0 2px var(--accent-1)'
                                    })
                                  }}
                                >
                                  <div className="text-xs font-medium mb-1">{palette.name}</div>
                                  <div className="flex gap-1">
                                    <div
                                      className="w-2.5 h-2.5 rounded-full"
                                      style={{ backgroundColor: palette.accent1 }}
                                    />
                                    <div
                                      className="w-2.5 h-2.5 rounded-full"
                                      style={{ backgroundColor: palette.accent2 }}
                                    />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Design Selection */}
                  {config.skillsDisplay?.allowDesignChange && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        {translations?.common && 'skillsLayout' in translations.common 
                          ? String(translations.common.skillsLayout)
                          : 'Skills Layout'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                        {config.skillsDisplay.availableDesigns?.map((design) => (
                          <button
                            key={design}
                            onClick={() => handleSkillsDesignChange(design)}
                            className={`p-3 rounded-lg text-left transition-all text-sm ${
                              (preferences.skillsDesign || config.skillsDisplay?.design) === design
                                ? 'bg-white/10 border-2 border-transparent' 
                                : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                            }`}
                            style={{
                              ...(((preferences.skillsDesign || config.skillsDisplay?.design) === design) && {
                                boxShadow: 'inset 0 0 0 2px var(--accent-1)'
                              })
                            }}
                          >
                            <div className="font-medium capitalize">{design}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
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

                  {/* About Section Layout Selection */}
                  {config.aboutSection?.allowLayoutChange && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        {translations?.common && 'aboutLayout' in translations.common 
                          ? String(translations.common.aboutLayout)
                          : 'About Section Layout'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                        {config.aboutSection.availableLayouts?.map((layout) => (
                          <button
                            key={layout}
                            onClick={() => handleAboutLayoutChange(layout)}
                            className={`p-3 rounded-lg text-left transition-all text-sm ${
                              (preferences.aboutLayout || config.aboutSection?.layout) === layout
                                ? 'bg-white/10 border-2 border-transparent'
                                : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                            }`}
                            style={{
                              ...(((preferences.aboutLayout || config.aboutSection?.layout) === layout) && {
                                boxShadow: 'inset 0 0 0 2px var(--accent-1)'
                              })
                            }}
                          >
                            <div className="font-medium capitalize">{layout}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                              {layout === 'basic' && 'Simple text-based about section'}
                              {layout === 'enhanced' && 'Rich layout with profile picture and timeline'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Behavior Tab */}
              {activeTab === 'behavior' && (
                <div className="space-y-6">
                  {/* Animation Toggle */}
                  {settingsConfig?.allowAnimationToggle && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">Animations</h3>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.animationsEnabled ?? config.animation?.enabled ?? true}
                          onChange={(e) => handleAnimationToggle(e.target.checked)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">
                          {translations?.common && 'enableAnimations' in translations.common 
                            ? String(translations.common.enableAnimations)
                            : 'Enable background animations'}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Language Selection */}
                  {settingsConfig?.allowLanguageChange && config.i18n?.languages && Object.keys(config.i18n.languages).length > 1 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        {translations?.common && 'language' in translations.common 
                          ? String(translations.common.language)
                          : 'Language'}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 p-1">
                        {Object.entries(config.i18n.languages).map(([key, lang]) => (
                          <button
                            key={key}
                            onClick={() => handleLanguageChange(key)}
                            className="p-3 rounded-lg text-left transition-all text-sm"
                            style={{
                              backgroundColor: (preferences.language || config.i18n?.defaultLocale) === key
                                ? 'color-mix(in srgb, var(--card), transparent 40%)'
                                : 'color-mix(in srgb, var(--card), transparent 70%)',
                              borderWidth: (preferences.language || config.i18n?.defaultLocale) === key ? '2px' : '0px',
                              borderColor: (preferences.language || config.i18n?.defaultLocale) === key ? 'var(--accent-1)' : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              if ((preferences.language || config.i18n?.defaultLocale) !== key) {
                                e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 40%)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if ((preferences.language || config.i18n?.defaultLocale) !== key) {
                                e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 70%)';
                              }
                            }}
                          >
                            <div className="font-medium">
                              {key === 'de' ? '🇩🇪 Deutsch' : key === 'en' ? '🇺🇸 English' : key.toUpperCase()}
                            </div>
                            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                              {lang.nav.about} • {lang.nav.projects}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Home Sections Tab (admin only) */}
              {activeTab === 'home' && (
                <div className="space-y-4">
                  {!adminEnabled ? (
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>
                      Admin mode is required to edit home sections.
                    </div>
                  ) : (
                    <HomeSectionsEditor
                      config={config}
                      preferences={preferences}
                      onChange={(next) => {
                        setPreferences(prev => ({ ...prev, homeSections: next }));
                        savePreferences({ homeSections: next });
                      }}
                    />
                  )}
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  {/* Storage Info & Download */}
                  {settingsConfig?.cookieConsent && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium mb-3">Configuration</h3>
                      
                      <div className="text-xs p-3 rounded-lg" style={{ color: 'var(--muted)', backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
                        {hasConsent ? (
                          <>✓ Settings are saved in your browser</>
                        ) : (
                          <>Settings are temporary (cookies declined)</>
                        )}
                      </div>
                      
                      {/* Download Configuration Button */}
                      <button
                        onClick={downloadConfiguration}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 80%)',
                          color: 'var(--foreground)',
                          border: '1px solid color-mix(in srgb, var(--accent-1), transparent 50%)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-1), transparent 70%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-1), transparent 80%)';
                        }}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        {translations?.common && 'downloadSettings' in translations.common 
                          ? String(translations.common.downloadSettings)
                          : 'Download Settings as JSON'}
                      </button>
                      
                      <div className="text-xs px-2" style={{ color: 'var(--muted)' }}>
                        Save this file as <code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)' }}>custom-defaults.json</code> in your project to set these as default values.
                      </div>
                    </div>
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
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
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
                  onClick={handleAcceptCookies}
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
