'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { isAdminEnabled, setAdminEnabled } from '@/utils/admin';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

interface AdminNavigationProps {
  config: SiteConfig;
}

export default function AdminNavigation({ config }: AdminNavigationProps) {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { translations } = useLanguage(config);

  useEffect(() => {
    // Check if admin is logged in by checking for stored password
    const hasAdminPassword = !!localStorage.getItem('adminPassword');
    const adminEnabled = isAdminEnabled();
    setAdminLoggedIn(hasAdminPassword && adminEnabled);

    // Listen for admin mode changes
    const handleAdminChange = (event: CustomEvent<{ enabled?: boolean }>) => {
      const hasPassword = !!localStorage.getItem('adminPassword');
      setAdminLoggedIn(hasPassword && !!event.detail?.enabled);
    };

    window.addEventListener('adminModeChanged', handleAdminChange as EventListener);

    return () => {
      window.removeEventListener('adminModeChanged', handleAdminChange as EventListener);
    };
  }, []);

  // Only show if login navigation is enabled in config
  if (!config.admin?.showLoginNavigation) {
    return null;
  }

  const handleLogout = () => {
    // Clear admin password and disable admin mode
    localStorage.removeItem('adminPassword');
    setAdminEnabled(false);
    setAdminLoggedIn(false);
    setShowDropdown(false);
    
    // Refresh to update UI
    router.refresh();
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="relative">
      {adminLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 90%)',
              color: 'var(--accent-1)',
              border: '1px solid color-mix(in srgb, var(--accent-1), transparent 70%)',
            }}
            title={translations?.common?.adminMode || 'Admin Mode'}
          >
            <UserIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {translations?.common?.adminMode || 'Admin Mode'}
            </span>
          </button>

          {showDropdown && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50"
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left"
                  style={{
                    color: 'var(--foreground)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--foreground), transparent 90%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                  <span className="text-sm">
                    {translations?.common?.logout || 'Logout'}
                  </span>
                </button>
                
                <Link
                  href="/admin"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left"
                  style={{
                    color: 'var(--foreground)',
                    backgroundColor: 'transparent',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--foreground), transparent 90%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => setShowDropdown(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">Dashboard</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--muted)',
            border: '1px solid color-mix(in srgb, var(--foreground), transparent 80%)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--foreground), transparent 95%)';
            e.currentTarget.style.color = 'var(--foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--muted)';
          }}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span className="text-sm">
            {translations?.common?.login || 'Login'}
          </span>
        </button>
      )}
    </div>
  );
}
