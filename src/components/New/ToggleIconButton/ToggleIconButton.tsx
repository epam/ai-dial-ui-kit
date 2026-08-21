import type { FC, MouseEvent, ReactNode } from 'react';
import { useCallback } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { IconButton, type IconButtonProps } from '../IconButton/IconButton';
import { Tooltip, type TooltipProps } from '../Tooltip/Tooltip';

type ToggleTooltipProps = Omit<TooltipProps, 'children'>;

/*
 * `onToggle` shadows the native DOM handler of the same name, which fires for
 * `<details>` and popover elements and never for a `<button>` — so the name is
 * free to mean the toggle's own change here.
 */
export interface ToggleIconButtonProps extends Omit<
  IconButtonProps,
  'variant' | 'appearance' | 'tooltipProps' | 'onToggle'
> {
  icon: ReactNode;
  selectedIcon?: ReactNode;
  isSelected?: boolean;
  onToggle?: (isSelected: boolean) => void;
  tooltipProps?: ToggleTooltipProps;
}

/**
 * An icon button that stays pressed, for a setting the icon itself represents.
 * aliases: IconToggle|ToggleButton|BookmarkButton
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <ToggleIconButton
 *   icon={<IconBookmark />}
 *   selectedIcon={<IconBookmarkFilled />}
 *   isSelected={isBookmarked}
 *   onToggle={setIsBookmarked}
 *   tooltipProps={{ tooltip: 'Bookmark' }}
 * />
 * ```
 *
 * This is a button, not a checkbox: the state rides on `aria-pressed`, so one
 * unchanging accessible name covers both states and screen readers announce it
 * as "pressed". Do not switch the name between them — a control that renames
 * itself on click reads as a different control.
 *
 * Built on the primary ghost {@link IconButton}, which already supplies the
 * whole unselected column of the design: a secondary-grey icon that turns
 * accent on hover, an accent-alpha tint on hover and active, and a grey icon
 * when disabled. Selected keeps that accent icon at rest and swaps in
 * `selectedIcon` — usually the filled twin of `icon`.
 *
 * @param icon - Icon shown while unselected; rendered at 16px
 * @param [selectedIcon] - Icon shown while selected; falls back to `icon`
 * @param [isSelected=false] - Whether the toggle is on
 * @param [onToggle] - Callback fired with the next value when clicked
 * @param [size=ElementSize.Small] - Defines the size of the button
 * @param [tooltipProps] - Props of the 2.0 {@link Tooltip} wrapping the button
 */
export const ToggleIconButton: FC<ToggleIconButtonProps> = ({
  icon,
  selectedIcon,
  isSelected = false,
  onToggle,
  onClick,
  tooltipProps,
  size = ElementSize.Small,
  className,
  ...props
}) => {
  const onButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      onToggle?.(!isSelected);
    },
    [onClick, onToggle, isSelected],
  );

  const button = (
    <IconButton
      {...props}
      size={size}
      variant={ButtonVariant.Primary}
      appearance={ButtonAppearance.Ghost}
      icon={isSelected ? (selectedIcon ?? icon) : icon}
      aria-pressed={isSelected}
      aria-label={resolveAccessibleName(
        props['aria-label'],
        tooltipProps?.tooltip,
      )}
      onClick={onButtonClick}
      className={mergeClasses(
        '!rounded',
        // The glyph stays 16px at every size tier — only the tint square grows.
        // CSS outranks the width/height attributes Tabler renders, so callers
        // need not pass a size and the two icons can never disagree.
        '[&_svg]:size-4',
        isSelected && '!text-accent',
        className,
      )}
    />
  );

  return tooltipProps ? (
    <Tooltip asChild {...tooltipProps}>
      {button}
    </Tooltip>
  ) : (
    button
  );
};
