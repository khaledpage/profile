import React from 'react';

interface AboutProps {
  content: any;
  config: any;
}

const About = ({ content, config }: AboutProps) => {
  return (
    <section id="about-section" className="py-20 lg:py-32 relative overflow-hidden">
      <div id="about-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div id="about-header" className="text-center mb-16">
          <h2 id="about-title" className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p id="about-subtitle" className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div id="about-content-grid" className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Profile Image and Stats */}
          <div id="profile-section" className="lg:col-span-1">
            <div className="relative">
              <div className="relative z-10">
                <div id="profile-image-container" className="relative overflow-hidden rounded-3xl">
                  <div className="aspect-[3/4] relative">
                    <img
                      id="profile-image"
                      src={config.personal.image}
                      alt={config.personal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  <div id="profile-stats" className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl backdrop-blur-xl">
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div id="profile-decorations" className="absolute inset-0 -z-10">
                <div className="absolute top-8 left-8 w-full h-full border-2 border-primary/20 rounded-3xl" />
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
              </div>
            </div>
          </div>

          {/* Content and Skills */}
          <div id="about-main-content" className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div id="about-description-card" className="glass p-8 rounded-3xl">
              <p id="about-description-text" className="text-lg text-theme-secondary leading-relaxed mb-6">
                {content.description}
              </p>
              
              {/* Highlights Grid */}
              <div id="highlights-grid" className="grid md:grid-cols-2 gap-4">
                {content.highlights.map((highlight: string, index: number) => (
                  <div 
                    key={index} 
                    id={`highlight-item-${index}`}
                    className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors touch-manipulation"
                    style={{ touchAction: 'pan-y' }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-theme-secondary">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div id="skills-section">
              <h3 id="skills-title" className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Technical Skills
              </h3>
              
              {/* Skills Grid */}
              <div id="skills-grid" className="grid md:grid-cols-2 gap-6">
                {content.skills.map((skill: any, index: number) => (
                  <div 
                    key={skill.name} 
                    id={`skill-card-${index}`}
                    className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300 touch-manipulation md:hover:scale-[1.02]"
                    style={{ 
                      touchAction: 'pan-y',
                      willChange: 'auto'
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                        <div className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      </div>
                      <h4 id={`skill-name-${index}`} className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                        {skill.name}
                      </h4>
                    </div>
                    
                    {/* Technologies */}
                    <div id={`skill-technologies-${index}`} className="flex flex-wrap gap-2">
                      {skill.technologies.map((tech: string, techIndex: number) => (
                        <span
                          key={tech}
                          id={`tech-tag-${index}-${techIndex}`}
                          className="px-3 py-1 text-sm rounded-full border transition-colors duration-200 md:hover:scale-105 md:hover:shadow-lg touch-manipulation"
                          style={{ 
                            backgroundColor: 'var(--surface)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-secondary)',
                            touchAction: 'manipulation'
                          }}
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

      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-secondary/3 to-transparent rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default About;