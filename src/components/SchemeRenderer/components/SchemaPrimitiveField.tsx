import { type FC, useId } from 'react';
import { DialInput } from '@/components/Input/Input';
import { DialNumberInput } from '@/components/NumberInput/NumberInput';
import { DialSwitch } from '@/components/Switch/Switch';
import { DialSelect } from '@/components/Select/Select';
import type { JsonSchemaDef } from '@/components/SchemeRenderer/types';
import { useSchemaContext } from '@/components/SchemeRenderer/context';

export interface SchemaPrimitiveFieldProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  invalid?: boolean;
}

/**
 * Renders a single primitive schema field: string, integer, number, boolean, enum, or const.
 * aliases: SchemaInputField|PrimitiveSchemaField
 *
 * @example
 * ```tsx
 * <SchemaPrimitiveField
 *   schema={{ type: 'string', enum: ['a', 'b'] }}
 *   value="a"
 *   onChange={(v) => console.log(v)}
 * />
 * ```
 *
 * @param schema - The resolved JSON Schema definition for this field
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
  const { texts } = useSchemaContext();
  const isConst = schema.const !== undefined;
  const hasEnum = Array.isArray(schema.enum) && schema.enum.length > 0;

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
        onChange={(next) => onChange(typeof next === 'string' ? next : next[0])}
        placeholder={texts.enumSelectPlaceholder}
      />
    );
  }

  if (schema.type === 'boolean') {
    return (
      <DialSwitch
        switchId={switchId}
        isOn={Boolean(value)}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (schema.type === 'integer') {
    return (
      <DialNumberInput
        integer
        value={value !== undefined && value !== null ? String(value) : ''}
        invalid={invalid}
        onChange={(v) => onChange(v !== undefined ? Number(v) : undefined)}
        placeholder={texts.integerInputPlaceholder}
      />
    );
  }

  if (schema.type === 'number') {
    return (
      <DialNumberInput
        value={value !== undefined && value !== null ? String(value) : ''}
        invalid={invalid}
        onChange={(v) => onChange(v !== undefined ? Number(v) : undefined)}
        placeholder={texts.numberInputPlaceholder}
      />
    );
  }

  return (
    <DialInput
      value={value !== undefined && value !== null ? String(value) : ''}
      invalid={invalid}
      onChange={(v) => onChange(v ?? undefined)}
      placeholder={texts.stringInputPlaceholder}
    />
  );
};
