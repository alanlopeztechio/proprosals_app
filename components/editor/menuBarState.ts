import type { Editor } from '@tiptap/core';

export const menuBarStateSelector = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return {
      isBold: false,
      isItalic: false,
      isStrike: false,
      isCode: false,
      isParagraph: false,
      isHeading1: false,
      isHeading2: false,
      isHeading3: false,
      isHeading4: false,
      isHeading5: false,
      isHeading6: false,
      isBulletList: false,
      isOrderedList: false,
      isCodeBlock: false,
      isBlockquote: false,
      canBold: false,
      canItalic: false,
      canStrike: false,
      canCode: false,
      canUndo: false,
      canRedo: false,
    };
  }

  try {
    return {
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
      isStrike: editor.isActive('strike'),
      isCode: editor.isActive('code'),
      isParagraph: editor.isActive('paragraph'),
      isHeading1: editor.isActive('heading', { level: 1 }),
      isHeading2: editor.isActive('heading', { level: 2 }),
      isHeading3: editor.isActive('heading', { level: 3 }),
      isHeading4: editor.isActive('heading', { level: 4 }),
      isHeading5: editor.isActive('heading', { level: 5 }),
      isHeading6: editor.isActive('heading', { level: 6 }),
      isBulletList: editor.isActive('bulletList'),
      isOrderedList: editor.isActive('orderedList'),
      isCodeBlock: editor.isActive('codeBlock'),
      isBlockquote: editor.isActive('blockquote'),
      canBold: editor.can().toggleBold(),
      canItalic: editor.can().toggleItalic(),
      canStrike: editor.can().toggleStrike(),
      canCode: editor.can().toggleCode(),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    };
  } catch (error) {
    return {
      isBold: false,
      isItalic: false,
      isStrike: false,
      isCode: false,
      isParagraph: false,
      isHeading1: false,
      isHeading2: false,
      isHeading3: false,
      isHeading4: false,
      isHeading5: false,
      isHeading6: false,
      isBulletList: false,
      isOrderedList: false,
      isCodeBlock: false,
      isBlockquote: false,
      canBold: false,
      canItalic: false,
      canStrike: false,
      canCode: false,
      canUndo: false,
      canRedo: false,
    };
  }
};
