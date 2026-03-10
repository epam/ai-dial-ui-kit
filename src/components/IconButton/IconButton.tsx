import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { getButtonClassNames } from '@/components/Button/utils';
import {
  DialTooltip,
  type DialTooltipProps,
} from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { ElementSize } from '@/types/size';

type TooltipProps = Omit<DialTooltipProps, 'children'>;

export interface DialIconButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: ButtonVariant;
  size?: ElementSize;
  appearance?: ButtonAppearance;
  icon: ReactNode;
  tooltipProps?: TooltipProps;
}

/**
 * A Icon Button component with flexible icon and text positioning
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
 * <DialIconButton
 *   aria-label="Custom Label"
 *   onClick={handleClick}
 * />
 * ```
 *
 * inherits all properties from the `ButtonHTMLAttributes<HTMLButtonElement>`
 *
 * @param [variant] - Defines the visual style of the button
 * @param [appearance=ButtonAppearance.Solid] - Defines the type of the button
 * @param [size=ElementSize.Standard] - Defines the size of the button
 * @param [tooltip] - The content of the icon button tooltip
 * @param icon - Icon display
 */
export const DialIconButton: FC<DialIconButtonProps> = ({
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
    variant && getButtonClassNames(variant, appearance),
    size === ElementSize.Small ? 'h-[24px] w-[24px]' : 'h-[40px] w-[40px]',
    'dial-icon-button disabled:cursor-not-allowed focus-visible:outline outline-offset-0 disabled:text-controls-secondary-disable',
    className,
  );

  const button = (
    <button
      {...props}
      type={type}
      className={btnClassName}
      aria-label={props['aria-label']}
    >
      {icon}
    </button>
  );
  return tooltipProps ? (
    <DialTooltip {...tooltipProps}>{button}</DialTooltip>
  ) : (
    button
  );
};
