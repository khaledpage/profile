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
      <div className="min-h-screen">
        <Header />
        
        <Hero
          title={hero.title}
          subtitle={hero.subtitle}
          description={hero.description}
          primaryButton={hero.primaryButton}
          secondaryButton={hero.secondaryButton}
        />
        
        {/* Additional Hero Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                {hero.content}
              </p>
            </div>
          </div>
        </section>
        
        <section id="projects" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {projects.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.projects.map((project: Project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {contact.title}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {contact.description}
            </p>
            
            <div className="max-w-lg mx-auto">
              <form className="space-y-6">
                {contact.formFields.map((field: FormField) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        rows={4}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.id}
                        placeholder={field.placeholder}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300"
                >
                  {contact.submitButton.text}
                </button>
              </form>
            </div>
          </div>
        </section>
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
