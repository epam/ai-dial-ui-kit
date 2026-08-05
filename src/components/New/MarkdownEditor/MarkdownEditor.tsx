import { useMemo, type FC, type ReactNode } from 'react';
import MDEditor, { type PreviewType } from '@uiw/react-md-editor';

import { EditorThemes } from '@/types/editor';
import { mergeClasses } from '@/utils/merge-classes';
import {
  getMarkdownExtraCommands,
  getMarkdownFormattingCommands,
} from './constants';

export interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  theme?: EditorThemes;
  className?: string;
  placeholder?: ReactNode;
  /** Initial edit/live/preview mode; the toolbar lets the user switch it afterwards. */
  defaultPreview?: PreviewType;
}

/**
 * The 2.0 Markdown editor: a formatting toolbar (bold/italic/strikethrough,
 * text style, lists, quote/link/code, table) plus an edit/live/preview mode
 * switcher and fullscreen, built on top of `@uiw/react-md-editor`.
 *
 * @example
 * ```tsx
 * <MarkdownEditor value={value} onChange={setValue} height={400} />
 * ```
 *
 * @param [value] - The current markdown content
 * @param [onChange] - Callback fired when the editor content changes
 * @param [height=300] - Height of the editor in pixels
 * @param [theme='dark'] - Theme for the editor ('light' or 'dark')
 * @param [className] - Additional CSS classes for the container
 * @param [placeholder] - Content to display when the editor is empty
 * @param [defaultPreview='edit'] - Initial edit/live/preview mode
 */
export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value,
  onChange,
  height = 300,
  theme = EditorThemes.dark,
  className,
  placeholder,
  defaultPreview = 'edit',
}) => {
  const showPlaceholder = placeholder !== undefined && !value;

  const commands = useMemo(() => getMarkdownFormattingCommands(), []);
  const extraCommands = useMemo(() => getMarkdownExtraCommands(), []);

  return (
    <div
      data-color-mode={theme}
      className={mergeClasses('dial-kit-markdown-editor relative', className)}
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val || '')}
        height={height}
        preview={defaultPreview}
        commands={commands}
        extraCommands={extraCommands}
      />
      {showPlaceholder && (
        <div className="pointer-events-none absolute left-0 top-8 px-2 dial-small-text text-secondary opacity-40">
          {placeholder}
        </div>
      )}
    </div>
  );
};
