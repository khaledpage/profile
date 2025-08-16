'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setAdminEnabled } from '@/utils/admin';
import { useLanguage } from '@/utils/i18n';
import { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
};

export default function LoginForm({ config }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { translations } = useLanguage(config);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Enable admin mode
        setAdminEnabled(true);
        
        // Store password for API authentication
        localStorage.setItem('admin-password', password);
        
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

  return (
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
  );
}
