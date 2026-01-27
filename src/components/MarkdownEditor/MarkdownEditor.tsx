import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import MDEditor, { type PreviewType } from '@uiw/react-md-editor';
import classNames from 'classnames';
import type { FC } from 'react';

export interface DialMarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  preview?: PreviewType;
  theme?: 'light' | 'dark';
  className?: string;
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
 * @param [theme='dark'] - Theme for the editor ('light' or 'dark')
 * @param [className] - Additional CSS classes for the container
 */
export const DialMarkdownEditor: FC<DialMarkdownEditorProps> = ({
  value,
  onChange,
  height = 300,
  preview = 'edit',
  theme = 'dark',
  className,
}) => {
  return (
    <div
      className={classNames('dial-markdown-editor', className)}
      data-color-mode={theme}
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val || '')}
        height={height}
        preview={preview}
      />
    </div>
  );
};
