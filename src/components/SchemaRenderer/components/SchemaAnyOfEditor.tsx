import type { FC } from 'react';
import { DialSelect } from '@/components/Select/Select';
import type { JsonSchemaDef } from '@/components/SchemaRenderer/types';
import { useSchemaContext } from '@/components/SchemaRenderer/context';
import {
  resolveRef,
  getOptionLabel,
  detectAnyOfVariant,
  extractDefaults,
} from '@/components/SchemaRenderer/utils';
import { SchemaFieldContent } from './SchemaFieldContent';

export interface SchemaAnyOfEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

/**
 * Renders an `anyOf` schema field as a type-selector dropdown with an inline sub-editor.
 * aliases: AnyOfSchemaEditor|SchemaUnionEditor
 *
 * @example
 * ```tsx
 * <SchemaAnyOfEditor
 *   schema={{ anyOf: [{ type: 'null' }, { type: 'string' }] }}
 *   value={null}
 *   onChange={(v) => console.log(v)}
 *   path={['field']}
 *   level={1}
 * />
 * ```
 *
 * @param schema - The JSON Schema definition containing an `anyOf` array
 * @param value - Current field value
 * @param onChange - Called with the new value when the type or sub-value changes
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child field components
 */
export const SchemaAnyOfEditor: FC<SchemaAnyOfEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
}) => {
  const { rootSchema, readonly = false } = useSchemaContext();
  const anyOfSchemas = schema.anyOf ?? [];

  const options = anyOfSchemas.map((s, i) => ({
    value: String(i),
    label: getOptionLabel(s, rootSchema),
  }));

  const currentIndex = detectAnyOfVariant(value, anyOfSchemas, rootSchema);
  const selectedSchema = anyOfSchemas[currentIndex];
  const resolvedSelected = resolveRef(selectedSchema, rootSchema);
  const isNull = resolvedSelected.type === 'null';

  const handleChange = (idx: number) => {
    const newSchema = resolveRef(anyOfSchemas[idx], rootSchema);
    if (newSchema.type === 'null') {
      onChange(null);
      return;
    }
    const defaults = extractDefaults(newSchema, rootSchema);
    if (defaults !== undefined) {
      onChange(defaults);
    } else if (newSchema.type === 'array') {
      onChange([]);
    } else if (newSchema.type === 'string') {
      onChange('');
    } else if (newSchema.type === 'boolean') {
      onChange(false);
    } else if (newSchema.type === 'integer' || newSchema.type === 'number') {
      onChange(0);
    } else {
      onChange({});
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex-1 max-w-[280px]">
        <DialSelect
          options={options}
          value={String(currentIndex)}
          disabled={readonly}
          onChange={(next) => {
            const val = typeof next === 'string' ? next : next[0];
            handleChange(Number(val));
          }}
        />
      </div>
      {!isNull && selectedSchema && (
        <div className="pl-3 border-l-2 border-secondary">
          <SchemaFieldContent
            schema={selectedSchema}
            value={value}
            onChange={onChange}
            path={path}
            level={level}
          />
        </div>
      )}
    </div>
  );
};
