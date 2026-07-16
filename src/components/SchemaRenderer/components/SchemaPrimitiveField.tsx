import { type FC, useId } from 'react';
import { DialInput } from '@/components/Input/Input';
import { DialPasswordInput } from '@/components/PasswordInput/PasswordInput';
import { DialNumberInput } from '@/components/NumberInput/NumberInput';
import { DialSwitch } from '@/components/Switch/Switch';
import { DialSelect } from '@/components/Select/Select';
import { DialRadioButton } from '@/components/RadioButton/RadioButton';
import {
  JsonSchemaType,
  SchemaDisplayMode,
  SchemaOrientation,
} from '@/components/SchemaRenderer/types';
import type { JsonSchemaDef } from '@/components/SchemaRenderer/types';
import { useSchemaContext } from '@/components/SchemaRenderer/context';

export interface SchemaPrimitiveFieldProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  invalid?: boolean;
}

/**
 * Renders a single primitive schema field: string, integer, number, boolean, enum, or const.
 * - `isProtected: true` → masked password input
 * - `enum` + `enumDisplay: 'radio'` → radio buttons (`enumOrientation: 'row'` lays them horizontally)
 * - `enum` without `enumDisplay` → select dropdown
 * - `const` → disabled read-only input
 * aliases: SchemaInputField|PrimitiveSchemaField
 *
 * @example
 * ```tsx
 * <SchemaPrimitiveField
 *   schema={{ type: 'string', enum: ['a', 'b'], enumDisplay: 'radio', enumOrientation: 'row' }}
 *   value="a"
 *   onChange={(v) => console.log(v)}
 * />
 * ```
 *
 * @param schema - The resolved JSON Schema definition; supports `isProtected`, `enumDisplay`, `enumOrientation`
 * @param value - Current field value
 * @param onChange - Called with the new value when the field changes
 * @param [invalid] - Whether the field has a validation error (applies error styling)
 */
export const SchemaPrimitiveField: FC<SchemaPrimitiveFieldProps> = ({
  schema,
  value,
  onChange,
  invalid,
}) => {
  const switchId = useId();
  const {
    texts,
    readonly = false,
    inputClassName,
    acceptableResourceTypes,
  } = useSchemaContext();
  const isConst = schema.const !== undefined;
  const hasEnum = Array.isArray(schema.enum) && schema.enum.length > 0;

  const isResourceField =
    schema['dial:resource'] === true &&
    Array.isArray(schema.acceptableResourceTypes) &&
    schema.acceptableResourceTypes.length > 0;

  if (
    isResourceField &&
    (schema.type === JsonSchemaType.String || schema.type === undefined)
  ) {
    const resourceOptions = (schema.acceptableResourceTypes ?? []).flatMap(
      (resourceType) => {
        const entries = acceptableResourceTypes?.[resourceType];
        return Array.isArray(entries)
          ? entries.map((entry) => {
              const strVal = String(entry);
              return { value: strVal, label: strVal };
            })
          : [];
      },
    );

    return (
      <DialSelect
        options={resourceOptions}
        value={value != null ? String(value) : undefined}
        invalid={invalid}
        disabled={readonly}
        onChange={(next) => onChange(typeof next === 'string' ? next : next[0])}
        placeholder={texts.enumSelectPlaceholder}
        className={inputClassName}
      />
    );
  }

  if (isConst) {
    return (
      <DialInput
        value={String(schema.const ?? '')}
        disabled
        onChange={undefined}
        className="opacity-60"
      />
    );
  }

  if (hasEnum && schema.enumDisplay === SchemaDisplayMode.Radio) {
    const isRow = schema.enumOrientation === SchemaOrientation.Row;
    return (
      <div
        role="radiogroup"
        className={
          isRow
            ? 'flex flex-row flex-wrap gap-x-4 gap-y-2'
            : 'flex flex-col gap-2'
        }
      >
        {(schema.enum as unknown[]).map((v) => {
          const strVal = String(v);
          return (
            <DialRadioButton
              key={strVal}
              name={switchId}
              value={strVal}
              inputId={`${switchId}-${strVal}`}
              label={strVal}
              checked={value != null ? String(value) === strVal : false}
              disabled={readonly}
              onChange={(selected) => onChange(selected)}
            />
          );
        })}
      </div>
    );
  }

  if (hasEnum) {
    const options = (schema.enum as unknown[]).map((v) => ({
      value: String(v),
      label: String(v),
    }));
    return (
      <DialSelect
        options={options}
        value={value != null ? String(value) : undefined}
        invalid={invalid}
        disabled={readonly}
        onChange={(next) => onChange(typeof next === 'string' ? next : next[0])}
        placeholder={texts.enumSelectPlaceholder}
      />
    );
  }

  switch (schema.type) {
    case JsonSchemaType.Boolean:
      return (
        <DialSwitch
          switchId={switchId}
          isOn={Boolean(value)}
          disabled={readonly}
          onChange={(v) => onChange(v)}
        />
      );
    case JsonSchemaType.Integer:
      return (
        <DialNumberInput
          integer
          value={value !== undefined && value !== null ? String(value) : ''}
          invalid={invalid}
          disabled={readonly}
          onChange={(v) => onChange(v !== undefined ? Number(v) : undefined)}
          placeholder={texts.integerInputPlaceholder}
          containerClassName={inputClassName}
        />
      );
    case JsonSchemaType.Number:
      return (
        <DialNumberInput
          value={value !== undefined && value !== null ? String(value) : ''}
          invalid={invalid}
          disabled={readonly}
          onChange={(v) => onChange(v !== undefined ? Number(v) : undefined)}
          placeholder={texts.numberInputPlaceholder}
          containerClassName={inputClassName}
        />
      );
    default:
      if (schema.isProtected) {
        return (
          <DialPasswordInput
            value={value !== undefined && value !== null ? String(value) : ''}
            invalid={invalid}
            disabled={readonly}
            onChange={(v) => onChange(v ?? undefined)}
            placeholder={texts.stringInputPlaceholder}
            containerClassName={inputClassName}
          />
        );
      }
      return (
        <DialInput
          value={value !== undefined && value !== null ? String(value) : ''}
          invalid={invalid}
          disabled={readonly}
          onChange={(v) => onChange(v ?? undefined)}
          placeholder={texts.stringInputPlaceholder}
          containerClassName={inputClassName}
        />
      );
  }
};
