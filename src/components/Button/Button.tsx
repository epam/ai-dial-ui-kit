import classNames from 'classnames';
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { ButtonAppearance, ButtonSize, ButtonVariant } from '@/types/button';
import { getButtonClassNames } from './utils';
import { mergeClasses } from '../../utils/merge-classes';

export interface DialButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  appearance?: ButtonAppearance;
  textClassName?: string;
  label?: ReactNode;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  hideTitleOnMobile?: boolean;
}

/**
 * A Button component with flexible icon and text positioning
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
 * @param [size=ButtonSize.Standard] - Defines the size of the button
 * @param [textClassName] - Additional CSS classes to apply specifically to the button text
 * @param [iconAfter] - Icon or element to display after the button text
 * @param [iconBefore] - Icon or element to display before the button text
 * @param [hideTitleOnMobile=false] - Whether to hide the title text on mobile devices
 */
export const DialButton: FC<DialButtonProps> = ({
  label,
  variant,
  appearance = ButtonAppearance.Solid,
  size = ButtonSize.Standard,
  className,
  textClassName,
  iconAfter,
  iconBefore,
  hideTitleOnMobile,
  type = 'button',
  ...props
}) => {
  const btnTextClassName = classNames(
    hideTitleOnMobile ? 'hidden sm:inline' : 'inline',
    textClassName,
  );

  const btnClassName = mergeClasses(
    variant && getButtonClassNames(variant, appearance),
    size === ButtonSize.Small ? 'dial-tiny-text' : 'dial-small-text',
    appearance !== ButtonAppearance.Link &&
      (size === ButtonSize.Small ? 'h-[22px] px-2' : 'h-[38px] px-3'),
    'disabled:cursor-not-allowed focus-visible:outline outline-offset-0',
    className,
  );

  return (
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
};
