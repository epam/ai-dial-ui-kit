import type { FC } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { Button, type ButtonProps } from './Button';

type ButtonVariantProps = Omit<ButtonProps, 'variant'>;

const ButtonVariantCreator = (
  variant: ButtonVariant,
  defaultAppearance: ButtonAppearance,
): FC<ButtonVariantProps> => {
  const ButtonWrapper: FC<ButtonVariantProps> = ({ appearance, ...props }) => {
    return (
      <Button
        {...props}
        variant={variant}
        appearance={appearance || defaultAppearance}
      />
    );
  };
  return ButtonWrapper;
};

type ButtonAppearanceProps = Omit<ButtonProps, 'appearance'>;

const ButtonAppearanceCreator = (
  appearance: ButtonAppearance,
  defaultVariant: ButtonVariant,
): FC<ButtonAppearanceProps> => {
  const ButtonWrapper: FC<ButtonAppearanceProps> = ({ variant, ...props }) => {
    return (
      <Button
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
 * @example
 * ```tsx
 * <PrimaryButton
 *  label="Click me"
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `ButtonProps`
 */
export const PrimaryButton = ButtonVariantCreator(
  ButtonVariant.Primary,
  ButtonAppearance.Solid,
);

/** A Neutral Button component with predefined neutral variant
 * @example
 * ```tsx
 * <NeutralButton
 *  label="Click me"
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `ButtonProps`
 */
export const NeutralButton = ButtonVariantCreator(
  ButtonVariant.Neutral,
  ButtonAppearance.Solid,
);

/** A Danger Button component with predefined danger variant
 * @example
 * ```tsx
 * <DangerButton
 * label="Click me"
 * onClick={handleClick}
 * className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `ButtonProps`
 */
export const DangerButton = ButtonVariantCreator(
  ButtonVariant.Danger,
  ButtonAppearance.Solid,
);
/** A Link Button component with predefined link appearance
 * @example
 * ```tsx
 * <LinkButton
 *  label="Click me"
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Pass `href` to navigate: the control then renders a real `<a>`, so it keeps
 * the link role, middle-click, and "open in new tab". Without `href` it stays a
 * `<button>` and needs an `onClick`.
 *
 * @example
 * ```tsx
 * <LinkButton label="Read the docs" href="/docs" />
 * <LinkButton label="Open dashboard" href="https://example.com" target="_blank" />
 * ```
 *
 * Inherits all properties from the `ButtonProps`
 */
export const LinkButton = ButtonAppearanceCreator(
  ButtonAppearance.Link,
  ButtonVariant.Primary,
);
/** A Ghost Button component with predefined ghost appearance
 * @example
 * ```tsx
 * <GhostButton
 *  label="Click me"
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `ButtonProps`
 */
export const GhostButton = ButtonAppearanceCreator(
  ButtonAppearance.Ghost,
  ButtonVariant.Primary,
);

/** An Outlined Button component with predefined outlined appearance
 * @example
 * ```tsx
 * <OutlinedButton
 * label="Click me"
 * onClick={handleClick}
 * className="custom-button"
 * />
 * ```
 *  Inherits all properties from the `ButtonProps`
 */
export const OutlinedButton = ButtonAppearanceCreator(
  ButtonAppearance.Outlined,
  ButtonVariant.Neutral,
);
