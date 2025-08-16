'use client';

import { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  articleSlug?: string; // For resolving relative image paths
}

export default function MarkdownRenderer({ content, className = '', articleSlug }: MarkdownRendererProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function processMarkdown() {
      try {
        // Process relative image paths if articleSlug is provided
        let processedContent = content;
        if (articleSlug) {
          // Replace relative image paths with API paths
          processedContent = content.replace(
            /!\[([^\]]*)\]\(\.\/assets\/([^)]+)\)/g,
            `![$1](/api/articles/${articleSlug}/assets/$2)`
          ).replace(
            /!\[([^\]]*)\]\(assets\/([^)]+)\)/g,
            `![$1](/api/articles/${articleSlug}/assets/$2)`
          );
        }

        // Support TeX delimiters \( ... \) and \[ ... ] by mapping to $ ... $ and $$ ... $$
        // Do this before remark-math so it can parse them properly.
        processedContent = processedContent
          // Display math: \[ ... ] -> $$ ... $$ (preserve multi-line)
          .replace(/\\\[([\s\S]*?)\\\]/g, (_m, latex) => `\n\n$$\n${String(latex).trim()}\n$$\n\n`)
          // Inline math: \( ... \) -> $ ... $
          .replace(/\\\(([\s\S]*?)\\\)/g, (_m, latex) => `$${String(latex).trim()}$`);

        // First process with remark (markdown to HTML with math)
        const remarkResult = await remark()
          .use(remarkGfm) // GitHub-Flavored Markdown (tables, task lists, etc.)
          .use(remarkMath)
          .use(remarkHtml, { sanitize: false })
          .process(processedContent);

        // Then process with rehype to handle KaTeX
        const { rehype } = await import('rehype');
        const rehypeResult = await rehype()
          .use(rehypeKatex, {
            // KaTeX options for better compatibility
            throwOnError: false,
            errorColor: '#cc0000',
            strict: false,
            trust: true,
            fleqn: false,
            macros: {
              // Common sets
              '\\RR': '\\mathbb{R}',
              '\\NN': '\\mathbb{N}',
              '\\ZZ': '\\mathbb{Z}',
              // Align with PDF macros
              '\\vec': '\\mathbf{#1}',
              '\\mat': '\\mathbf{#1}',
              '\\tr': '\\operatorname{tr}',
              '\\det': '\\operatorname{det}',
              '\\rank': '\\operatorname{rank}',
              '\\norm': '\\left\\|#1\\right\\|',
              '\\abs': '\\left|#1\\right|',
              '\\bm': '\\boldsymbol{#1}',
              '\\E': '\\mathbb{E}',
              '\\Var': '\\operatorname{Var}',
              '\\Cov': '\\operatorname{Cov}',
              '\\argmax': '\\mathop{\\mathrm{arg\\,max}}',
              '\\argmin': '\\mathop{\\mathrm{arg\\,min}}',
            }
          })
          .process(remarkResult.toString());

        setHtmlContent(rehypeResult.toString());
      } catch (error) {
        console.error('Error processing markdown:', error);
        setHtmlContent('<p>Error rendering content</p>');
      } finally {
        setIsLoading(false);
      }
    }

    processMarkdown();
  }, [content, articleSlug]);

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
