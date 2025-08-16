"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCookieConsent } from '@/utils/cookies';
import type { SkillsContent, SkillGroup, SiteConfig } from '@/types/content';

type Props = { 
  skills: SkillsContent | undefined;
  config: SiteConfig;
};

// Marquee Design (Original)
function MarqueeDesign({ skills }: { skills: SkillsContent }) {
  function GroupMarquee({ group }: { group: SkillGroup }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const [active, setActive] = useState<number | null>(null);

    const dir = group.direction === 'right' ? 1 : -1;
    const duration = Math.max(20, group.speedSec ?? 40);
    const items = useMemo(() => [...group.items, ...group.items], [group.items]);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      let raf = 0;
      let x = 0;
      let last = performance.now();
      const pxPerSec = (el.scrollWidth / 2) / duration;

      const tick = (t: number) => {
        const dt = (t - last) / 1000;
        last = t;
        if (!paused) {
          x += dir * pxPerSec * dt;
          el.style.transform = `translateX(${x}px)`;
          const width = el.scrollWidth / 2;
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
          <h3 className="text-lg font-semibold" style={{color: 'var(--foreground)'}}>{group.title}</h3>
          <span className="text-xs" style={{color: 'var(--muted)'}}>{group.direction === 'right' ? '→' : '←'}</span>
        </div>
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div ref={containerRef} className="flex gap-3 w-max">
            {items.map((skill, idx) => (
              <div
                key={`${skill.name}-${idx}`}
                onClick={() => setActive(active === idx ? null : idx)}
                className="flex-shrink-0 p-3 rounded-lg cursor-pointer transition-all hover:scale-105"
                style={{
                  backgroundColor: active === idx ? 'color-mix(in srgb, var(--accent-1), transparent 80%)' : 'color-mix(in srgb, var(--foreground), transparent 95%)',
                  border: `1px solid color-mix(in srgb, var(--foreground), transparent 85%)`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-1), transparent 85%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = active === idx ? 'color-mix(in srgb, var(--accent-1), transparent 80%)' : 'color-mix(in srgb, var(--foreground), transparent 95%)';
                }}
              >
                <div className="text-sm font-medium mb-1" style={{color: 'var(--foreground)'}}>{skill.name}</div>
                {skill.level && <div className="text-xs" style={{color: 'var(--muted)'}}>{skill.level}</div>}
                {active === idx && skill.description && (
                  <div className="mt-2 text-xs max-w-48" style={{color: 'var(--muted)'}}>{skill.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {skills.groups.map((group, index) => (
        <GroupMarquee key={`${group.key}-${index}`} group={group} />
      ))}
    </div>
  );
}

// Grid Design
function GridDesign({ skills }: { skills: SkillsContent }) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.groups.map((group, index) => (
        <div key={`${group.key}-${index}`} className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4" style={{color: 'var(--foreground)'}}>{group.title}</h3>
          <div className="grid grid-cols-2 gap-3">
            {group.items.slice(0, expandedGroup === group.key ? undefined : 4).map((skill, skillIndex) => (
              <div key={`${skill.name}-${skillIndex}`} className="p-3 rounded-lg"
                   style={{
                     backgroundColor: 'color-mix(in srgb, var(--foreground), transparent 95%)',
                     border: `1px solid color-mix(in srgb, var(--foreground), transparent 85%)`
                   }}>
                <div className="text-sm font-medium" style={{color: 'var(--foreground)'}}>{skill.name}</div>
                {skill.level && <div className="text-xs mt-1" style={{color: 'var(--muted)'}}>{skill.level}</div>}
              </div>
            ))}
          </div>
          {group.items.length > 4 && (
            <button
              onClick={() => setExpandedGroup(expandedGroup === group.key ? null : group.key)}
              className="mt-4 text-sm transition-colors"
              style={{color: 'var(--muted)'}}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
            >
              {expandedGroup === group.key ? 'Show Less' : `+${group.items.length - 4} more`}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Carousel Design
function CarouselDesign({ skills }: { skills: SkillsContent }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allItems = skills.groups.flatMap(group => 
    group.items.map(item => ({ ...item, group: group.title }))
  );

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % Math.ceil(allItems.length / 3));
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + Math.ceil(allItems.length / 3)) % Math.ceil(allItems.length / 3));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Skills & Technologies</h3>
        <div className="flex gap-2">
          <button 
            onClick={prevSlide} 
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card), transparent 40%)',
              color: 'var(--muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 20%)';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 40%)';
              e.currentTarget.style.color = 'var(--muted)';
            }}
          >
            ←
          </button>
          <button 
            onClick={nextSlide} 
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card), transparent 40%)',
              color: 'var(--muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 20%)';
              e.currentTarget.style.color = 'var(--foreground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--card), transparent 40%)';
              e.currentTarget.style.color = 'var(--muted)';
            }}
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[200px]">
        {allItems.slice(currentIndex * 3, (currentIndex + 1) * 3).map((skill, idx) => (
          <div 
            key={`carousel-${skill.name}-${currentIndex}-${idx}`} 
            className="p-4 rounded-lg transition-colors"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
            }}
          >
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>{skill.name}</div>
            <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{skill.group}</div>
            {skill.level && <div className="text-xs" style={{ color: 'var(--muted)' }}>{skill.level}</div>}
            {skill.description && <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{skill.description}</div>}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: Math.ceil(allItems.length / 3) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: idx === currentIndex ? 'var(--accent-1)' : 'color-mix(in srgb, var(--foreground), transparent 80%)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Masonry Design
function MasonryDesign({ skills }: { skills: SkillsContent }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {skills.groups.map((group, index) => (
        <div key={`${group.key}-${index}`} className="break-inside-avoid glass rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{group.title}</h3>
          <div className="space-y-3">
            {group.items.map((skill, skillIndex) => (
              <div 
                key={`${skill.name}-${skillIndex}`} 
                className="p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                }}
              >
                <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{skill.name}</div>
                {skill.level && <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{skill.level}</div>}
                {skill.description && <div className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{skill.description}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Timeline Design
function TimelineDesign({ skills }: { skills: SkillsContent }) {
  return (
    <div className="relative">
      <div 
        className="absolute left-4 top-0 bottom-0 w-0.5"
        style={{
          background: `linear-gradient(to bottom, var(--accent-1), var(--accent-2))`,
        }}
      ></div>
      <div className="space-y-8">
        {skills.groups.map((group, index) => (
          <div key={`${group.key}-${index}`} className="relative">
            <div 
              className="absolute left-2 w-4 h-4 rounded-full border-4"
              style={{
                backgroundColor: 'var(--accent-1)',
                borderColor: 'var(--background)',
              }}
            ></div>
            <div className="ml-12 glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>{group.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.items.map((skill, skillIndex) => (
                  <div 
                    key={`${skill.name}-${skillIndex}`} 
                    className="p-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                    }}
                  >
                    <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{skill.name}</div>
                    {skill.level && <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{skill.level}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsShowcaseMultiDesign({ skills, config }: Props) {
  const [currentDesign, setCurrentDesign] = useState(config.skillsDisplay?.design || 'marquee');

  useEffect(() => {
    // Check for stored preferences on mount
    const loadStoredPreferences = () => {
      const consent = getCookieConsent();
      if (consent && consent.preferences) {
        const stored = localStorage.getItem('user-preferences');
        if (stored) {
          try {
            const prefs = JSON.parse(stored);
            if (prefs.skillsDesign) {
              setCurrentDesign(prefs.skillsDesign);
            }
          } catch {
            // Ignore parsing errors
          }
        }
      }
    };

    loadStoredPreferences();

    // Listen for storage changes (when preferences are updated from settings panel)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user-preferences' && e.newValue) {
        try {
          const prefs = JSON.parse(e.newValue);
          if (prefs.skillsDesign) {
            setCurrentDesign(prefs.skillsDesign);
          }
        } catch {
          // Ignore parsing errors
        }
      }
    };

    // Listen for custom events for immediate updates within the same tab
    const handlePreferencesUpdate = (e: CustomEvent) => {
      if (e.detail.skillsDesign) {
        setCurrentDesign(e.detail.skillsDesign);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('preferencesUpdated', handlePreferencesUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('preferencesUpdated', handlePreferencesUpdate as EventListener);
    };
  }, []);

  if (!skills || skills.groups.length === 0) {
    return <div className="text-center" style={{ color: 'var(--muted)' }}>No skills data available</div>;
  }

  const renderDesign = () => {
    switch (currentDesign) {
      case 'grid':
        return <GridDesign skills={skills} />;
      case 'carousel':
        return <CarouselDesign skills={skills} />;
      case 'masonry':
        return <MasonryDesign skills={skills} />;
      case 'timeline':
        return <TimelineDesign skills={skills} />;
      case 'marquee':
      default:
        return <MarqueeDesign skills={skills} />;
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {skills.title || 'Skills & Tooling'}
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Technologies and tools I work with, organized by expertise and experience.
          </p>
        </div>
        {renderDesign()}
      </div>
    </section>
  );
}
