import { type FC, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';

import { GhostButton } from '@/components/New/Button/ButtonWrappers';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { Select } from '@/components/New/Select/Select';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import type { JsonSchemaDef } from '@/models/json-schema';
import {
  buildSummary,
  extractDefaults,
  getItemTitle,
  getSchemaDefault,
  resolveRef,
  validateRequired,
} from '@/utils/json-schema';
import { useSchemaContext } from '../context';
import { SchemaFieldContent } from './SchemaFieldContent';
import { SchemaSection } from './SchemaSection';

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
 * Design system 2.0
 *
 * An item schema with a `discriminator` adds a type select next to the add
 * button; the new item gets that variant's defaults.
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
  const [selectedAddType, setSelectedAddType] = useState<string | undefined>();
  const items = Array.isArray(value) ? (value as unknown[]) : [];
  const itemSchema = schema.items;

  if (!itemSchema) {
    return (
      <p className="dial-small-text text-secondary">{texts.noItemSchema}</p>
    );
  }

  const resolvedItemSchema = resolveRef(itemSchema, rootSchema);
  const discriminator = resolvedItemSchema.discriminator;
  const addTypeOptions = discriminator
    ? Object.keys(discriminator.mapping).map((k) => ({ value: k, label: k }))
    : [];
  const typeToAdd = selectedAddType ?? addTypeOptions[0]?.value;

  const handleAdd = () => {
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
        <p className="dial-small-text text-secondary">{texts.noItemsYet}</p>
      )}

      {items.map((item, i) => {
        const itemTitle = getItemTitle(item, discriminator?.propertyName, i);
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
            summary={buildSummary(item, resolvedItemSchema, rootSchema)}
            errorCount={errors.length}
            onRemove={readonly ? undefined : () => handleRemove(i)}
            defaultExpanded={defaultExpanded}
            removeItemAriaLabel={`${texts.removeItemAriaLabel}: ${itemTitle}`}
          >
            <SchemaFieldContent
              schema={itemSchema}
              value={item}
              onChange={(v) => handleItemChange(i, v)}
              path={[...path, String(i)]}
              level={level + 1}
              ariaLabel={itemTitle}
            />
          </SchemaSection>
        );
      })}

      {!readonly && (
        <div className="flex items-center gap-2 pt-1">
          {addTypeOptions.length > 0 && (
            <Select
              ariaLabel={texts.selectTypeToAdd}
              options={addTypeOptions}
              value={typeToAdd}
              placeholder={texts.selectTypeToAdd}
              onChange={(next) =>
                setSelectedAddType(typeof next === 'string' ? next : next[0])
              }
              className="max-w-[280px] flex-1"
            />
          )}
          <GhostButton
            label={texts.addItem}
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
