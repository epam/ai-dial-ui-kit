import type { FC } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { DialButton, type DialButtonProps } from './Button';

type ButtonVariantProps = Omit<DialButtonProps, 'variant'>;

const ButtonVariantCreator = (
  variant: ButtonVariant,
  defaultAppearance: ButtonAppearance,
): FC<ButtonVariantProps> => {
  const ButtonWrapper: FC<ButtonVariantProps> = ({ appearance, ...props }) => {
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

type ButtonAppearanceProps = Omit<DialButtonProps, 'appearance'>;

const ButtonAppearanceCreator = (
  appearance: ButtonAppearance,
  defaultVariant: ButtonVariant,
): FC<ButtonAppearanceProps> => {
  const ButtonWrapper: FC<ButtonAppearanceProps> = ({ variant, ...props }) => {
    return (
      <DialButton
        {...props}
        variant={variant || defaultVariant}
        appearance={appearance}
      />
    );
  };
  return ButtonWrapper;
};
/**
 * A Primary Button component with predefined primary variant
 * Design system 1.0
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
export const DialPrimaryButton = ButtonVariantCreator(
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
export const DialNeutralButton = ButtonVariantCreator(
  ButtonVariant.Neutral,
  ButtonAppearance.Outlined,
);

/** A Danger Button component with predefined danger variant
 * @example
 * ```tsx
 * <DialDangerButton
 * label="Click me"
 * onClick={handleClick}
 * className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialButtonProps`
 */
export const DialDangerButton = ButtonVariantCreator(
  ButtonVariant.Danger,
  ButtonAppearance.Outlined,
);
/** A Link Button component with predefined link appearance
 * @example
 * ```tsx
 * <DialLinkButton
 *  label="Click me"
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialButtonProps`
 */
export const DialLinkButton = ButtonAppearanceCreator(
  ButtonAppearance.Link,
  ButtonVariant.Primary,
);
/** A Ghost Button component with predefined ghost appearance
 * @example
 * ```tsx
 * <DialGhostButton
 *  label="Click me"
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialButtonProps`
 */
export const DialGhostButton = ButtonAppearanceCreator(
  ButtonAppearance.Ghost,
  ButtonVariant.Primary,
);
