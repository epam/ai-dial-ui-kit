import type { FC, ReactNode } from 'react';

import { DialIcon } from '@/components/Icon/Icon';

import { mergeClasses } from '@/utils/merge-classes';
import { IconArrowUpRight } from '@tabler/icons-react';
import { DialTooltip } from '../Tooltip/Tooltip';

export interface DialSharedEntityIndicatorProps {
  label?: ReactNode;
  size?: number;
  stroke?: number;
  className?: string;
  containerClassName?: string;
  sharedIndicatorTooltip?: ReactNode;
}

/**
 * A compact icon-only indicator to denote a "shared" entity.
 *
 * Renders a small arrow-up-right icon with token-based colors.
 *
 * @example
 * ```tsx
 * <DialSharedEntityIndicator />
 * <DialSharedEntityIndicator size={12} label="Opens in new window" />
 * ```
 *
 * @param [label="Shared entity"] - Accessible label for assistive tech
 * @param [size=10] - Pixel size for the icon
 * @param [className] - Additional Tailwind classes applied to the icon
 * @param [containerClassName] - Additional Tailwind classes appended to the container
 * @param [stroke=1.5] - Stroke width for the icon
 * @param [sharedIndicatorTooltip] - Custom tooltip content, defaults to "Shared"
 *
 */
export const DialSharedEntityIndicator: FC<DialSharedEntityIndicatorProps> = ({
  label = 'Shared entity',
  size = 14,
  className,
  containerClassName,
  stroke = 1.5,
  sharedIndicatorTooltip,
}) => {
  return (
    <DialTooltip tooltip={sharedIndicatorTooltip || 'Shared'}>
      <DialIcon
        className={mergeClasses(
          'text-accent-primary flex bg-layer-3',
          containerClassName,
        )}
        icon={
          <IconArrowUpRight
            size={size}
            stroke={stroke}
            aria-label={typeof label === 'string' ? label : undefined}
            className={className}
            role="img"
          />
        }
      />
    </DialTooltip>
  );
};
