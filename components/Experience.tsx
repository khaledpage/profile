import React from 'react';

interface ExperienceProps {
  content: any;
  config: any;
}

const Experience = ({ content, config }: ExperienceProps) => {
  return (
    <section id="experience" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {content.projects?.map((project: any, index: number) => (
            <div key={index} className="glass p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full">
              {/* Only show image container if project has an image */}
              {project.image && (
                <div className="relative overflow-hidden rounded-lg bg-gray-800/50 h-48 mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
              )}
              
              {/* If no image, show featured badge at top of card */}
              {!project.image && project.featured && (
                <div className="flex justify-end mb-4">
                  <div className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                    Featured
                  </div>
                </div>
              )}
              
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{project.title}</h3>
                <p className="text-theme-secondary leading-relaxed mb-4 flex-1">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tech: string, techIndex: number) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-sm rounded-full border transition-colors duration-200 hover:scale-105"
                      style={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Only show buttons container if there are demo or github links */}
                {(project.demo || project.github) && (
                  <div className="flex space-x-3 mt-auto">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary text-center text-sm py-2 rounded-lg"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 glass text-center text-sm py-2 rounded-lg border border-white/20 hover:border-primary/30 transition-colors"
                        style={{ color: 'var(--text)' }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )) || (
            <div className="col-span-full text-center text-theme-muted">
              No projects found
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Experience;
