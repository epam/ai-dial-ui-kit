import { type FC, useMemo, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { DialSelect } from '@/components/Select/Select';
import { DialGhostButton } from '@/components/Button/ButtonWrappers';
import type { JsonSchemaDef } from '@/components/SchemaRenderer/types';
import { useSchemaContext } from '@/components/SchemaRenderer/context';
import {
  resolveRef,
  extractDefaults,
  buildSummary,
  validateRequired,
  getItemTitle,
  getSchemaDefault,
} from '@/components/SchemaRenderer/utils';
import { SchemaSection } from './SchemaSection';
import { SchemaFieldContent } from './SchemaFieldContent';

export interface SchemaArrayEditorProps {
  schema: JsonSchemaDef;
  value: unknown;
  onChange: (value: unknown) => void;
  path: string[];
  level: number;
}

/**
 * Renders a JSON Schema array as a list of collapsible items with add and remove controls.
 * aliases: ArraySchemaEditor|SchemaListEditor
 *
 * @example
 * ```tsx
 * <SchemaArrayEditor
 *   schema={{ type: 'array', items: { type: 'string' } }}
 *   value={['foo', 'bar']}
 *   onChange={(v) => console.log(v)}
 *   path={['tags']}
 *   level={1}
 * />
 * ```
 *
 * @param schema - The JSON Schema array definition (must include an `items` sub-schema)
 * @param value - Current array value
 * @param onChange - Called with the updated array when items are added, removed, or changed
 * @param path - Field path segments used for validation error tracking
 * @param level - Nesting depth passed to child section components
 */
export const SchemaArrayEditor: FC<SchemaArrayEditorProps> = ({
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
    defaultExpanded = true,
  } = useSchemaContext();
  const items = Array.isArray(value) ? (value as unknown[]) : [];
  const itemSchema = schema.items;
  const [selectedAddType, setSelectedAddType] = useState<string | undefined>(
    undefined,
  );

  if (!itemSchema) {
    return (
      <p className="dial-tiny-text text-secondary italic">
        {texts.noItemSchema}
      </p>
    );
  }

  const resolvedItemSchema = useMemo(
    () => resolveRef(itemSchema, rootSchema),
    [itemSchema, rootSchema],
  );

  const discriminator = useMemo(
    () => resolvedItemSchema.discriminator,
    [resolvedItemSchema],
  );

  const discriminatorProp = useMemo(
    () => discriminator?.propertyName,
    [discriminator],
  );

  const addTypeOptions = useMemo(
    () =>
      discriminator
        ? Object.keys(discriminator.mapping).map((k) => ({
            value: k,
            label: k,
          }))
        : [],
    [discriminator],
  );

  const handleAdd = () => {
    const typeToAdd = selectedAddType ?? addTypeOptions[0]?.value;

    let newItem: unknown;
    if (discriminator && typeToAdd) {
      const variantSchema = resolveRef(
        { $ref: discriminator.mapping[typeToAdd] },
        rootSchema,
      );
      const defaults =
        (extractDefaults(variantSchema, rootSchema) as Record<
          string,
          unknown
        >) ?? {};
      newItem = { ...defaults, [discriminator.propertyName]: typeToAdd };
    } else {
      newItem =
        extractDefaults(resolvedItemSchema, rootSchema) ??
        getSchemaDefault(resolvedItemSchema);
    }

    onChange([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, newVal: unknown) => {
    onChange(items.map((item, i) => (i === index ? newVal : item)));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="dial-tiny-text text-secondary italic">
          {texts.noItemsYet}
        </p>
      )}

      {items.map((item, i) => {
        const itemTitle = getItemTitle(item, discriminatorProp, i);
        const summary = buildSummary(item, resolvedItemSchema, rootSchema);
        const errors = validateRequired(
          item,
          resolvedItemSchema,
          rootSchema,
          `${path.join('.')}[${i}]`,
        );

        return (
          <SchemaSection
            key={i}
            title={itemTitle}
            level={level}
            summary={summary}
            errorCount={errors.length}
            onRemove={readonly ? undefined : () => handleRemove(i)}
            defaultExpanded={defaultExpanded}
            removeItemAriaLabel={texts.removeItemAriaLabel}
          >
            <SchemaFieldContent
              schema={itemSchema}
              value={item}
              onChange={(v) => handleItemChange(i, v)}
              path={[...path, String(i)]}
              level={level + 1}
            />
          </SchemaSection>
        );
      })}

      {!readonly && (
        <div className="flex items-center gap-2 pt-1">
          {addTypeOptions.length > 0 && (
            <div className="flex-1 max-w-[280px]">
              <DialSelect
                options={addTypeOptions}
                value={selectedAddType ?? addTypeOptions[0]?.value}
                placeholder={texts.selectTypeToAdd}
                onChange={(next) => {
                  const val = typeof next === 'string' ? next : next[0];
                  setSelectedAddType(val);
                }}
              />
            </div>
          )}
          <DialGhostButton
            label={texts.addItem}
            iconBefore={<IconPlus size={16} stroke={2} />}
            onClick={handleAdd}
          />
        </div>
      )}
    </div>
  );
};
