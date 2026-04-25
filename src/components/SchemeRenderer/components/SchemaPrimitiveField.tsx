import { type FC, useId } from 'react';
import { DialInput } from '@/components/Input/Input';
import { DialNumberInput } from '@/components/NumberInput/NumberInput';
import { DialSwitch } from '@/components/Switch/Switch';
import { DialSelect } from '@/components/Select/Select';
import type { JsonSchemaDef } from '../types';

export interface SchemaPrimitiveFieldProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  invalid?: boolean;
}

export const SchemaPrimitiveField: FC<SchemaPrimitiveFieldProps> = ({
  schema,
  value,
  onChange,
  invalid,
}) => {
  const switchId = useId();
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
        value={
          value !== undefined && value !== null ? String(value) : undefined
        }
        invalid={invalid}
        onChange={(next) => onChange(typeof next === 'string' ? next : next[0])}
        placeholder="Select an option…"
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
        placeholder="Enter a whole number…"
      />
    );
  }

  if (schema.type === 'number') {
    return (
      <DialNumberInput
        value={value !== undefined && value !== null ? String(value) : ''}
        invalid={invalid}
        onChange={(v) => onChange(v !== undefined ? Number(v) : undefined)}
        placeholder="Enter a number…"
      />
    );
  }

  return (
    <DialInput
      value={value !== undefined && value !== null ? String(value) : ''}
      invalid={invalid}
      onChange={(v) => onChange(v ?? undefined)}
      placeholder="Enter a value…"
    />
  );
};
