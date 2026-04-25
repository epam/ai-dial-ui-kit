import { type FC, useEffect, useMemo, useState } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import type { DialSchemeRendererProps } from './types';
import { SchemaRendererContext } from './context';
import {
  resolveRef,
  extractDefaults,
  buildSummary,
  validateRequired,
  toFieldLabel,
} from './utils';
import { SchemaSection } from './components/SchemaSection';
import { SchemaFieldContent } from './components/SchemaFieldContent';

export const DialSchemeRenderer: FC<DialSchemeRendererProps> = ({
  schema,
  defaultValue,
  className,
  onChange,
  onPropertyChange,
  onDefaultValues,
}) => {
  const initialValue = useMemo<Record<string, unknown>>(() => {
    if (defaultValue) return defaultValue;
    return (extractDefaults(schema, schema) as Record<string, unknown>) ?? {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [value, setValue] = useState<Record<string, unknown>>(initialValue);

  useEffect(() => {
    onDefaultValues?.(initialValue);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePropertyChange = (key: string, newVal: unknown) => {
    const updated = { ...value, [key]: newVal };
    setValue(updated);
    onChange?.(updated);
    onPropertyChange?.(key, newVal);
  };

  const topLevelProperties = Object.entries(schema.properties ?? {});
  const topLevelRequired = schema.required ?? [];

  return (
    <SchemaRendererContext.Provider value={{ rootSchema: schema }}>
      <div className={mergeClasses('flex flex-col gap-4', className)}>
        {topLevelProperties.map(([key, propSchema]) => {
          const resolved = resolveRef(propSchema, schema);
          const propLabel =
            resolved.title ?? propSchema.title ?? toFieldLabel(key);
          const isRequired = topLevelRequired.includes(key);
          const propValue = value[key];
          const summary = buildSummary(propValue, resolved, schema);
          const errors = validateRequired(propValue, resolved, schema, key);

          return (
            <SchemaSection
              key={key}
              title={propLabel}
              description={resolved.description}
              level={0}
              summary={summary}
              errorCount={
                isRequired && (propValue === undefined || propValue === null)
                  ? Math.max(errors.length, 1)
                  : errors.length
              }
            >
              <SchemaFieldContent
                schema={propSchema}
                value={propValue}
                onChange={(v) => handlePropertyChange(key, v)}
                path={[key]}
                level={1}
                required={isRequired}
              />
            </SchemaSection>
          );
        })}
      </div>
    </SchemaRendererContext.Provider>
  );
};
