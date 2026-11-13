import type { AnchorHTMLAttributes, FC } from 'react';

import { LinkVariant } from '@/types/link';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import {
  linkTypographyClassMap,
  linkVariantClassMap,
  type LinkSize,
} from './constants';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: LinkVariant;
  size?: ElementSize;
  disabled?: boolean;
}

const resolveSize = (size: ElementSize): LinkSize =>
  size === ElementSize.Small ? ElementSize.Small : ElementSize.Standard;

/**
 * An underlined text link for running copy, always rendered as an `<a>`.
 * aliases: Anchor|TextLink|Hyperlink|InlineLink
 * Design system 2.0
 *
 * For a button-shaped link, use `Button` with `ButtonAppearance.Link` (or
 * `LinkButton`); on an inverted surface pair it with
 * `ButtonVariant.Inverted`.
 *
 * @example
 * ```tsx
 * <p>
 *   Read the <Link href="/docs">documentation</Link> first.
 * </p>
 * ```
 *
 * @example
 * ```tsx
 * <Link href="https://example.com" target="_blank" variant={LinkVariant.Inverted}>
 *   Open in a new tab
 * </Link>
 * ```
 *
 * Inherits all properties from `AnchorHTMLAttributes<HTMLAnchorElement>`.
 *
 * @param href - Destination of the link
 * @param [variant=LinkVariant.Primary] - Color family: `Primary` (accent,
 * semibold), `Neutral` (primary text, regular) or `Inverted` (for an inverted
 * surface, semibold)
 * @param [size=ElementSize.Standard] - `Standard` (14/24) or `Small` (12/16).
 * `Large` is not designed and renders as `Standard`.
 * @param [disabled] - Drops the `href`, suppresses `onClick`, leaves the tab
 * order and marks the link `aria-disabled`. It keeps `role="link"`: an `<a>`
 * without `href` is otherwise a generic element, which loses the link role
 * and may not carry `aria-disabled`.
 * @param [target] - Anchor target
 * @param [rel] - Anchor `rel`. Defaults to `noopener noreferrer` when
 * `target="_blank"`.
 * @param [className] - Additional CSS classes for the anchor
 */
export const Link: FC<LinkProps> = ({
  href,
  variant = LinkVariant.Primary,
  size = ElementSize.Standard,
  disabled,
  target,
  rel,
  className,
  onClick,
  tabIndex,
  children,
  ...props
}) => (
  <a
    {...props}
    href={disabled ? undefined : href}
    role={disabled ? 'link' : props.role}
    target={target}
    // A `_blank` target hands the opened page a reference back to this one
    // until the opener is severed.
    rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
    aria-disabled={disabled || undefined}
    tabIndex={disabled ? -1 : tabIndex}
    onClick={disabled ? undefined : onClick}
    className={mergeClasses(
      'dial-kit-base-link',
      linkVariantClassMap[variant],
      linkTypographyClassMap[variant][resolveSize(size)],
      className,
    )}
  >
    {children}
  </a>
);
