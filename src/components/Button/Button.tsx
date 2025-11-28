import classNames from 'classnames';
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import type { ButtonVariant } from '@/types/button';
import { variantClassMap } from './constants';

export interface DialButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: ButtonVariant;
  textClassName?: string;
  label?: string;
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
 * inherits all properties from the `ButtonHTMLAttributes<HTMLButtonElement>`
 *
 * @param [label] - The text content of the button
 * @param [variant=ButtonVariant.Primary] - Defines the visual style of the button
 * @param [textClassName] - Additional CSS classes to apply specifically to the button text
 * @param [iconAfter] - Icon or element to display after the button text
 * @param [iconBefore] - Icon or element to display before the button text
 * @param [hideTitleOnMobile=false] - Whether to hide the title text on mobile devices
 */
export const DialButton: FC<DialButtonProps> = ({
  label,
  variant,
  className,
  textClassName,

  iconAfter,
  iconBefore,
  hideTitleOnMobile,
  type = 'button',
  ...props
}) => {
  const btnTextClassNames = classNames(
    'dial-small-semi',
    iconAfter ? 'mr-2' : '',
    iconBefore ? 'ml-2' : '',
    hideTitleOnMobile ? 'hidden sm:inline' : 'inline',
    textClassName,
  );
  const btnClassNames = classNames(
    variant && variantClassMap[variant],
    'focus-visible:outline outline-offset-0',
    className,
  );

  return (
    <button
      {...props}
      type={type}
      className={btnClassNames}
      aria-label={label || props['aria-label']}
    >
      <DialIcon icon={iconBefore} />
      {label && <span className={btnTextClassNames}>{label}</span>}
      <DialIcon icon={iconAfter} />
    </button>
  );
};
