'use client';

import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
  useEditorState,
} from '@tiptap/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { MermaidBlock } from './mermaid-block';
import { menuBarStateSelector } from './menuBarState';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { marked } from 'marked';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Table as TableIcon,
  Minus,
  Undo,
  Redo,
  Eye,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/button';

const lowlight = createLowlight(common);

/** Custom code block view that renders mermaid diagrams inline */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CodeBlockView({ node, updateAttributes }: any) {
  const language = node.attrs.language as string | null;
  const isMermaid = language === 'mermaid';

  return (
    <NodeViewWrapper className="relative">
      <select
        contentEditable={false}
        className="absolute right-2 top-2 z-10 rounded bg-surface-3 px-1.5 py-0.5 text-xs text-text-secondary"
        value={language ?? ''}
        onChange={(e) => updateAttributes({ language: e.target.value })}
      >
        <option value="">auto</option>
        <option value="mermaid">mermaid</option>
        <option value="javascript">javascript</option>
        <option value="typescript">typescript</option>
        <option value="python">python</option>
        <option value="sql">sql</option>
        <option value="json">json</option>
        <option value="html">html</option>
        <option value="css">css</option>
      </select>
      {isMermaid && node.textContent.trim() ? (
        <div contentEditable={false} className="mb-2">
          <MermaidBlock code={node.textContent} />
        </div>
      ) : null}
      <pre>
        <NodeViewContent as="div" className="hljs" />
      </pre>
    </NodeViewWrapper>
  );
}

/**
 * Detects whether a string is raw Markdown (vs HTML already).
 * MCP-created notes store Markdown; UI-created notes store HTML.
 */
function looksLikeMarkdown(text: string): boolean {
  if (!text || text.startsWith('<')) return false;
  return /^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|^\*\*|^>\s|```/m.test(text);
}

function ensureHtml(text: string): string {
  if (!text) return '';
  if (looksLikeMarkdown(text)) {
    return marked.parse(text, { async: false }) as string;
  }
  return text;
}

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  onChangeEditable?: (editable: boolean) => void;
  proposalId?: string;
  onRequestAI?: () => void;
  isAILoading?: boolean;
}

export function NoteEditor({
  content,
  onChange,
  editable = true,
  placeholder = 'Escribe tu nota aqui... Usa Markdown o la barra de herramientas.',
  proposalId,
  onRequestAI,
  isAILoading,
}: NoteEditorProps) {
  const isExternalUpdate = useRef(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleUpdate = useCallback(
    ({
      editor: ed,
    }: {
      editor: ReturnType<typeof useEditor> extends infer E
        ? NonNullable<E>
        : never;
    }) => {
      if (isExternalUpdate.current) return;
      // Always save as HTML for consistency
      onChange(ed.getHTML());
    },
    [onChange],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: 'tiptap-table' },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({ lowlight }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }),
    ],
    content: ensureHtml(content),
    editable,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-invert max-w-none focus:outline-none min-h-[250px]',
      },
    },
  });

  // Sync content prop into TipTap when it changes externally
  // (e.g., after Convex query resolves or version restore)
  useEffect(() => {
    if (!editor) return;
    const html = ensureHtml(content);
    if (html !== editor.getHTML()) {
      isExternalUpdate.current = true;
      editor.commands.setContent(html);
      isExternalUpdate.current = false;
    }
  }, [editor, content]);

  useEffect(() => {
    if (!editor) return;

    const shouldBeEditable = editable && !previewMode;

    editor.setEditable(shouldBeEditable);
  }, [editor, previewMode, editable]);

  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor || !editorState) return null;

  return (
    <div className="flex flex-col">
      {editable && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1.5">
          {!previewMode && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editorState.canBold}
                active={editorState.isBold}
                title="Negritas"
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editorState.canItalic}
                active={editorState.isItalic}
                title="Italicas"
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <div className="mx-1 h-5 w-px bg-border-strong" />
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={editorState.isHeading2}
                title="Titulo H2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                active={editorState.isHeading3}
                title="Titulo H3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
              <div className="mx-1 h-5 w-px bg-border-strong" />
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editorState.isBulletList}
                title="Lista"
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editorState.isOrderedList}
                title="Lista numerada"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editorState.isBlockquote}
                title="Cita"
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                active={editorState.isCodeBlock}
                title="Bloque de codigo"
              >
                <Code className="h-4 w-4" />
              </ToolbarButton>
              <div className="mx-1 h-5 w-px bg-border-strong" />
              <ToolbarButton
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
                title="Insertar tabla"
              >
                <TableIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Linea horizontal"
              >
                <Minus className="h-4 w-4" />
              </ToolbarButton>
              <div className="ml-auto flex gap-1">
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editorState.canUndo}
                  title="Deshacer"
                >
                  <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editorState.canRedo}
                  title="Rehacer"
                >
                  <Redo className="h-4 w-4" />
                </ToolbarButton>
              </div>
            </>
          )}
          {previewMode && <div className="flex-1" />}
        </div>
      )}
      <div className="bg-background">
        <EditorContent
          editor={editor}
          className={`overflow-y-auto max-h-[60vh] p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent ${editable ? 'preview-active' : 'edit-active'}`}
        />
      </div>

      {editable && proposalId && (
        <Button
          onClick={onRequestAI}
          disabled={isAILoading}
          className="absolute bottom-6 right-6 rounded-full shadow-lg h-14 w-14 p-0 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-transform hover:scale-105"
          title="Preguntar a IA"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
  className,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-md p-1.5 transition-all text-sm ${className || ''} ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : disabled
            ? 'text-muted-foreground opacity-50 cursor-not-allowed'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
