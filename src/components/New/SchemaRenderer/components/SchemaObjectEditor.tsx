import type { FC } from 'react';

import type { JsonSchemaDef } from '@/models/json-schema';
import {
  resolveRef,
  sortByPropertyOrder,
  toFieldLabel,
} from '@/utils/json-schema';
import { useSchemaContext } from '../context';
import { SchemaField } from './SchemaField';

export interface SchemaObjectEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

/**
 * Renders the properties of a JSON Schema object as labelled form fields.
 * aliases: ObjectSchemaEditor|SchemaPropertiesEditor
 * Design system 2.0
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
  const properties = sortByPropertyOrder(
    Object.entries(resolved.properties ?? {}).filter(
      ([, propSchema]) => !resolveRef(propSchema, rootSchema).isHidden,
    ),
  );
  const required = resolved.required ?? [];
  const obj = (value as Record<string, unknown>) ?? {};

  if (properties.length === 0) {
    return (
      <p className="dial-small-text text-secondary">
        {texts.noConfigurableProperties}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {properties.map(([key, propSchema]) => {
        const resolvedProp = resolveRef(propSchema, rootSchema);

        return (
          <SchemaField
            key={key}
            schema={propSchema}
            value={obj[key]}
            onChange={(newVal) => onChange({ ...obj, [key]: newVal })}
            path={[...path, key]}
            level={level}
            required={required.includes(key)}
            label={resolvedProp.title ?? propSchema.title ?? toFieldLabel(key)}
          />
        );
      })}
    </div>
  );
};
