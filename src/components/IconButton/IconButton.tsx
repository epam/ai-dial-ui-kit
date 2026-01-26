import classNames from 'classnames';
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  ReactNode,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { ButtonAppearance, ButtonSize, ButtonVariant } from '@/types/button';
import { getButtonClassNames } from '@/components/Button/utils';

export interface DialIconButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: ButtonVariant;
  size?: ButtonSize;
  appearance?: ButtonAppearance;
  icon: ReactNode;
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
 * @param [size=ButtonSize.Standard] - Defines the size of the button
 * @param icon - Icon display
 */
export const DialIconButton: FC<DialIconButtonProps> = ({
  variant,
  appearance = ButtonAppearance.Solid,
  size = ButtonSize.Standard,
  className,
  icon,
  type = 'button',
  ...props
}) => {
  const btnClassName = classNames(
    variant && getButtonClassNames(variant, appearance),
    size === ButtonSize.Small ? 'min-h-[24px] p-1' : 'min-h-[40px] p-2',
    'dial-icon-button disabled:cursor-not-allowed focus-visible:outline outline-offset-0',
    className,
  );

  return (
    <button
      {...props}
      type={type}
      className={btnClassName}
      aria-label={props['aria-label']}
    >
      <DialIcon icon={icon} />
    </button>
  );
};
