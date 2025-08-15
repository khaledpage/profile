"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import type { SkillsContent, SkillGroup } from '@/types/content';

type Props = { skills: SkillsContent | undefined };

function GroupMarquee({ group }: { group: SkillGroup }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const dir = group.direction === 'right' ? 1 : -1;
  const duration = Math.max(20, group.speedSec ?? 40);

  // Duplicate items for seamless loop
  const items = useMemo(() => [...group.items, ...group.items], [group.items]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    let last = performance.now();
    const pxPerSec = (el.scrollWidth / 2) / duration; // cover one loop per duration

    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      if (!paused) {
        x += dir * pxPerSec * dt;
        el.style.transform = `translateX(${x}px)`;
        const width = el.scrollWidth / 2; // half since duplicated
        if (dir < 0 && -x > width) x += width;
        if (dir > 0 && x > width) x -= width;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dir, duration, paused]);

  return (
    <div className="overflow-hidden rounded-2xl glass-dark p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{group.title}</h3>
        <span className="text-xs text-gray-400">{group.direction === 'right' ? '→' : '←'}</span>
      </div>
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div ref={containerRef} className="flex gap-3 will-change-transform">
          {items.map((item, idx) => {
            const isActive = active === idx;
            return (
              <button
                key={`${item.name}-${idx}`}
                onClick={() => setActive(isActive ? null : idx)}
                className={`relative shrink-0 rounded-xl glass p-3 text-left transition-all ${isActive ? 'scale-105 ring-2 ring-white/20' : 'hover:scale-105'}`}
                style={{ width: isActive ? 220 : 160 }}
              >
                <div className="text-sm font-medium">{item.name}</div>
                {(item.level || item.years) && (
                  <div className="mt-0.5 text-[11px] text-gray-400">
                    {item.level ? item.level : ''}{item.level && item.years ? ' • ' : ''}{item.years ? `${item.years} yrs` : ''}
                  </div>
                )}
                {isActive && (
                  <div className="mt-2 text-xs text-gray-300 max-w-[30ch]">
                    {item.description}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                          <span key={t} className="px-1.5 py-[2px] rounded-full bg-white/10 text-[10px]">{t}</span>
                        ))}
                      </div>
                    )}
                    {item.link && (
                      <div className="mt-2">
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-[11px] gradient-text">Learn more →</a>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SkillsShowcase({ skills }: Props) {
  if (!skills || !skills.groups || skills.groups.length === 0) return null;
  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {skills.title ?? 'Skills & Tooling'}
        </h2>
        <div className="space-y-6">
          {skills.groups.map((g) => (
            <GroupMarquee key={g.key} group={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
