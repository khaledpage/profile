// Utility to load and merge custom defaults with base configuration
import type { SiteConfig } from '@/types/content';

interface CustomDefaults {
  colorProfile?: string;
  skillsDisplay?: {
    design?: string;
  };
  i18n?: {
    defaultLocale?: string;
  };
  animation?: {
    enabled?: boolean;
  };
}

let customDefaults: CustomDefaults | null = null;

// Try to load custom defaults from public/custom-defaults.json
export async function loadCustomDefaults(): Promise<CustomDefaults | null> {
  if (customDefaults !== null) {
    return customDefaults;
  }

  try {
    const response = await fetch('/custom-defaults.json', { cache: 'force-cache' });
    if (response.ok) {
      customDefaults = await response.json();
      return customDefaults;
    }
  } catch (error) {
    // Custom defaults file doesn't exist, which is fine
    console.log('No custom defaults found, using base configuration');
  }
  
  customDefaults = {};
  return customDefaults;
}

// Merge custom defaults into the base configuration
export function mergeCustomDefaults(baseConfig: SiteConfig, customDefaults: CustomDefaults | null): SiteConfig {
  if (!customDefaults) {
    return baseConfig;
  }

  const merged = { ...baseConfig };

  // Apply custom defaults
  if (customDefaults.colorProfile) {
    merged.colorProfile = customDefaults.colorProfile;
  }

  if (customDefaults.skillsDisplay?.design && merged.skillsDisplay) {
    merged.skillsDisplay.design = customDefaults.skillsDisplay.design;
  }

  if (customDefaults.i18n?.defaultLocale && merged.i18n) {
    merged.i18n.defaultLocale = customDefaults.i18n.defaultLocale;
  }

  if (customDefaults.animation?.enabled !== undefined && merged.animation) {
    merged.animation.enabled = customDefaults.animation.enabled;
  }

  return merged;
}

// Get custom defaults synchronously (for client-side usage)
export function getCustomDefaults(): CustomDefaults | null {
  return customDefaults;
}
