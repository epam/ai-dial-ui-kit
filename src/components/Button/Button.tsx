import classNames from 'classnames';
import type { ButtonHTMLAttributes, FC, ReactNode, Ref } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import type { ButtonVariant } from '@/types/button';
import { variantClassMap } from './constants';

export interface DialButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  textClassName?: string;
  label?: string;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
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
 * @param [label] - The text content of the button
 * @param [type='button'] - The HTML button type attribute
 * @param [variant=ButtonVariant.Primary] - Defines the visual style of the button
 * @param [className] - Additional CSS classes to apply to the button
 * @param [textClassName] - Additional CSS classes to apply specifically to the button text
 * @param [onClick] - Click event handler for the button
 * @param [disabled=false] - Whether the button should be disabled
 * @param [iconAfter] - Icon or element to display after the button text
 * @param [iconBefore] - Icon or element to display before the button text
 * @param [hideTitleOnMobile=false] - Whether to hide the title text on mobile devices
 * @param [aria-label] - Accessible label for screen readers when no title is provided
 * @param [ref] - Ref to access the button DOM element
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
  ...restProps
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
      {...restProps}
      type={type}
      className={btnClassNames}
      aria-label={label || restProps['aria-label']}
    >
      <DialIcon icon={iconBefore} />
      {label && <span className={btnTextClassNames}>{label}</span>}
      <DialIcon icon={iconAfter} />
    </button>
  );
};
