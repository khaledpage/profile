"use client";

import { useEffect } from 'react';
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
  animation?: { fadeOutDurationSec?: number; fadeInAfterSec?: number; fadeDurationSec?: number; fadeMin?: number; fadeMax?: number };
  interactiveEffects?: SiteConfig['interactiveEffects'];
};

export default function ThemeController({ palettes, colorProfile, colorRotation, animation, interactiveEffects }: Props) {
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

    applyPalette(colorProfile);

  let intervalTimer: ReturnType<typeof setInterval> | undefined;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    if (colorRotation?.enabled) {
      const list = colorRotation.candidates && colorRotation.candidates.length > 0
        ? colorRotation.candidates
        : Object.keys(palettes);
      let idx = list.indexOf(colorProfile);
      intervalTimer = setInterval(() => {
        idx = (idx + 1) % list.length;
        applyPalette(list[idx]);
      }, (colorRotation.intervalSec ?? 120) * 1000);
    }

  // Control fading out and back in
    if (animation) {
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
  }, [palettes, colorProfile, colorRotation, animation]);

  // Subtle random ripple effect on pointer move
  useEffect(() => {
    const cfg = interactiveEffects;
    if (cfg?.enabled === false) return;

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
  }, [interactiveEffects]);

  return null;
}
