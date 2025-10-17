import { IconArrowUpRight } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialIcon } from '@/components/Icon/Icon';

import { mergeClasses } from '@/utils/merge-classes';

export interface DialSharedEntityIndicatorProps {
  label?: string;
  size?: number;
  cssClass?: string;
  stroke?: number;
}

/**
 * A compact icon-only indicator to denote a "shared" entity.
 *
 * Renders a small arrow-up-right icon with token-based colors.
 *
 * @example
 * ```tsx
 * <DialSharedEntityIndicator />
 * <DialSharedEntityIndicator variant={SharedEntityIndicatorVariant.Muted} />
 * <DialSharedEntityIndicator size={12} label="Opens in new window" />
 * <DialSharedEntityIndicator closable onClose={() => console.log('closed')} />
 * ```
 *
 * @param [label="Shared entity"] - Accessible label for assistive tech
 * @param [size=10] - Pixel size for the icon
 * @param [cssClass] - Additional Tailwind classes appended to the container
 * @param [stroke=2] - Stroke width for the icon
 *
 */
export const DialSharedEntityIndicator: FC<DialSharedEntityIndicatorProps> = ({
  label = 'Shared entity',
  size = 10,
  cssClass,
  stroke = 2,
}) => {
  return (
    <DialIcon
      className={mergeClasses('text-accent-primary bg-layer-3', cssClass)}
      label="Shared entity indicator"
      icon={
        <IconArrowUpRight
          size={size}
          stroke={stroke}
          aria-label={label}
          role="img"
        />
      }
    />
  );
};
