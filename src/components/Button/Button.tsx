import classNames from 'classnames';
import type { FC, MouseEvent, ReactNode, Ref } from 'react';
import { DialIcon } from '../Icon/Icon';

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
 * @param title - The text content of the button
 * @param cssClass - Additional CSS classes to apply to the button
 * @param onClick - Click event handler for the button
 * @param disable - Whether the button should be disabled
 * @param iconAfter - Icon or element to display after the button text
 * @param iconBefore - Icon or element to display before the button text
 * @param hideTitleOnMobile - Whether to hide the title text on mobile devices
 * @param ariaLabel - Accessible label for screen readers when no title is provided
 * @param ref - Ref to access the button DOM element
 * @returns A button element
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
