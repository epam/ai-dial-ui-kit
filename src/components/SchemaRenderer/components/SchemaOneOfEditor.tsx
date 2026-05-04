import { type FC, useId } from 'react';
import { DialSelect } from '@/components/Select/Select';
import { DialRadioButton } from '@/components/RadioButton/RadioButton';
import {
  SchemaDisplayMode,
  SchemaOrientation,
} from '@/components/SchemaRenderer/types';
import type { JsonSchemaDef } from '@/components/SchemaRenderer/types';
import { useSchemaContext } from '@/components/SchemaRenderer/context';
import {
  resolveRef,
  extractDefaults,
  getOptionLabel,
} from '@/components/SchemaRenderer/utils';
import { SchemaObjectEditor } from './SchemaObjectEditor';
import { SchemaFieldContent } from './SchemaFieldContent';

export interface SchemaOneOfEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

/**
 * Renders a `oneOf` schema field as a type-selector dropdown with an inline sub-editor.
 * aliases: OneOfSchemaEditor|SchemaDiscriminatorEditor
 *
 * @example
 * ```tsx
 * <SchemaOneOfEditor
 *   schema={{ oneOf: [...], discriminator: { propertyName: 'type', mapping: {...} } }}
 *   value={{ type: 'foo' }}
 *   onChange={(v) => console.log(v)}
 *   path={['config']}
 *   level={1}
 * />
 * ```
 *
 * @param schema - The JSON Schema definition containing a `oneOf` array and optional `discriminator`
 * @param value - Current field value
 * @param onChange - Called with the new value when the selected type or sub-value changes
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child editor components
 */
export const SchemaOneOfEditor: FC<SchemaOneOfEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
}) => {
  const { rootSchema, texts, readonly = false } = useSchemaContext();
  const radioGroupId = useId();
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

    if (schema.discriminatorDisplay === SchemaDisplayMode.Radio) {
      const isRow = schema.discriminatorOrientation === SchemaOrientation.Row;
      const selectedFilteredSchema = currentType
        ? (() => {
            const optSchema = resolveRef(
              { $ref: mapping[currentType] },
              rootSchema,
            );
            const { [discProp]: __disc, ...visibleProperties } =
              optSchema.properties ?? {};
            return { ...optSchema, properties: visibleProperties };
          })()
        : undefined;

      if (isRow) {
        return (
          <div className="flex flex-col gap-3">
            <div role="radiogroup" className="flex flex-row flex-wrap gap-4">
              {Object.keys(mapping).map((key) => {
                const optSchema = resolveRef(
                  { $ref: mapping[key] },
                  rootSchema,
                );
                return (
                  <DialRadioButton
                    key={key}
                    name={radioGroupId}
                    value={key}
                    inputId={`${radioGroupId}-${key}`}
                    label={optSchema.title ?? key}
                    checked={currentType === key}
                    disabled={readonly}
                    onChange={() => handleTypeChange(key)}
                  />
                );
              })}
            </div>
            {selectedFilteredSchema && (
              <SchemaObjectEditor
                schema={selectedFilteredSchema}
                value={value}
                onChange={onChange}
                path={path}
                level={level}
              />
            )}
          </div>
        );
      }

      return (
        <div role="radiogroup" className="flex flex-col gap-2">
          {Object.keys(mapping).map((key) => {
            const optSchema = resolveRef({ $ref: mapping[key] }, rootSchema);
            const isSelected = currentType === key;
            const { [discProp]: __disc, ...visibleProperties } =
              optSchema.properties ?? {};
            const filteredSchema = {
              ...optSchema,
              properties: visibleProperties,
            };
            return (
              <div key={key} className="flex flex-col">
                <DialRadioButton
                  name={radioGroupId}
                  value={key}
                  inputId={`${radioGroupId}-${key}`}
                  label={optSchema.title ?? key}
                  checked={isSelected}
                  disabled={readonly}
                  onChange={() => handleTypeChange(key)}
                />
                {isSelected && (
                  <div className="ml-6 mt-2">
                    <SchemaObjectEditor
                      schema={filteredSchema}
                      value={value}
                      onChange={onChange}
                      path={path}
                      level={level}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex-1 max-w-[280px]">
          <DialSelect
            options={options}
            value={currentType}
            placeholder={texts.selectTypePlaceholder}
            disabled={readonly}
            onChange={(next) => {
              const val = typeof next === 'string' ? next : next[0];
              if (val) handleTypeChange(val);
            }}
          />
        </div>
        {selectedSchema && (
          <div className="pl-3 border-l-2 border-secondary">
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

  if (schema.discriminatorDisplay === SchemaDisplayMode.Radio) {
    return (
      <div role="radiogroup" className="flex flex-col gap-2">
        {oneOfSchemas.map((s, i) => {
          const resolved = resolveRef(s, rootSchema);
          const label = getOptionLabel(s, rootSchema) ?? `Option ${i + 1}`;
          const isSelected = currentIndex === i;
          return (
            <div key={i} className="flex flex-col">
              <DialRadioButton
                name={radioGroupId}
                value={String(i)}
                inputId={`${radioGroupId}-${i}`}
                label={label}
                checked={isSelected}
                disabled={readonly}
                onChange={() => handleIndexChange(i)}
              />
              {isSelected && resolved && (
                <div className="ml-6 mt-2">
                  <SchemaFieldContent
                    schema={resolved}
                    value={value}
                    onChange={onChange}
                    path={path}
                    level={level}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const options = oneOfSchemas.map((s, i) => {
    const resolved = resolveRef(s, rootSchema);
    return { value: String(i), label: resolved.title ?? `Option ${i + 1}` };
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex-1 max-w-[280px]">
        <DialSelect
          options={options}
          value={String(currentIndex)}
          disabled={readonly}
          onChange={(next) => {
            const val = typeof next === 'string' ? next : next[0];
            handleIndexChange(Number(val));
          }}
        />
      </div>
      {selectedSchema && (
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
