import type { FC } from 'react';

import { Input } from '@/components/New/Input/Input';
import { NumberInput } from '@/components/New/NumberInput/NumberInput';
import { PasswordInput } from '@/components/New/PasswordInput/PasswordInput';
import { RadioGroup } from '@/components/New/RadioGroup/RadioGroup';
import { Select } from '@/components/New/Select/Select';
import { Switch } from '@/components/New/Switch/Switch';
import type { JsonSchemaDef } from '@/models/json-schema';
import {
  JsonSchemaType,
  SchemaDisplayMode,
  SchemaOrientation,
} from '@/types/json-schema';
import { RadioGroupOrientation } from '@/types/radio-group';
import { useSchemaContext } from '../context';

export interface SchemaPrimitiveFieldProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  invalid?: boolean;
  id?: string;
  ariaLabel?: string;
}

const toSingleValue = (next: string | string[]): string | undefined =>
  typeof next === 'string' ? next : next[0];

const toInputValue = (value: unknown): string =>
  value !== undefined && value !== null ? String(value) : '';

const toNumber = (next?: number | string): number | undefined =>
  next !== undefined ? Number(next) : undefined;

/**
 * Renders a single primitive schema field: string, integer, number, boolean, enum, or const.
 * - `dial:resource` with `acceptableResourceTypes` → select over the live resource options
 * - `isProtected: true` → masked password input
 * - `enum` + `enumDisplay: 'radio'` → radio group (`enumOrientation: 'row'` lays it out horizontally)
 * - `enum` without `enumDisplay` → select
 * - `const` → disabled read-only input
 * aliases: SchemaInputField|PrimitiveSchemaField
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <SchemaPrimitiveField
 *   schema={{ type: 'string', enum: ['a', 'b'], enumDisplay: 'radio', enumOrientation: 'row' }}
 *   value="a"
 *   onChange={(v) => console.log(v)}
 *   ariaLabel="Mode"
 * />
 * ```
 *
 * @param schema - The resolved JSON Schema definition; supports `isProtected`, `enumDisplay`, `enumOrientation`
 * @param value - Current field value
 * @param onChange - Called with the new value when the field changes
 * @param [invalid] - Whether the field has a validation error (applies error styling)
 * @param [id] - Id of the control, for a visible label to point at
 * @param [ariaLabel] - Accessible name of the control
 */
export const SchemaPrimitiveField: FC<SchemaPrimitiveFieldProps> = ({
  schema,
  value,
  onChange,
  invalid,
  id,
  ariaLabel,
}) => {
  const {
    texts,
    readonly = false,
    inputClassName,
    acceptableResourceTypes,
  } = useSchemaContext();
  const isConst = schema.const !== undefined;
  const enumValues = Array.isArray(schema.enum) ? schema.enum : [];
  const hasEnum = enumValues.length > 0;

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
      <Select
        id={id}
        ariaLabel={ariaLabel}
        options={resourceOptions}
        value={value != null ? String(value) : undefined}
        invalid={invalid}
        disabled={readonly}
        onChange={(next) => onChange(toSingleValue(next))}
        placeholder={texts.enumSelectPlaceholder}
        className={inputClassName}
      />
    );
  }

  if (isConst) {
    return (
      <Input
        id={id}
        aria-label={ariaLabel}
        value={String(schema.const ?? '')}
        disabled
        containerClassName={inputClassName}
      />
    );
  }

  if (hasEnum && schema.enumDisplay === SchemaDisplayMode.Radio) {
    return (
      <RadioGroup
        id={id}
        ariaLabel={ariaLabel}
        items={enumValues.map((v) => ({ value: String(v), label: String(v) }))}
        value={value != null ? String(value) : undefined}
        orientation={
          schema.enumOrientation === SchemaOrientation.Row
            ? RadioGroupOrientation.Row
            : RadioGroupOrientation.Column
        }
        disabled={readonly}
        onChange={(selected) => onChange(selected)}
      />
    );
  }

  if (hasEnum) {
    return (
      <Select
        id={id}
        ariaLabel={ariaLabel}
        options={enumValues.map((v) => ({
          value: String(v),
          label: String(v),
        }))}
        value={value != null ? String(value) : undefined}
        invalid={invalid}
        disabled={readonly}
        onChange={(next) => onChange(toSingleValue(next))}
        placeholder={texts.enumSelectPlaceholder}
        className={inputClassName}
      />
    );
  }

  switch (schema.type) {
    case JsonSchemaType.Boolean:
      return (
        <Switch
          id={id}
          aria-label={ariaLabel}
          isOn={Boolean(value)}
          disabled={readonly}
          onChange={(v) => onChange(v)}
        />
      );
    case JsonSchemaType.Integer:
    case JsonSchemaType.Number:
      return (
        <NumberInput
          id={id}
          aria-label={ariaLabel}
          integer={schema.type === JsonSchemaType.Integer}
          value={toInputValue(value)}
          invalid={invalid}
          disabled={readonly}
          onChange={(v) => onChange(toNumber(v))}
          placeholder={
            schema.type === JsonSchemaType.Integer
              ? texts.integerInputPlaceholder
              : texts.numberInputPlaceholder
          }
          containerClassName={inputClassName}
        />
      );
    default:
      if (schema.isProtected) {
        return (
          <PasswordInput
            id={id}
            aria-label={ariaLabel}
            value={toInputValue(value)}
            invalid={invalid}
            disabled={readonly}
            onChange={(v) => onChange(v ?? undefined)}
            placeholder={texts.stringInputPlaceholder}
            containerClassName={inputClassName}
          />
        );
      }
      return (
        <Input
          id={id}
          aria-label={ariaLabel}
          value={toInputValue(value)}
          invalid={invalid}
          disabled={readonly}
          onChange={(v) => onChange(v ?? undefined)}
          placeholder={texts.stringInputPlaceholder}
          containerClassName={inputClassName}
        />
      );
  }
};
