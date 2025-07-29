import classNames from 'classnames';
import type { FC, MouseEvent, ReactNode, Ref } from 'react';

export interface Button {
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
 * <Button
 *   title="Click me"
 *   onClick={handleClick}
 *   iconBefore={<Icon />}
 *   cssClass="custom-button"
 * />
 * ```
 *
 * @param props - The button component props
 * @param props.title - The text content of the button
 * @param props.cssClass - Additional CSS classes to apply to the button
 * @param props.ref - Ref to access the button DOM element
 * @param props.onClick - Click event handler for the button
 * @param props.disable - Whether the button should be disabled
 * @param props.iconAfter - Icon or element to display after the button text
 * @param props.iconBefore - Icon or element to display before the button text
 * @param props.hideTitleOnMobile - Whether to hide the title text on mobile devices
 * @param props.ariaLabel - Accessible label for screen readers when no title is provided
 * @returns A button element
 */
export const Button: FC<Button> = ({
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
    'dial-small-text-semi',
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
      {iconBefore}
      {title && <span className={btnTextClassNames}>{title}</span>}
      {iconAfter}
    </button>
  );
};
