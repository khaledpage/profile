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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="space-y-8">
          {content.timeline.map((item: any, index: number) => (
            <div key={index} className="relative">
              <div className="glass p-8 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="text-primary font-bold text-lg">{item.period}</div>
                    <div className="text-gray-400">{item.location}</div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <h3 className="text-xl font-bold text-white mb-2">{item.position}</h3>
                    <div className="text-lg text-gray-300 mb-4">{item.company}</div>
                    <p className="text-gray-300 leading-relaxed mb-4">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
