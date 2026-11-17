import { type FC, useEffect, useRef, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';

import { GhostButton } from '@/components/New/Button/ButtonWrappers';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { LiveRegion } from '@/components/New/LiveRegion/LiveRegion';
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

let itemKeySequence = 0;

/** Keys that identify array items across moves and removals, unlike their index. */
const createItemKeys = (count: number): string[] =>
  Array.from({ length: count }, () => `schema-array-item-${++itemKeySequence}`);

/** Returns a copy of `list` with the entries at `from` and `to` swapped. */
const swap = <T,>(list: readonly T[], from: number, to: number): T[] => {
  const next = [...list];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};

interface MoveButtons {
  up: HTMLButtonElement | null;
  down: HTMLButtonElement | null;
}

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
 * With `reorderableArrays` on the renderer, each item also gets "Move up" and
 * "Move down" buttons. After a move, focus stays on the moved item's button and
 * the new position is announced through a visually hidden live region. Items
 * keep stable keys, so their expanded state follows them on a move or removal.
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
 * @param onChange - Called with the updated array when items are added, removed, moved, or changed
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
    reorderableArrays = false,
  } = useSchemaContext();
  const [selectedAddType, setSelectedAddType] = useState<string | undefined>();
  const items = Array.isArray(value) ? (value as unknown[]) : [];
  const itemSchema = schema.items;

  const [storedItemKeys, setStoredItemKeys] = useState(() =>
    createItemKeys(items.length),
  );
  // The value can also change from outside (a new default value); keep one key per item.
  let itemKeys = storedItemKeys;
  if (itemKeys.length !== items.length) {
    itemKeys =
      itemKeys.length > items.length
        ? itemKeys.slice(0, items.length)
        : [...itemKeys, ...createItemKeys(items.length - itemKeys.length)];
    setStoredItemKeys(itemKeys);
  }

  const [announcement, setAnnouncement] = useState({ id: 0, text: '' });
  const moveButtons = useRef(new Map<string, MoveButtons>());
  const pendingFocus = useRef<{ key: string; up: boolean } | null>(null);

  // after a move, keep focus on the moved item: on the same button unless it is
  // now disabled at the first or last position, then on the other one
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;

    const buttons = moveButtons.current.get(pending.key);
    const same = pending.up ? buttons?.up : buttons?.down;
    const other = pending.up ? buttons?.down : buttons?.up;
    (same && !same.disabled ? same : other)?.focus();
  });

  const setMoveButton =
    (key: string, direction: keyof MoveButtons) =>
    (element: HTMLButtonElement | null) => {
      const buttons = moveButtons.current.get(key) ?? { up: null, down: null };
      buttons[direction] = element;
      if (buttons.up || buttons.down) moveButtons.current.set(key, buttons);
      else moveButtons.current.delete(key);
    };

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

    setStoredItemKeys([...itemKeys, ...createItemKeys(1)]);
    onChange([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    setStoredItemKeys(itemKeys.filter((_, i) => i !== index));
    onChange(items.filter((_, i) => i !== index));
  };

  const handleMove = (from: number, to: number) => {
    pendingFocus.current = { key: itemKeys[from], up: to < from };
    setStoredItemKeys(swap(itemKeys, from, to));
    setAnnouncement((prev) => ({
      id: prev.id + 1,
      text: texts.itemMovedAnnouncement
        .replaceAll('{position}', String(to + 1))
        .replaceAll('{total}', String(items.length)),
    }));
    onChange(swap(items, from, to));
  };

  const isReorderable = reorderableArrays && !readonly && items.length > 1;

  const handleItemChange = (index: number, newVal: unknown) => {
    onChange(items.map((item, i) => (i === index ? newVal : item)));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="dial-small-text text-secondary">{texts.noItemsYet}</p>
      )}

      {items.map((item, i) => {
        const itemKey = itemKeys[i];
        const itemTitle = getItemTitle(item, discriminator?.propertyName, i);
        const errors = validateRequired(
          item,
          resolvedItemSchema,
          rootSchema,
          `${path.join('.')}[${i}]`,
        );

        return (
          <SchemaSection
            key={itemKey}
            title={itemTitle}
            level={level}
            summary={buildSummary(item, resolvedItemSchema, rootSchema)}
            errorCount={errors.length}
            onRemove={readonly ? undefined : () => handleRemove(i)}
            defaultExpanded={defaultExpanded}
            removeItemAriaLabel={`${texts.removeItemAriaLabel}: ${itemTitle}`}
            {...(isReorderable && {
              onMoveUp: i > 0 ? () => handleMove(i, i - 1) : undefined,
              onMoveDown:
                i < items.length - 1 ? () => handleMove(i, i + 1) : undefined,
              moveUpAriaLabel: `${texts.moveItemUpAriaLabel}: ${itemTitle}`,
              moveDownAriaLabel: `${texts.moveItemDownAriaLabel}: ${itemTitle}`,
              moveUpButtonRef: setMoveButton(itemKey, 'up'),
              moveDownButtonRef: setMoveButton(itemKey, 'down'),
            })}
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

      {reorderableArrays && !readonly && (
        <LiveRegion visuallyHidden>
          {announcement.text && (
            <span key={announcement.id}>{announcement.text}</span>
          )}
        </LiveRegion>
      )}

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
