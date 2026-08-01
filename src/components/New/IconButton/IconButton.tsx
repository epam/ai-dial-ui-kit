import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import {
  DialTooltip,
  type DialTooltipProps,
} from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { ElementSize } from '@/types/size';
import { getButtonClassNames } from '../Button/utils';

type TooltipProps = Omit<DialTooltipProps, 'children'>;

export interface IconButtonProps extends DetailedHTMLProps<
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
 * aliases: IconicButton|SymbolButton
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
 * @param [variant] - Defines the visual style of the button
 * @param [appearance=ButtonAppearance.Solid] - Defines the type of the button
 * @param [size=ElementSize.Standard] - Defines the size of the button
 * @param [tooltip] - The content of the icon button tooltip
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
    'dial-kit-base-button',
    variant && getButtonClassNames(variant, appearance),
    size === ElementSize.Small ? 'size-[24px]' : 'size-[40px]',
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
