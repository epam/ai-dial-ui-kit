import type { FC } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { DialButton, type DialButtonProps } from './Button';

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
export const DialPrimaryButton: FC<Omit<DialButtonProps, 'variant'>> = ({
  appearance,
  ...props
}) => {
  return (
    <DialButton
      {...props}
      variant={ButtonVariant.Primary}
      appearance={appearance || ButtonAppearance.Solid}
    />
  );
};

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
export const DialNeutralButton: FC<Omit<DialButtonProps, 'variant'>> = ({
  appearance,
  ...props
}) => {
  return (
    <DialButton
      {...props}
      variant={ButtonVariant.Neutral}
      appearance={appearance || ButtonAppearance.Outlined}
    />
  );
};

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
export const DialErrorButton: FC<Omit<DialButtonProps, 'variant'>> = ({
  appearance,
  ...props
}) => {
  return (
    <DialButton
      {...props}
      variant={ButtonVariant.Error}
      appearance={appearance || ButtonAppearance.Solid}
    />
  );
};
