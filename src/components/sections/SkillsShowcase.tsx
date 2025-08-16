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
    <div id={`skill-group-${group.title.toLowerCase().replace(/\s+/g, '-')}`} className="overflow-hidden rounded-2xl glass-dark p-3">
      <div id={`skill-header-${group.title.toLowerCase().replace(/\s+/g, '-')}`} className="mb-3 flex items-center justify-between">
        <h3 id={`skill-title-${group.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg font-semibold">{group.title}</h3>
        <span id={`skill-direction-${group.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs" style={{ color: 'var(--muted)' }}>{group.direction === 'right' ? '→' : '←'}</span>
      </div>
      <div
        id={`skill-container-${group.title.toLowerCase().replace(/\s+/g, '-')}`}
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div id={`skill-marquee-${group.title.toLowerCase().replace(/\s+/g, '-')}`} ref={containerRef} className="flex gap-3 will-change-transform">
          {items.map((item, idx) => {
            const isActive = active === idx;
            return (
              <button
                key={`${item.name}-${idx}`}
                id={`skill-item-${item.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`}
                onClick={() => setActive(isActive ? null : idx)}
                className={`relative shrink-0 rounded-xl glass p-3 text-left transition-all ${isActive ? 'scale-105 ring-2 ring-white/20' : 'hover:scale-105'}`}
                style={{ width: isActive ? 220 : 160 }}
              >
                <div id={`skill-name-${item.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`} className="text-sm font-medium">{item.name}</div>
                {(item.level || item.years) && (
                                    <div id={`skill-meta-${item.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`} className="mt-0.5 text-[11px]" style={{ color: 'var(--muted)' }}>
                    {item.level}{item.years && ` | ${item.years} years`}
                  </div>
                )}
                {isActive && (
                  <div id={`skill-details-${item.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`} className="mt-2 text-xs max-w-[30ch]" style={{ color: 'var(--muted)' }}>
                    {item.description}
                    {item.tags && item.tags.length > 0 && (
                      <div id={`skill-tags-${item.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`} className="mt-2 flex flex-wrap gap-1.5">
                        {item.tags.map((t, tagIdx) => (
                          <span key={t} id={`skill-tag-${t.toLowerCase().replace(/\s+/g, '-')}-${idx}-${tagIdx}`} className="px-1.5 py-[2px] rounded-full bg-white/10 text-[10px]">{t}</span>
                        ))}
                      </div>
                    )}
                    {item.link && (
                      <div id={`skill-link-${item.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`} className="mt-2">
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
    <section id="skills-section" className="py-24">
      <div id="skills-container" className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="skills-title" className="text-3xl md:text-4xl font-bold text-center mb-12">
          {skills.title ?? 'Skills & Tooling'}
        </h2>
        <div id="skills-groups" className="space-y-6">
          {skills.groups.map((g) => (
            <GroupMarquee key={g.key} group={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
