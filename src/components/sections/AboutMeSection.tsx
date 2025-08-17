'use client';

import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
};

export default function AboutMeSection({ config }: Props) {
  const { translations } = useLanguage(config);

  const aboutContent = {
    en: {
      title: "About Me",
      subtitle: "Let me introduce myself",
      description: "With over 5 years of experience in web development, I combine technical expertise with creative design to create exceptional digital solutions. I specialize in modern web technologies like React, Next.js and Node.js, developing scalable and user-friendly applications.",
      education: {
        title: "Education",
        degree: "Master of Computer Science",
        university: "Technical University",
        year: "2019"
      },
      experience: {
        title: "Experience",
        items: [
          {
            role: "Senior Full-Stack Developer",
            company: "Tech Innovation GmbH",
            period: "2021 - Present",
            description: "Lead development of modern web applications using React, Next.js, and TypeScript."
          },
          {
            role: "Frontend Developer",
            company: "Digital Solutions AG",
            period: "2019 - 2021", 
            description: "Developed responsive user interfaces and optimized application performance."
          }
        ]
      },
      stats: {
        experience: "5+ Years",
        projects: "40+",
        techFocus: "Next.js, TS",
        location: "Remote"
      }
    },
    de: {
      title: "Über mich",
      subtitle: "Lassen Sie mich mich vorstellen",
      description: "Mit über 5 Jahren Erfahrung in der Webentwicklung kombiniere ich technische Expertise mit kreativem Design, um außergewöhnliche digitale Lösungen zu schaffen. Spezialisiert auf moderne Webtechnologien wie React, Next.js und Node.js, entwickle ich skalierbare und benutzerfreundliche Anwendungen.",
      education: {
        title: "Ausbildung",
        degree: "Master Informatik",
        university: "Technische Universität",
        year: "2019"
      },
      experience: {
        title: "Berufserfahrung",
        items: [
          {
            role: "Senior Full-Stack Entwickler",
            company: "Tech Innovation GmbH",
            period: "2021 - Heute",
            description: "Leitung der Entwicklung moderner Webanwendungen mit React, Next.js und TypeScript."
          },
          {
            role: "Frontend Entwickler",
            company: "Digital Solutions AG",
            period: "2019 - 2021",
            description: "Entwicklung responsiver Benutzeroberflächen und Optimierung der Anwendungsleistung."
          }
        ]
      },
      stats: {
        experience: "5+ Jahre",
        projects: "40+",
        techFocus: "Next.js, TS",
        location: "Remote"
      }
    }
  };

  const currentLang = config.i18n?.defaultLocale || 'en';
  const content = aboutContent[currentLang as keyof typeof aboutContent] || aboutContent.en;

  return (
    <section id="about-me" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {content.title}
          </h2>
          <p className="text-lg" style={{ color: 'var(--muted)' }}>
            {content.subtitle}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Profile Picture & Introduction */}
          <div className="lg:col-span-5">
            <div className="relative mb-8">
              {/* Profile Picture with modern frame */}
              <div className="relative mx-auto w-80 h-80 md:w-96 md:h-96">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    padding: '6px'
                  }}
                >
                  <div 
                    className="w-full h-full rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--card)' }}
                  >
                    <img
                      src="/content/assets/csm_Khaled_Alabsi_Portraet_6d491f1c81.jpg"
                      alt="Khaled Alabsi Profile Picture"
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(1.1) contrast(1.05)' }}
                    />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div 
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 animate-pulse"
                  style={{ backgroundColor: 'var(--accent-1)' }}
                />
                <div 
                  className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full opacity-30 animate-pulse"
                  style={{ 
                    backgroundColor: 'var(--accent-2)',
                    animationDelay: '1s'
                  }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-1)' }}>
                  {content.stats.experience}
                </div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>
                  {content.experience.title}
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-1)' }}>
                  {content.stats.projects}
                </div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>
                  Projekte
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-1)' }}>
                  {content.stats.techFocus}
                </div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>
                  Tech Focus
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent-1)' }}>
                  {content.stats.location}
                </div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>
                  Standort
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-7 space-y-8">
            {/* Description */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="text-2xl">👋</span>
                Hallo!
              </h3>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
                {content.description}
              </p>
            </div>

            {/* Education */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="text-2xl">🎓</span>
                {content.education.title}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {content.education.degree}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                    {content.education.university}
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 80%)',
                      color: 'var(--accent-1)' 
                    }}
                  >
                    {content.education.year}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="text-2xl">💼</span>
                {content.experience.title}
              </h3>
              <div className="space-y-6">
                {content.experience.items.map((job, index) => (
                  <div key={index} className="relative">
                    {/* Timeline line */}
                    {index < content.experience.items.length - 1 && (
                      <div 
                        className="absolute left-3 top-8 w-0.5 h-16"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 70%)' }}
                      />
                    )}
                    
                    {/* Timeline dot */}
                    <div 
                      className="absolute left-1.5 top-2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: 'var(--accent-1)' }}
                    />
                    
                    {/* Content */}
                    <div className="ml-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                          {job.role}
                        </h4>
                        <span 
                          className="text-sm px-2 py-1 rounded mt-1 sm:mt-0"
                          style={{ 
                            backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                            color: 'var(--muted)' 
                          }}
                        >
                          {job.period}
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-2" style={{ color: 'var(--accent-1)' }}>
                        {job.company}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                        {job.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
