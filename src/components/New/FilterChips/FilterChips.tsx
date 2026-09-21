import type { ReactNode } from 'react';

import { Tag } from '@/components/New/Tag/Tag';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { TagAppearance } from '@/types/tag';
import { mergeClasses } from '@/utils/merge-classes';
import { chipStretchClassName, containerClassName } from './constants';

export interface FilterChipItem<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface FilterChipsProps<T extends string = string> {
  items: FilterChipItem<T>[];
  value: T;
  onChange: (value: T) => void;
  stretch?: boolean;
  className?: string;
  chipClassName?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * A row of filter chips that picks one value out of a few.
 * aliases: FilterChipRow|ChipTabs|TagTabs|FilterTabs
 * Design system 2.0
 *
 * The chip-shaped sibling of the kit's other single-select rows, and the one to
 * reach for when the options label a *subset of a list* — "All", "Shared",
 * "Mine" above a history panel. `Tabs` underlines the active option and reads
 * as navigation between panels; `SegmentedControl` sinks equal segments into a
 * track and reads as a view switch. This one draws `TagAppearance.Selectable`
 * chips: no fill until selected, and a semibold label once it is. Selecting a
 * chip therefore widens it by the difference between the regular and semibold
 * label — give the row `stretch`, or the chips a width, if that shift matters.
 *
 * Each chip is a toggle button carrying its state on `aria-pressed`, wrapped in
 * a named `role="group"` — the pattern `Tag` is built for. That makes every
 * chip its own tab stop, which is what a filter row wants: unlike a
 * `radiogroup`, arrowing onto a chip never changes the filter by accident.
 * Name the group through `aria-label` or `aria-labelledby`, or the chips are
 * announced as a handful of unrelated toggles.
 *
 * There is no disabled chip. An option the user must not pick is left out of
 * `items` — a chip that renders but cannot be activated is a label and nothing
 * else, and `Tag` drops its button role when disabled, so it would not even
 * announce as unavailable.
 *
 * Labels are the caller's to translate — the component ships no English
 * defaults.
 *
 * @example
 * ```tsx
 * <FilterChips
 *   aria-label={t('Filter chats')}
 *   value={tab}
 *   onChange={setTab}
 *   items={[
 *     { value: 'all', label: t('All') },
 *     { value: 'mine', label: t('My chats') },
 *     { value: 'shared', label: t('Shared') },
 *   ]}
 * />
 * ```
 *
 * @param items - Chips to render, in order; each needs a unique `value` and a `label`
 * @param value - The `value` of the selected chip
 * @param onChange - Called with the `value` of the chip the user picked. A click on the already-selected chip fires it again, so a row that clears back to a default handles that itself
 * @param [stretch=false] - Grows the chips to share the row width equally instead of hugging their labels
 * @param [className] - Additional classes for the row, e.g. its padding or `flex-wrap`
 * @param [chipClassName] - Additional classes for every chip. A panel too narrow for the chips' default padding can tighten it here
 * @param [aria-label] - Names the row as a whole
 * @param [aria-labelledby] - Names the row from an existing element, e.g. a visible heading
 */
export const FilterChips = <T extends string = string>({
  items,
  value,
  onChange,
  stretch = false,
  className,
  chipClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: FilterChipsProps<T>) => (
  <div
    role="group"
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    className={mergeClasses(
      containerClassName,
      className,
      DIAL_KIT_CLASS.filterChips,
    )}
  >
    {items.map((item) => (
      <Tag
        key={item.value}
        label={item.label}
        icon={item.icon}
        appearance={TagAppearance.Selectable}
        selected={item.value === value}
        onClick={() => onChange(item.value)}
        className={mergeClasses(stretch && chipStretchClassName, chipClassName)}
      />
    ))}
  </div>
);
