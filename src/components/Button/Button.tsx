import classNames from 'classnames';
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { getButtonClassNames } from './utils';
import { mergeClasses } from '@/utils/merge-classes';
import { ElementSize } from '@/types/size';
import {
  DialTooltip,
  type DialTooltipProps,
} from '@/components/Tooltip/Tooltip';

type TooltipProps = Omit<DialTooltipProps, 'children'>;

export interface DialButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  variant?: ButtonVariant;
  size?: ElementSize;
  appearance?: ButtonAppearance;
  textClassName?: string;
  label?: ReactNode;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  hideTitleOnMobile?: boolean;
  tooltipProps?: TooltipProps;
}

/**
 * A Button component with flexible icon and text positioning
 * aliases: ActionButton|CallToAction
 *
 * @example
 * ```tsx
 * <DialButton
 *   label="Click me"
 *   onClick={handleClick}
 *   iconBefore={<Icon />}
 *   className="custom-button"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DialButton
 *   label={<span>Custom <strong>Label</strong></span>}
 *   aria-label="Custom Label"
 *   onClick={handleClick}
 * />
 * ```
 *
 * inherits all properties from the `ButtonHTMLAttributes<HTMLButtonElement>`
 *
 * @param [label] - The content of the button. Can be any React node.
 * @param [variant] - Defines the visual style of the button
 * @param [appearance=ButtonAppearance.Solid] - Defines the type of the button
 * @param [size=ElementSize.Standard] - Defines the size of the button
 * @param [textClassName] - Additional CSS classes to apply specifically to the button text
 * @param [iconAfter] - Icon or element to display after the button text
 * @param [iconBefore] - Icon or element to display before the button text
 * @param [hideTitleOnMobile=false] - Whether to hide the title text on mobile devices
 */
export const DialButton: FC<DialButtonProps> = ({
  label,
  variant,
  appearance = ButtonAppearance.Solid,
  size = ElementSize.Standard,
  className,
  textClassName,
  iconAfter,
  iconBefore,
  hideTitleOnMobile,
  type = 'button',
  tooltipProps,
  ...props
}) => {
  const btnTextClassName = classNames(
    hideTitleOnMobile ? 'hidden sm:inline' : 'inline',
    textClassName,
  );

  const btnClassName = mergeClasses(
    variant && getButtonClassNames(variant, appearance),
    size === ElementSize.Small ? 'dial-tiny-semi-text' : 'dial-small-semi-text',
    appearance !== ButtonAppearance.Link &&
      (size === ElementSize.Small ? 'h-[24px] px-2' : 'h-[40px] px-3'),
    // A link-appearance button sits inline in text, where WCAG 2.5.5 exempts
    // it and an expanded target would overlap the surrounding copy.
    size !== ElementSize.Small &&
      appearance !== ButtonAppearance.Link &&
      'dial-kit-enhanced-target',
    'disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-focus-black outline-offset-0',
    className,
  );

  const button = (
    <button
      {...props}
      type={type}
      className={btnClassName}
      aria-label={(typeof label === 'string' && label) || props['aria-label']}
    >
      <DialIcon icon={iconBefore} />
      {label && <span className={btnTextClassName}>{label}</span>}
      <DialIcon icon={iconAfter} />
    </button>
  );

  return tooltipProps ? (
    <DialTooltip {...tooltipProps}>{button}</DialTooltip>
  ) : (
    button
  );
};
