import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  DEFAULT_SCHEMA_TEXTS,
  SchemaRendererVariant,
} from '@/components/SchemaRenderer/types';
import type { DialSchemaRendererProps } from '@/components/SchemaRenderer/types';
import { SchemaRendererContext } from '@/components/SchemaRenderer/context';
import {
  resolveRef,
  extractDefaults,
  validateRequired,
  toFieldLabel,
  isMissingRequiredValue,
  sortByPropertyOrder,
} from '@/components/SchemaRenderer/utils';
import { SchemaSection } from '@/components/SchemaRenderer/components/SchemaSection';
import { SchemaFieldContent } from '@/components/SchemaRenderer/components/SchemaFieldContent';
import { SchemaField } from '@/components/SchemaRenderer/components/SchemaField';
import { SchemaAdditionalPropertiesEditor } from '@/components/SchemaRenderer/components/SchemaAdditionalPropertiesEditor';

/**
 * Renders a JSON Schema as a form UI with collapsible sections, validation, and default values.
 * aliases: SchemaRenderer|JsonSchemaForm
 * Design system 1.0
 *
 * @example
 * ```tsx
 * <DialSchemaRenderer
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
 * @param [readonly=false] - When true all inputs are disabled; sections remain collapsible
 * @param [defaultExpanded=true] - Initial expanded state for all collapsible sections
 * @param [variant=SchemaRendererVariant.Sections] - `Sections` wraps every top-level property in a collapsible card; `Flat` renders primitives as plain DialFormItem fields
 * @param [renderField] - Override the rendered element for any field by path; return `defaultElement` to fall back to built-in rendering
 * @param [onChange] - Called with the full form value on every change
 * @param [onPropertyChange] - Called with `(path, value)` for each individual property change
 * @param [onDefaultValues] - Called once on mount with the resolved default values
 * @param [jsonEditorTheme] - Theme for the JSON editor shown for value keys absent from the schema
 */
export const DialSchemaRenderer: FC<DialSchemaRendererProps> = ({
  schema,
  defaultValue,
  texts,
  className,
  readonly = false,
  defaultExpanded = true,
  inputClassName,
  variant = SchemaRendererVariant.Sections,
  onChange,
  onPropertyChange,
  onDefaultValues,
  renderField,
  skipUntouched = false,
  jsonEditorTheme,
  acceptableResourceTypes,
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
  const [touchedPaths, setTouchedPaths] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const markTouched = useCallback((path: string) => {
    setTouchedPaths((prev) => {
      if (prev.has(path)) return prev;
      return new Set([...prev, path]);
    });
  }, []);

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

  const schemaPropertyKeys = new Set(Object.keys(schema.properties ?? {}));

  // keys present in the value but absent from the schema's declared properties
  const additionalPropertyKeys = Object.keys(value).filter(
    (key) => !schemaPropertyKeys.has(key),
  );

  const topLevelProperties = sortByPropertyOrder(
    Object.entries(schema.properties ?? {}).filter(
      ([, propSchema]) => !resolveRef(propSchema, schema).isHidden,
    ),
  );
  const topLevelRequired = schema.required ?? [];

  return (
    <SchemaRendererContext.Provider
      value={{
        rootSchema: schema,
        texts: mergedTexts,
        readonly,
        defaultExpanded,
        inputClassName,
        jsonEditorTheme,
        acceptableResourceTypes,
        renderField,
        touchedPaths,
        markTouched,
        skipUntouched,
      }}
    >
      <div className={mergeClasses('flex flex-col gap-4', className)}>
        {topLevelProperties.map(([key, propSchema]) => {
          const resolved = resolveRef(propSchema, schema);
          const propLabel =
            resolved.title ?? propSchema.title ?? toFieldLabel(key);
          const isRequired = topLevelRequired.includes(key);
          const propValue = value[key];

          if (variant === SchemaRendererVariant.Flat) {
            return (
              <SchemaField
                key={key}
                schema={propSchema}
                value={propValue}
                onChange={(v) => handlePropertyChange(key, v)}
                path={[key]}
                level={0}
                required={isRequired}
                label={propLabel}
              />
            );
          }

          if (variant === SchemaRendererVariant.FlatSections) {
            return (
              <div key={key} className="flex flex-col gap-3">
                <h2 className="dial-small-semi-text text-primary">
                  {propLabel}
                </h2>
                <SchemaFieldContent
                  schema={propSchema}
                  value={propValue}
                  onChange={(v) => handlePropertyChange(key, v)}
                  path={[key]}
                  level={0}
                  required={isRequired}
                />
              </div>
            );
          }

          const errors = validateRequired(propValue, resolved, schema, key);
          const prefix = key + '.';
          const isSectionTouched =
            !skipUntouched ||
            touchedPaths.has(key) ||
            [...touchedPaths].some((p) => p.startsWith(prefix));

          return (
            <SchemaSection
              key={key}
              title={propLabel}
              description={resolved.description}
              level={0}
              defaultExpanded={defaultExpanded}
              errorCount={
                isSectionTouched
                  ? isRequired && isMissingRequiredValue(propValue)
                    ? Math.max(errors.length, 1)
                    : errors.length
                  : 0
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
        {additionalPropertyKeys.map((key) => {
          const propLabel = toFieldLabel(key);
          const editor = (
            <SchemaAdditionalPropertiesEditor
              value={value[key]}
              onChange={(v) => handlePropertyChange(key, v)}
              theme={jsonEditorTheme}
            />
          );

          if (variant === SchemaRendererVariant.Sections) {
            return (
              <SchemaSection
                key={key}
                title={propLabel}
                level={0}
                defaultExpanded={defaultExpanded}
              >
                {editor}
              </SchemaSection>
            );
          }

          return (
            <div key={key} className="flex flex-col gap-3">
              <h2 className="dial-small-semi-text text-primary">{propLabel}</h2>
              {editor}
            </div>
          );
        })}
      </div>
    </SchemaRendererContext.Provider>
  );
};
