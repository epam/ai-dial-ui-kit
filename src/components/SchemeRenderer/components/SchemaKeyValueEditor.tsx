import { type FC, useState } from 'react';
import { IconPlus, IconX } from '@tabler/icons-react';
import { DialInput } from '@/components/Input/Input';
import { DialGhostButton } from '@/components/Button/ButtonWrappers';
import type { JsonSchemaDef } from '../types';
import { SchemaPrimitiveField } from './SchemaPrimitiveField';

interface KeyValuePair {
  id: string;
  key: string;
  value: unknown;
}

const createPair = (key: string, value: unknown): KeyValuePair => ({
  id: Math.random().toString(36).slice(2),
  key,
  value,
});

interface KeyValueRowProps {
  pairKey: string;
  pairValue: unknown;
  valueSchema: JsonSchemaDef;
  onKeyChange: (key: string) => void;
  onValueChange: (value: unknown) => void;
  onRemove: () => void;
}

const KeyValueRow: FC<KeyValueRowProps> = ({
  pairKey,
  pairValue,
  valueSchema,
  onKeyChange,
  onValueChange,
  onRemove,
}) => {
  const [keyDraft, setKeyDraft] = useState(pairKey);

  return (
    <div className="flex gap-2 items-center">
      <div className="w-2/5 min-w-0">
        <DialInput
          value={keyDraft}
          onChange={(v) => setKeyDraft(v ?? '')}
          onBlur={() => {
            if (keyDraft !== pairKey) onKeyChange(keyDraft);
          }}
          placeholder="Key…"
        />
      </div>
      <div className="flex-1 min-w-0">
        <SchemaPrimitiveField
          schema={valueSchema}
          value={pairValue}
          onChange={onValueChange}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 text-text-secondary hover:text-error transition-colors rounded p-1"
        aria-label="Remove field"
      >
        <IconX size={14} stroke={2} />
      </button>
    </div>
  );
};

export interface SchemaKeyValueEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
}

export const SchemaKeyValueEditor: FC<SchemaKeyValueEditorProps> = ({
  schema,
  value,
  onChange,
}) => {
  const valueSchema: JsonSchemaDef =
    schema.additionalProperties === true || schema.additionalProperties == null
      ? { type: 'string' }
      : typeof schema.additionalProperties === 'object'
        ? (schema.additionalProperties as JsonSchemaDef)
        : { type: 'string' };

  const [pairs, setPairs] = useState<KeyValuePair[]>(() =>
    Object.entries((value as Record<string, unknown>) ?? {}).map(([k, v]) =>
      createPair(k, v),
    ),
  );

  const toObject = (p: KeyValuePair[]) =>
    Object.fromEntries(
      p.filter((pair) => pair.key !== '').map((pair) => [pair.key, pair.value]),
    );

  const handleKeyChange = (idx: number, newKey: string) => {
    const updated = pairs.map((p, i) =>
      i === idx ? { ...p, key: newKey } : p,
    );
    setPairs(updated);
    onChange(toObject(updated));
  };

  const handleValueChange = (idx: number, newValue: unknown) => {
    const updated = pairs.map((p, i) =>
      i === idx ? { ...p, value: newValue } : p,
    );
    setPairs(updated);
    onChange(toObject(updated));
  };

  const handleAdd = () => {
    setPairs((prev) => [...prev, createPair('', '')]);
  };

  const handleRemove = (idx: number) => {
    const updated = pairs.filter((_, i) => i !== idx);
    setPairs(updated);
    onChange(toObject(updated));
  };

  return (
    <div className="flex flex-col gap-2">
      {pairs.length === 0 && (
        <p className="dial-tiny text-text-secondary italic">
          No fields yet. Add one below.
        </p>
      )}

      {pairs.length > 0 && (
        <div className="flex gap-2 mb-1 pr-7">
          <span className="w-2/5 dial-tiny text-text-secondary font-medium">
            Key
          </span>
          <span className="flex-1 dial-tiny text-text-secondary font-medium">
            Value
          </span>
        </div>
      )}

      {pairs.map((pair, i) => (
        <KeyValueRow
          key={pair.id}
          pairKey={pair.key}
          pairValue={pair.value}
          valueSchema={valueSchema}
          onKeyChange={(k) => handleKeyChange(i, k)}
          onValueChange={(v) => handleValueChange(i, v)}
          onRemove={() => handleRemove(i)}
        />
      ))}

      <div className="pt-1">
        <DialGhostButton
          label="Add Field"
          iconBefore={<IconPlus size={16} stroke={2} />}
          onClick={handleAdd}
        />
      </div>
    </div>
  );
};
