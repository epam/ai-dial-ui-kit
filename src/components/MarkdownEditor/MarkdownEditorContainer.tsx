import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ComponentType,
  type FC,
  type ReactNode,
} from 'react';
import type { OnValidate } from '@monaco-editor/react';
import type { PreviewType } from '@uiw/react-md-editor';

import { type DialJsonEditorProps } from '@/components/JsonEditor/JsonEditor';
import { DialSwitch } from '@/components/Switch/Switch';
import { EditorThemes } from '@/types/editor';
import { DialMarkdownEditor } from './MarkdownEditor';
import { DialLabel } from '@/components/Label/Label';

export interface DialMarkdownEditorContainerProps {
  value?: string;
  onChangeValue?: (value: string) => void;
  label?: ReactNode;
  headerContent?: ReactNode;
  switcherLabel?: ReactNode;
  height?: number;
  theme?: EditorThemes;
  onValidateJSON?: OnValidate;
  preview?: PreviewType;
}

/**
 * A container component that combines Markdown and JSON editing capabilities
 * with an optional switcher to toggle between modes.
 *
 * @example
 * ```tsx
 * <DialMarkdownEditorContainer
 *   value="# Hello"
 *   onChangeValue={(value) => console.log(value)}
 *   label="Content"
 *   switcherLabel="JSON Mode"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DialMarkdownEditorContainer
 *   value="# Hello"
 *   onChangeValue={(value) => console.log(value)}
 *   label="Content"
 * />
 * ```
 *
 * @param [value] - The current content value
 * @param [onChangeValue] - Callback fired when the content changes
 * @param [label] - Optional label for the field
 * @param [headerContent] - Optional content to display in the header
 * @param [switcherLabel] - Optional label for the mode switcher (if not provided, switcher is hidden)
 * @param [height=300] - Height of the editor in pixels
 * @param [theme='dark'] - Theme for the editor (EditorThemes.dark or EditorThemes.light)
 * @param [onValidateJSON] - Callback fired when JSON validation occurs
 * @param [preview='edit'] - Preview mode for Markdown editor
 */
export const DialMarkdownEditorContainer: FC<
  DialMarkdownEditorContainerProps
> = ({
  value,
  onChangeValue,
  label,
  headerContent,
  switcherLabel,
  height = 300,
  theme = EditorThemes.dark,
  onValidateJSON,
  preview = 'edit',
}) => {
  const switchId = useId();
  const [isJSONContentMode, setIsJSONContentMode] = useState(false);
  const [DialJsonEditorComponent, setDialJsonEditorComponent] =
    useState<ComponentType<DialJsonEditorProps> | null>(null);

  /**
   * Dynamically loads JsonEditor component only on client-side when JSON mode is active.
   * This prevents SSR errors since Monaco Editor (used by JsonEditor) requires browser APIs.
   * The component is only loaded when needed, reducing initial bundle size.
   */
  useEffect(() => {
    if (isJSONContentMode && typeof window !== 'undefined') {
      import('@/components/JsonEditor/JsonEditor').then((module) => {
        setDialJsonEditorComponent(() => module.DialJsonEditor);
      });
    }
  }, [isJSONContentMode]);

  const onChangeContent = useCallback(
    (content: string | undefined) => {
      onChangeValue?.(content as string);
    },
    [onChangeValue],
  );

  const handleValidateJSON = useCallback<OnValidate>(
    (errors) => {
      onValidateJSON?.(errors);
    },
    [onValidateJSON],
  );

  const showSwitcher = Boolean(switcherLabel);

  return (
    <div className="size-full flex flex-col">
      <div className="flex flex-col gap-8">
        <div>
          {(label || headerContent || showSwitcher) && (
            <div className="flex justify-between items-center mb-2">
              {label && <DialLabel label={label} />}
              <div className="flex items-center gap-2 flex-1 justify-end">
                {headerContent}
                {showSwitcher && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <DialSwitch
                      isOn={isJSONContentMode}
                      label={switcherLabel}
                      switchId={switchId}
                      onChange={(value: boolean) => setIsJSONContentMode(value)}
                    />
                  </label>
                )}
              </div>
            </div>
          )}
          {showSwitcher && isJSONContentMode ? (
            <div
              className="border border-primary rounded"
              style={{ height: `${height}px` }}
            >
              {DialJsonEditorComponent && (
                <DialJsonEditorComponent
                  value={value}
                  onChange={onChangeContent}
                  onValidateJSON={handleValidateJSON}
                  currentTheme={theme}
                />
              )}
            </div>
          ) : (
            <DialMarkdownEditor
              value={value}
              onChange={onChangeContent}
              height={height}
              preview={preview}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
};
