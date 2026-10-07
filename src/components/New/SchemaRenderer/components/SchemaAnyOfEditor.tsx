import type { FC } from 'react';

import { Select } from '@/components/New/Select/Select';
import type { JsonSchemaDef } from '@/models/json-schema';
import { JsonSchemaType } from '@/types/json-schema';
import {
  detectAnyOfVariant,
  extractDefaults,
  getOptionLabel,
  resolveRef,
} from '@/utils/json-schema';
import { useSchemaContext } from '../context';
import { SchemaFieldContent } from './SchemaFieldContent';

export interface SchemaAnyOfEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
  ariaLabel?: string;
}

/** The empty value a variant of the given type starts from when it has no default. */
const EMPTY_VALUE_BY_TYPE: Partial<Record<string, unknown>> = {
  [JsonSchemaType.Array]: [],
  [JsonSchemaType.String]: '',
  [JsonSchemaType.Boolean]: false,
  [JsonSchemaType.Integer]: 0,
  [JsonSchemaType.Number]: 0,
};

/**
 * Renders an `anyOf` schema field as a type select with the selected variant's editor.
 * aliases: AnyOfSchemaEditor|SchemaUnionEditor
 * Design system 2.0
 *
 * A `null` variant has no editor, so selecting it clears the value.
 *
 * @example
 * ```tsx
 * <SchemaAnyOfEditor
 *   schema={{ anyOf: [{ type: 'null' }, { type: 'string' }] }}
 *   value={null}
 *   onChange={(v) => console.log(v)}
 *   path={['field']}
 *   level={1}
 *   ariaLabel="Field"
 * />
 * ```
 *
 * @param schema - The JSON Schema definition containing an `anyOf` array
 * @param value - Current field value
 * @param onChange - Called with the new value when the type or sub-value changes
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child field components
 * @param [ariaLabel] - Accessible name of the type select and the variant's control
 */
export const SchemaAnyOfEditor: FC<SchemaAnyOfEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
  ariaLabel,
}) => {
  const { rootSchema, texts, readonly = false } = useSchemaContext();
  const anyOfSchemas = schema.anyOf ?? [];

  const currentIndex = detectAnyOfVariant(value, anyOfSchemas, rootSchema);
  const selectedSchema = anyOfSchemas[currentIndex];
  const isNull =
    !selectedSchema ||
    resolveRef(selectedSchema, rootSchema).type === JsonSchemaType.Null;

  const handleChange = (idx: number) => {
    const newSchema = resolveRef(anyOfSchemas[idx], rootSchema);
    if (newSchema.type === JsonSchemaType.Null) {
      onChange(null);
      return;
    }
    const defaults = extractDefaults(newSchema, rootSchema);
    if (defaults !== undefined) {
      onChange(defaults);
      return;
    }
    const type = typeof newSchema.type === 'string' ? newSchema.type : '';
    onChange(type in EMPTY_VALUE_BY_TYPE ? EMPTY_VALUE_BY_TYPE[type] : {});
  };

  return (
    <div className="flex flex-col gap-3">
      <Select
        ariaLabel={ariaLabel ?? texts.selectTypePlaceholder}
        options={anyOfSchemas.map((s, i) => ({
          value: String(i),
          label: getOptionLabel(s, rootSchema),
        }))}
        value={String(currentIndex)}
        disabled={readonly}
        onChange={(next) =>
          handleChange(Number(typeof next === 'string' ? next : next[0]))
        }
        className="max-w-[280px]"
      />
      {!isNull && (
        <div className="border-l-2 border-tertiary pl-3">
          <SchemaFieldContent
            schema={selectedSchema}
            value={value}
            onChange={onChange}
            path={path}
            level={level}
            ariaLabel={ariaLabel}
          />
        </div>
      )}
    </div>
  );
};
