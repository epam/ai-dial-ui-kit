import classNames from 'classnames';
import type { FC, MouseEvent, ReactNode, Ref } from 'react';

import { DialIcon } from '@/components/Icon/Icon';

export interface DialButton {
  cssClass?: string;
  disable?: boolean;
  title?: string;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  ref?: Ref<HTMLButtonElement>;
  hideTitleOnMobile?: boolean;
  ariaLabel?: string;
}

/**
 * A Button component with flexible icon and text positioning
 *
 * @example
 * ```tsx
 * <DialButton
 *   title="Click me"
 *   onClick={handleClick}
 *   iconBefore={<Icon />}
 *   cssClass="custom-button"
 * />
 * ```
 *
 * @param optional title - The text content of the button
 * @param optional cssClass - Additional CSS classes to apply to the button
 * @param optional onClick - Click event handler for the button
 * @param optional disable - Whether the button should be disabled
 * @default false
 * @param optional iconAfter - Icon or element to display after the button text
 * @param optional iconBefore - Icon or element to display before the button text
 * @param optional hideTitleOnMobile - Whether to hide the title text on mobile devices
 * @default false
 * @param optional ariaLabel - Accessible label for screen readers when no title is provided
 * @param optional ref - Ref to access the button DOM element
 */
export const DialButton: FC<DialButton> = ({
  title,
  cssClass,
  ref,
  onClick,
  disable,
  iconAfter,
  iconBefore,
  hideTitleOnMobile,
  ariaLabel,
}) => {
  const btnTextClassNames = classNames(
    'dial-small-semi',
    iconAfter ? 'mr-2' : '',
    iconBefore ? 'ml-2' : '',
    hideTitleOnMobile ? 'hidden sm:inline' : 'inline',
  );
  const btnClassNames = classNames(
    cssClass,
    'focus-visible:outline outline-offset-0',
  );

  return (
    <button
      ref={ref}
      type="button"
      className={btnClassNames}
      onClick={(e) => onClick?.(e)}
      disabled={disable}
      aria-label={title || ariaLabel}
    >
      <DialIcon icon={iconBefore} />
      {title && <span className={btnTextClassNames}>{title}</span>}
      <DialIcon icon={iconAfter} />
    </button>
  );
};
