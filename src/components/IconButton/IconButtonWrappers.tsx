import type { FC } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { DialIconButton, type DialIconButtonProps } from './IconButton';

type ButtonVariantProps = Omit<DialIconButtonProps, 'variant'>;

const IconButtonVariantCreator = (
  variant: ButtonVariant,
  defaultAppearance: ButtonAppearance,
): FC<ButtonVariantProps> => {
  const ButtonWrapper: FC<ButtonVariantProps> = ({ appearance, ...props }) => {
    return (
      <DialIconButton
        {...props}
        variant={variant}
        appearance={appearance || defaultAppearance}
      />
    );
  };
  return ButtonWrapper;
};

type ButtonAppearanceProps = Omit<DialIconButtonProps, 'appearance'>;

const IconButtonAppearanceCreator = (
  appearance: ButtonAppearance,
  defaultVariant: ButtonVariant,
): FC<ButtonAppearanceProps> => {
  const ButtonWrapper: FC<ButtonAppearanceProps> = ({ variant, ...props }) => {
    return (
      <DialIconButton
        {...props}
        variant={variant || defaultVariant}
        appearance={appearance}
      />
    );
  };
  return ButtonWrapper;
};
/**
 * A Primary Icon Button component with predefined primary variant
 * @example
 * ```tsx
 * <DialPrimaryIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialIconButtonProps`
 */
export const DialPrimaryIconButton = IconButtonVariantCreator(
  ButtonVariant.Primary,
  ButtonAppearance.Solid,
);

/** A Neutral Icon Button component with predefined neutral variant
 * @example
 * ```tsx
 * <DialNeutralIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialIconButtonProps`
 */
export const DialNeutralIconButton = IconButtonVariantCreator(
  ButtonVariant.Neutral,
  ButtonAppearance.Outlined,
);

/** A Danger Icon Button component with predefined danger variant
 * @example
 * ```tsx
 * <DialDangerIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialIconButtonProps`
 */
export const DialDangerIconButton = IconButtonVariantCreator(
  ButtonVariant.Danger,
  ButtonAppearance.Outlined,
);

/** A Secondary Icon Button component with predefined secondary variant
 * @example
 * ```tsx
 * <DialSecondaryIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialIconButtonProps`
 */
export const DialSecondaryIconButton = IconButtonVariantCreator(
  ButtonVariant.Secondary,
  ButtonAppearance.Ghost,
);

/** A Tertiary Icon Button component with predefined tertiary variant
 * @example
 * ```tsx
 * <DialTertiaryIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialIconButtonProps`
 */
export const DialTertiaryIconButton = IconButtonVariantCreator(
  ButtonVariant.Tertiary,
  ButtonAppearance.Ghost,
);

/** A Success Icon Button component with predefined success variant
 * @example
 * ```tsx
 * <DialSuccessIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialIconButtonProps`
 */
export const DialSuccessIconButton = IconButtonVariantCreator(
  ButtonVariant.Success,
  ButtonAppearance.Ghost,
);

/** A Ghost Icon Button component with predefined ghost appearance
 * @example
 * ```tsx
 * <DialGhostIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `DialIconButtonProps`
 */
export const DialGhostIconButton = IconButtonAppearanceCreator(
  ButtonAppearance.Ghost,
  ButtonVariant.Primary,
);
