import type { FC } from 'react';
import type { JsonSchemaDef } from '../types';
import { useSchemaContext } from '../context';
import { resolveRef, toFieldLabel } from '../utils';
import { SchemaField } from './SchemaField';

export interface SchemaObjectEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

export const SchemaObjectEditor: FC<SchemaObjectEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
}) => {
  const { rootSchema } = useSchemaContext();
  const resolved = resolveRef(schema, rootSchema);
  const properties = Object.entries(resolved.properties ?? {});
  const required = resolved.required ?? [];
  const obj = (value as Record<string, unknown>) ?? {};

  if (properties.length === 0) {
    return (
      <p className="dial-tiny text-text-secondary italic">
        No configurable properties.
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
