import type { FC } from 'react';
import { DialSelect } from '@/components/Select/Select';
import type { JsonSchemaDef } from '../types';
import { useSchemaContext } from '../context';
import { resolveRef, extractDefaults } from '../utils';
import { SchemaObjectEditor } from './SchemaObjectEditor';
import { SchemaFieldContent } from './SchemaFieldContent';

export interface SchemaOneOfEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

export const SchemaOneOfEditor: FC<SchemaOneOfEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
}) => {
  const { rootSchema } = useSchemaContext();
  const discriminator = schema.discriminator;

  if (discriminator) {
    const discProp = discriminator.propertyName;
    const mapping = discriminator.mapping;
    const options = Object.keys(mapping).map((key) => ({
      value: key,
      label: key,
    }));

    const currentType =
      typeof value === 'object' && value !== null
        ? ((value as Record<string, unknown>)[discProp] as string | undefined)
        : undefined;

    const selectedSchema = currentType
      ? resolveRef({ $ref: mapping[currentType] }, rootSchema)
      : undefined;

    const handleTypeChange = (newType: string) => {
      const newSchema = resolveRef({ $ref: mapping[newType] }, rootSchema);
      const defaults =
        (extractDefaults(newSchema, rootSchema) as Record<string, unknown>) ??
        {};
      onChange({ ...defaults, [discProp]: newType });
    };

    return (
      <div className="flex flex-col gap-3">
        <DialSelect
          options={options}
          value={currentType}
          placeholder="Select type…"
          onChange={(next) => {
            const val = typeof next === 'string' ? next : next[0];
            if (val) handleTypeChange(val);
          }}
        />
        {selectedSchema && (
          <div className="pl-3 border-l-2 border-border-secondary">
            <SchemaObjectEditor
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
  }

  const oneOfSchemas = schema.oneOf ?? [];
  const options = oneOfSchemas.map((s, i) => {
    const resolved = resolveRef(s, rootSchema);
    return { value: String(i), label: resolved.title ?? `Option ${i + 1}` };
  });

  const detectIndex = (): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (let i = 0; i < oneOfSchemas.length; i++) {
        const r = resolveRef(oneOfSchemas[i], rootSchema);
        if (r.required?.every((k) => k in (value as Record<string, unknown>)))
          return i;
      }
    }
    return 0;
  };

  const currentIndex = detectIndex();

  const handleIndexChange = (idx: number) => {
    const newSchema = resolveRef(oneOfSchemas[idx], rootSchema);
    const defaults = extractDefaults(newSchema, rootSchema);
    onChange(defaults ?? null);
  };

  const selectedSchema = oneOfSchemas[currentIndex];

  return (
    <div className="flex flex-col gap-3">
      <DialSelect
        options={options}
        value={String(currentIndex)}
        onChange={(next) => {
          const val = typeof next === 'string' ? next : next[0];
          handleIndexChange(Number(val));
        }}
      />
      {selectedSchema && (
        <div className="pl-3 border-l-2 border-border-secondary">
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
