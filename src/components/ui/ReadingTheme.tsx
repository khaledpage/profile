'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ReadingThemeProps {
  children: React.ReactNode;
}

export default function ReadingTheme({ children }: ReadingThemeProps) {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    // Apply reading theme on mount
    document.documentElement.classList.add('reading-theme');
    setIsReadingMode(true);

    return () => {
      // Remove reading theme on unmount
      document.documentElement.classList.remove('reading-theme');
    };
  }, []);

  const handleDownloadPDF = async () => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
      alert('PDF generation is unavailable on static export. Clone the repo and run locally to generate PDFs.');
      return;
    }
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/articles/${slug}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: show prompt if clipboard API fails
      const url = window.location.href;
      window.prompt('Copy this link', url);
    }
  };

  return (
    <div className={`reading-container ${isReadingMode ? 'reading-active' : ''}`}>
      {/* Reading Mode Controls */}
      <div className="reading-controls fixed top-24 right-6 z-50 flex flex-col gap-3">
        {/* Reading Mode Toggle */}
        <button
          onClick={() => {
            setIsReadingMode(!isReadingMode);
            if (isReadingMode) {
              document.documentElement.classList.remove('reading-theme');
            } else {
              document.documentElement.classList.add('reading-theme');
            }
          }}
          className="p-3 rounded-lg transition-all duration-300 glass-subtle"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)',
            border: '1px solid color-mix(in srgb, var(--foreground), transparent 85%)',
          }}
          title={isReadingMode ? 'Exit Reading Mode' : 'Enter Reading Mode'}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ color: 'var(--foreground)' }}
          >
            {isReadingMode ? (
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            )}
          </svg>
        </button>

        {/* PDF Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="p-3 rounded-lg transition-all duration-300 glass-subtle"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)',
            border: '1px solid color-mix(in srgb, var(--foreground), transparent 85%)',
          }}
          title="Download as PDF"
        >
          {isDownloading ? (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ color: 'var(--foreground)' }}
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ color: 'var(--foreground)' }}
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-3 rounded-lg transition-all duration-300 glass-subtle"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)',
            border: '1px solid color-mix(in srgb, var(--foreground), transparent 85%)',
          }}
          title="Copy article link"
        >
          {copied ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--foreground)' }}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--foreground)' }}>
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
            </svg>
          )}
        </button>
      </div>

      {children}
    </div>
  );
}
