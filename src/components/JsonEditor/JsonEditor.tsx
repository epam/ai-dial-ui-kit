import type { FC } from 'react';

import { EDITOR_THEMES_CONFIG } from '@/constants/editor';
import { EDITOR_THEMES } from '@/types/editor';
import { Editor, type Monaco, type OnValidate } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

export interface Props {
  value?: string | undefined;
  currentTheme: string;
  themesConfig?: Record<EDITOR_THEMES, editor.IStandaloneThemeData>;
  onChange: (value: string | undefined) => void;
  onValidateJSON?: OnValidate;
  options?: editor.IStandaloneEditorConstructionOptions;
}

/**
 * A JSON editor component built on top of Monaco Editor.
 * Provides syntax highlighting, validation, and theme support for JSON editing.
 *
 * @param currentTheme - The theme to apply to the editor
 * @param onChange - Callback fired when the editor content changes
 * @param [value] - The JSON string value to edit
 * @param [themesConfig=EDITOR_THEMES_CONFIG] - Custom theme configurations
 * @param [onValidateJSON] - Callback fired when JSON validation occurs
 * @param [options] - Additional Monaco editor options
 */
export const DialJsonEditor: FC<Props> = ({
  value,
  onChange,
  onValidateJSON,
  options,
  currentTheme,
  themesConfig = EDITOR_THEMES_CONFIG,
}) => {
  function handleBeforeMount(monaco: Monaco) {
    monaco?.editor?.defineTheme(
      currentTheme,
      themesConfig[currentTheme as EDITOR_THEMES],
    );
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      enableSchemaRequest: false,
      schemas: [
        {
          uri: 'http://custom-schema/object-required.json',
          fileMatch: ['*'],
          schema: {
            type: 'object',
            description: 'Top-level value must be an object',
            additionalProperties: true,
          },
        },
      ],
    });
  }

  return (
    <Editor
      beforeMount={handleBeforeMount}
      height="100%"
      defaultLanguage="json"
      value={value}
      onChange={onChange}
      theme={currentTheme}
      onValidate={onValidateJSON}
      options={{
        minimap: { enabled: false },
        formatOnType: true,
        formatOnPaste: true,
        selectOnLineNumbers: false,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        smoothScrolling: true,
        overviewRulerLanes: 0,
        scrollbar: {
          horizontal: 'hidden',
          verticalScrollbarSize: 4,
          verticalSliderSize: 4,
        },
        ...(options ?? {}),
      }}
    />
  );
};
