'use client';

import { useState } from 'react';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
};

export default function WorkflowSection({ config }: Props) {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const { translations } = useLanguage(config);

  // Get workflow translations with fallbacks
  const workflowTranslations = translations?.workflow;
  const stepTranslations = workflowTranslations?.steps;

  const workflowSteps = [
    {
      id: 'idea',
      icon: '💡',
      title: stepTranslations?.idea?.title || 'Your Idea',
      description: stepTranslations?.idea?.description || 'Share your vision, challenge, or business concept',
      color: 'var(--accent-1)',
      details: stepTranslations?.idea?.details || [
        'Business problem identification',
        'Market opportunity analysis',
        'User needs assessment',
        'Competitive landscape review'
      ]
    },
    {
      id: 'concept',
      icon: '🎯',
      title: stepTranslations?.concept?.title || 'Concept Design',
      description: stepTranslations?.concept?.description || 'Transform ideas into structured technical concepts',
      color: 'var(--accent-2)',
      details: stepTranslations?.concept?.details || [
        'System architecture planning',
        'Technology stack selection',
        'User experience design',
        'Technical feasibility study'
      ]
    },
    {
      id: 'code',
      icon: '⚡',
      title: stepTranslations?.code?.title || 'Development',
      description: stepTranslations?.code?.description || 'Build robust, scalable solutions with modern technologies',
      color: '#00d4aa',
      details: stepTranslations?.code?.details || [
        'Clean, maintainable code',
        'Performance optimization',
        'Security best practices',
        'Responsive design implementation'
      ]
    },
    {
      id: 'goal',
      icon: '🎖️',
      title: stepTranslations?.goal?.title || 'Achievement',
      description: stepTranslations?.goal?.description || 'Deliver functional products that meet objectives',
      color: '#ff6b6b',
      details: stepTranslations?.goal?.details || [
        'Quality assurance testing',
        'User acceptance validation',
        'Performance benchmarking',
        'Documentation delivery'
      ]
    },
    {
      id: 'business',
      icon: '🚀',
      title: stepTranslations?.business?.title || 'Business Impact',
      description: stepTranslations?.business?.description || 'Launch solutions that drive real business value',
      color: '#4ecdc4',
      details: stepTranslations?.business?.details || [
        'Revenue generation',
        'Process optimization',
        'User engagement growth',
        'Market expansion opportunities'
      ]
    }
  ];

  return (
    <section id="workflow" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--accent-1), transparent 95%), transparent 50%),
                       radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent-2), transparent 95%), transparent 50%),
                       radial-gradient(circle at 40% 80%, color-mix(in srgb, #00d4aa, transparent 95%), transparent 50%)`
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            {workflowTranslations?.title || 'From Vision to Reality'}
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            {workflowTranslations?.subtitle || 'Every successful project follows a proven path. Let me guide your ideas through a strategic journey from initial concept to thriving business solution.'}
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop View - Horizontal Flow */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2" 
                   style={{ backgroundColor: 'color-mix(in srgb, var(--foreground), transparent 70%)' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
              </div>

              {/* Step Cards */}
              <div className="grid grid-cols-5 gap-4 relative z-10">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center">
                    {/* Step Card */}
                    <div
                      className={`glass rounded-2xl p-6 cursor-pointer transform transition-all duration-300 w-full ${
                        activeStep === step.id ? 'scale-105 -translate-y-2' : 'hover:scale-102 hover:-translate-y-1'
                      }`}
                      onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                      style={{
                        background: activeStep === step.id 
                          ? `linear-gradient(135deg, color-mix(in srgb, ${step.color}, transparent 90%), color-mix(in srgb, var(--card), transparent 20%))` 
                          : 'color-mix(in srgb, var(--card), transparent 20%)',
                        border: `1px solid ${activeStep === step.id ? step.color : 'color-mix(in srgb, var(--foreground), transparent 90%)'}`,
                      }}
                    >
                      {/* Step Icon */}
                      <div 
                        className="text-4xl mb-4 mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${step.color}, transparent 80%)`,
                        }}
                      >
                        {step.icon}
                      </div>

                      {/* Step Content */}
                      <h3 
                        className="text-lg font-semibold mb-2 text-center"
                        style={{ color: activeStep === step.id ? step.color : 'var(--foreground)' }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--muted)' }}>
                        {step.description}
                      </p>

                      {/* Step Number */}
                      <div 
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: step.color,
                          color: 'white',
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {activeStep === step.id && (
                      <div 
                        className="glass rounded-xl p-4 mt-4 w-full animate-fadeIn"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--card), transparent 10%)',
                          border: `1px solid ${step.color}`,
                        }}
                      >
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: step.color }}
                              />
                              <span style={{ color: 'var(--muted)' }}>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View - Vertical Flow */}
          <div className="lg:hidden space-y-6">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < workflowSteps.length - 1 && (
                  <div 
                    className="absolute left-8 top-20 w-0.5 h-6 z-0"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--foreground), transparent 70%)' }}
                  />
                )}

                <div
                  className={`glass rounded-2xl p-6 cursor-pointer transform transition-all duration-300 relative z-10 ${
                    activeStep === step.id ? 'scale-102' : 'hover:scale-101'
                  }`}
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                  style={{
                    background: activeStep === step.id 
                      ? `linear-gradient(135deg, color-mix(in srgb, ${step.color}, transparent 90%), color-mix(in srgb, var(--card), transparent 20%))` 
                      : 'color-mix(in srgb, var(--card), transparent 20%)',
                    border: `1px solid ${activeStep === step.id ? step.color : 'color-mix(in srgb, var(--foreground), transparent 90%)'}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Icon & Number */}
                    <div className="flex-shrink-0 relative">
                      <div 
                        className="text-3xl w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${step.color}, transparent 80%)`,
                        }}
                      >
                        {step.icon}
                      </div>
                      <div 
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: step.color,
                          color: 'white',
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-semibold mb-2"
                        style={{ color: activeStep === step.id ? step.color : 'var(--foreground)' }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                        {step.description}
                      </p>

                      {/* Expanded Details */}
                      {activeStep === step.id && (
                        <ul className="mt-4 space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: step.color }}
                              />
                              <span style={{ color: 'var(--muted)' }}>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              {workflowTranslations?.cta?.title || 'Ready to Transform Your Idea?'}
            </h3>
            <p className="text-lg mb-6" style={{ color: 'var(--muted)' }}>
              {workflowTranslations?.cta?.description || 'Let&apos;s discuss how I can help bring your vision to life with proven expertise and strategic thinking.'}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 pulse"
              style={{
                background: 'linear-gradient(to right, var(--accent-1), var(--accent-2))',
                color: 'var(--card-contrast)',
                textDecoration: 'none',
              }}
            >
              <span>{workflowTranslations?.cta?.button || 'Let&apos;s Talk'}</span>
              <span className="text-xl">💬</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </section>
  );
}
