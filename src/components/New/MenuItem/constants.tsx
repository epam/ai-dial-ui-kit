import { IconCheck } from '@tabler/icons-react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';

/**
 * Marks the chosen row in a `MenuItemMark.Check` list. Decorative: the row's
 * `aria-checked`/`aria-selected` already carries the state.
 */
export const menuItemCheckIcon = (
  <IconCheck
    size={DIAL_ICON_SIZE.SM}
    stroke={DIAL_KIT_ICON_STROKE}
    className="shrink-0"
    aria-hidden
  />
);
