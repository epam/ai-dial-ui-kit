import { type FC, useState } from 'react';

import { Textarea, TextareaResize } from '@/components/New/Textarea/Textarea';
import { useSchemaContext } from '../context';

export interface SchemaJsonEditorProps {
  value: unknown;
  onChange: (value: unknown) => void;
  id?: string;
  ariaLabel?: string;
}

const isValidJson = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Edits a value the schema does not describe as raw JSON text: a key absent
 * from the schema's `properties`, an object with no fixed properties, or a
 * key-value entry switched to the object or array type.
 * aliases: SchemaRawJsonEditor|SchemaUnknownPropertyEditor
 * Design system 2.0
 *
 * A plain monospace {@link Textarea} rather than a code editor, so the form
 * pulls in no editor bundle. The draft text is kept locally and `onChange`
 * fires only once it parses.
 *
 * @example
 * ```tsx
 * <SchemaJsonEditor value={{ retries: 3 }} onChange={setValue} />
 * ```
 *
 * @param value - The current value (any JSON type)
 * @param onChange - Called with the parsed value whenever the edited text is valid JSON
 * @param [id] - Id of the textarea, for a visible label to point at
 * @param [ariaLabel] - Accessible name of the textarea
 */
export const SchemaJsonEditor: FC<SchemaJsonEditorProps> = ({
  value,
  onChange,
  id,
  ariaLabel,
}) => {
  const { readonly, texts } = useSchemaContext();
  const [text, setText] = useState<string>(
    () => JSON.stringify(value, null, 2) ?? '',
  );
  const hasParseError = !isValidJson(text);

  const handleChange = (nextText: string) => {
    setText(nextText);
    if (isValidJson(nextText)) onChange(JSON.parse(nextText));
  };

  return (
    <Textarea
      id={id}
      aria-label={ariaLabel}
      value={text}
      onChange={handleChange}
      readOnly={readonly}
      invalid={hasParseError}
      error={hasParseError ? texts.invalidJsonError : undefined}
      spellCheck={false}
      rows={10}
      resize={TextareaResize.Vertical}
      // `.dial-kit-textarea` sets `white-space: normal` outside any cascade
      // layer, which no utility can beat without `!` — and JSON needs its
      // indentation and line breaks kept.
      className="font-mono !whitespace-pre"
    />
  );
};
