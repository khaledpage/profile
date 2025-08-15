"use client";

import { useEffect, useState, useCallback } from 'react';
import { getCookieConsent } from '@/utils/cookies';
import type { SiteConfig } from '@/types/content';

type Palette = {
  name: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
  cardContrast: string;
  accent1: string;
  accent2: string;
};

type Props = {
  palettes: Record<string, Palette>;
  colorProfile: string;
  colorRotation?: { enabled?: boolean; intervalSec?: number; candidates?: string[] };
  animation?: { fadeOutDurationSec?: number; fadeInAfterSec?: number; fadeDurationSec?: number; fadeMin?: number; fadeMax?: number; enabled?: boolean };
  interactiveEffects?: SiteConfig['interactiveEffects'];
};

declare global {
  interface Window {
    __themeController?: {
      changeTheme: (profileKey: string) => void;
      toggleAnimations: (enabled: boolean) => void;
    };
  }
}

export default function ThemeController({ palettes, colorProfile, colorRotation, animation, interactiveEffects }: Props) {
  const [currentProfile, setCurrentProfile] = useState(colorProfile);
  const [animationsEnabled, setAnimationsEnabled] = useState(animation?.enabled ?? true);

  // Expose theme change function globally for SettingsPanel
  const changeTheme = useCallback((profileKey: string) => {
    if (palettes[profileKey]) {
      setCurrentProfile(profileKey);
    }
  }, [palettes]);

  const toggleAnimations = useCallback((enabled: boolean) => {
    setAnimationsEnabled(enabled);
  }, []);

  useEffect(() => {
    // Make functions available globally
    window.__themeController = {
      changeTheme,
      toggleAnimations,
    };

    // Check for stored preferences on mount (only if consent given and preferences allowed)
    const consent = getCookieConsent();
    if (consent && consent.preferences) {
      const stored = localStorage.getItem('user-preferences');
      if (stored) {
        try {
          const prefs = JSON.parse(stored);
          if (prefs.colorProfile && palettes[prefs.colorProfile]) {
            setCurrentProfile(prefs.colorProfile);
          }
          if (prefs.animationsEnabled !== undefined) {
            setAnimationsEnabled(prefs.animationsEnabled);
          }
        } catch {
          // Ignore parsing errors
        }
      }
    }

    // Listen for preference updates
    const handlePreferencesUpdate = (event: CustomEvent) => {
      const newPrefs = event.detail;
      if (newPrefs.colorProfile && palettes[newPrefs.colorProfile]) {
        setCurrentProfile(newPrefs.colorProfile);
      }
      if (newPrefs.animationsEnabled !== undefined) {
        setAnimationsEnabled(newPrefs.animationsEnabled);
      }
    };

    window.addEventListener('preferencesUpdated', handlePreferencesUpdate as EventListener);

    // Apply initial theme immediately
    const root = document.documentElement;
    const initialProfile = currentProfile || colorProfile;
    const p = palettes[initialProfile];
    if (p) {
      root.style.setProperty('--background', p.background);
      root.style.setProperty('--foreground', p.foreground);
      root.style.setProperty('--muted', p.muted);
      root.style.setProperty('--card', p.card);
      root.style.setProperty('--card-contrast', p.cardContrast);
      root.style.setProperty('--accent-1', p.accent1);
      root.style.setProperty('--accent-2', p.accent2);
    }

    return () => {
      window.removeEventListener('preferencesUpdated', handlePreferencesUpdate as EventListener);
      delete window.__themeController;
    };
  }, [changeTheme, toggleAnimations, palettes, currentProfile, colorProfile]);

  useEffect(() => {
    const root = document.documentElement;
    const applyPalette = (key: string) => {
      const p = palettes[key];
      if (!p) return;
      root.style.setProperty('--background', p.background);
      root.style.setProperty('--foreground', p.foreground);
      root.style.setProperty('--muted', p.muted);
      root.style.setProperty('--card', p.card);
      root.style.setProperty('--card-contrast', p.cardContrast);
      root.style.setProperty('--accent-1', p.accent1);
      root.style.setProperty('--accent-2', p.accent2);
    };

    applyPalette(currentProfile);

    // Control animation class
    const gradient = document.querySelector('.animated-gradient') as HTMLElement | null;
    if (gradient) {
      if (animationsEnabled) {
        gradient.style.display = 'block';
        gradient.style.opacity = String(animation?.fadeMax ?? 0.5);
      } else {
        gradient.style.opacity = '0';
      }
    }

    let intervalTimer: ReturnType<typeof setInterval> | undefined;
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    
    if (colorRotation?.enabled && animationsEnabled) {
      const list = colorRotation.candidates && colorRotation.candidates.length > 0
        ? colorRotation.candidates
        : Object.keys(palettes);
      let idx = list.indexOf(currentProfile);
      intervalTimer = setInterval(() => {
        idx = (idx + 1) % list.length;
        const newProfile = list[idx];
        setCurrentProfile(newProfile);
        applyPalette(newProfile);
      }, (colorRotation.intervalSec ?? 120) * 1000);
    }

    // Control fading out and back in
    if (animation && animationsEnabled) {
      const min = animation.fadeMin ?? 0.2;
      const max = animation.fadeMax ?? 0.6;
      const outMs = (animation.fadeOutDurationSec ?? animation.fadeDurationSec ?? 60) * 1000;
      const waitMs = (animation.fadeInAfterSec ?? 0) * 1000;

      // set CSS variables for keyframes
      root.style.setProperty('--anim-min', String(min));
      root.style.setProperty('--anim-max', String(max));

      const gradient = document.querySelector('.animated-gradient') as HTMLElement | null;
      if (gradient) {
        let visible = true;
        const loop = () => {
          if (!gradient) return;
          if (visible) {
            gradient.style.transition = `opacity ${outMs}ms linear`;
            gradient.style.opacity = String(min);
            visible = false;
            setTimeout(() => {
              if (!gradient) return;
              gradient.style.transition = `opacity ${outMs}ms linear`;
              gradient.style.opacity = String(max);
              visible = true;
              fadeTimer = setTimeout(loop, waitMs);
            }, outMs + waitMs);
          }
        };
        fadeTimer = setTimeout(loop, waitMs);
      }
    }

    return () => {
      if (intervalTimer) clearInterval(intervalTimer);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [palettes, currentProfile, colorRotation, animation, animationsEnabled]);

  // Subtle random ripple effect on pointer move
  useEffect(() => {
    const cfg = interactiveEffects;
    if (cfg?.enabled === false || !animationsEnabled) return;

    let target = document.querySelector('.ripples-layer') as HTMLElement | null;
    if (!target) {
      const div = document.createElement('div');
      div.className = 'ripples-layer';
      document.body.appendChild(div);
      target = div;
    }

    let lastTs = 0;
    let countWindow = 0;
    let windowStart = Date.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const triggerChance = cfg?.triggerChance ?? 0.08;
      const minInterval = (cfg?.minIntervalSec ?? 8) * 1000;
      const maxPerMinute = cfg?.maxPerMinute ?? 6;
      const now = Date.now();
      if (now - windowStart > 60000) { windowStart = now; countWindow = 0; }
      if (countWindow >= maxPerMinute) return;
      if (now - lastTs < minInterval) return;
      if (Math.random() > triggerChance) return;

      lastTs = now;
      countWindow++;

      const size = cfg?.ripple?.sizePx ?? 180;
      const duration = cfg?.ripple?.durationMs ?? 1200;

      const dot = document.createElement('div');
      dot.className = 'ripple-dot';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.setProperty('--ripple-duration', `${duration}ms`);
      if (cfg?.ripple?.color) {
        dot.style.background = `radial-gradient(circle at 50% 50%, ${cfg.ripple.color}, transparent 70%)`;
      }
      target!.appendChild(dot);
      setTimeout(() => {
        if (dot.parentElement === target) target!.removeChild(dot);
      }, duration + 50);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [interactiveEffects, animationsEnabled]);

  return null;
}
