import type { FC } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { DialButton, type DialButtonProps } from './Button';

type ButtonWrapperProps = Omit<DialButtonProps, 'variant'>;

const ButtonWrapperCreator = (
  variant: ButtonVariant,
  defaultAppearance: ButtonAppearance,
): FC<ButtonWrapperProps> => {
  const ButtonWrapper: FC<ButtonWrapperProps> = ({ appearance, ...props }) => {
    return (
      <DialButton
        {...props}
        variant={variant}
        appearance={appearance || defaultAppearance}
      />
    );
  };
  return ButtonWrapper;
};
/**
 * A Primary Button component with predefined primary variant
 * @example
 * ```tsx
 * <DialPrimaryButton
 *  label="Click me"
 * onClick={handleClick}
 * className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialButtonProps`
 */
export const DialPrimaryButton = ButtonWrapperCreator(
  ButtonVariant.Primary,
  ButtonAppearance.Solid,
);

/** A Neutral Button component with predefined neutral variant
 * @example
 * ```tsx
 * <DialNeutralButton
 *  label="Click me"
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialButtonProps`
 */
export const DialNeutralButton = ButtonWrapperCreator(
  ButtonVariant.Neutral,
  ButtonAppearance.Outlined,
);

/** A Error Button component with predefined error variant
 * @example
 * ```tsx
 * <DialErrorButton
 * label="Click me"
 * onClick={handleClick}
 * className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialButtonProps`
 */
export const DialErrorButton = ButtonWrapperCreator(
  ButtonVariant.Error,
  ButtonAppearance.Outlined,
);
