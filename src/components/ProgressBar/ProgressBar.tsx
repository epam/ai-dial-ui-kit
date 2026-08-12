import { mergeClasses } from '@/utils/merge-classes';
import type { FC } from 'react';

export enum DialProgressBarSize {
  Small = 'sm',
  Medium = 'md',
}

export interface DialProgressBarProps {
  value: number;
  max?: number;
  size?: DialProgressBarSize;
  className?: string;
  ariaLabel?: string;
}

const sizeClasses: Record<DialProgressBarSize, string> = {
  [DialProgressBarSize.Small]: 'h-1',
  [DialProgressBarSize.Medium]: 'h-2',
};

/**
 * Design system 1.0
 */
export const DialProgressBar: FC<DialProgressBarProps> = ({
  value,
  max = 100,
  size = DialProgressBarSize.Medium,
  className,
  ariaLabel = 'Progress',
}) => {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
      className={mergeClasses(
        'w-full overflow-hidden rounded-full bg-layer-4',
        sizeClasses[size],
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-controls-accent-primary transition-[width] duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
