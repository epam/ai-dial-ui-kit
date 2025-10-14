import {
  TextColor,
  type DialTypographyBaseProps,
  TextVariant,
} from '@/types/typography';
import type { ElementType, FC } from 'react';
import {
  alignClassMap,
  textColors,
  textDefaultLeadingClassMap,
  textVariantClassMap,
} from './constants';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialTextProps extends DialTypographyBaseProps {
  variant?: TextVariant;
  component?: ElementType;
  bold?: boolean;
}

/**
 * Text component.
 *
 * Use `component` to render any tag (e.g., 'span', 'p', 'label', custom component).
 * Toggle `lineHeight150` to set line-height to 150%.
 *
 * @example
 * ```tsx
 * <DialText>Body text</DialText>
 * <DialText component="p" variant={TextVariant.Small} color={TextColor.Secondary}>Paragraph small text</DialText>
 * <DialText variant={TextVariant.Small} lineHeight150>Small with 150% LH</DialText>
 * ```
 *
 * @param [variant=TextVariant.Body] - Visual text style
 * @param [color=TextColor.Primary] - Text color token (CSS variable powered)
 * @param [align] - Text alignment
 * @param [component='span'] - Rendered tag/component
 * @param [lineHeight150=false] - When true, applies `line-height: 150%`
 * @param [cssClass] - Additional utility classes for the container
 * @param [bold=false] - When true, applies `font-weight: 600`
 * @param children - Text content
 */
export const DialText: FC<DialTextProps> = ({
  variant = TextVariant.Small,
  color = TextColor.Primary,
  align,
  component = 'span',
  cssClass,
  lineHeight150 = false,
  children,
  bold = false,
}) => {
  const Tag = component;
  const leading = lineHeight150
    ? 'leading-[150%]'
    : textDefaultLeadingClassMap[variant];

  return (
    <Tag
      className={mergeClasses(
        'font-normal',
        textVariantClassMap[variant],
        textColors[color],
        leading,
        align ? alignClassMap[align] : undefined,
        bold ? 'font-semibold' : undefined,
        cssClass,
      )}
    >
      {children}
    </Tag>
  );
};
