import React from 'react';

interface AboutProps {
  content: any;
  config: any;
}

const About = ({ content, config }: AboutProps) => {
  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative z-10">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="aspect-[4/5] relative">
                  <img
                    src={config.personal.image}
                    alt={config.personal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                
                <div className="absolute -top-4 -right-4 glass p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-theme-warning">⭐</span>
                    <span className="text-sm font-semibold">{content.experience}+ Years</span>
                  </div>
                  <p className="text-xs text-theme-secondary">{content.experienceLabel}</p>
                </div>

                <div className="absolute -bottom-4 -left-4 glass p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-theme-success">✓</span>
                    <span className="text-sm font-semibold">{content.projects}+</span>
                  </div>
                  <p className="text-xs text-theme-secondary">{content.projectsLabel}</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 -z-10">
              <div className="absolute top-8 left-8 w-full h-full border-2 border-primary/30 rounded-2xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-xl" />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                <span className="gradient-text">{content.title}</span>
              </h2>
              <p className="text-xl text-theme-secondary mb-6">
                {content.subtitle}
              </p>
              <p className="text-theme-secondary leading-relaxed text-lg">
                {content.description}
              </p>
            </div>

            <div className="space-y-4">
              {content.highlights.map((highlight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-primary mt-1 flex-shrink-0">✓</span>
                  <p className="text-theme-secondary">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">{content.skillsTitle}</h3>
              <div className="space-y-4">
                {content.skills.map((skill: any, index: number) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{skill.name}</span>
                      <span className="text-primary font-bold">{skill.level}%</span>
                    </div>
                    
                    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skill.technologies.map((tech: string, techIndex: number) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default About;