import { type DropdownItem } from '@/models/dropdown';
import { MenuItemMark } from '@/types/menu-item';

/**
 * How a chosen row is marked. `mark` wins when it is given; otherwise the
 * legacy `selectable` flag still means the multiselect checkbox row.
 */
export const resolveItemMark = (item: DropdownItem): MenuItemMark =>
  item.mark ?? (item.selectable ? MenuItemMark.Checkbox : MenuItemMark.None);

/**
 * Role the row announces. A `selectable` row toggles and so is a checkbox item
 * whatever it is marked with — the design draws a menu's multiselect exactly
 * like its single-select, with a check. A row that only *marks* a single choice
 * is a radio item; an unmarked row and the navigation highlight are plain
 * items, the highlight carrying `aria-current` instead.
 */
export const getItemRole = (item: DropdownItem): string => {
  if (item.selectable) return 'menuitemcheckbox';
  return resolveItemMark(item) === MenuItemMark.Check
    ? 'menuitemradio'
    : 'menuitem';
};
