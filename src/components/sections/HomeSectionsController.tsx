'use client';

import Hero from '@/components/sections/Hero';
import SkillsShowcaseMultiDesign from '@/components/sections/SkillsShowcaseMultiDesign';
import ArticlesSection from '@/components/sections/ArticlesSection';
import WorkflowSection from '@/components/sections/WorkflowSection';
import ProjectCard from '@/components/ui/ProjectCard';
import { Project, SiteContent, SiteConfig } from '@/types/content';
import React from 'react';

type Props = {
  content: SiteContent;
  config: SiteConfig;
};

const DEFAULT_ORDER: Array<'hero' | 'about' | 'skills' | 'projects' | 'articles' | 'workflow' | 'contact'> = [
  'hero', 'about', 'skills', 'projects', 'articles', 'workflow', 'contact'
];

export default function HomeSectionsController({ content, config }: Props) {
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [hidden, setHidden] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    // Load from preferences if allowed
    try {
      const prefs = localStorage.getItem('user-preferences');
      let prefOrder = config.homeSections?.order ?? DEFAULT_ORDER;
      let prefHidden = config.homeSections?.hidden ?? [];
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed?.homeSections?.order) prefOrder = parsed.homeSections.order;
        if (parsed?.homeSections?.hidden) prefHidden = parsed.homeSections.hidden;
      }
      setOrder(prefOrder as typeof DEFAULT_ORDER);
      setHidden(prefHidden as Array<string>);
    } catch {}
  }, [config.homeSections]);

  React.useEffect(() => {
    const onPrefsUpdated = (ev: Event) => {
      try {
        const e = ev as CustomEvent<{ homeSections?: { order?: typeof DEFAULT_ORDER; hidden?: Array<string> } }>;
        const detail = e?.detail || {};
        if (detail?.homeSections) {
          if (Array.isArray(detail.homeSections.order)) {
            setOrder(detail.homeSections.order as typeof DEFAULT_ORDER);
          }
          if (Array.isArray(detail.homeSections.hidden)) {
            setHidden(detail.homeSections.hidden as Array<string>);
          }
        }
      } catch {}
    };
    window.addEventListener('preferencesUpdated', onPrefsUpdated as EventListener);
    return () => window.removeEventListener('preferencesUpdated', onPrefsUpdated as EventListener);
  }, []);

  const sequence = order.filter(k => !hidden.includes(k));

  return (
    <main className="content-surface">
      {sequence.map((key) => {
        switch (key) {
          case 'hero':
            return (
              <Hero
                key="hero"
                title={content.hero.title}
                subtitle={content.hero.subtitle}
                description={content.hero.description}
                primaryButton={content.hero.primaryButton}
                secondaryButton={content.hero.secondaryButton}
                config={config}
              />
            );
          case 'about':
            return (
              <section id="about" className="py-24" key="about">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Über mich
                      </h2>
                      <p className="text-lg leading-relaxed" style={{color: 'var(--muted)'}}>
                        {content.hero.content}
                      </p>
                    </div>
                    <div className="lg:col-span-5">
                      <div className="glass rounded-2xl p-6 lift">
                        <dl className="grid grid-cols-2 gap-6">
                          <div>
                            <dt className="text-sm" style={{color: 'var(--muted)'}}>Erfahrung</dt>
                            <dd className="text-2xl font-semibold" style={{color: 'var(--foreground)'}}>5+ Jahre</dd>
                          </div>
                          <div>
                            <dt className="text-sm" style={{color: 'var(--muted)'}}>Tech Focus</dt>
                            <dd className="text-2xl font-semibold" style={{color: 'var(--foreground)'}}>Next.js, TS</dd>
                          </div>
                          <div>
                            <dt className="text-sm" style={{color: 'var(--muted)'}}>Projekte</dt>
                            <dd className="text-2xl font-semibold" style={{color: 'var(--foreground)'}}>40+</dd>
                          </div>
                          <div>
                            <dt className="text-sm" style={{color: 'var(--muted)'}}>Standort</dt>
                            <dd className="text-2xl font-semibold" style={{color: 'var(--foreground)'}}>Remote</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          case 'skills':
            return (
              <SkillsShowcaseMultiDesign key="skills" skills={content.skills} config={config} />
            );
          case 'projects':
            return (
              <section id="projects" className="py-24" key="projects">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-end justify-between mb-10">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold">{content.projects.title}</h2>
                      <p style={{ color: 'var(--muted)' }}>{content.projects.subtitle}</p>
                    </div>
                    <a href="#contact" className="hidden md:inline-block text-sm gradient-text">Projekt anfragen →</a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.projects.projects.map((project: Project) => (
                      <ProjectCard key={project.title} {...project} />
                    ))}
                  </div>
                </div>
              </section>
            );
          case 'articles':
            return <ArticlesSection key="articles" />;
          case 'workflow':
            return <WorkflowSection key="workflow" config={config} />;
          case 'contact':
            return (
              <section id="contact" className="py-24" key="contact">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.contact.title}</h2>
                    <p className="mb-8 max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>{content.contact.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                      <div className="glass rounded-xl p-5">
                        <div className="text-sm" style={{ color: 'var(--muted)' }}>E-Mail</div>
                        <div className="font-medium">khaled@example.com</div>
                      </div>
                      <div className="glass rounded-xl p-5">
                        <div className="text-sm" style={{ color: 'var(--muted)' }}>Telefon</div>
                        <div className="font-medium">+49 123 456789</div>
                      </div>
                      <div className="glass rounded-xl p-5">
                        <div className="text-sm" style={{ color: 'var(--muted)' }}>Standort</div>
                        <div className="font-medium">Remote / Deutschland</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
