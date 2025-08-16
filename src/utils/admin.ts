'use client';

import { SiteConfig } from '@/types/content';

const ADMIN_KEY = 'admin-enabled';

export function getInitialAdminEnabled(config: SiteConfig): boolean {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_KEY) : null;
    if (stored === 'true') return true;
    if (stored === 'false') return false;
  } catch {}
  return !!config.admin?.enabledByDefault;
}

export function setAdminEnabled(enabled: boolean) {
  try {
    localStorage.setItem(ADMIN_KEY, String(enabled));
    if (!enabled) {
      // Clear stored password on logout
      localStorage.removeItem('admin-password');
    }
    window.dispatchEvent(new CustomEvent('adminModeChanged', { detail: { enabled } }));
  } catch {}
}

export function isAdminEnabled(config?: SiteConfig): boolean {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_KEY) : null;
    if (stored === 'true') return true;
    if (stored === 'false') return false;
  } catch {}
  return config ? !!config.admin?.enabledByDefault : false;
}
