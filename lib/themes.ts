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
    primaryShadow?: string;
    primaryShadowStrong?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  effects: {
    glass: string;
    shadow: string;
    blur: string;
  };
}

export const themes: Record<string, Theme> = {
  // Dark Themes
  'midnight-gradient': {
    name: 'Midnight Gradient',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#ffffff',
      textSecondary: '#94a3b8',
      border: 'rgba(255, 255, 255, 0.1)',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    },
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05);',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      blur: 'blur(10px)',
    },
  },

  'cyberpunk-neon': {
    name: 'Cyberpunk Neon',
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#ffff00',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a1a1a 100%)',
      surface: 'rgba(255, 0, 128, 0.05)',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      border: 'rgba(255, 0, 128, 0.2)',
      gradient: 'linear-gradient(135deg, #ff0080 0%, #00ff80 50%, #ffff00 100%)',
    },
    fonts: {
      heading: 'Orbitron, monospace',
      body: 'Roboto Mono, monospace',
    },
    effects: {
      glass: 'backdrop-filter: blur(15px); background: rgba(255, 0, 128, 0.05);',
      shadow: '0 0 20px rgba(255, 0, 128, 0.5)',
      blur: 'blur(15px)',
    },
  },

  'ocean-depths': {
    name: 'Ocean Depths',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#22d3ee',
      background: 'linear-gradient(135deg, #0c4a6e 0%, #164e63 50%, #155e75 100%)',
      surface: 'rgba(14, 165, 233, 0.05)',
      text: '#ffffff',
      textSecondary: '#a5b4fc',
      border: 'rgba(14, 165, 233, 0.2)',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #22d3ee 100%)',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(12px); background: rgba(14, 165, 233, 0.05);',
      shadow: '0 8px 40px rgba(6, 182, 212, 0.3)',
      blur: 'blur(12px)',
    },
  },

  'sunset-blaze': {
    name: 'Sunset Blaze',
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #431407 0%, #7c2d12 50%, #9a3412 100%)',
      surface: 'rgba(249, 115, 22, 0.05)',
      text: '#ffffff',
      textSecondary: '#fed7aa',
      border: 'rgba(249, 115, 22, 0.2)',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #fbbf24 100%)',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(249, 115, 22, 0.05);',
      shadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
      blur: 'blur(10px)',
    },
  },

  'aurora-lights': {
    name: 'Aurora Lights',
    colors: {
      primary: '#a855f7',
      secondary: '#06b6d4',
      accent: '#10b981',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #1e3a8a 60%, #1e40af 100%)',
      surface: 'rgba(168, 85, 247, 0.05)',
      text: '#ffffff',
      textSecondary: '#c4b5fd',
      border: 'rgba(168, 85, 247, 0.2)',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 33%, #10b981 66%, #fbbf24 100%)',
    },
    fonts: {
      heading: 'Space Grotesk, sans-serif',
      body: 'Inter, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(14px); background: rgba(168, 85, 247, 0.05);',
      shadow: '0 8px 40px rgba(168, 85, 247, 0.3)',
      blur: 'blur(14px)',
    },
  },

  'forest-emerald': {
    name: 'Forest Emerald',
    colors: {
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#84cc16',
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      surface: 'rgba(5, 150, 105, 0.05)',
      text: '#ffffff',
      textSecondary: '#a7f3d0',
      border: 'rgba(5, 150, 105, 0.2)',
      gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #84cc16 100%)',
    },
    fonts: {
      heading: 'Nunito, sans-serif',
      body: 'Source Sans Pro, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(5, 150, 105, 0.05);',
      shadow: '0 8px 32px rgba(13, 148, 136, 0.3)',
      blur: 'blur(10px)',
    },
  },

  // Light Themes
  'arctic-frost': {
    name: 'Arctic Frost',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      surface: 'rgba(59, 130, 246, 0.05)',
      text: '#1e293b',
      textSecondary: '#475569',
      border: 'rgba(59, 130, 246, 0.1)',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.8);',
      shadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
      blur: 'blur(10px)',
    },
  },

  'rose-garden': {
    name: 'Rose Garden',
    colors: {
      primary: '#e11d48',
      secondary: '#f43f5e',
      accent: '#fb7185',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fce7e7 50%, #fecaca 100%)',
      surface: 'rgba(225, 29, 72, 0.05)',
      text: '#7f1d1d',
      textSecondary: '#991b1b',
      border: 'rgba(225, 29, 72, 0.1)',
      gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Source Sans Pro, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.7);',
      shadow: '0 8px 32px rgba(225, 29, 72, 0.15)',
      blur: 'blur(10px)',
    },
  },

  'golden-hour': {
    name: 'Golden Hour',
    colors: {
      primary: '#d97706',
      secondary: '#f59e0b',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fed7aa 100%)',
      surface: 'rgba(217, 119, 6, 0.05)',
      text: '#78350f',
      textSecondary: '#92400e',
      border: 'rgba(217, 119, 6, 0.1)',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    },
    fonts: {
      heading: 'Merriweather, serif',
      body: 'Lato, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.6);',
      shadow: '0 8px 32px rgba(217, 119, 6, 0.15)',
      blur: 'blur(10px)',
    },
  },

  // Monochrome Themes
  'monochrome-dark': {
    name: 'Monochrome Dark',
    colors: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      accent: '#9ca3af',
      background: 'linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      text: '#ffffff',
      textSecondary: '#9ca3af',
      border: 'rgba(255, 255, 255, 0.1)',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #9ca3af 100%)',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05);',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      blur: 'blur(10px)',
    },
  },

  'monochrome-light': {
    name: 'Monochrome Light',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#6b7280',
      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)',
      surface: 'rgba(31, 41, 55, 0.05)',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: 'rgba(31, 41, 55, 0.1)',
      gradient: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #6b7280 100%)',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.8);',
      shadow: '0 8px 32px rgba(31, 41, 55, 0.1)',
      blur: 'blur(10px)',
    },
  },

  'high-contrast': {
    name: 'High Contrast',
    colors: {
      primary: '#ffffff',
      secondary: '#ffffff',
      accent: '#ffffff',
      background: 'linear-gradient(135deg, #000000 0%, #000000 50%, #111111 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      textSecondary: '#ffffff',
      border: 'rgba(255, 255, 255, 0.3)',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #ffffff 100%)',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.1);',
      shadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
      blur: 'blur(10px)',
    },
  },

  // Retro Themes
  'retro-synthwave': {
    name: 'Retro Synthwave',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #000033 100%)',
      surface: 'rgba(255, 0, 255, 0.05)',
      text: '#ffffff',
      textSecondary: '#ff99ff',
      border: 'rgba(255, 0, 255, 0.2)',
      gradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)',
    },
    fonts: {
      heading: 'Orbitron, monospace',
      body: 'Courier New, monospace',
    },
    effects: {
      glass: 'backdrop-filter: blur(12px); background: rgba(255, 0, 255, 0.05);',
      shadow: '0 0 30px rgba(255, 0, 255, 0.5)',
      blur: 'blur(12px)',
    },
  },

  'vapor-wave': {
    name: 'Vapor Wave',
    colors: {
      primary: '#ff006e',
      secondary: '#8338ec',
      accent: '#06ffa5',
      background: 'linear-gradient(135deg, #2d1b69 0%, #11001c 50%, #0c002b 100%)',
      surface: 'rgba(255, 0, 110, 0.05)',
      text: '#ffffff',
      textSecondary: '#ff99d5',
      border: 'rgba(255, 0, 110, 0.2)',
      gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #06ffa5 100%)',
    },
    fonts: {
      heading: 'Audiowide, cursive',
      body: 'Roboto, sans-serif',
    },
    effects: {
      glass: 'backdrop-filter: blur(15px); background: rgba(255, 0, 110, 0.05);',
      shadow: '0 0 25px rgba(255, 0, 110, 0.4)',
      blur: 'blur(15px)',
    },
  },
};

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || themes['midnight-gradient'];
};

export const getThemeNames = (): string[] => {
  return Object.keys(themes);
};

export const getThemesByCategory = () => {
  return {
    dark: [
      'midnight-gradient',
      'cyberpunk-neon',
      'ocean-depths',
      'sunset-blaze',
      'aurora-lights',
      'forest-emerald',
    ],
    light: [
      'arctic-frost',
      'rose-garden',
      'golden-hour',
    ],
    monochrome: [
      'monochrome-dark',
      'monochrome-light',
      'high-contrast',
    ],
    retro: [
      'retro-synthwave',
      'vapor-wave',
    ],
  };
};
