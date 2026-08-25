import { IconX } from '@tabler/icons-react';
import type {
  FC,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { TagAppearance } from '@/types/tag';
import { mergeClasses } from '@/utils/merge-classes';
import { GhostIconButton } from '../IconButton/IconButtonWrappers';
import {
  tagBaseClassName,
  tagHoverClassName,
  tagInteractiveClassName,
  tagStateClassNames,
} from './constants';

type NativeTagProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export interface TagProps extends NativeTagProps {
  label: string;
  icon?: ReactNode;
  appearance?: TagAppearance;
  selected?: boolean;
  disabled?: boolean;
  closable?: boolean;
  removeLabel?: string;
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A compact label element used for selections, filters, or categories.
 * aliases: Chip|Pill
 * Design system 2.0
 *
 * The tag has one height — the 32px pill of the 2.0 design. There is no `size`
 * prop: a tag sizes itself, and a caller that needs a different height is
 * usually reaching for a button.
 *
 * The label truncates rather than wrapping, and carries a native `title` so the
 * full text stays reachable when it does.
 *
 * A tag with `onClick` becomes a `role="button"` operable with Enter and Space.
 * Its remove control is a real nested `<button>`, so keep the two roles apart in
 * the caller: a clickable tag that is also closable gives a screen reader two
 * actions with no way to tell which one it landed on.
 *
 * No tag draws a rim; the two appearances are told apart by their fill.
 * `TagAppearance.Selectable` is the filter chip of the 2.0 design: no fill
 * at all until it is selected, one hover tint shared by both states, a semibold
 * label once selected, and the state carried on `aria-pressed` rather than by
 * the tint alone. Give it an `onClick` — a selectable tag that cannot be
 * activated is a colour and nothing else.
 *
 * Selecting one therefore changes its width by the difference between the
 * regular and semibold label. In a wrapping filter row that is what the design
 * asks for; if a fixed width matters, give the chip one.
 *
 * @example
 * ```tsx
 * <Tag label="TypeScript" />
 * <Tag label="TypeScript" closable onRemove={() => remove('TypeScript')} />
 * <Tag label="Drafts" selected onClick={() => toggle('Drafts')} />
 * <Tag
 *   label="Drafts"
 *   appearance={TagAppearance.Selectable}
 *   selected={isSelected}
 *   onClick={() => toggle('Drafts')}
 * />
 * ```
 *
 * @param label - Text content displayed inside the tag.
 * @param [icon] - Icon rendered before the label.
 * @param [appearance=TagAppearance.Outlined] - `outlined` is the filled chip on the raised
 * layer; `selectable` is the unfilled filter chip that tints and turns semibold when selected.
 * @param [selected=false] - Applies the accent-tinted selected styling.
 * @param [disabled=false] - Stops the tag responding: no click handling, no remove control. The design defines no disabled tag, so the colours stay put.
 * @param [closable=false] - Renders the remove button. Needs `onRemove` to appear.
 * @param [removeLabel] - Accessible name of the remove button; defaults to `Remove <label>`.
 * @param [onRemove] - Called when the remove button is clicked. The click does not bubble to `onClick`.
 * @param [onClick] - Called when the tag itself is activated. Makes the tag a button.
 */
export const Tag: FC<TagProps> = ({
  label,
  icon,
  appearance = TagAppearance.Outlined,
  selected = false,
  disabled = false,
  closable = false,
  removeLabel,
  className,
  title,
  onClick,
  onRemove,
  onKeyDown,
  ...props
}) => {
  const isSelectable = appearance === TagAppearance.Selectable;
  const clickable = !!onClick && !disabled;
  const showRemove = closable && !!onRemove && !disabled;
  const hasBoldLabel = isSelectable && selected;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);

    if (!clickable || event.defaultPrevented) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Re-dispatch as a click so `onClick` always receives a real MouseEvent.
      event.currentTarget.click();
    }
  };

  return (
    <span
      {...props}
      role={clickable ? 'button' : props.role}
      tabIndex={clickable ? 0 : props.tabIndex}
      aria-disabled={disabled || undefined}
      // A selectable tag is a toggle: without this the accent tint is the
      // only carrier of the state, and a screen reader announces neither.
      aria-pressed={isSelectable && clickable ? selected : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={mergeClasses(
        tagBaseClassName,
        hasBoldLabel ? 'dial-tiny-semi-text' : 'dial-tiny-text',
        tagStateClassNames[appearance][selected ? 'selected' : 'default'],
        // The design defines no disabled tag, so a disabled one keeps its
        // colours and only stops responding.
        disabled && 'cursor-not-allowed',
        clickable && [tagInteractiveClassName, tagHoverClassName],
        className,
      )}
    >
      {icon && (
        <span className="flex shrink-0 items-center" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="truncate" title={title ?? label}>
        {label}
      </span>

      {showRemove && (
        <GhostIconButton
          // 16px keeps the button inside the tag; `dial-kit-minimum-target`
          // grows only its pointer target to the 24x24 WCAG 2.5.8 minimum.
          className="size-[16px] shrink-0 dial-kit-minimum-target"
          size={ElementSize.Small}
          aria-label={removeLabel ?? `Remove ${label}`}
          icon={<IconX size={DIAL_ICON_SIZE.SM} aria-hidden="true" />}
          onClick={(event) => {
            // A closable tag may also be clickable; removing it must not also
            // activate it.
            event.stopPropagation();
            onRemove?.(event);
          }}
        />
      )}
    </span>
  );
};
