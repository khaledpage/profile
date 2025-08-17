import React from 'react';
import config from '@/lib/config';

const Experience = () => {
  return (
    <section id="experience" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{config.experience.title}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {config.experience.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.experience.projects.map((project, index) => (
            <div key={project.title} className="group">
              <div className="glass card-hover p-8 h-full rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border border-primary/30 mb-6">
                    <span className="text-primary font-bold text-lg">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-start space-x-3 mb-6">
                    <span className="text-green-400 mt-1 flex-shrink-0">📈</span>
                    <p className="text-green-400 text-sm font-medium">
                      {project.impact}
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg transition-colors duration-300">
                      <span>🔗</span>
                      <span className="text-sm font-medium">View Project</span>
                    </button>
                    
                    <button className="p-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-600/50 rounded-lg transition-colors duration-300">
                      <span>💻</span>
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '50+', label: 'Projects Completed', icon: '🚀' },
            { number: '8+', label: 'Years Experience', icon: '⭐' },
            { number: '100%', label: 'Client Satisfaction', icon: '❤️' },
            { number: '24/7', label: 'Support Available', icon: '🛠️' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center glass p-6 rounded-xl hover:bg-primary/5 transition-colors duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl lg:text-3xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Experience;