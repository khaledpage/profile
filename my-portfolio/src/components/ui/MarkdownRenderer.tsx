'use client';

import { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function processMarkdown() {
      try {
        const result = await remark()
          .use(remarkMath)
          .use(remarkHtml, { sanitize: false })
          .use(rehypeKatex)
          .process(content);

        setHtmlContent(result.toString());
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHtmlContent('<p>Error rendering content</p>');
      } finally {
        setIsLoading(false);
      }
    }

    processMarkdown();
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent-1)' }}></div>
      </div>
    );
  }

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      style={{
        '--tw-prose-body': 'var(--foreground)',
        '--tw-prose-headings': 'var(--foreground)',
        '--tw-prose-lead': 'var(--muted)',
        '--tw-prose-links': 'var(--accent-1)',
        '--tw-prose-bold': 'var(--foreground)',
        '--tw-prose-counters': 'var(--muted)',
        '--tw-prose-bullets': 'var(--muted)',
        '--tw-prose-hr': 'color-mix(in srgb, var(--foreground), transparent 80%)',
        '--tw-prose-quotes': 'var(--foreground)',
        '--tw-prose-quote-borders': 'var(--accent-1)',
        '--tw-prose-captions': 'var(--muted)',
        '--tw-prose-code': 'var(--accent-2)',
        '--tw-prose-pre-code': 'var(--foreground)',
        '--tw-prose-pre-bg': 'color-mix(in srgb, var(--card), transparent 30%)',
        '--tw-prose-th-borders': 'color-mix(in srgb, var(--foreground), transparent 70%)',
        '--tw-prose-td-borders': 'color-mix(in srgb, var(--foreground), transparent 85%)',
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
