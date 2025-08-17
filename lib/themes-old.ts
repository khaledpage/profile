export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    gradient: string;
    cardBg: string;
    heroGradient: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const themes: Record<string, Theme> = {
  'midnight-gradient': {
    name: 'Midnight Gradient',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#ffffff',
      textSecondary: '#a1a1aa',
      border: 'rgba(255, 255, 255, 0.1)',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      heroGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'ocean-depth': {
    name: 'Ocean Depth',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0c1527 0%, #1e3a8a 50%, #0369a1 100%)',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#ffffff',
      textSecondary: '#94a3b8',
      border: 'rgba(255, 255, 255, 0.12)',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #06b6d4 100%)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      heroGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'sunset-blaze': {
    name: 'Sunset Blaze',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#ef4444',
      background: 'linear-gradient(135deg, #1a0a00 0%, #451a03 50%, #7c2d12 100%)',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#ffffff',
      textSecondary: '#fed7aa',
      border: 'rgba(255, 255, 255, 0.12)',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ef4444 100%)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      heroGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'forest-mist': {
    name: 'Forest Mist',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0c1410 0%, #14532d 50%, #166534 100%)',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#ffffff',
      textSecondary: '#86efac',
      border: 'rgba(255, 255, 255, 0.12)',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #06b6d4 100%)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      heroGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'cosmic-purple': {
    name: 'Cosmic Purple',
    colors: {
      primary: '#a855f7',
      secondary: '#9333ea',
      accent: '#ec4899',
      background: 'linear-gradient(135deg, #1a0825 0%, #4c1d95 50%, #7c3aed 100%)',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#ffffff',
      textSecondary: '#e4d4f7',
      border: 'rgba(255, 255, 255, 0.12)',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #ec4899 100%)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      heroGradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'aurora-lights': {
    name: 'Aurora Lights',
    colors: {
      primary: '#06b6d4',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1e1b4b 25%, #134e4a 50%, #7c2d12 75%, #4c1d95 100%)',
      surface: 'rgba(255, 255, 255, 0.08)',
      text: '#ffffff',
      textSecondary: '#cbd5e1',
      border: 'rgba(255, 255, 255, 0.12)',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #10b981 100%)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      heroGradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'dark': {
    name: 'Classic Dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#06b6d4',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#a1a1aa',
      border: '#333333',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      cardBg: '#1f1f1f',
      heroGradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'gray': {
    name: 'Elegant Gray',
    colors: {
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#06b6d4',
      background: '#111827',
      surface: '#1f2937',
      text: '#ffffff',
      textSecondary: '#d1d5db',
      border: '#374151',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      cardBg: '#243043',
      heroGradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'white': {
    name: 'Pure White',
    colors: {
      primary: '#2563eb',
      secondary: '#1d4ed8',
      accent: '#0891b2',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      cardBg: '#ffffff',
      heroGradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'mid-white': {
    name: 'Soft White',
    colors: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#0891b2',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#4b5563',
      border: '#d1d5db',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      cardBg: '#ffffff',
      heroGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'white-10': {
    name: 'Warm White',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#ea580c',
      background: '#fefefe',
      surface: '#fef7f7',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#f3f4f6',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      cardBg: '#ffffff',
      heroGradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'white-20': {
    name: 'Cool White',
    colors: {
      primary: '#0891b2',
      secondary: '#0e7490',
      accent: '#0284c7',
      background: '#fefefe',
      surface: '#f0f9ff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e0f2fe',
      gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
      cardBg: '#ffffff',
      heroGradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'neon-cyber': {
    name: 'Neon Cyber',
    colors: {
      primary: '#00ff88',
      secondary: '#00d4ff',
      accent: '#ff0080',
      background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a0a1a 100%)',
      surface: 'rgba(0, 255, 136, 0.1)',
      text: '#ffffff',
      textSecondary: '#00ff88',
      border: 'rgba(0, 255, 136, 0.3)',
      gradient: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #ff0080 100%)',
      cardBg: 'rgba(0, 255, 136, 0.08)',
      heroGradient: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'golden-hour': {
    name: 'Golden Hour',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#dc2626',
      background: 'linear-gradient(135deg, #1a1000 0%, #451a03 50%, #92400e 100%)',
      surface: 'rgba(245, 158, 11, 0.1)',
      text: '#ffffff',
      textSecondary: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.3)',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #dc2626 100%)',
      cardBg: 'rgba(245, 158, 11, 0.08)',
      heroGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'arctic-ice': {
    name: 'Arctic Ice',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#3b82f6',
      background: 'linear-gradient(135deg, #0f1419 0%, #1e3a8a 50%, #075985 100%)',
      surface: 'rgba(6, 182, 212, 0.1)',
      text: '#ffffff',
      textSecondary: '#67e8f9',
      border: 'rgba(6, 182, 212, 0.3)',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #3b82f6 100%)',
      cardBg: 'rgba(6, 182, 212, 0.08)',
      heroGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'rose-garden': {
    name: 'Rose Garden',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f97316',
      background: 'linear-gradient(135deg, #1a0a14 0%, #831843 50%, #be185d 100%)',
      surface: 'rgba(236, 72, 153, 0.1)',
      text: '#ffffff',
      textSecondary: '#fbb6ce',
      border: 'rgba(236, 72, 153, 0.3)',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #f97316 100%)',
      cardBg: 'rgba(236, 72, 153, 0.08)',
      heroGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  },
  'emerald-dream': {
    name: 'Emerald Dream',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0a1a0f 0%, #064e3b 50%, #047857 100%)',
      surface: 'rgba(16, 185, 129, 0.1)',
      text: '#ffffff',
      textSecondary: '#6ee7b7',
      border: 'rgba(16, 185, 129, 0.3)',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #06b6d4 100%)',
      cardBg: 'rgba(16, 185, 129, 0.08)',
      heroGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif'
    }
  }
};

export function getTheme(themeName: string): Theme {
  return themes[themeName] || themes['midnight-gradient'];
}