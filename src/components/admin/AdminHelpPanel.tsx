'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
  onClose: () => void;
};

export default function AdminHelpPanel({ config, onClose }: Props) {
  const { translations } = useLanguage(config);
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Check if this is the first session or if user already dismissed for session
  useEffect(() => {
    const sessionDismissed = sessionStorage.getItem('adminHelpDismissedThisSession');
    if (sessionDismissed) {
      // Close immediately if already dismissed in this session
      onClose();
    }
  }, [onClose]);

  const steps = [
    {
      title: "Welcome to Article Editing",
      content: "This guide will show you how to edit articles in real-time using the web interface.",
      icon: "✏️"
    },
    {
      title: "Navigate to Articles",
      content: "Go to the Articles page (/articles) to see all your articles with admin controls.",
      icon: "📄"
    },
    {
      title: "Find Edit Buttons",
      content: "Each article card has an 'Edit' button when admin mode is enabled. Look for the edit button in the top-right corner of each article card.",
      icon: "🔘"
    },
    {
      title: "Open Article Editor",
      content: "Click the 'Edit' button to open a comprehensive editing modal with metadata and content editing capabilities.",
      icon: "🖥️"
    },
    {
      title: "Edit Metadata",
      content: "On the left panel, you can edit title, summary, tags, category, featured status, and cover image.",
      icon: "📝"
    },
    {
      title: "Edit Content",
      content: "Use the main editor to write markdown content. Toggle 'Show Preview' to see how it will look.",
      icon: "📖"
    },
    {
      title: "Auto-Save & Manual Save",
      content: "Changes auto-save every 30 seconds. You can also click 'Save' manually. Watch for the 'Unsaved changes' indicator.",
      icon: "💾"
    },
    {
      title: "Additional Features",
      content: "You can also upload articles via ZIP, bulk delete, and download articles as ZIP files from the admin controls.",
      icon: "🔧"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      // Permanently don't show again
      localStorage.setItem('hasSeenEditingGuide', 'true');
    } else {
      // Just don't show again this session
      sessionStorage.setItem('adminHelpDismissedThisSession', 'true');
    }
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <div 
      id="admin-help-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        id="admin-help-panel"
        className="glass rounded-2xl shadow-xl w-full max-w-2xl p-8"
        style={{ 
          backgroundColor: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--muted)'
        }}
      >
        {/* Header */}
        <div id="help-header" className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentStepData.icon}</span>
            <div>
              <h2 id="help-title" className="text-2xl font-bold">
                Article Editing Guide
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              id="help-skip-button"
              onClick={handleClose}
              className="px-3 py-1 text-sm rounded-lg hover:bg-opacity-80"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--muted), transparent 80%)',
                color: 'var(--foreground)'
              }}
            >
              Skip Tutorial
            </button>
            <button
              id="help-close-button"
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-opacity-80"
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--muted), transparent 70%)',
                color: 'var(--foreground)'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div id="help-progress" className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--accent-1)',
                width: `${((currentStep + 1) / steps.length) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div id="help-content" className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <span className="text-2xl">{currentStepData.icon}</span>
            {currentStepData.title}
          </h3>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            {currentStepData.content}
          </p>
          
          {/* Special instructions for specific steps */}
          {currentStep === 1 && (
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 90%)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--accent-1)' }}>
                💡 Tip: You can access the articles page by clicking &quot;Articles&quot; in the navigation menu or visiting /articles directly.
              </p>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 90%)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--accent-1)' }}>
                💡 Note: Admin mode is enabled by default in this setup, so edit buttons should be visible immediately.
              </p>
            </div>
          )}
        </div>

        {/* Don't Show Again Option */}
        <div id="help-dont-show-again" className="mb-4 border-t pt-4" style={{ borderColor: 'var(--muted)' }}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border accent-1"
              style={{ 
                accentColor: 'var(--accent-1)',
                borderColor: 'var(--muted)'
              }}
            />
            <span className="text-sm" style={{ color: 'var(--foreground)' }}>
              Don&apos;t show this guide again
            </span>
          </label>
          <p className="text-xs mt-1 ml-7" style={{ color: 'var(--muted)' }}>
            {dontShowAgain 
              ? 'This guide will be permanently hidden for all sessions' 
              : 'This guide will be hidden for this session only'
            }
          </p>
        </div>

        {/* Navigation */}
        <div id="help-navigation" className="flex items-center justify-between">
          <button
            id="help-prev-button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'var(--muted)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className="w-3 h-3 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentStep ? 'var(--accent-1)' : 'var(--muted)'
                }}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              id="help-next-button"
              onClick={nextStep}
              className="px-6 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--accent-1)',
                color: 'var(--card-contrast)'
              }}
            >
              Next →
            </button>
          ) : (
            <button
              id="help-finish-button"
              onClick={handleClose}
              className="px-6 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--accent-1)',
                color: 'var(--card-contrast)'
              }}
            >
              Get Started!
            </button>
          )}
        </div>

        {/* Quick Actions */}
        {currentStep === steps.length - 1 && (
          <div id="help-quick-actions" className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}>
            <h4 className="font-semibold mb-3">Quick Actions:</h4>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/articles"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: 'var(--accent-2)',
                  color: 'var(--card-contrast)'
                }}
              >
                Go to Articles
              </Link>
              <a
                href="/admin"
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
                style={{
                  borderColor: 'var(--accent-1)',
                  color: 'var(--accent-1)'
                }}
              >
                Admin Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
