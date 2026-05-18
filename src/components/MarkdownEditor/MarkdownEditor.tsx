import { EditorThemes } from '@/types/editor';
import MDEditor, { type PreviewType } from '@uiw/react-md-editor';
import type { FC, ReactNode } from 'react';

export interface DialMarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  preview?: PreviewType;
  theme?: EditorThemes;
  className?: string;
  placeholder?: ReactNode;
}

/**
 * A Markdown editor component built on top of @uiw/react-md-editor.
 * Provides markdown editing with preview capabilities and theme support.
 *
 * @example
 * ```tsx
 * <DialMarkdownEditor
 *   value="# Hello World"
 *   onChange={(value) => console.log(value)}
 *   height={400}
 *   theme="dark"
 * />
 * ```
 *
 * @param [value] - The current markdown content
 * @param [onChange] - Callback fired when the editor content changes
 * @param [height=300] - Height of the editor in pixels
 * @param [preview='edit'] - Preview mode ('edit', 'live', 'preview')
 * @param [placeholder] - Content to display when the editor is empty
 * @param [theme='dark'] - Theme for the editor ('light' or 'dark')
 * @param [className] - Additional CSS classes for the container
 */
export const DialMarkdownEditor: FC<DialMarkdownEditorProps> = ({
  value,
  onChange,
  height = 300,
  preview = 'edit',
  theme = EditorThemes.dark,
  className,
  placeholder,
}) => {
  const showPlaceholder = placeholder !== undefined && !value;

  return (
    <div data-color-mode={theme} className={`relative ${className ?? ''}`}>
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val || '')}
        height={height}
        preview={preview}
      />
      {showPlaceholder && (
        <div className="pointer-events-none absolute left-0 top-8 px-2 dial-small-text text-secondary opacity-40">
          {placeholder}
        </div>
      )}
    </div>
  );
};
