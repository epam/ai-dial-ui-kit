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

type NativeTagProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export interface TagProps extends NativeTagProps {
  label: string;
  icon?: ReactNode;
  size?: ElementSize;
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
 * The label truncates rather than wrapping, and carries a native `title` so the
 * full text stays reachable when it does.
 *
 * A tag with `onClick` becomes a `role="button"` operable with Enter and Space.
 * Its remove control is a real nested `<button>`, so keep the two roles apart in
 * the caller: a clickable tag that is also closable gives a screen reader two
 * actions with no way to tell which one it landed on.
 *
 * `TagAppearance.Selectable` is the filter chip of the 2.0 design: no rim and no
 * fill until it is selected, one hover tint shared by both states, and the state
 * carried on `aria-pressed` rather than by the tint alone. Give it an `onClick` —
 * a selectable tag that cannot be activated is a colour and nothing else.
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
 * @param [size=ElementSize.Standard] - Tag height: standard is 24px, small is 20px.
 * @param [appearance=TagAppearance.Outlined] - `outlined` is the bordered chip; `selectable`
 * is the borderless filter chip that tints when selected.
 * @param [selected=false] - Applies the accent-tinted selected styling.
 * @param [disabled=false] - Dims the tag and suppresses the remove control and click handling.
 * @param [closable=false] - Renders the remove button. Needs `onRemove` to appear.
 * @param [removeLabel] - Accessible name of the remove button; defaults to `Remove <label>`.
 * @param [onRemove] - Called when the remove button is clicked. The click does not bubble to `onClick`.
 * @param [onClick] - Called when the tag itself is activated. Makes the tag a button.
 */
export const Tag: FC<TagProps> = ({
  label,
  icon,
  size = ElementSize.Standard,
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
  const isSmall = size === ElementSize.Small;
  const isSelectable = appearance === TagAppearance.Selectable;
  const clickable = !!onClick && !disabled;
  const showRemove = closable && !!onRemove && !disabled;

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
        'inline-flex max-w-full items-center border dial-tiny-text',
        isSmall
          ? 'h-[20px] gap-0.5 rounded-md px-1.5'
          : 'h-[24px] gap-1 rounded-lg px-2',
        disabled && 'cursor-not-allowed text-control-disable-primary',
        disabled &&
          (isSelectable
            ? 'border-transparent'
            : 'border-tertiary bg-layer-sunken'),
        // The selectable tag draws no rim, but keeps the border box so both
        // appearances are the same height and line up in a mixed row.
        !disabled &&
          isSelectable && [
            'border-transparent',
            selected
              ? 'bg-control-accent-alpha text-primary'
              : 'bg-transparent text-secondary',
          ],
        !disabled &&
          !isSelectable &&
          (selected
            ? 'border-accent-alpha bg-control-accent-alpha text-primary'
            : 'border-tertiary bg-layer-raised text-primary'),
        clickable && [
          'cursor-pointer outline-offset-0',
          'focus-visible:outline focus-visible:outline-focus',
          isSelectable
            ? // Selected and unselected share one hover tint, as the 2.0 overlay
              // rows do: a selected tag must not read as hovered at rest.
              'hover:bg-control-accent-alpha-hover hover:text-primary active:bg-control-accent-alpha-active'
            : selected
              ? 'hover:bg-control-accent-alpha-hover active:bg-control-accent-alpha-active'
              : 'hover:border-accent-alpha',
          // A 24px tag already clears WCAG 2.5.8; the 20px one reaches it
          // through the pseudo-element. It would sit over a nested remove
          // button and swallow its clicks, so a closable tag keeps its own.
          isSmall && !showRemove && 'dial-kit-minimum-target',
        ],
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
