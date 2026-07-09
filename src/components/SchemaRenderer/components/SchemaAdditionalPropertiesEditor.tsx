import { type ComponentType, type FC, useEffect, useState } from 'react';
import type { DialJsonEditorProps } from '@/components/JsonEditor/JsonEditor';
import { useSchemaContext } from '@/components/SchemaRenderer/context';
import { EditorThemes } from '@/types/editor';

export interface SchemaAdditionalPropertiesEditorProps {
  value: unknown;
  onChange: (value: unknown) => void;
  theme?: EditorThemes;
  height?: number;
}

/**
 * Renders a single value key that is not declared in the schema's `properties` as a raw JSON
 * editor, letting users inspect and manually edit it. The Monaco-based editor is dynamically
 * imported on the client only, keeping the parent SchemaRenderer SSR-safe.
 * aliases: SchemaExtraPropertyEditor|SchemaUnknownPropertyEditor
 *
 * @param value - The current value of the property (any JSON type)
 * @param onChange - Called with the parsed value whenever the edited JSON is valid
 * @param [theme=EditorThemes.dark] - Theme applied to the JSON editor
 * @param [height=240] - Editor height in pixels
 */
export const SchemaAdditionalPropertiesEditor: FC<
  SchemaAdditionalPropertiesEditorProps
> = ({ value, onChange, theme = EditorThemes.dark, height = 240 }) => {
  const { readonly } = useSchemaContext();
  const [EditorComponent, setEditorComponent] =
    useState<ComponentType<DialJsonEditorProps> | null>(null);
  const [text, setText] = useState<string>(() =>
    JSON.stringify(value, null, 2),
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/components/JsonEditor/JsonEditor').then((module) => {
        setEditorComponent(() => module.DialJsonEditor);
      });
    }
  }, []);

  const handleChange = (next: string | undefined) => {
    const nextText = next ?? '';
    setText(nextText);

    try {
      onChange(JSON.parse(nextText));
    } catch {
      // Ignore invalid JSON while the user is typing; propagate only once it parses.
    }
  };

  return (
    <div
      className="border border-primary rounded"
      style={{ height: `${height}px` }}
    >
      {EditorComponent && (
        <EditorComponent
          value={text}
          currentTheme={theme}
          onChange={handleChange}
          options={{ readOnly: readonly }}
        />
      )}
    </div>
  );
};
