import { Highlight } from '@/components/New/Highlight/Highlight';
import { DropdownItemType } from '@/types/dropdown';
import type { DropdownItem } from '@/models/dropdown';

/** Decides whether an item matches a non-empty, trimmed, lower-cased query. */
export type DropdownItemFilter = (item: DropdownItem, query: string) => boolean;

/** Case-insensitive substring match on a string `label`; an item with a non-string label never matches. */
export const matchDropdownItemLabel: DropdownItemFilter = (item, query) =>
  typeof item.label === 'string' &&
  item.label.toLocaleLowerCase().includes(query);

const isStructural = (item: DropdownItem): boolean =>
  item.type === DropdownItemType.Divider ||
  item.type === DropdownItemType.PlainText;

const filterItem = (
  item: DropdownItem,
  query: string,
  isMatch: DropdownItemFilter,
): DropdownItem | null => {
  if (!item.children?.length) return isMatch(item, query) ? item : null;
  // A query naming the submenu keeps all of it; otherwise only its matching rows.
  if (isMatch(item, query)) return item;
  const children = filterItems(item.children, query, isMatch);
  return children.length > 0 ? { ...item, children } : null;
};

/*
 * A heading (`PlainText`) or divider survives only while a row that it
 * introduces survives, so a search never leaves an empty group heading behind
 * or two dividers in a row.
 */
const filterItems = (
  items: DropdownItem[],
  query: string,
  isMatch: DropdownItemFilter,
): DropdownItem[] => {
  const result: DropdownItem[] = [];
  let pending: DropdownItem[] = [];

  items.forEach((item) => {
    if (isStructural(item)) {
      if (item.type === DropdownItemType.Divider) pending = [];
      pending.push(item);
      return;
    }
    const kept = filterItem(item, query, isMatch);
    if (kept == null) return;
    // A leading divider has nothing above it to separate.
    const leading =
      result.length === 0
        ? pending.filter((it) => it.type !== DropdownItemType.Divider)
        : pending;
    result.push(...leading, kept);
    pending = [];
  });

  return result;
};

/** Returns `items` narrowed to the rows matching `query`; an empty query returns `items` unchanged. */
export const filterDropdownItems = (
  items: DropdownItem[],
  query: string,
  isMatch: DropdownItemFilter = matchDropdownItemLabel,
): DropdownItem[] => {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return items;
  return filterItems(items, normalized, isMatch);
};

/** Returns `items` with every string row label, submenus included, rendered through a single-line `Highlight` of `query`. */
export const highlightDropdownItems = (
  items: DropdownItem[],
  query: string,
): DropdownItem[] => {
  const trimmed = query.trim();
  if (!trimmed) return items;
  return items.map((item) => {
    if (isStructural(item)) return item;
    return {
      ...item,
      label:
        typeof item.label === 'string' ? (
          <Highlight text={item.label} query={trimmed} maxLines={1} />
        ) : (
          item.label
        ),
      children: item.children
        ? highlightDropdownItems(item.children, trimmed)
        : undefined,
    };
  });
};
