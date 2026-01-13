import type { FC, ReactNode } from 'react';

import { DialIcon } from '@/components/Icon/Icon';

import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg?react';

import { mergeClasses } from '@/utils/merge-classes';

export interface DialSharedEntityIndicatorProps {
  label?: ReactNode;
  size?: number;
  className?: string;
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
 * <DialSharedEntityIndicator size={12} label="Opens in new window" />
 * ```
 *
 * @param [label="Shared entity"] - Accessible label for assistive tech
 * @param [size=10] - Pixel size for the icon
 * @param [className] - Additional Tailwind classes appended to the container
 * @param [stroke=1.5] - Stroke width for the icon
 *
 */
export const DialSharedEntityIndicator: FC<DialSharedEntityIndicatorProps> = ({
  label = 'Shared entity',
  size = 10,
  className,
  stroke = 1.5,
}) => {
  return (
    <DialIcon
      className={mergeClasses('text-accent-primary', className)}
      icon={
        <ArrowUpRightIcon
          width={size}
          height={size}
          strokeWidth={stroke}
          aria-label={typeof label === 'string' ? label : undefined}
          className="bg-layer-3"
          role="img"
        />
      }
    />
  );
};
