import { type CSSProperties, type FC, useId } from 'react';

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
 * Design system 2.0
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
/*
 * The icon stroke gradient, in the 24×24 user space of a Tabler icon. It is the
 * design's `linear-gradient(119.74deg, … -10.06%, … 115.51%)` projected onto
 * that box, so the stops can sit at 0 and 1.
 */
const STARTER_ICON_GRADIENT = {
  x1: '-5.06',
  y1: '2.26',
  x2: '30.62',
  y2: '22.63',
  from: 'var(--stroke-gradient-1, #5976E9)',
  to: 'var(--stroke-gradient-2, #885DF2)',
};

/** A Starter Button component — a conversation starter: an outlined neutral
 * pill whose icons are stroked with the accent gradient
 * Design system 2.0
 *
 * An SVG stroke cannot take a CSS gradient, so the button renders its own
 * `linearGradient` with a per-instance id and hands it to its icons through
 * the `--dial-kit-starter-icon-stroke` custom property. Any icon that strokes
 * with `currentColor`, as Tabler icons do, picks it up.
 * @example
 * ```tsx
 * <StarterButton
 *  label="Summarize this document"
 *  iconBefore={<IconSparkles />}
 *  onClick={handleClick}
 * />
 * ```
 *
 * Inherits all properties from the `ButtonProps`
 */
export const StarterButton: FC<ButtonVariantProps> = ({
  appearance = ButtonAppearance.Outlined,
  iconBefore,
  iconAfter,
  style,
  ...props
}) => {
  // `useId` output contains `:` or `«»`, which are unsafe inside `url(#…)`.
  const gradientId = `dial-kit-starter-gradient-${useId().replace(/[^\w-]/g, '')}`;

  // A zero-size box rather than `display: none`: browsers do not paint a
  // gradient whose defining `<svg>` is not rendered.
  const gradient = (
    <svg
      className="pointer-events-none absolute size-0 overflow-hidden"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1={STARTER_ICON_GRADIENT.x1}
          y1={STARTER_ICON_GRADIENT.y1}
          x2={STARTER_ICON_GRADIENT.x2}
          y2={STARTER_ICON_GRADIENT.y2}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={STARTER_ICON_GRADIENT.from} />
          <stop offset="1" stopColor={STARTER_ICON_GRADIENT.to} />
        </linearGradient>
      </defs>
    </svg>
  );

  // The definition rides along with the first icon, so a label-only button
  // renders no extra icon slot.
  const withGradient = (icon: ButtonProps['iconBefore']) => (
    <>
      {gradient}
      {icon}
    </>
  );

  return (
    <Button
      {...props}
      variant={ButtonVariant.Starter}
      appearance={appearance}
      iconBefore={iconBefore ? withGradient(iconBefore) : undefined}
      iconAfter={iconAfter && !iconBefore ? withGradient(iconAfter) : iconAfter}
      style={
        {
          '--dial-kit-starter-icon-stroke': `url(#${gradientId})`,
          ...style,
        } as CSSProperties
      }
    />
  );
};

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
