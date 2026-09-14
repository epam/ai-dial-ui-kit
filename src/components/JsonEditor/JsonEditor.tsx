import type { FC } from 'react';

import { EDITOR_THEMES_CONFIG } from '@/constants/editor';
import { EditorThemes } from '@/types/editor';
/*
 * `@monaco-editor/react` is an optional peer, so a consumer that never mounts
 * an editor does not install it — and a named value import of a package that
 * is not installed is a build error, not a runtime one: a bundler resolves
 * this module because the root entry re-exports `LazyDialJsonEditor`, sees an
 * import of a name the stubbed-out optional peer does not export, and stops.
 * Reaching the component through the namespace keeps the binding dynamic, so
 * the failure lands where it belongs — on the consumer that renders an editor
 * without installing its engine. Types stay named: they are erased before any
 * bundler sees them.
 */
import * as monacoReact from '@monaco-editor/react';
import type { Monaco, OnValidate } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export interface DialJsonEditorProps {
  value?: string | undefined;
  currentTheme: string;
  themesConfig?: Record<EditorThemes, editor.IStandaloneThemeData>;
  onChange: (value: string | undefined) => void;
  onValidateJSON?: OnValidate;
  options?: editor.IStandaloneEditorConstructionOptions;
}

/**
 * A JSON editor component built on top of Monaco Editor.
 * Design system 1.0
 * Provides syntax highlighting, validation, and theme support for JSON editing.
 *
 * @param currentTheme - The theme to apply to the editor
 * @param onChange - Callback fired when the editor content changes
 * @param [value] - The JSON string value to edit
 * @param [themesConfig=EDITOR_THEMES_CONFIG] - Custom theme configurations
 * @param [onValidateJSON] - Callback fired when JSON validation occurs
 * @param [options] - Additional Monaco editor options
 */
export const DialJsonEditor: FC<DialJsonEditorProps> = ({
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
      themesConfig[currentTheme as EditorThemes],
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

  const { Editor } = monacoReact;

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
