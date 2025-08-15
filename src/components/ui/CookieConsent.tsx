'use client';

import { useState, useEffect } from 'react';
import { setCookieConsent, shouldShowCookieBanner, type CookieConsent } from '@/utils/cookies';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    preferences: false,
    marketing: false,
  });

  useEffect(() => {
    setIsVisible(shouldShowCookieBanner());
  }, []);

  const handleAcceptAll = () => {
    setCookieConsent({
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    });
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentGiven'));
    window.dispatchEvent(new CustomEvent('cookieConsentChanged'));
  };

  const handleAcceptSelected = () => {
    setCookieConsent(preferences);
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentGiven'));
    window.dispatchEvent(new CustomEvent('cookieConsentChanged'));
  };

  const handleRejectAll = () => {
    setCookieConsent({
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    });
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('cookieConsentGiven'));
    window.dispatchEvent(new CustomEvent('cookieConsentChanged'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="glass rounded-2xl p-6 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Cookie Preferences
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.
            </p>
            
            {showDetails && (
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg" 
                     style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>Necessary</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      Required for basic site functionality
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={true} 
                    disabled 
                    className="w-4 h-4 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" 
                     style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>Preferences</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      Remember your settings and choices
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferences: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" 
                     style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>Analytics</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      Help us understand how you use our site
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" 
                     style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>Marketing</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      Personalized ads and content
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-auto w-full">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{
                backgroundColor: 'var(--accent-1)',
                color: 'var(--card-contrast)',
              }}
            >
              Accept All
            </button>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card), transparent 30%)',
                color: 'var(--foreground)',
              }}
            >
              Customize
            </button>
            
            {showDetails && (
              <>
                <button
                  onClick={handleAcceptSelected}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  style={{
                    backgroundColor: 'var(--accent-2)',
                    color: 'var(--card-contrast)',
                  }}
                >
                  Save Preferences
                </button>
                
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--muted)',
                    border: '1px solid color-mix(in srgb, var(--foreground), transparent 80%)',
                  }}
                >
                  Reject All
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
