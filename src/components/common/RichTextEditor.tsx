import { useEffect, type ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const ToolbarButton = ({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  title: string;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition hover:bg-slate-800/70',
      active && 'border-primary/60 bg-slate-800/80 text-slate-100',
    )}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, placeholder, error }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({
        placeholder: placeholder || 'Write your blog content...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const handleLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', previousUrl || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleImage = () => {
    if (!editor) return;
    const url = window.prompt('Enter image URL');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3">
        <ToolbarButton
          title="Bold"
          active={editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor?.isActive('underline')}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor?.isActive('strike')}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor?.isActive('heading', { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor?.isActive('heading', { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Bullet list"
          active={editor?.isActive('bulletList')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered list"
          active={editor?.isActive('orderedList')}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          active={editor?.isActive('blockquote')}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          active={editor?.isActive('codeBlock')}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Insert link" onClick={handleLink} active={editor?.isActive('link')}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Insert image" onClick={handleImage}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Undo" onClick={() => editor?.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor?.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div
        className={cn(
          'min-h-[280px] rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-slate-100 shadow-soft focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20',
          error && 'border-rose-500/70 focus-within:border-rose-500 focus-within:ring-rose-500/20',
        )}
      >
        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none [&_.ProseMirror]:min-h-[240px] [&_.ProseMirror]:outline-none [&_.ProseMirror>p]:my-2"
        />
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
};

export default RichTextEditor;
