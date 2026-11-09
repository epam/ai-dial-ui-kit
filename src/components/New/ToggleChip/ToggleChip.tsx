import type { ButtonHTMLAttributes, FC, MouseEvent, ReactNode } from 'react';
import { useCallback } from 'react';

import {
  tagBaseClassName,
  tagHoverClassName,
  tagInteractiveClassName,
  tagStateClassNames,
} from '@/components/New/Tag/constants';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { TagAppearance } from '@/types/tag';
import { mergeClasses } from '@/utils/merge-classes';
import {
  toggleChipDisabledClassNames,
  toggleChipLabelClassNames,
} from './constants';

/*
 * `onToggle` shadows the native DOM handler of the same name, which fires for
 * `<details>` and popover elements and never for a `<button>` — so the name is
 * free to mean the chip's own change here, as it does on `ToggleIconButton`.
 */
type NativeToggleChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'type' | 'onToggle' | 'aria-pressed'
>;

export interface ToggleChipProps extends NativeToggleChipProps {
  label: ReactNode;
  icon?: ReactNode;
  isSelected?: boolean;
  onToggle?: (isSelected: boolean) => void;
}

/**
 * A chip that switches one option on and off on its own, for a row of
 * independent toggles — tools a model may call, filters that combine.
 * aliases: ChipToggle|ToggleTag|PressableChip|SelectableChip|MultiSelectChip
 * Design system 2.0
 *
 * Draws the `TagAppearance.Selectable` filter chip of the 2.0 design — no fill
 * until it is on, one accent hover tint shared by both states, an accent-alpha
 * fill and a semibold label once on — so a row of these sits beside a
 * `FilterChips` row without a seam. Turning it on therefore widens it by the
 * difference between the regular and semibold label; give it a width if that
 * shift matters.
 *
 * Reach for it when each chip is its own yes/no. `FilterChips` picks one value
 * out of several and `Tag` is a label that may be clicked or removed; neither
 * keeps several independent states, and `Tag` renders a `<span>` with a string
 * label. This is a native `<button aria-pressed>`: Enter and Space work, the
 * state is announced as "pressed", and `disabled` takes it out of the tab order
 * and greys it out.
 *
 * Keep one accessible name across both states — the state rides on
 * `aria-pressed`, and a control that renames itself on click reads as a
 * different control. Visible state text such as "ON" / "OFF" belongs inside
 * `label`, wrapped in `aria-hidden` so it is not read on top of the pressed
 * state. There is no remove control: a chip that toggles and also closes gives
 * a screen reader two actions with no way to tell which one it landed on, so a
 * removable value is a closable `Tag` instead.
 *
 * Group a row of these in a named `role="group"` so they are announced
 * together. Labels are the caller's to translate — the component ships no
 * English defaults.
 *
 * @example
 * ```tsx
 * <div role="group" aria-label={t('Tools')} className="flex flex-wrap gap-1">
 *   {tools.map((tool) => (
 *     <ToggleChip
 *       key={tool.id}
 *       icon={tool.icon}
 *       label={
 *         <>
 *           {tool.label}
 *           <span aria-hidden="true">: {tool.isOn ? t('ON') : t('OFF')}</span>
 *         </>
 *       }
 *       isSelected={tool.isOn}
 *       onToggle={(isOn) => setTool(tool.id, isOn)}
 *     />
 *   ))}
 * </div>
 * ```
 *
 * @param label - Content of the chip after the icon. Any node, so trailing state text can follow the name; it truncates on one line
 * @param [icon] - Icon rendered before the label; hidden from assistive tech
 * @param [isSelected=false] - Whether the chip is on; rendered as `aria-pressed`
 * @param [onToggle] - Called with the next value when the chip is activated by click, Enter or Space
 * @param [disabled=false] - Greys the chip out and stops it responding; it keeps showing its on/off state
 * @param [onClick] - Native click handler, called before `onToggle`
 * @param [className] - Additional classes on the button
 */
export const ToggleChip: FC<ToggleChipProps> = ({
  label,
  icon,
  isSelected = false,
  onToggle,
  onClick,
  disabled = false,
  className,
  title,
  ...props
}) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      onToggle?.(!isSelected);
    },
    [onClick, onToggle, isSelected],
  );

  const state = isSelected ? 'selected' : 'default';

  return (
    <button
      {...props}
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      title={title ?? (typeof label === 'string' ? label : undefined)}
      onClick={handleClick}
      className={mergeClasses(
        tagBaseClassName,
        toggleChipLabelClassNames[state],
        disabled
          ? toggleChipDisabledClassNames[state]
          : [
              tagStateClassNames[TagAppearance.Selectable][state],
              tagInteractiveClassName,
              tagHoverClassName,
            ],
        className,
        DIAL_KIT_CLASS.toggleChip,
      )}
    >
      {icon && (
        <span className="flex shrink-0 items-center" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="truncate">{label}</span>
    </button>
  );
};
