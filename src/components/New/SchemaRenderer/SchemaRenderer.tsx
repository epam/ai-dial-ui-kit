import { type FC, useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_SCHEMA_TEXTS } from '@/constants/schema-renderer';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { SchemaRendererVariant } from '@/types/json-schema';
import {
  extractDefaults,
  isMissingRequiredValue,
  resolveRef,
  sortByPropertyOrder,
  toFieldLabel,
  validateRequired,
} from '@/utils/json-schema';
import { mergeClasses } from '@/utils/merge-classes';
import { SchemaField } from './components/SchemaField';
import { SchemaFieldContent } from './components/SchemaFieldContent';
import { SchemaJsonEditor } from './components/SchemaJsonEditor';
import { SchemaSection } from './components/SchemaSection';
import { isPathTouched, SchemaRendererContext } from './context';
import type { SchemaRendererProps } from './types';

const flatHeadingClassName = 'dial-small-semi-text text-primary';

/**
 * Renders a JSON Schema as a form, with collapsible sections, required-field
 * validation and default values.
 * aliases: SchemaRenderer|JsonSchemaForm|SchemaForm
 * Design system 2.0
 *
 * Built only from 2.0 controls: `Input`, `NumberInput`, `PasswordInput`,
 * `Select`, `Switch` and `RadioGroup`. A value the schema does not describe —
 * a key absent from `properties`, or an object with no fixed properties — is
 * edited as raw JSON in a monospace `Textarea`.
 *
 * @example
 * ```tsx
 * <SchemaRenderer
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
 * @param [inputClassName] - Additional classes for the container of every text, number and select field
 * @param [variant=SchemaRendererVariant.Sections] - `Sections` wraps every top-level property in a collapsible card; `Flat` renders primitives as labelled fields; `FlatSections` puts every property under a plain heading
 * @param [skipUntouched=false] - When true, required-field errors appear only after the user has interacted with a field
 * @param [acceptableResourceTypes] - Live options for properties flagged with `dial:resource: true`, keyed by resource type
 * @param [renderField] - Override the rendered control for any field by path; return `defaultElement` to fall back to built-in rendering
 * @param [onChange] - Called with the full form value on every change
 * @param [onPropertyChange] - Called with `(path, value)` for each individual top-level property change
 * @param [onDefaultValues] - Called once on mount with the resolved default values
 */
export const SchemaRenderer: FC<SchemaRendererProps> = ({
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
  acceptableResourceTypes,
}) => {
  const mergedTexts = useMemo(
    () => ({ ...DEFAULT_SCHEMA_TEXTS, ...texts }),
    [texts],
  );

  // computed once: the provided defaultValue, or the defaults the schema declares
  const initialValue = useMemo<Record<string, unknown>>(() => {
    if (defaultValue) return defaultValue;
    return (extractDefaults(schema, schema) as Record<string, unknown>) ?? {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [value, setValue] = useState<Record<string, unknown>>(initialValue);
  const [touchedPaths, setTouchedPaths] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const markTouched = useCallback((path: string) => {
    setTouchedPaths((prev) =>
      prev.has(path) ? prev : new Set([...prev, path]),
    );
  }, []);

  // fired once on mount to hand the default values to the parent
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
        acceptableResourceTypes,
        renderField,
        touchedPaths,
        markTouched,
        skipUntouched,
      }}
    >
      <div
        className={mergeClasses(
          'flex flex-col gap-4',
          className,
          DIAL_KIT_CLASS.schemaRenderer,
        )}
      >
        {topLevelProperties.map(([key, propSchema]) => {
          const resolved = resolveRef(propSchema, schema);
          const propLabel =
            resolved.title ?? propSchema.title ?? toFieldLabel(key);
          const isRequired = topLevelRequired.includes(key);
          const propValue = value[key];
          const handleChange = (v: unknown) => handlePropertyChange(key, v);

          if (variant === SchemaRendererVariant.Flat) {
            return (
              <SchemaField
                key={key}
                schema={propSchema}
                value={propValue}
                onChange={handleChange}
                path={[key]}
                level={0}
                required={isRequired}
                label={propLabel}
              />
            );
          }

          if (variant === SchemaRendererVariant.FlatSections) {
            return (
              <section key={key} className="flex flex-col gap-3">
                <h2 className={flatHeadingClassName}>{propLabel}</h2>
                <SchemaFieldContent
                  schema={propSchema}
                  value={propValue}
                  onChange={handleChange}
                  path={[key]}
                  level={0}
                  required={isRequired}
                  ariaLabel={propLabel}
                />
              </section>
            );
          }

          const errors = validateRequired(propValue, resolved, schema, key);
          const errorCount =
            isRequired && isMissingRequiredValue(propValue)
              ? Math.max(errors.length, 1)
              : errors.length;

          return (
            <SchemaSection
              key={key}
              title={propLabel}
              description={resolved.description}
              level={0}
              defaultExpanded={defaultExpanded}
              errorCount={
                isPathTouched(key, touchedPaths, skipUntouched, true)
                  ? errorCount
                  : 0
              }
            >
              <SchemaFieldContent
                schema={propSchema}
                value={propValue}
                onChange={handleChange}
                path={[key]}
                level={1}
                required={isRequired}
                ariaLabel={propLabel}
              />
            </SchemaSection>
          );
        })}

        {additionalPropertyKeys.map((key) => {
          const propLabel = toFieldLabel(key);
          const editor = (
            <SchemaJsonEditor
              value={value[key]}
              onChange={(v) => handlePropertyChange(key, v)}
              ariaLabel={propLabel}
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
            <section key={key} className="flex flex-col gap-3">
              <h2 className={flatHeadingClassName}>{propLabel}</h2>
              {editor}
            </section>
          );
        })}
      </div>
    </SchemaRendererContext.Provider>
  );
};
