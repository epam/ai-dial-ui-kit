import { useCallback, useEffect, useId, useState, type FC } from 'react';
import type { OnValidate } from '@monaco-editor/react';
import type { PreviewType } from '@uiw/react-md-editor';

import { type DialJsonEditorProps } from '@/components/JsonEditor/JsonEditor';
import { DialSwitch } from '@/components/Switch/Switch';
import { EDITOR_THEMES } from '@/types/editor';
import { DialMarkdownEditor } from './MarkdownEditor';

export interface DialMarkdownEditorContainerProps {
  value?: string;
  onChangeValue?: (value: string) => void;
  label?: React.ReactNode;
  headerContent?: React.ReactNode;
  switcherLabel?: string;
  height?: number;
  theme?: 'light' | 'dark';
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
 * @param [theme='dark'] - Theme for the editor ('light' or 'dark')
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
  theme = 'dark',
  onValidateJSON,
  preview = 'edit',
}) => {
  const switchId = useId();
  const [isJSONContentMode, setIsJSONContentMode] = useState(false);
  const [jsonValue, setJsonValue] = useState<string | undefined>(undefined);
  const [DialJsonEditorComponent, setDialJsonEditorComponent] =
    useState<React.ComponentType<DialJsonEditorProps> | null>(null);

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
    (content: string) => {
      onChangeValue?.(content);
    },
    [onChangeValue],
  );

  const onChangeContentMode = useCallback((value: boolean) => {
    setIsJSONContentMode(value);
  }, []);

  const onChangeJsonValue = useCallback(
    (v: string | undefined) => {
      setJsonValue(v);
      onChangeValue?.(v as string);
    },
    [onChangeValue],
  );

  const handleValidateJSON = useCallback<OnValidate>(
    (errors) => {
      onValidateJSON?.(errors);
    },
    [onValidateJSON],
  );

  useEffect(() => {
    if (isJSONContentMode && value) {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object') {
          setJsonValue(JSON.stringify(parsed, null, 2));
        } else {
          setJsonValue(value);
        }
      } catch {
        setJsonValue(value);
      }
    }
  }, [isJSONContentMode, value]);

  const showSwitcher = Boolean(switcherLabel);
  const currentTheme =
    theme === 'light' ? EDITOR_THEMES.light : EDITOR_THEMES.dark;

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex flex-col gap-8">
        <div>
          {(label || headerContent || showSwitcher) && (
            <div className="flex justify-between items-center mb-2">
              {label && (
                <div className="flex items-center dial-tiny text-secondary mb-1">
                  {label}
                </div>
              )}
              <div className="flex items-center gap-2 flex-1 justify-end">
                {headerContent}
                {showSwitcher && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <DialSwitch
                      isOn={isJSONContentMode}
                      label={switcherLabel}
                      switchId={switchId}
                      onChange={onChangeContentMode}
                    />
                  </label>
                )}
              </div>
            </div>
          )}
          {showSwitcher && isJSONContentMode ? (
            <div
              className="border border-primary rounded dial-json-editor-container"
              style={{ height: `${height}px` }}
            >
              {DialJsonEditorComponent && (
                <DialJsonEditorComponent
                  value={jsonValue}
                  onChange={onChangeJsonValue}
                  onValidateJSON={handleValidateJSON}
                  currentTheme={currentTheme}
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
