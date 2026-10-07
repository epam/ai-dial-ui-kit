import { type FC, useMemo, useState } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';

import { GhostButton } from '@/components/New/Button/ButtonWrappers';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DangerIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Input } from '@/components/New/Input/Input';
import { Select } from '@/components/New/Select/Select';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import type { JsonSchemaDef, SchemaRendererTexts } from '@/models/json-schema';
import { JsonSchemaType } from '@/types/json-schema';
import { ElementSize } from '@/types/size';
import {
  ENTRY_TYPE_OPTIONS,
  type EntryType,
  buildSummary,
  extractDefaults,
  getEntryTypeDefault,
  getSchemaDefault,
  inferEntryType,
  isObjectType,
  resolveRef,
  validateRequired,
} from '@/utils/json-schema';
import { isPathTouched, useSchemaContext } from '../context';
import { SchemaFieldContent } from './SchemaFieldContent';
import { SchemaJsonEditor } from './SchemaJsonEditor';
import { SchemaPrimitiveField } from './SchemaPrimitiveField';
import { SchemaSection } from './SchemaSection';

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

const entryTypeLabelKey: Record<EntryType, keyof SchemaRendererTexts> = {
  [JsonSchemaType.String]: 'entryTypeString',
  [JsonSchemaType.Number]: 'entryTypeNumber',
  [JsonSchemaType.Boolean]: 'entryTypeBoolean',
  [JsonSchemaType.Null]: 'entryTypeNull',
  [JsonSchemaType.Object]: 'entryTypeObject',
  [JsonSchemaType.Array]: 'entryTypeArray',
};

const toSingleValue = (next: string | string[]): string | undefined =>
  typeof next === 'string' ? next : next[0];

interface KeyValueRowProps {
  pair: KeyValuePair;
  valueSchema: JsonSchemaDef;
  isUnschematizedValue: boolean;
  onKeyChange: (key: string) => void;
  onValueChange: (value: unknown) => void;
  onRemove: () => void;
  path: string[];
  level: number;
}

