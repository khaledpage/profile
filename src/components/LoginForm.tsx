'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setAdminEnabled } from '@/utils/admin';
import { useLanguage } from '@/utils/i18n';
import { SiteConfig } from '@/types/content';
import { canSavePreferences, setCookieConsent, shouldShowCookieBanner } from '@/utils/cookies';

type Props = {
  config: SiteConfig;
};

export default function LoginForm({ config }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [pendingLogin, setPendingLogin] = useState<{ username: string; password: string } | null>(null);
  const router = useRouter();
  
  const { translations } = useLanguage(config);

  useEffect(() => {
    // Check if we need to show cookie consent
    if (shouldShowCookieBanner()) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleCookieConsent = () => {
    // Give necessary cookie consent for login
    setCookieConsent({
      necessary: true,
      analytics: false,
      preferences: true, // Need this to save admin session
      marketing: false,
    });
    setShowCookieConsent(false);
    
    // If there's a pending login, complete it now
    if (pendingLogin) {
      completeLogin(pendingLogin.username, pendingLogin.password);
      setPendingLogin(null);
    }
  };

  const completeLogin = async (loginUsername: string, loginPassword: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Enable admin mode
        setAdminEnabled(true);
        
        // Store password for API authentication (only if preferences consent is given)
        if (canSavePreferences()) {
          localStorage.setItem('admin-password', loginPassword);
        }
        
        // Redirect to home page
        router.push('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if cookie consent is needed for storing login session
    if (shouldShowCookieBanner()) {
      // Store login details and show consent
      setPendingLogin({ username, password });
      setShowCookieConsent(true);
      setLoading(false);
      return;
    }

    // Proceed with login if consent is already given
    await completeLogin(username, password);
  };

  return (
    <>
      <div id="login-page-container" className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div id="login-form-wrapper" className="glass p-8 rounded-lg w-full max-w-md" style={{ border: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)' }}>
          <h1 id="login-page-title" className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--foreground)' }}>
            {translations?.login?.title || 'Admin Login'}
          </h1>
          
          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div id="username-field-container">
              <label id="username-label" htmlFor="username" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                {translations?.login?.username || 'Username'}
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  background: 'var(--card)',
                  border: '1px solid color-mix(in srgb, var(--foreground), transparent 80%)',
                  color: 'var(--foreground)'
                }}
                required
              />
            </div>
            
            <div id="password-field-container">
              <label id="password-label" htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                {translations?.login?.password || 'Password'}
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  background: 'var(--card)',
                  border: '1px solid color-mix(in srgb, var(--foreground), transparent 80%)',
                  color: 'var(--foreground)'
                }}
                required
              />
            </div>
            
            {error && (
              <div id="login-error-message" className="text-sm p-2 rounded" style={{ 
                background: 'color-mix(in srgb, var(--foreground), transparent 90%)',
                color: 'var(--foreground)'
              }}>
                {error}
              </div>
            )}
            
            <button
              id="login-submit-button"
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              style={{ 
                background: 'linear-gradient(to right, var(--accent-1), var(--accent-2))',
                color: 'var(--card-contrast)'
              }}
            >
              {loading ? (translations?.login?.logging_in || 'Logging in...') : (translations?.login?.login || 'Login')}
            </button>
          </form>
          
          <div id="login-back-link-container" className="mt-4 text-center">
            <Link 
              id="login-back-link"
              href="/"
              className="text-sm hover:underline"
              style={{ color: 'var(--muted)' }}
            >
              {translations?.login?.back_to_home || 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>

      {/* Cookie Consent Modal for Login */}
      {showCookieConsent && (
        <div id="login-cookie-consent-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div id="login-cookie-consent-modal" className="glass p-6 rounded-lg max-w-md mx-4" style={{ 
            border: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)',
            background: 'var(--card)'
          }}>
            <h3 id="login-cookie-consent-title" className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              {translations?.cookies?.consent_required || 'Cookie Consent Required'}
            </h3>
            <p id="login-cookie-consent-message" className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
              {translations?.cookies?.admin_login_message || 'To save your admin session, we need to store necessary cookies. This requires your consent to continue.'}
            </p>
            <div id="login-cookie-consent-actions" className="flex gap-3 justify-end">
              <button
                id="login-cookie-consent-deny"
                onClick={() => {
                  setShowCookieConsent(false);
                  setPendingLogin(null);
                  setLoading(false);
                }}
                className="px-4 py-2 rounded text-sm transition-all duration-200 hover:opacity-80"
                style={{ 
                  background: 'color-mix(in srgb, var(--foreground), transparent 80%)',
                  color: 'var(--foreground)'
                }}
              >
                {translations?.cookies?.deny || 'Deny'}
              </button>
              <button
                id="login-cookie-consent-accept"
                onClick={handleCookieConsent}
                className="px-4 py-2 rounded text-sm transition-all duration-200 hover:opacity-90"
                style={{ 
                  background: 'linear-gradient(to right, var(--accent-1), var(--accent-2))',
                  color: 'var(--card-contrast)'
                }}
              >
                {translations?.cookies?.accept || 'Accept & Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
