import React from 'react';
import config from '@/lib/config';

const iconMap = {
  'Zap': '⚡',
  'Shield': '🛡️',
  'Rocket': '🚀',
  'Heart': '❤️',
};

const Motivation = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{config.motivation.title}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {config.motivation.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {config.motivation.points.map((point) => {
            const iconEmoji = iconMap[point.icon as keyof typeof iconMap] || '⭐';
            
            return (
              <div key={point.title} className="group">
                <div className="glass p-8 rounded-2xl border border-white/10 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 mb-6 group-hover:bg-primary/30 group-hover:border-primary/50 transition-colors duration-300">
                      <span className="text-2xl">{iconEmoji}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                      {point.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {point.description}
                    </p>

                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="glass p-8 lg:p-12 rounded-2xl border border-white/10 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-secondary to-accent" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-4xl font-bold mb-6">
                <span className="gradient-text">Ready to Build Something Amazing?</span>
              </h3>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's transform your ideas into reality with cutting-edge technology and exceptional design.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary text-lg px-8 py-4">
                  Start Your Project
                </button>
                
                <button className="glass px-8 py-4 text-lg font-semibold text-white border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 rounded-full transition-all duration-300">
                  Let's Connect
                </button>
              </div>
            </div>

            <div className="absolute top-4 right-4 w-4 h-4 bg-primary rounded-full animate-pulse" />
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Motivation;