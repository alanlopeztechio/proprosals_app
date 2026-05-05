/// Splits a markdown document into chunks based on headings (H1, H2, H3).
function splitByHeadings(
  markdown: string,
): Array<{ heading: string | undefined; content: string }> {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const sections: Array<{ heading: string | undefined; content: string }> = [];
  let lastIndex = 0;
  let lastHeading: string | undefined = undefined;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(markdown)) !== null) {
    if (match.index > lastIndex) {
      console.log('match.index', match.index);
      const content = markdown.slice(lastIndex, match.index).trim();
      if (content) {
        sections.push({ heading: lastHeading, content });
      }
    }
    console.log('match', match);
    console.log('match[2]', match[2]);
    lastHeading = match[2];
    lastIndex = match.index + match[0].length;
  }

  const remaining = markdown.slice(lastIndex).trim();
  if (remaining) {
    sections.push({ heading: lastHeading, content: remaining });
  }

  if (sections.length === 0) {
    sections.push({ heading: undefined, content: markdown });
  }

  return sections;
}

const document_to_chunk = `# Heading 1
This is some content under heading 1.
## Heading 2
This is some content under heading 2.
### Heading 3
This is some content under heading 3.`;

const chunks = splitByHeadings(document_to_chunk);
console.log(chunks);
