import { type FC, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { DialInput } from '@/components/Input/Input';
import { DialErrorText } from '@/components/CaptionText/CaptionText';
import { DialGhostButton } from '@/components/Button/ButtonWrappers';
import { DialRemoveButton } from '@/components/RemoveButton/RemoveButton';
import { ElementSize } from '@/types/size';
import {
  JsonSchemaType,
  type JsonSchemaDef,
} from '@/components/SchemaRenderer/types';
import { useSchemaContext } from '@/components/SchemaRenderer/context';
import {
  resolveRef,
  extractDefaults,
  buildSummary,
  validateRequired,
  isObjectType,
  getSchemaDefault,
} from '@/components/SchemaRenderer/utils';
import { SchemaPrimitiveField } from './SchemaPrimitiveField';
import { SchemaSection } from './SchemaSection';
import { SchemaFieldContent } from './SchemaFieldContent';

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

const isComplexValueSchema = (schema: JsonSchemaDef): boolean =>
  Boolean(
    schema.oneOf ||
    schema.anyOf ||
    schema.type === JsonSchemaType.Array ||
    isObjectType(schema),
  );

interface KeyValueRowProps {
  pairId: string;
  pairKey: string;
  pairValue: unknown;
  valueSchema: JsonSchemaDef;
  onKeyChange: (key: string) => void;
  onValueChange: (value: unknown) => void;
  onRemove: () => void;
  keyInputPlaceholder: string;
  removeFieldAriaLabel: string;
  path: string[];
  level: number;
  readonly?: boolean;
  inputClassName?: string;
}

const KeyValueRow: FC<KeyValueRowProps> = ({
  pairId,
  pairKey,
  pairValue,
  valueSchema,
  onKeyChange,
  onValueChange,
  onRemove,
  keyInputPlaceholder,
  removeFieldAriaLabel,
  path,
  level,
  readonly = false,
  inputClassName,
}) => {
  const {
    rootSchema,
    texts,
    defaultExpanded = true,
    touchedPaths = new Set<string>(),
    markTouched = () => {},
    skipUntouched = false,
  } = useSchemaContext();
  const [keyDraft, setKeyDraft] = useState(pairKey);
  const isComplex = isComplexValueSchema(valueSchema);
  const keyTouchedPath = [...path, pairId, 'key'].join('.');
  const isKeyTouched = !skipUntouched || touchedPaths.has(keyTouchedPath);
  const showKeyError = isKeyTouched && pairKey === '';

  const keyRow = (
    <div className="flex gap-2 items-start">
      <div className={isComplex ? 'flex-1 min-w-0' : 'w-2/5 min-w-0'}>
        <DialInput
          value={keyDraft}
          disabled={readonly}
          invalid={showKeyError}
          onChange={(v) => setKeyDraft(v ?? '')}
          onBlur={() => {
            markTouched(keyTouchedPath);
            if (keyDraft !== pairKey) onKeyChange(keyDraft);
          }}
          placeholder={keyInputPlaceholder}
          containerClassName={inputClassName}
        />
        <DialErrorText
          text={
            showKeyError ? `${texts.keyColumnHeader} is required` : undefined
          }
        />
      </div>
      {!isComplex && (
        <div className="flex-1 min-w-0">
          <SchemaPrimitiveField
            schema={valueSchema}
            value={pairValue}
            onChange={onValueChange}
          />
        </div>
      )}
      {!readonly && (
        <DialRemoveButton
          size={ElementSize.Small}
          onClick={onRemove}
          aria-label={removeFieldAriaLabel}
          className="shrink-0 p-1"
        />
      )}
    </div>
  );

  if (!isComplex) return keyRow;

  const entryPath = [...path, pairKey];
  const summary = buildSummary(pairValue, valueSchema, rootSchema);
  const errors = validateRequired(
    pairValue,
    valueSchema,
    rootSchema,
    entryPath.join('.'),
  );

  return (
    <div className="flex flex-col gap-2">
      {keyRow}
      <SchemaSection
        title={pairKey}
        level={level}
        summary={summary}
        errorCount={errors.length + (showKeyError ? 1 : 0)}
        defaultExpanded={defaultExpanded}
      >
        <SchemaFieldContent
          schema={valueSchema}
          value={pairValue}
          onChange={onValueChange}
          path={entryPath}
          level={level + 1}
        />
      </SchemaSection>
    </div>
  );
};

export interface SchemaKeyValueEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

/**
 * Renders an `additionalProperties` object schema as an editable key-value list. Primitive
 * values render inline; object/`oneOf`/array values render as a collapsible section recursing
 * back into `SchemaFieldContent`.
 * aliases: KeyValueSchemaEditor|AdditionalPropertiesEditor
 *
 * @example
 * ```tsx
 * <SchemaKeyValueEditor
 *   schema={{ type: 'object', additionalProperties: { type: 'string' } }}
 *   value={{ foo: 'bar' }}
 *   onChange={(v) => console.log(v)}
 *   path={['metadata']}
 *   level={1}
 * />
 * ```
 *
 * @param schema - The JSON Schema object definition with `additionalProperties`
 * @param value - Current object value (treated as a key-value map)
 * @param onChange - Called with the updated object when pairs are added, removed, or changed
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child section components
 */
export const SchemaKeyValueEditor: FC<SchemaKeyValueEditorProps> = ({
  schema,
  value,
  onChange,
  path,
  level,
}) => {
  const {
    rootSchema,
    texts,
    readonly = false,
    inputClassName,
  } = useSchemaContext();

  const valueSchema: JsonSchemaDef =
    schema.additionalProperties === true || schema.additionalProperties == null
      ? { type: 'string' }
      : typeof schema.additionalProperties === 'object'
        ? resolveRef(schema.additionalProperties as JsonSchemaDef, rootSchema)
        : { type: 'string' };

  const isComplexValue = isComplexValueSchema(valueSchema);

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

  const buildNewValue = (): unknown => {
    if (!isComplexValue) return '';
    return (
      extractDefaults(valueSchema, rootSchema) ?? getSchemaDefault(valueSchema)
    );
  };

  const handleAdd = () => {
    setPairs((prev) => [...prev, createPair('', buildNewValue())]);
  };

  const handleRemove = (idx: number) => {
    const updated = pairs.filter((_, i) => i !== idx);
    setPairs(updated);
    onChange(toObject(updated));
  };

  return (
    <div className="flex flex-col gap-2">
      {pairs.length === 0 && (
        <p className="dial-tiny-text text-secondary italic">
          {texts.noFieldsYet}
        </p>
      )}

      {pairs.length > 0 && !isComplexValue && (
        <div className="flex gap-2 mb-1 pr-7">
          <span className="w-2/5 dial-tiny-text text-secondary font-medium">
            {texts.keyColumnHeader}
          </span>
          <span className="flex-1 dial-tiny-text text-secondary font-medium">
            {texts.valueColumnHeader}
          </span>
        </div>
      )}

      {pairs.map((pair, i) => (
        <KeyValueRow
          key={pair.id}
          pairId={pair.id}
          pairKey={pair.key}
          pairValue={pair.value}
          valueSchema={valueSchema}
          onKeyChange={(k) => handleKeyChange(i, k)}
          onValueChange={(v) => handleValueChange(i, v)}
          onRemove={() => handleRemove(i)}
          keyInputPlaceholder={texts.keyInputPlaceholder}
          removeFieldAriaLabel={texts.removeFieldAriaLabel}
          path={path}
          level={level}
          readonly={readonly}
          inputClassName={inputClassName}
        />
      ))}

      {!readonly && (
        <div className="pt-1">
          <DialGhostButton
            label={texts.addField}
            iconBefore={<IconPlus size={16} stroke={2} />}
            onClick={handleAdd}
          />
        </div>
      )}
    </div>
  );
};
