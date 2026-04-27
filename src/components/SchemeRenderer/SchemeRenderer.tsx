import { type FC, useEffect, useMemo, useState } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import type { DialSchemeRendererProps } from '@/components/SchemeRenderer/types';
import { DEFAULT_SCHEMA_TEXTS } from '@/components/SchemeRenderer/types';
import { SchemaRendererContext } from '@/components/SchemeRenderer/context';
import {
  resolveRef,
  extractDefaults,
  buildSummary,
  validateRequired,
  toFieldLabel,
} from '@/components/SchemeRenderer/utils';
import { SchemaSection } from '@/components/SchemeRenderer/components/SchemaSection';
import { SchemaFieldContent } from '@/components/SchemeRenderer/components/SchemaFieldContent';

/**
 * Renders a JSON Schema as a form UI with collapsible sections, validation, and default values.
 * aliases: SchemaRenderer|JsonSchemaForm
 *
 * @example
 * ```tsx
 * <DialSchemeRenderer
 *   schema={mySchema}
 *   onChange={(v) => console.log(v)}
 *   onDefaultValues={(defaults) => console.log(defaults)}
 * />
 * ```
 *
 * @param schema - The root JSON Schema to render
 * @param [defaultValue] - Initial form value; if omitted, defaults are extracted from schema
 * @param [texts] - Override any user-visible strings rendered by the component
 * @param [className] - Additional CSS classes for the root container
 * @param [onChange] - Called with the full form value on every change
 * @param [onPropertyChange] - Called with `(path, value)` for each individual property change
 * @param [onDefaultValues] - Called once on mount with the resolved default values
 */
export const DialSchemeRenderer: FC<DialSchemeRendererProps> = ({
  schema,
  defaultValue,
  texts,
  className,
  onChange,
  onPropertyChange,
  onDefaultValues,
}) => {
  const mergedTexts = useMemo(
    () => ({ ...DEFAULT_SCHEMA_TEXTS, ...texts }),
    [texts],
  );

  // fired once to compute initial form values, either from provided defaultValue or extracted from schema
  const initialValue = useMemo<Record<string, unknown>>(() => {
    if (defaultValue) return defaultValue;
    return (extractDefaults(schema, schema) as Record<string, unknown>) ?? {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [value, setValue] = useState<Record<string, unknown>>(initialValue);

  // fired once on mount to provide default values to parent
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
    <SchemaRendererContext.Provider
      value={{ rootSchema: schema, texts: mergedTexts }}
    >
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
