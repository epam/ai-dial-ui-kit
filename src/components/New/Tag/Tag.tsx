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
import { mergeClasses } from '@/utils/merge-classes';
import { GhostIconButton } from '../IconButton/IconButtonWrappers';

type NativeTagProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

export interface TagProps extends NativeTagProps {
  label: string;
  icon?: ReactNode;
  size?: ElementSize;
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
 * @example
 * ```tsx
 * <Tag label="TypeScript" />
 * <Tag label="TypeScript" closable onRemove={() => remove('TypeScript')} />
 * <Tag label="Drafts" selected onClick={() => toggle('Drafts')} />
 * ```
 *
 * @param label - Text content displayed inside the tag.
 * @param [icon] - Icon rendered before the label.
 * @param [size=ElementSize.Standard] - Tag height: standard is 24px, small is 20px.
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
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={mergeClasses(
        'inline-flex max-w-full items-center border dial-tiny-text',
        isSmall
          ? 'h-[20px] gap-0.5 rounded-md px-1.5'
          : 'h-[24px] gap-1 rounded-lg px-2',
        disabled && 'cursor-not-allowed border-tertiary bg-layer-sunken',
        disabled && 'text-control-disable-primary',
        !disabled &&
          (selected
            ? 'border-accent-alpha bg-control-accent-alpha text-primary'
            : 'border-tertiary bg-layer-raised text-primary'),
        clickable && [
          'cursor-pointer outline-offset-0',
          'focus-visible:outline focus-visible:outline-focus',
          selected
            ? 'hover:bg-control-accent-alpha-hover active:bg-control-accent-alpha-active'
            : 'hover:border-accent-alpha',
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
