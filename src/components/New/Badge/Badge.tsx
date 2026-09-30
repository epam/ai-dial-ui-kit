import type { FC, HTMLAttributes, ReactNode } from 'react';

import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { BadgeColor, BadgeVariant } from '@/types/badge';
import { mergeClasses } from '@/utils/merge-classes';

/** Props for `Badge`. */
export interface BadgeProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'color'
> {
  /** Text of the badge. */
  label: string;
  /** How the badge is drawn. */
  variant?: BadgeVariant;
  /** Visual colour of a filled badge. Ignored by the outlined variant. */
  color?: BadgeColor;
  /** Decorative icon before the label. */
  icon?: ReactNode;
  /** Type-scale class for the label, replacing the variant's own. */
  textClassName?: string;
}

/*
 * Literal class names, one background and text pair per colour, so Tailwind's
 * content scan keeps each of them.
 */
const FILLED_COLOR_CLASS: Record<BadgeColor, string> = {
  [BadgeColor.Blue]: 'bg-blue text-blue',
  [BadgeColor.Green]: 'bg-green-2 text-green-1',
  [BadgeColor.Violet]: 'bg-violet-2 text-violet-1',
  [BadgeColor.Indigo]: 'bg-violet-1 text-violet-2',
  [BadgeColor.Brown]: 'bg-brown text-brown-2',
  [BadgeColor.Red]: 'bg-red text-red',
};

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  [BadgeVariant.Outlined]:
    'rounded-md border border-tertiary bg-layer-sunken text-secondary',
  [BadgeVariant.Filled]: 'rounded-full',
};

const VARIANT_TEXT_CLASS: Record<BadgeVariant, string> = {
  [BadgeVariant.Outlined]: 'dial-tiny-text',
  [BadgeVariant.Filled]: 'dial-caption-lead-semi-text',
};

/**
 * A short, static label: a topic, a category, or a status that is not a
 * control.
 * aliases: Label|StatusLabel|Pill|Chip
 * Design system 2.0
 *
 * Unlike `Tag`, a badge never responds to the pointer and never removes
 * itself — reach for `Tag` when the label is something to select, filter by or
 * dismiss. The badge is 24px tall and does not wrap; a long label keeps its
 * width, so give the badge a `max-w-*` and a truncating `textClassName` where
 * that matters.
 *
 * `BadgeVariant.Outlined` is the neutral label, bordered on the sunken layer.
 * `BadgeVariant.Filled` is a pill in one of the theme's visual colours, for
 * labels that are told apart by colour — so pair the colour with text that
 * says the same thing, since colour alone does not reach every reader. The
 * filled variant's type scale is a lead style, which uppercases itself: pass
 * the label in sentence case.
 *
 * @example
 * ```tsx
 * <Badge label="Translation" />
 * <Badge label="Featured" variant={BadgeVariant.Filled} color={BadgeColor.Green} />
 * ```
 *
 * @param label - Text of the badge
 * @param [variant=BadgeVariant.Outlined] - How the badge is drawn
 * @param [color=BadgeColor.Blue] - Visual colour of a filled badge
 * @param [icon] - Decorative icon before the label
 * @param [textClassName] - Type-scale class for the label, replacing the variant's own
 */
export const Badge: FC<BadgeProps> = ({
  label,
  variant = BadgeVariant.Outlined,
  color = BadgeColor.Blue,
  icon,
  textClassName,
  className,
  ...props
}) => (
  <span
    {...props}
    className={mergeClasses(
      'inline-flex h-6 w-fit shrink-0 items-center gap-1 whitespace-nowrap px-2',
      VARIANT_CLASS[variant],
      variant === BadgeVariant.Filled && FILLED_COLOR_CLASS[color],
      className,
      DIAL_KIT_CLASS.badge,
    )}
  >
    {icon && (
      <span className="flex shrink-0 items-center" aria-hidden="true">
        {icon}
      </span>
    )}
    <span className={textClassName ?? VARIANT_TEXT_CLASS[variant]}>
      {label}
    </span>
  </span>
);
