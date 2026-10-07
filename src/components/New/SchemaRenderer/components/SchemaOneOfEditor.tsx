import { type FC, useId } from 'react';

import { RadioGroup } from '@/components/New/RadioGroup/RadioGroup';
import { Select } from '@/components/New/Select/Select';
import type { JsonSchemaDef } from '@/models/json-schema';
import { SchemaDisplayMode, SchemaOrientation } from '@/types/json-schema';
import { RadioGroupOrientation } from '@/types/radio-group';
import {
  extractDefaults,
  getOptionLabel,
  resolveRef,
} from '@/utils/json-schema';
import { useSchemaContext } from '../context';
import { SchemaFieldContent } from './SchemaFieldContent';
import { SchemaObjectEditor } from './SchemaObjectEditor';

export interface SchemaOneOfEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
  ariaLabel?: string;
}

const toSingleValue = (next: string | string[]): string | undefined =>
  typeof next === 'string' ? next : next[0];

/** A variant schema without its discriminator property, which the radio already shows. */
const withoutProperty = (
  schema: JsonSchemaDef,
  property: string,
): JsonSchemaDef => {
  const { [property]: __omitted, ...visibleProperties } =
    schema.properties ?? {};
  return { ...schema, properties: visibleProperties };
};

/**
 * Renders a `oneOf` schema field as a type selector with the selected variant's editor.
 * aliases: OneOfSchemaEditor|SchemaDiscriminatorEditor
 * Design system 2.0
 *
 * The selector is a select by default, or a radio group with
 * `discriminatorDisplay: 'radio'`. A column radio group reveals the variant's
 * editor under its own option; a row one shows it below the whole row.
 *
 * @example
 * ```tsx
 * <SchemaOneOfEditor
 *   schema={{ oneOf: [...], discriminator: { propertyName: 'type', mapping: {...} } }}
 *   value={{ type: 'foo' }}
 *   onChange={(v) => console.log(v)}
 *   path={['config']}
 *   level={1}
 *   ariaLabel="Provider"
 * />
 * ```
 *
 * @param schema - The JSON Schema definition containing a `oneOf` array and optional `discriminator`
 * @param value - Current field value
 * @param onChange - Called with the new value when the selected type or sub-value changes
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child editor components
 * @param [ariaLabel] - Accessible name of the type selector; defaults to the select-type placeholder
 */
export const SchemaOneOfEditor: FC<SchemaOneOfEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
  ariaLabel,
}) => {
  const { rootSchema, texts, readonly = false } = useSchemaContext();
  const radioGroupId = useId();
  const selectorLabel = ariaLabel ?? texts.selectTypePlaceholder;
  const isRadio = schema.discriminatorDisplay === SchemaDisplayMode.Radio;
  const discriminator = schema.discriminator;

  if (discriminator) {
    const discProp = discriminator.propertyName;
    const mapping = discriminator.mapping;
    const resolveVariant = (key: string) =>
      resolveRef({ $ref: mapping[key] }, rootSchema);

    const currentType =
      typeof value === 'object' && value !== null
        ? ((value as Record<string, unknown>)[discProp] as string | undefined)
        : undefined;
    const selectedSchema = currentType
      ? resolveVariant(currentType)
      : undefined;

    const handleTypeChange = (newType: string) => {
      const defaults =
        (extractDefaults(resolveVariant(newType), rootSchema) as Record<
          string,
          unknown
        >) ?? {};
      onChange({ ...defaults, [discProp]: newType });
    };

    if (isRadio) {
      const isRow = schema.discriminatorOrientation === SchemaOrientation.Row;
      const renderVariantEditor = (variantSchema: JsonSchemaDef) => (
        <SchemaObjectEditor
          schema={withoutProperty(variantSchema, discProp)}
          value={value}
          onChange={onChange}
          path={path}
          level={level}
        />
      );

      const group = (
        <RadioGroup
          id={radioGroupId}
          ariaLabel={selectorLabel}
          value={currentType}
          onChange={handleTypeChange}
          disabled={readonly}
          orientation={
            isRow ? RadioGroupOrientation.Row : RadioGroupOrientation.Column
          }
          items={Object.keys(mapping).map((key) => {
            const variantSchema = resolveVariant(key);
            return {
              value: key,
              label: variantSchema.title ?? key,
              content: isRow ? undefined : renderVariantEditor(variantSchema),
            };
          })}
        />
      );

      if (!isRow) return group;

      return (
        <div className="flex flex-col gap-3">
          {group}
          {selectedSchema && renderVariantEditor(selectedSchema)}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <Select
          ariaLabel={selectorLabel}
          options={Object.keys(mapping).map((key) => ({
            value: key,
            label: key,
          }))}
          value={currentType}
          placeholder={texts.selectTypePlaceholder}
          disabled={readonly}
          onChange={(next) => {
            const val = toSingleValue(next);
            if (val) handleTypeChange(val);
          }}
          className="max-w-[280px]"
        />
        {selectedSchema && (
          <div className="pl-3">
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
    if (typeof value !== 'object' || value === null || Array.isArray(value))
      return 0;
    const index = oneOfSchemas.findIndex((s) =>
      resolveRef(s, rootSchema).required?.every(
        (k) => k in (value as Record<string, unknown>),
      ),
    );
    return index >= 0 ? index : 0;
  };

  const currentIndex = detectIndex();
  const selectedSchema = oneOfSchemas[currentIndex];

  const handleIndexChange = (idx: number) => {
    const defaults = extractDefaults(
      resolveRef(oneOfSchemas[idx], rootSchema),
      rootSchema,
    );
    onChange(defaults ?? null);
  };

  if (isRadio) {
    return (
      <RadioGroup
        id={radioGroupId}
        ariaLabel={selectorLabel}
        value={String(currentIndex)}
        onChange={(next) => handleIndexChange(Number(next))}
        disabled={readonly}
        items={oneOfSchemas.map((s, i) => ({
          value: String(i),
          label: getOptionLabel(s, rootSchema) ?? `Option ${i + 1}`,
          content: (
            <SchemaFieldContent
              schema={resolveRef(s, rootSchema)}
              value={value}
              onChange={onChange}
              path={path}
              level={level}
              ariaLabel={ariaLabel}
            />
          ),
        }))}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Select
        ariaLabel={selectorLabel}
        options={oneOfSchemas.map((s, i) => ({
          value: String(i),
          label: resolveRef(s, rootSchema).title ?? `Option ${i + 1}`,
        }))}
        value={String(currentIndex)}
        disabled={readonly}
        onChange={(next) => handleIndexChange(Number(toSingleValue(next)))}
        className="max-w-[280px]"
      />
      {selectedSchema && (
        <div className="border-l-2 border-tertiary pl-3">
          <SchemaFieldContent
            schema={selectedSchema}
            value={value}
            onChange={onChange}
            path={path}
            level={level}
            ariaLabel={ariaLabel}
          />
        </div>
      )}
    </div>
  );
};
