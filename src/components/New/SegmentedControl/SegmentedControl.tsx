import type { KeyboardEvent, ReactNode } from 'react';
import { useCallback, useRef } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import {
  NAVIGATION_KEYS,
  containerClassName,
  segmentClassName,
  segmentDisabledSelectedClassName,
  segmentDisabledUnselectedClassName,
  segmentSelectedClassName,
  segmentSelectedInteractiveClassName,
  segmentUnselectedClassName,
  segmentUnselectedInteractiveClassName,
} from './constants';

export interface SegmentedControlItem<T extends string = string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
}

export interface SegmentedControlProps<T extends string> {
  items: SegmentedControlItem<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  segmentClassName?: string;
  'aria-label'?: string;
}

/**
 * A single-select switch between a few mutually exclusive, equally sized options.
 * aliases: SegmentedButton|ViewSwitcher|ButtonGroup
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   aria-label="View"
 *   value={view}
 *   onChange={setView}
 *   items={[
 *     { value: 'list', icon: <IconList />, 'aria-label': 'List' },
 *     { value: 'grid', icon: <IconGrid />, 'aria-label': 'Grid' },
 *   ]}
 * />
 * ```
 *
 * This is a radio group, not a tab list: it selects a value rather than
 * revealing a panel, so it takes `role="radiogroup"` with `role="radio"`
 * segments. The group is a single tab stop — the selected segment holds it, and
 * the arrow keys, `Home` and `End` move the selection, per the ARIA radio-group
 * pattern. `DialSegmentedControl` (1.0) uses `tablist`/`tab` instead; that is
 * the behaviour this replaces.
 *
 * An icon-only segment still needs a name: give it `aria-label`, since the icon
 * carries no text. A segment with a string `label` is named by it.
 *
 * @param items - Segments to render; each needs a unique `value` and may carry a `label`, `icon` and `disabled` flag
 * @param value - The currently selected `value`
 * @param onChange - Callback fired with the newly selected `value`
 * @param [disabled] - Disables every segment
 * @param [className] - Additional classes for the track
 * @param [segmentClassName] - Additional classes for every segment
 * @param [aria-label] - Names the group as a whole
 */
export const SegmentedControl = <T extends string>({
  items,
  value,
  onChange,
  disabled,
  className,
  segmentClassName: segmentClassNameProp,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) => {
  const segmentRefs = useRef<Partial<Record<T, HTMLButtonElement | null>>>({});

  // Roving tabindex: the group is one tab stop. A disabled segment cannot hold
  // it, so a `value` pointing at one falls back to the first enabled segment —
  // otherwise the group would drop out of the tab order entirely.
  const selectedItem = items.find((item) => item.value === value);
  const tabStopValue =
    selectedItem && !selectedItem.disabled
      ? selectedItem.value
      : items.find((item) => !item.disabled)?.value;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || !NAVIGATION_KEYS.includes(event.key)) return;

      // Disabled segments are not selectable, so they are not targets either.
      const selectable = items.filter((item) => !item.disabled);
      if (selectable.length === 0) return;

      // A `value` that matches nothing still has to have somewhere to go.
      const currentIndex = Math.max(
        selectable.findIndex((item) => item.value === value),
        0,
      );
      const lastIndex = selectable.length - 1;

      let nextIndex = currentIndex;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = lastIndex;
          break;
      }

      // Arrow keys would otherwise scroll the page along with moving selection.
      event.preventDefault();

      const nextItem = selectable[nextIndex];
      segmentRefs.current[nextItem.value]?.focus();
      if (nextItem.value !== value) {
        onChange(nextItem.value);
      }
    },
    [disabled, items, value, onChange],
  );

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
      className={mergeClasses(containerClassName, className)}
    >
      {items.map((item) => {
        const isSelected = item.value === value;
        const isDisabled = disabled || item.disabled;

        return (
          <button
            key={item.value}
            ref={(node) => {
              segmentRefs.current[item.value] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={resolveAccessibleName(
              item['aria-label'],
              typeof item.label === 'string' ? item.label : undefined,
            )}
            tabIndex={item.value === tabStopValue ? 0 : -1}
            disabled={isDisabled}
            onClick={() => onChange(item.value)}
            className={mergeClasses(
              segmentClassName,
              isSelected
                ? segmentSelectedClassName
                : segmentUnselectedClassName,
              isDisabled
                ? isSelected
                  ? segmentDisabledSelectedClassName
                  : segmentDisabledUnselectedClassName
                : isSelected
                  ? segmentSelectedInteractiveClassName
                  : segmentUnselectedInteractiveClassName,
              segmentClassNameProp,
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
