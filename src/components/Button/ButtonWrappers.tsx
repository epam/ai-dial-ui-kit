import type { FC } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { mergeClasses } from '@/utils/merge-classes';
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
export const DialErrorButton = ButtonVariantCreator(
  ButtonVariant.Error,
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

export interface DialRoundedButtonProps extends Omit<
  DialButtonProps,
  'variant' | 'appearance'
> {
  selected?: boolean;
}

/**
 * A pill-shaped neutral button with an optional selected state.
 * @example
 * ```tsx
 * <DialRoundedButton label="Tag" selected={isActive} onClick={handleClick} />
 * ```
 *
 * Inherits all properties from `DialButtonProps` except `variant` and `appearance`.
 *
 * @param [selected=false] - Applies accent-primary tint and border when true
 */
export const DialRoundedButton: FC<DialRoundedButtonProps> = ({
  selected,
  className,
  ...props
}) => (
  <DialButton
    {...props}
    className={mergeClasses(
      'dial-neutral-rounded-button',
      selected && 'selected',
      className,
    )}
  />
);
