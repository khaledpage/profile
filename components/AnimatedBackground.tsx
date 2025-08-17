import React from 'react';
import config from '@/lib/config';

const AnimatedBackground = () => {
  if (!config.ui.animations.enabled || !config.ui.animations.backgroundParticles) {
    return null;
  }

  return (
    <>
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Primary Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`primary-${i}`}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Secondary Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`secondary-${i}`}
            className="absolute w-1 h-1 bg-secondary/30 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Accent Particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`accent-${i}`}
            className="absolute w-3 h-3 bg-accent/10 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-drift-1"
          style={{ top: '10%', left: '10%' }}
        />
        <div 
          className="absolute w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-drift-2"
          style={{ top: '60%', right: '10%' }}
        />
        <div 
          className="absolute w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-drift-3"
          style={{ bottom: '10%', left: '30%' }}
        />
      </div>

      {/* Network Lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="w-full h-full opacity-5">
          {[...Array(8)].map((_, i) => (
            <g key={`line-${i}`}>
              <line
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="currentColor"
                strokeWidth="1"
                className="animate-pulse"
                style={{
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Matrix Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={`matrix-${i}`}
            className="absolute text-xs font-mono text-primary animate-matrix-fall"
            style={{
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '8s',
            }}
          >
            {Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
          </div>
        ))}
      </div>

      {/* Geometric Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute border border-primary/10 animate-rotate-slow"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;
