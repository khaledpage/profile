import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import ProjectCard from '@/components/ui/ProjectCard';
import { getAllContent } from '@/utils/content';
import { Project, FormField } from '@/types/content';

export const revalidate = 0; // Deaktiviert das Caching für Entwicklungszwecke

export default async function Home() {
  try {
    const content = await getAllContent();
    const { hero, projects, contact } = content;

    return (
      <div className="min-h-dvh text-foreground">
        <Header />
        <main>
          <Hero
            title={hero.title}
            subtitle={hero.subtitle}
            description={hero.description}
            primaryButton={hero.primaryButton}
            secondaryButton={hero.secondaryButton}
          />

          {/* About */}
          <section id="about" className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Über mich
                  </h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    {hero.content}
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <div className="glass rounded-2xl p-6 lift">
                    <dl className="grid grid-cols-2 gap-6">
                      <div>
                        <dt className="text-sm text-gray-400">Erfahrung</dt>
                        <dd className="text-2xl font-semibold">5+ Jahre</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-400">Tech Focus</dt>
                        <dd className="text-2xl font-semibold">Next.js, TS</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-400">Projekte</dt>
                        <dd className="text-2xl font-semibold">40+</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-400">Standort</dt>
                        <dd className="text-2xl font-semibold">Remote</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Skills & Tooling
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  'Next.js',
                  'React',
                  'TypeScript',
                  'Node.js',
                  'Tailwind',
                  'Framer Motion',
                  'Prisma',
                  'PostgreSQL',
                  'Docker',
                  'AWS',
                  'Vercel',
                  'CI/CD',
                ].map((skill) => (
                  <div key={skill} className="glass rounded-xl p-4 text-center lift">
                    <span className="text-sm text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">{projects.title}</h2>
                  <p className="text-gray-400">{projects.subtitle}</p>
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

          {/* Contact */}
          <section id="contact" className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
                  {contact.title}
                </h2>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                  {contact.description}
                </p>
                <form className="glass rounded-2xl p-6 md:p-8 space-y-6">
                  {contact.formFields.map((field: FormField) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm text-gray-300 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.id}
                          rows={5}
                          placeholder={field.placeholder}
                          className="w-full rounded-lg bg-card border border-white/10 p-3 outline-none focus:ring-2 focus:ring-purple-500"
                          required={field.required}
                        />
                      ) : (
                        <input
                          type={field.type}
                          id={field.id}
                          placeholder={field.placeholder}
                          className="w-full rounded-lg bg-card border border-white/10 p-3 outline-none focus:ring-2 focus:ring-purple-500"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all interactive-border"
                  >
                    {contact.submitButton.text}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-10 text-center text-sm text-gray-500">
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
          <p className="text-gray-600">Please make sure all content files are properly formatted.</p>
        </div>
      </div>
    );
  }
}
