'use client';

import { useEffect, useRef } from 'react';

interface MermaidBlockProps {
  code: string;
}

/**
 * Renders a Mermaid diagram from code
 */
export function MermaidBlock({ code }: MermaidBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current || !code.trim()) return;

      try {
        // Dynamically import mermaid
        const { default: mermaid } = await import('mermaid');

        // Initialize mermaid with dark theme support
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          securityLevel: 'loose',
        });

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create a unique ID for this render
        const id = `mermaid-${renderIdRef.current}`;
        const div = document.createElement('div');
        div.id = id;
        div.className = 'mermaid';
        div.textContent = code;

        containerRef.current.appendChild(div);

        // Render the diagram
        await mermaid.run();
      } catch (error) {
        // Silently fail on invalid diagrams
        if (containerRef.current) {
          containerRef.current.innerHTML = `<p class="text-xs text-red-500">Invalid Mermaid diagram</p>`;
        }
      }
    };

    renderMermaid();
  }, [code]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center bg-surface-2/30 rounded p-4 my-2 overflow-x-auto"
    />
  );
}
