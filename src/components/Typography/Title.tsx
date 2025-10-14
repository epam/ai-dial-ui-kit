import type { FC } from 'react';
import { TextColor, type DialTypographyBaseProps } from '@/types/typography';
import {
  alignClassMap,
  defaultTitleTagByLevel,
  textColors,
  titleLevelClassMap,
} from './constants';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialTitleProps extends DialTypographyBaseProps {
  level?: 1 | 2 | 3;
}

/**
 * Title with levels (1–3).
 *
 * Uses Tailwind utility classes sourced from constants and supports:
 * - color, alignment, custom classes via shared base props
 *
 * @example
 * ```tsx
 * <DialTitle>Dashboard</DialTitle>
 * <DialTitle level={2} color={TextColor.Secondary}>Section</DialTitle>
 * <DialTitle level={3}>Subsection</DialTitle>
 * ```
 *
 * @param [level=1] - Visual level (1–3)
 * @param [color=TextColor.Primary] - Text color token (utility class)
 * @param [align] - Text alignment
 * @param [cssClass] - Additional utility classes
 * @param [id] - Optional id attribute
 * @param children - Title text
 */
export const DialTitle: FC<DialTitleProps> = ({
  level = 1,
  color = TextColor.Primary,
  align,
  cssClass,
  id,
  children,
}) => {
  const Tag = defaultTitleTagByLevel[level];

  return (
    <Tag
      id={id}
      className={mergeClasses(
        titleLevelClassMap[level],
        textColors[color],
        align ? alignClassMap[align] : undefined,
        cssClass,
      )}
    >
      {children}
    </Tag>
  );
};

export default DialTitle;
