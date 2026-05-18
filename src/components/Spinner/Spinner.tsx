import { mergeClasses } from '@/utils/merge-classes';
import type { FC } from 'react';

export interface DialSpinnerProps {
  size?: number;
  className?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export const DialSpinner: FC<DialSpinnerProps> = ({
  size = 24,
  className,
  fullWidth = false,
  ariaLabel = 'Loading',
}) => {
  return (
    <div
      role="status"
      className={mergeClasses(
        'flex items-center justify-center',
        { 'size-full': fullWidth },
        className,
      )}
    >
      <div
        role="img"
        aria-label={ariaLabel}
        style={{ width: size, height: size }}
        className="rounded-full border-2 border-secondary border-t-accent-primary animate-spin-steps shrink-0"
      />
    </div>
  );
};