const KeyValueRow: FC<KeyValueRowProps> = ({
  pair,
  valueSchema,
  isUnschematizedValue,
  onKeyChange,
  onValueChange,
  onRemove,
  path,
  level,
}) => {
  const {
    rootSchema,
    texts,
    readonly = false,
    inputClassName,
    defaultExpanded = true,
    touchedPaths,
    markTouched,
    skipUntouched,
  } = useSchemaContext();
  const [keyDraft, setKeyDraft] = useState(pair.key);
  const [entryType, setEntryType] = useState<EntryType>(() =>
    inferEntryType(pair.value),
  );

  const isSchemaComplex = isComplexValueSchema(valueSchema);
  const isJsonMode =
    isUnschematizedValue &&
    (entryType === JsonSchemaType.Object || entryType === JsonSchemaType.Array);
  const isNullMode = isUnschematizedValue && entryType === JsonSchemaType.Null;
  const isBooleanMode =
    isUnschematizedValue && entryType === JsonSchemaType.Boolean;
  const isComplex = isSchemaComplex || isJsonMode;

  const keyTouchedPath = [...path, pair.id, 'key'].join('.');
  const showKeyError =
    isPathTouched(keyTouchedPath, touchedPaths, skipUntouched) &&
    pair.key === '';
  const valueLabel = pair.key || texts.valueColumnHeader;

  const handleChangeType = (next: EntryType) => {
    onValueChange(getEntryTypeDefault(next));
    setEntryType(next);
  };

  const entryTypeOptions = useMemo(
    () =>
      ENTRY_TYPE_OPTIONS.map((type) => ({
        value: type,
        label: texts[entryTypeLabelKey[type]],
      })),
    [texts],
  );

  const booleanOptions = useMemo(
    () => [
      { value: 'true', label: texts.booleanTrueOption },
      { value: 'false', label: texts.booleanFalseOption },
    ],
    [texts],
  );

  const renderInlineValue = () => {
    if (isNullMode) {
      return <Input aria-label={valueLabel} value="null" disabled />;
    }
    if (isBooleanMode) {
      return (
        <Select
          ariaLabel={valueLabel}
          options={booleanOptions}
          value={pair.value ? 'true' : 'false'}
          disabled={readonly}
          onChange={(next) => {
            const nextValue = toSingleValue(next);
            if (nextValue) onValueChange(nextValue === 'true');
          }}
        />
      );
    }
    return (
      <SchemaPrimitiveField
        schema={isUnschematizedValue ? { type: entryType } : valueSchema}
        value={pair.value}
        onChange={onValueChange}
        ariaLabel={valueLabel}
      />
    );
  };

  const keyRow = (
    <div className="flex items-start gap-2">
      <div className={isComplex ? 'min-w-0 flex-1' : 'w-2/5 min-w-0'}>
        <Input
          aria-label={texts.keyColumnHeader}
          value={keyDraft}
          disabled={readonly}
          invalid={showKeyError}
          error={
            showKeyError ? `${texts.keyColumnHeader} is required` : undefined
          }
          onChange={(v) => setKeyDraft(v ?? '')}
          onBlur={() => {
            markTouched?.(keyTouchedPath);
            if (keyDraft !== pair.key) onKeyChange(keyDraft);
          }}
          placeholder={texts.keyInputPlaceholder}
          containerClassName={inputClassName}
        />
      </div>
      {!isComplex && (
        <div className="min-w-0 flex-1">{renderInlineValue()}</div>
      )}
      {isUnschematizedValue && (
        <div className="w-28 shrink-0">
          <Tooltip
            tooltip={texts.entryTypeChangeWarning}
            triggerClassName="block"
          >
            <Select
              ariaLabel={texts.typeColumnHeader}
              options={entryTypeOptions}
              value={entryType}
              disabled={readonly}
              onChange={(next) => {
                const nextType = toSingleValue(next);
                if (nextType) handleChangeType(nextType as EntryType);
              }}
            />
          </Tooltip>
        </div>
      )}
      {!readonly && (
        // The controls in this row are 40px tall; a 24px button keeps the row
        // dense, and the margin centres it on the first line of the row.
        <DangerIconButton
          size={ElementSize.Small}
          icon={
            <IconTrash
              size={DIAL_ICON_SIZE.SM}
              stroke={DIAL_KIT_ICON_STROKE}
              aria-hidden="true"
            />
          }
          aria-label={
            pair.key
              ? `${texts.removeFieldAriaLabel}: ${pair.key}`
              : texts.removeFieldAriaLabel
          }
          onClick={onRemove}
          className="mt-2 shrink-0"
        />
      )}
    </div>
  );

  if (!isComplex) return keyRow;

  if (isJsonMode) {
    return (
      <div className="flex flex-col gap-2">
        {keyRow}
        <SchemaJsonEditor
          key={entryType}
          value={pair.value}
          onChange={onValueChange}
          ariaLabel={valueLabel}
        />
      </div>
    );
  }

  const entryPath = [...path, pair.key];
  const errors = validateRequired(
    pair.value,
    valueSchema,
    rootSchema,
    entryPath.join('.'),
  );

  return (
    <div className="flex flex-col gap-2">
      {keyRow}
      <SchemaSection
        title={pair.key}
        level={level}
        summary={buildSummary(pair.value, valueSchema, rootSchema)}
        errorCount={errors.length + (showKeyError ? 1 : 0)}
        defaultExpanded={defaultExpanded}
      >
        <SchemaFieldContent
          schema={valueSchema}
          value={pair.value}
          onChange={onValueChange}
          path={entryPath}
          level={level + 1}
          ariaLabel={valueLabel}
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
 * Renders an `additionalProperties` object schema as an editable key-value list.
 * aliases: KeyValueSchemaEditor|AdditionalPropertiesEditor
 * Design system 2.0
 *
 * Primitive values render inline; object, `oneOf` and array values render as a
 * collapsible section recursing back into `SchemaFieldContent`. With
 * `additionalProperties: true` each entry also gets a type select, and an
 * object or array entry is edited as raw JSON.
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
  const { rootSchema, texts, readonly = false } = useSchemaContext();

  const isUnschematizedValue =
    schema.additionalProperties === true || schema.additionalProperties == null;

  const valueSchema: JsonSchemaDef =
    !isUnschematizedValue && typeof schema.additionalProperties === 'object'
      ? resolveRef(schema.additionalProperties as JsonSchemaDef, rootSchema)
      : { type: JsonSchemaType.String };

  const isComplexValue = isComplexValueSchema(valueSchema);

  const [pairs, setPairs] = useState<KeyValuePair[]>(() =>
    Object.entries((value as Record<string, unknown>) ?? {}).map(([k, v]) =>
      createPair(k, v),
    ),
  );

  const commit = (updated: KeyValuePair[]) => {
    setPairs(updated);
    onChange(
      Object.fromEntries(
        updated
          .filter((pair) => pair.key !== '')
          .map((pair) => [pair.key, pair.value]),
      ),
    );
  };

  const updatePair = (idx: number, patch: Partial<KeyValuePair>) =>
    commit(pairs.map((p, i) => (i === idx ? { ...p, ...patch } : p)));

  const handleAdd = () => {
    const newValue = isComplexValue
      ? (extractDefaults(valueSchema, rootSchema) ??
        getSchemaDefault(valueSchema))
      : '';
    setPairs((prev) => [...prev, createPair('', newValue)]);
  };

  return (
    <div className="flex flex-col gap-2">
      {pairs.length === 0 && (
        <p className="dial-small-text text-secondary">{texts.noFieldsYet}</p>
      )}

      {pairs.length > 0 && !isComplexValue && (
        // Column headings for sighted users; each control carries its own
        // accessible name, so the headings are hidden from assistive tech.
        <div aria-hidden="true" className="flex gap-2 pr-8">
          <span className="w-2/5 dial-tiny-semi-text text-secondary">
            {texts.keyColumnHeader}
          </span>
          <span className="flex-1 dial-tiny-semi-text text-secondary">
            {texts.valueColumnHeader}
          </span>
          {isUnschematizedValue && (
            <span className="w-28 shrink-0 dial-tiny-semi-text text-secondary">
              {texts.typeColumnHeader}
            </span>
          )}
        </div>
      )}

      {pairs.map((pair, i) => (
        <KeyValueRow
          key={pair.id}
          pair={pair}
          valueSchema={valueSchema}
          isUnschematizedValue={isUnschematizedValue}
          onKeyChange={(key) => updatePair(i, { key })}
          onValueChange={(v) => updatePair(i, { value: v })}
          onRemove={() => commit(pairs.filter((_, idx) => idx !== i))}
          path={path}
          level={level}
        />
      ))}

      {!readonly && (
        <div className="pt-1">
          <GhostButton
            label={texts.addField}
            iconBefore={
              <IconPlus
                size={DIAL_ICON_SIZE.SM}
                stroke={DIAL_KIT_ICON_STROKE}
                aria-hidden="true"
              />
            }
            onClick={handleAdd}
          />
        </div>
      )}
    </div>
  );
};
