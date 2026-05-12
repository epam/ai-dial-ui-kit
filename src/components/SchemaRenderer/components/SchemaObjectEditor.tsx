import { useSchemaContext } from '@/components/SchemaRenderer/context';
import type { JsonSchemaDef } from '@/components/SchemaRenderer/types';
import { resolveRef, toFieldLabel } from '@/components/SchemaRenderer/utils';
import type { FC } from 'react';
import { SchemaField } from './SchemaField';

export interface SchemaObjectEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

/**
 * Renders the properties of a JSON Schema object as labeled form fields.
 * aliases: ObjectSchemaEditor|SchemaPropertiesEditor
 *
 * @example
 * ```tsx
 * <SchemaObjectEditor
 *   schema={{ type: 'object', properties: { name: { type: 'string' } } }}
 *   value={{ name: 'Alice' }}
 *   onChange={(v) => console.log(v)}
 *   path={['config']}
 *   level={1}
 * />
 * ```
 *
 * @param schema - The JSON Schema object definition
 * @param value - Current object value
 * @param onChange - Called with the updated object when any property changes
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child SchemaField instances
 */
export const SchemaObjectEditor: FC<SchemaObjectEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
}) => {
  const { rootSchema, texts } = useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);
  const properties = Object.entries(resolved.properties ?? {}).filter(
    ([, propSchema]) => !resolveRef(propSchema, rootSchema).isHidden,
  );
  const required = resolved.required ?? [];
  const obj = (value as Record<string, unknown>) ?? {};

  if (properties.length === 0) {
    return (
      <p className="dial-tiny-text text-secondary italic">
        {texts.noConfigurableProperties}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {properties.map(([key, propSchema]) => {
        const resolvedProp = resolveRef(propSchema, rootSchema);
        const propLabel =
          resolvedProp.title ?? propSchema.title ?? toFieldLabel(key);
        const isRequired = required.includes(key);

        return (
          <SchemaField
            key={key}
            schema={propSchema}
            value={obj[key]}
            onChange={(newVal) => onChange({ ...obj, [key]: newVal })}
            path={[...path, key]}
            level={level}
            required={isRequired}
            label={propLabel}
          />
        );
      })}
    </div>
  );
};
