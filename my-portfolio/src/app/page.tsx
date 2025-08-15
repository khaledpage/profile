import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import ProjectCard from '@/components/ui/ProjectCard';
import { getAllContent, getSiteConfig } from '@/utils/content';
import SkillsShowcaseMultiDesign from '@/components/sections/SkillsShowcaseMultiDesign';
import ArticlesSection from '@/components/sections/ArticlesSection';
import { Project } from '@/types/content';

export const revalidate = 0; // Deaktiviert das Caching für Entwicklungszwecke

export default async function Home() {
  try {
    const content = await getAllContent();
    const config = await getSiteConfig();
    const { hero, projects, contact } = content;

    return (
      <div className="min-h-dvh text-foreground">
        <Header config={config} />
  <main className="content-surface">
          <Hero
            title={hero.title}
            subtitle={hero.subtitle}
            description={hero.description}
            primaryButton={hero.primaryButton}
            secondaryButton={hero.secondaryButton}
            config={config}
          />

          {/* About */}
          <section id="about" className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Über mich
                  </h2>
                  <p className="text-lg leading-relaxed" style={{color: 'var(--muted)'}}>
                    {hero.content}
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

          <SkillsShowcaseMultiDesign skills={content.skills} config={config} />

          {/* Projects */}
          <section id="projects" className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">{projects.title}</h2>
                  <p style={{ color: 'var(--muted)' }}>{projects.subtitle}</p>
                </div>
                <a href="#contact" className="hidden md:inline-block text-sm gradient-text">Projekt anfragen →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.projects.map((project: Project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            </div>
          </section>

          <ArticlesSection />

          {/* Contact */}
          <section id="contact" className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{contact.title}</h2>
                <p className="mb-8 max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>{contact.description}</p>
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
        </main>

        <footer className="py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} Khaled Alabsi. Built with Next.js.
        </footer>
      </div>
    );
  } catch (error) {
    console.error('Error loading content:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Content</h1>
          <p style={{ color: 'var(--muted)' }}>Please make sure all content files are properly formatted.</p>
        </div>
      </div>
    );
  }
}
