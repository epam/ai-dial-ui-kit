import type { FC } from 'react';

import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { IconButton, type IconButtonProps } from './IconButton';

type ButtonVariantProps = Omit<IconButtonProps, 'variant'>;

const IconButtonVariantCreator = (
  variant: ButtonVariant,
  defaultAppearance: ButtonAppearance,
): FC<ButtonVariantProps> => {
  const ButtonWrapper: FC<ButtonVariantProps> = ({ appearance, ...props }) => {
    return (
      <IconButton
        {...props}
        variant={variant}
        appearance={appearance || defaultAppearance}
      />
    );
  };
  return ButtonWrapper;
};

type ButtonAppearanceProps = Omit<IconButtonProps, 'appearance'>;

const IconButtonAppearanceCreator = (
  appearance: ButtonAppearance,
  defaultVariant: ButtonVariant,
): FC<ButtonAppearanceProps> => {
  const ButtonWrapper: FC<ButtonAppearanceProps> = ({ variant, ...props }) => {
    return (
      <IconButton
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
 * <PrimaryIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `IconButtonProps`
 */
export const PrimaryIconButton = IconButtonVariantCreator(
  ButtonVariant.Primary,
  ButtonAppearance.Solid,
);

/** A Neutral Icon Button component with predefined neutral variant
 * @example
 * ```tsx
 * <NeutralIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `IconButtonProps`
 */
export const NeutralIconButton = IconButtonVariantCreator(
  ButtonVariant.Neutral,
  ButtonAppearance.Solid,
);

/** A Danger Icon Button component with predefined danger variant
 * @example
 * ```tsx
 * <DangerIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `IconButtonProps`
 */
export const DangerIconButton = IconButtonVariantCreator(
  ButtonVariant.Danger,
  ButtonAppearance.Ghost,
);

/** A Ghost Icon Button component with predefined ghost appearance
 * @example
 * ```tsx
 * <GhostIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 *  className="custom-button"
 * />
 * ```
 *
 * Inherits all properties from the `IconButtonProps`
 */
export const GhostIconButton = IconButtonAppearanceCreator(
  ButtonAppearance.Ghost,
  ButtonVariant.Primary,
);

/** A Outlined Icon Button component with predefined outlined appearance
 * @example
 * ```tsx
 * <StaticIconButton
 *  icon={<Icon />}
 *  onClick={handleClick}
 * className="custom-button"
 * />
 * ```
 * Inherits all properties from the `IconButtonProps`
 */
export const StaticIconButton = IconButtonAppearanceCreator(
  ButtonAppearance.Solid,
  ButtonVariant.Static,
);
