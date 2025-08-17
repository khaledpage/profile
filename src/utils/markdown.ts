/**
 * Renders markdown content synchronously for preview purposes
 * Simple markdown parser without external dependencies
 * @param content The markdown content to render
 * @returns string HTML conversion
 */
export function renderMarkdownSync(content: string): string {
  try {
    if (!content || typeof content !== 'string') {
      return '';
    }

    let html = content
      // Escape HTML entities first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      
      // Headers (must be at start of line)
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-5">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
      
      // Bold and italic (order matters - do bold+italic first)
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Code blocks (before inline code)
      .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Lists (unordered)
      .replace(/^[\*\-] (.*$)/gm, '<li class="mb-1">$1</li>')
      
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-400 pl-4 italic text-gray-700 dark:text-gray-300 my-2">$1</blockquote>')
      
      // Line breaks - double newlines become paragraph breaks
      .replace(/\n\n+/g, '</p><p class="mb-4">')
      
      // Single newlines become <br>
      .replace(/\n/g, '<br>');

    // Wrap consecutive list items in <ul>
    html = html.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, (match) => {
      return '<ul class="list-disc ml-6 mb-4">' + match + '</ul>';
    });

    // Wrap everything in paragraphs if there's content
    if (html.trim()) {
      html = '<div class="prose max-w-none"><p class="mb-4">' + html + '</p></div>';
    }

    return html;
  } catch (error) {
    console.error('Error in markdown rendering:', error);
    // Ultra-safe fallback
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }
}

/**
 * Async version for future compatibility (currently just calls sync version)
 * @param content The markdown content to render
 * @returns Promise<string> HTML conversion
 */
export async function renderMarkdown(content: string): Promise<string> {
  return renderMarkdownSync(content);
}
