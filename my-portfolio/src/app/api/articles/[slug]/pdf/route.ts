import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/utils/articles';
import puppeteer from 'puppeteer';
import katex from 'katex';

// Enhanced markdown to HTML conversion with LaTeX support
function resolveAssetUrl(src: string, slug: string): string {
  try {
    if (!src) return src;
    // Absolute http(s) URLs stay as-is
    if (/^https?:\/\//i.test(src)) return src;
    // Already targeting API
    if (src.startsWith('/api/')) return src;
    // Strip leading ./ or /
    const cleaned = src.replace(/^\.\/?/, '').replace(/^\//, '');
    // If points into assets/, map to API route using filename
    if (cleaned.startsWith('assets/')) {
      const filename = cleaned.split('/').pop() as string;
      return `/api/articles/${slug}/assets/${filename}`;
    }
    // Default: try last segment as filename in assets
    const filename = cleaned.split('/').pop() as string;
    return `/api/articles/${slug}/assets/${filename}`;
  } catch {
    return src;
  }
}

// Enhanced markdown to HTML conversion with LaTeX support and image handling
function markdownToHtml(markdown: string, slug: string): string {
  let html = markdown;
  
  // Process LaTeX expressions first (before other markdown)
  const katexOptions = {
    throwOnError: false,
    strict: false as const,
    trust: true,
    macros: {
      "\\vec": "\\mathbf{#1}",
      "\\mat": "\\mathbf{#1}",
      "\\tr": "\\operatorname{tr}",
      "\\det": "\\operatorname{det}",
      "\\rank": "\\operatorname{rank}",
      "\\norm": "\\left\\|#1\\right\\|",
      "\\abs": "\\left|#1\\right|",
      "\\bm": "\\boldsymbol{#1}",
      "\\E": "\\mathbb{E}",
      "\\Var": "\\operatorname{Var}",
      "\\Cov": "\\operatorname{Cov}",
      "\\argmax": "\\mathop{\\mathrm{arg\,max}}",
      "\\argmin": "\\mathop{\\mathrm{arg\,min}}"
    }
  };

  // Display math ($$...$$)
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, latex) => {
    try {
      const rendered = katex.renderToString(latex.trim(), { ...katexOptions, displayMode: true });
      return `<div class="katex-display">${rendered}</div>`;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return `<div class="katex-error">$$${latex}$$</div>`;
    }
  });
  // Display math using \[ ... \]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (match, latex) => {
    try {
      const rendered = katex.renderToString(latex.trim(), { ...katexOptions, displayMode: true });
      return `<div class="katex-display">${rendered}</div>`;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return `<div class="katex-error">\\[${latex}\\]</div>`;
    }
  });
  
  // Inline math ($...$)
  html = html.replace(/\$([^$\n]+)\$/g, (match, latex) => {
    try {
      const rendered = katex.renderToString(latex.trim(), { ...katexOptions, displayMode: false });
      return `<span class="katex-inline">${rendered}</span>`;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return `<span class="katex-error">$${latex}$</span>`;
    }
  });
  // Inline math using \( ... \)
  html = html.replace(/\\\(([^)]+)\\\)/g, (match, latex) => {
    try {
      const rendered = katex.renderToString(latex.trim(), { ...katexOptions, displayMode: false });
      return `<span class="katex-inline">${rendered}</span>`;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return `<span class="katex-error">\\(${latex}\\)</span>`;
    }
  });
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Code blocks (must be processed before inline code)
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, language, code) => {
    const lang = language ? ` class="language-${language}"` : '';
    return `<pre><code${lang}>${code.trim()}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`\n]+)`/gim, '<code>$1</code>');
  
  // Images: ![alt](src) — handle before links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (match, alt, src) => {
    const resolved = resolveAssetUrl(src, slug);
    const safeAlt = String(alt || '').replace(/"/g, '&quot;');
    return `<img src="${resolved}" alt="${safeAlt}" />`;
  });

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
  
  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Wrap consecutive list items in ul/ol
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/gim, '');
  
  // Paragraphs
  html = html.replace(/\n\n/gim, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up
  html = html.replace(/<p><\/p>/gim, '');
  html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<pre>)/gim, '$1');
  html = html.replace(/(<\/pre>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<blockquote>)/gim, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<ul>)/gim, '$1');
  html = html.replace(/(<\/ul>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<div class="katex-display">)/gim, '$1');
  html = html.replace(/(<\/div>)<\/p>/gim, '$1');
  
  return html;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Generate PDF content
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

  const page = await browser.newPage();
    
    // Set page format for better PDF output
    await page.setViewport({ width: 1200, height: 800 });

    // Create HTML content for PDF
  const origin = request.nextUrl.origin;
  const coverSrc = article.metadata.coverImage ? resolveAssetUrl(String(article.metadata.coverImage), slug) : '';
  const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${article.metadata.title}</title>
      <base href="${origin}">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" crossorigin="anonymous">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background: #ffffff;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            
            .header {
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 30px;
              margin-bottom: 40px;
            }
            
            .category {
              display: inline-block;
              background: #eff6ff;
              color: #2563eb;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 20px;
            }
            
            .title {
              font-size: 36px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 16px;
              line-height: 1.2;
            }
            
            .summary {
              font-size: 18px;
              color: #6b7280;
              margin-bottom: 24px;
              line-height: 1.6;
            }
            
            .meta {
              display: flex;
              gap: 16px;
              align-items: center;
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 20px;
            }
            
            .meta .dot {
              width: 4px;
              height: 4px;
              background: #d1d5db;
              border-radius: 50%;
            }
            
            .tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            
            .tag {
              background: #f3f4f6;
              color: #6b7280;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
            }
            
            .content {
              font-size: 16px;
              line-height: 1.8;
              color: #374151;
            }
            
            .content h1,
            .content h2,
            .content h3,
            .content h4,
            .content h5,
            .content h6 {
              color: #111827;
              font-weight: 600;
              margin-top: 32px;
              margin-bottom: 16px;
            }
            
            .content h1 { font-size: 28px; }
            .content h2 { font-size: 24px; }
            .content h3 { font-size: 20px; }
            .content h4 { font-size: 18px; }
            
            .content p {
              margin-bottom: 16px;
              text-align: justify;
            }
            
            .content a {
              color: #2563eb;
              text-decoration: none;
              border-bottom: 1px solid #93c5fd;
            }
            
            .content code {
              background: #f3f4f6;
              color: #1f2937;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 14px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
            
            .content pre {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
              overflow-x: auto;
              font-size: 14px;
              line-height: 1.6;
            }
            
            .content pre code {
              background: none;
              padding: 0;
              color: #374151;
            }
            
            .content blockquote {
              border-left: 4px solid #2563eb;
              background: #eff6ff;
              padding: 16px 20px;
              margin: 24px 0;
              border-radius: 0 8px 8px 0;
              font-style: italic;
              color: #1f2937;
            }
            
            .content ul,
            .content ol {
              margin: 16px 0;
              padding-left: 24px;
            }
            
            .content li {
              margin-bottom: 8px;
            }
            
            .content img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 24px 0;
              display: block;
            }
            
            .footer {
              margin-top: 60px;
              padding-top: 30px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }

            .cover {
              width: 100%;
              height: auto;
              margin: 20px 0 0 0;
              border-radius: 10px;
            }
            
            /* KaTeX Math Rendering for PDF */
            .katex {
              color: #1f2937 !important;
              font-size: 1em !important;
            }
            
            .katex-display {
              margin: 1.5rem 0 !important;
              text-align: center;
              background: #f9fafb;
              padding: 1rem;
              border-radius: 8px;
              border-left: 3px solid #2563eb;
            }
            
            .katex-inline {
              color: #1f2937 !important;
            }
            
            .katex-error {
              color: #dc2626;
              background: #fef2f2;
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.9em;
            }
            
            /* Enhanced math display */
            .katex .mord {
              color: #1f2937 !important;
            }
            
            .katex .mop {
              color: #1f2937 !important;
            }
            
            .katex .mbin {
              color: #1f2937 !important;
            }
            
            .katex .mrel {
              color: #1f2937 !important;
            }
            
            .katex .mpunct {
              color: #1f2937 !important;
            }
            
            /* Page break handling */
            @media print {
              body { margin: 0; }
              .header { page-break-after: avoid; }
              .content h1,
              .content h2,
              .content h3 {
                page-break-after: avoid;
              }
              .content pre,
              .content blockquote,
              .katex-display {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="category">${article.metadata.category}</div>
            <h1 class="title">${article.metadata.title}</h1>
            <p class="summary">${article.metadata.summary}</p>
            <div class="meta">
              <span>By ${article.metadata.author}</span>
              <div class="dot"></div>
              <span>${new Date(article.metadata.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <div class="dot"></div>
              <span>${article.metadata.readingTime} min read</span>
            </div>
            <div class="tags">
              ${article.metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
          ${coverSrc ? `<img class="cover" src="${coverSrc}" alt="Cover image" />` : ''}
          
          <div class="content">
            ${markdownToHtml(article.content, slug)}
          </div>
          
          <div class="footer">
            <p>Generated from ${article.metadata.title} - ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1in',
        right: '0.75in',
        bottom: '1in',
        left: '0.75in',
      },
    });

    await browser.close();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
