import type { FC } from 'react';
import { DialSelect } from '@/components/Select/Select';
import type { JsonSchemaDef } from '../types';
import { useSchemaContext } from '../context';
import {
  resolveRef,
  getOptionLabel,
  detectAnyOfVariant,
  extractDefaults,
} from '../utils';
import { SchemaFieldContent } from './SchemaFieldContent';

export interface SchemaAnyOfEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

export const SchemaAnyOfEditor: FC<SchemaAnyOfEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
}) => {
  const { rootSchema } = useSchemaContext();
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
      <DialSelect
        options={options}
        value={String(currentIndex)}
        onChange={(next) => {
          const val = typeof next === 'string' ? next : next[0];
          handleChange(Number(val));
        }}
      />
      {!isNull && selectedSchema && (
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
