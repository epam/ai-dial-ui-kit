import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  HTMLAttributeAnchorTarget,
  ReactNode,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import {
  DialTooltip,
  type DialTooltipProps,
} from '@/components/Tooltip/Tooltip';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { getButtonClassNames } from './utils';

type TooltipProps = Omit<DialTooltipProps, 'children'>;

export interface ButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  variant?: ButtonVariant;
  size?: ElementSize;
  appearance?: ButtonAppearance;
  textClassName?: string;
  label?: ReactNode;
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  tooltipProps?: TooltipProps;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
}

/**
 * A Button component with flexible icon and text positioning
 * aliases: ActionButton|CallToAction
 *
 * @example
 * ```tsx
 * <Button
 *   label="Click me"
 *   onClick={handleClick}
 *   iconBefore={<Icon />}
 *   className="custom-button"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Button
 *   label={<span>Custom <strong>Label</strong></span>}
 *   aria-label="Custom Label"
 *   onClick={handleClick}
 * />
 * ```
 *
 * inherits all properties from the `ButtonHTMLAttributes<HTMLButtonElement>`
 *
 * The accessible name is taken from a string `label` first, then `aria-label`,
 * then — only for a button with no `label` at all — a string
 * `tooltipProps.tooltip`. Pass `aria-label` when `label` is a ReactNode, since
 * an icon-only button is otherwise unnamed.
 *
 * @param [label] - The content of the button. Can be any React node.
 * @param [variant] - Defines the visual style of the button
 * @param [appearance=ButtonAppearance.Solid] - Defines the type of the button
 * @param [size=ElementSize.Standard] - Defines the size of the button
 * @param [textClassName] - Additional CSS classes to apply specifically to the button text
 * @param [iconAfter] - Icon or element to display after the button text
 * @param [iconBefore] - Icon or element to display before the button text
 * @param [href] - Destination to navigate to. Renders an `<a>` instead of a
 * `<button>`, so the control keeps the link role, middle-click, and
 * "open in new tab". Pair it with `ButtonAppearance.Link` (or `LinkButton`)
 * unless a button-shaped link is intended.
 * @param [target] - Anchor target, only meaningful alongside `href`
 * @param [rel] - Anchor `rel`. Defaults to `noopener noreferrer` when
 * `target="_blank"`.
 */
export const Button: FC<ButtonProps> = ({
  label,
  variant,
  appearance = ButtonAppearance.Solid,
  size = ElementSize.Standard,
  className,
  textClassName,
  iconAfter,
  iconBefore,
  type = 'button',
  tooltipProps,
  href,
  target,
  rel,
  disabled,
  ...props
}) => {
  const btnClassName = mergeClasses(
    'dial-kit-base-button',
    variant && getButtonClassNames(variant, appearance),
    size === ElementSize.Small
      ? 'dial-tiny-semi-text'
      : 'dial-small-paragraph-semi-text',
    size === ElementSize.Small ? 'h-[24px] gap-1' : 'h-[40px] gap-2',
    appearance !== ButtonAppearance.Link &&
      (size === ElementSize.Small ? 'px-2' : 'px-4'),
    // A link-appearance button sits inline in text, where WCAG 2.5.5 exempts
    // it and an expanded target would overlap the surrounding copy.
    size !== ElementSize.Small &&
      appearance !== ButtonAppearance.Link &&
      'dial-kit-enhanced-target',
    className,
  );

  // A tooltip only names the button when nothing else does: as an `aria-label`
  // it would otherwise override a visible `label` that is a ReactNode.
  const tooltipFallback = label ? undefined : tooltipProps?.tooltip;

  const accessibleName = resolveAccessibleName(
    typeof label === 'string' ? label : undefined,
    props['aria-label'],
    tooltipFallback,
  );

  const content = (
    <>
      <DialIcon icon={iconBefore} />
      {label && <span className={textClassName}>{label}</span>}
      <DialIcon icon={iconAfter} />
    </>
  );

  // `ButtonProps` is typed against `<button>`, so the anchor branch has to
  // re-point the shared prop bag — handlers, `ref`, `tabIndex` — at `<a>`.
  const anchorProps =
    props as unknown as AnchorHTMLAttributes<HTMLAnchorElement>;

  // An anchor has no disabled state and never matches `:disabled`, so a
  // disabled link drops its `href` (nothing to follow), suppresses its click
  // handler, leaves the tab order, and is marked `aria-disabled` — which is
  // also what the `[aria-disabled='true']` rules in buttons.scss style against.
  const button =
    href !== undefined ? (
      <a
        {...anchorProps}
        href={disabled ? undefined : href}
        target={target}
        // A `_blank` target hands the opened page a reference back to this one
        // until the opener is severed.
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchorProps.tabIndex}
        onClick={disabled ? undefined : anchorProps.onClick}
        className={btnClassName}
        aria-label={accessibleName}
      >
        {content}
      </a>
    ) : (
      <button
        {...props}
        type={type}
        disabled={disabled}
        className={btnClassName}
        aria-label={accessibleName}
      >
        {content}
      </button>
    );

  return tooltipProps ? (
    <DialTooltip {...tooltipProps}>{button}</DialTooltip>
  ) : (
    button
  );
};
