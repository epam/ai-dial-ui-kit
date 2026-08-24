import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { ElementSize } from '@/types/size';
import { Tooltip, type TooltipProps } from '../Tooltip/Tooltip';
import { getButtonClassNames } from '../Button/utils';

type IconButtonTooltipProps = Omit<TooltipProps, 'children'>;

/** Square footprint per size, matching the field heights in `input.scss`. */
const SIZE_CLASS: Record<ElementSize, string> = {
  [ElementSize.Small]: 'size-[24px]',
  [ElementSize.Standard]: 'size-[40px] dial-kit-enhanced-target',
  [ElementSize.Large]: 'size-[48px] dial-kit-enhanced-target',
};

export interface IconButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  variant?: ButtonVariant;
  size?: ElementSize;
  appearance?: ButtonAppearance;
  icon: ReactNode;
  tooltipProps?: IconButtonTooltipProps;
}

/**
 * A Icon Button component with flexible icon and text positioning
 * aliases: IconicButton|SymbolButton
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <DialIconButton
 *   onClick={handleClick}
 *   icon={<Icon />}
 *   className="custom-button"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <IconButton
 *   aria-label="Custom Label"
 *   onClick={handleClick}
 * />
 * ```
 *
 * inherits all properties from the `ButtonHTMLAttributes<HTMLButtonElement>`
 *
 * The button is icon-only, so it needs an accessible name: pass `aria-label`,
 * or a string `tooltipProps.tooltip`, which is used as the label when no
 * `aria-label` is given.
 *
 * @param [variant] - Defines the visual style of the button
 * @param [appearance=ButtonAppearance.Solid] - Defines the type of the button
 * @param [size=ElementSize.Standard] - Defines the size of the button
 * @param [tooltipProps] - Props of the 2.0 {@link Tooltip} wrapping the button
 * @param icon - Icon display
 */
export const IconButton: FC<IconButtonProps> = ({
  variant,
  appearance = ButtonAppearance.Solid,
  size = ElementSize.Standard,
  className,
  icon,
  tooltipProps,
  type = 'button',
  ...props
}) => {
  const btnClassName = mergeClasses(
    'dial-kit-base-icon-button dial-kit-base-button',
    variant && getButtonClassNames(variant, appearance),
    // 24px is below the AAA target size, so only the larger tiers get the
    // enhanced pointer target — see the accessibility rules in AGENTS.md.
    SIZE_CLASS[size],
    className,
  );

  const button = (
    <button
      {...props}
      type={type}
      className={btnClassName}
      aria-label={resolveAccessibleName(
        props['aria-label'],
        tooltipProps?.tooltip,
      )}
    >
      {icon}
    </button>
  );

  // `asChild` puts the tooltip's `aria-describedby` on the button itself; a
  // wrapper <span> would keep the text away from assistive technology.
  return tooltipProps ? (
    <Tooltip asChild {...tooltipProps}>
      {button}
    </Tooltip>
  ) : (
    button
  );
};
