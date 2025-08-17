import React from 'react';

interface ExperienceProps {
  content: any;
  config: any;
}

const Experience = ({ content, config }: ExperienceProps) => {
  return (
    <section id="experience" className="py-20 lg:py-32 relative overflow-hidden">
      <div id="experience-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="experience-header" className="text-center mb-16">
          <h2 id="experience-title" className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p id="experience-subtitle" className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div id="projects-grid" className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {content.projects?.map((project: any, index: number) => (
            <div 
              key={index} 
              id={`project-card-${index}`}
              className="glass p-6 rounded-2xl border border-white/10 md:hover:border-primary/30 transition-all duration-300 group flex flex-col h-full touch-manipulation md:hover:scale-[1.02]"
              style={{ 
                touchAction: 'pan-y',
                willChange: 'auto'
              }}
            >
              {/* Only show image container if project has an image */}
              {project.image && (
                <div id={`project-image-container-${index}`} className="relative overflow-hidden rounded-lg bg-gray-800/50 h-48 mb-4">
                  <img
                    id={`project-image-${index}`}
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                  />
                  <div id={`project-image-overlay-${index}`} className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {project.featured && (
                    <div id={`project-featured-badge-image-${index}`} className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
              )}
              
              {/* If no image, show featured badge at top of card */}
              {!project.image && project.featured && (
                <div id={`project-featured-container-${index}`} className="flex justify-end mb-4">
                  <div id={`project-featured-badge-${index}`} className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                    Featured
                  </div>
                </div>
              )}
              
              <div id={`project-content-${index}`} className="flex-1 flex flex-col">
                <h3 id={`project-title-${index}`} className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{project.title}</h3>
                <p id={`project-description-${index}`} className="text-theme-secondary leading-relaxed mb-4 flex-1">{project.description}</p>
                
                <div id={`project-technologies-${index}`} className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.map((tech: string, techIndex: number) => (
                    <span
                      key={techIndex}
                      id={`project-tech-${index}-${techIndex}`}
                      className="px-3 py-1 text-sm rounded-full border transition-colors duration-200 md:hover:scale-105 touch-manipulation"
                      style={{ 
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                        touchAction: 'manipulation'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Only show buttons container if there are demo or github links */}
                {(project.demo || project.github) && (
                  <div id={`project-links-${index}`} className="flex space-x-3 mt-auto">
                    {project.demo && (
                      <a
                        id={`project-demo-link-${index}`}
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-primary text-center text-sm py-2 rounded-lg touch-manipulation"
                        style={{ touchAction: 'manipulation' }}
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        id={`project-github-link-${index}`}
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 glass text-center text-sm py-2 rounded-lg border border-white/20 md:hover:border-primary/30 transition-colors touch-manipulation"
                        style={{ 
                          color: 'var(--text)',
                          touchAction: 'manipulation'
                        }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )) || (
            <div id="no-projects-message" className="col-span-full text-center text-theme-muted">
              No projects found
            </div>
          )}
        </div>
      </div>

      <div id="experience-background-decorations" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div id="experience-bg-decoration-1" className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div id="experience-bg-decoration-2" className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Experience;
