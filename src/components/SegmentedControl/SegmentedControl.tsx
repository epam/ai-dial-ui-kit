import { useCallback, type KeyboardEvent } from 'react';

import type { SegmentedControlOption } from '@/models/segmented-control';
import { mergeClasses } from '@/utils/merge-classes';
import {
  containerBaseClassName,
  segmentBaseClassName,
  segmentDisabledClassName,
  segmentSelectedClassName,
  segmentUnselectedClassName,
} from './constants';

export interface DialSegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * A single-select control for switching between a small set of mutually exclusive,
 * equally-sized options (e.g. view switchers).
 * aliases: SegmentedButton|ViewSwitcher
 *
 * Renders a horizontal group of segments where every option is always visible and
 * equally sized. Supports 2 or more segments, optional per-option icons, and
 * keyboard navigation (Arrow keys, Home, End).
 *
 * @example
 * ```tsx
 * <DialSegmentedControl
 *   ariaLabel="View"
 *   value={view}
 *   onChange={setView}
 *   options={[
 *     { value: 'list', label: 'List' },
 *     { value: 'grid', label: 'Grid' },
 *   ]}
 * />
 * ```
 *
 * @param options - Segments to render. Each option needs a unique `value` and may include a `label`, `icon`, and `disabled` flag.
 * @param value - The currently selected option `value`.
 * @param onChange - Callback fired with the selected option `value`.
 * @param [disabled] - Disables the entire control when set.
 * @param [className] - Additional classes applied to the container.
 * @param [ariaLabel] - Accessible label for the control (applied to the `tablist`).
 */
export const DialSegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  disabled,
  className,
  ariaLabel,
}: DialSegmentedControlProps<T>) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      const enabledOptions = options.filter((option) => !option.disabled);
      if (enabledOptions.length === 0) {
        return;
      }

      const currentIndex = enabledOptions.findIndex(
        (option) => option.value === value,
      );

      let nextIndex: number | null = null;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % enabledOptions.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex =
            (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = enabledOptions.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const nextOption = enabledOptions[nextIndex];
      if (nextOption && nextOption.value !== value) {
        onChange(nextOption.value);
      }
    },
    [disabled, options, value, onChange],
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={mergeClasses(containerBaseClassName, className)}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={isDisabled}
            onClick={() => onChange(option.value)}
            onKeyDown={handleKeyDown}
            className={mergeClasses(
              segmentBaseClassName,
              !isLast && '-mr-px',
              isFirst && 'rounded-l',
              isLast && 'rounded-r',
              isSelected
                ? segmentSelectedClassName
                : segmentUnselectedClassName,
              isDisabled && segmentDisabledClassName,
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
