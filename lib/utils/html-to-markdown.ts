/**
 * Converts HTML to Markdown.
 * Handles common HTML elements and preserves formatting.
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  let markdown = html
    // Remove script and style tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Headings
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    // Bold
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    // Italic
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // Strikethrough
    .replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~')
    .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
    // Code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    // Pre/code blocks
    .replace(/<pre[^>]*>(.*?)<\/pre>/gi, (match, content) => {
      const code = content.replace(/<code[^>]*>(.*?)<\/code>/gi, '$1');
      return '\n```\n' + code.trim() + '\n```\n';
    })
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (match, content) => {
      return '> ' + content.trim().replace(/\n/g, '\n> ') + '\n\n';
    })
    // Links
    .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Images
    .replace(
      /<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*\/?>/gi,
      '![$1]($2)',
    )
    .replace(
      /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi,
      '![$2]($1)',
    )
    // Lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
      return (
        content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n').trim() + '\n\n'
      );
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
      let counter = 1;
      return (
        content
          .replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`)
          .trim() + '\n\n'
      );
    })
    // Tables (basic support)
    .replace(
      /<table[^>]*>(.*?)<\/table>/gi,
      (match: string, content: string) => {
        const rows = content.match(/<tr[^>]*>(.*?)<\/tr>/gi) || [];
        const markdownRows = rows.map((row: string, idx: number) => {
          const cells = row.match(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi) || [];
          const markdownCells = cells.map((cell: string) => {
            const cellContent = cell
              .replace(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi, '$1')
              .trim();
            return cellContent;
          });
          const rowMarkdown = '| ' + markdownCells.join(' | ') + ' |';
          if (idx === 0) {
            const separator =
              '| ' + markdownCells.map(() => '---').join(' | ') + ' |';
            return rowMarkdown + '\n' + separator;
          }
          return rowMarkdown;
        });
        return '\n' + markdownRows.join('\n') + '\n\n';
      },
    )
    // Remove HTML comments
    .replace(/<!--(.*?)-->/gi, '')
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    // Clean up excessive whitespace
    .replace(/\n\n\n+/g, '\n\n')
    .trim();

  return markdown;
}
