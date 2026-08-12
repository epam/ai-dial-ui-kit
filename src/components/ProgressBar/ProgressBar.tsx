import type { FC, HTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';

import { ElementSize } from '@/types/size';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { mergeClasses } from '@/utils/merge-classes';

type NativeProgressBarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export interface ProgressBarProps extends NativeProgressBarProps {
  value: number;
  max?: number;
  size?: ElementSize;
  label?: ReactNode;
}

/**
 * A horizontal bar indicating progress toward a goal.
 * aliases: Progress|LoadingBar|Meter
 * Design system 2.0
 *
 * Names itself from `label` through `aria-labelledby`; without one it falls back
 * to `aria-label`, and finally to `Progress` so the bar is never anonymous.
 * Prefer a real `label` — several bars all announcing "Progress" tell a screen
 * reader user nothing about which is which.
 *
 * Screen readers derive the announced percentage from the value and `max`. When
 * the raw numbers are more useful than a percentage, pass `aria-valuetext`
 * (e.g. `"3 of 10 files"`); it goes straight through to the element.
 *
 * @example
 * ```tsx
 * <ProgressBar value={40} label="Uploading" />
 * <ProgressBar value={3} max={10} aria-valuetext="3 of 10 files" />
 * <ProgressBar value={80} size={ElementSize.Small} />
 * ```
 *
 * @param value - Current progress. Clamped into `0…max`.
 * @param [max=100] - Value that counts as complete.
 * @param [size=ElementSize.Standard] - Bar height: standard is 8px, small is 4px.
 * @param [label] - Visible label rendered above the bar; also names it.
 * @param [className] - Additional classes on the track element.
 */
export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = ElementSize.Standard,
  label,
  id,
  className,
  'aria-label': ariaLabel,
  ...props
}) => {
  const generatedId = useId();
  const barId = id ?? generatedId;
  const labelId = label ? `${barId}-label` : undefined;

  // A non-positive `max` leaves no range to fill, and a non-finite `value`
  // would reach the DOM as `width: NaN%`.
  const safeMax = max > 0 ? max : 0;
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(Math.max(safeValue, 0), safeMax);
  const percentage = safeMax > 0 ? (clamped / safeMax) * 100 : 0;

  const bar = (
    <div
      {...props}
      id={barId}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-labelledby={labelId}
      aria-label={resolveAccessibleName(
        ariaLabel,
        label ? undefined : 'Progress',
      )}
      className={mergeClasses(
        'w-full overflow-hidden rounded-full bg-control-disable',
        size === ElementSize.Small ? 'h-1' : 'h-2',
        className,
      )}
    >
      <div
        // The width is the progress value, not a design token, so it cannot be
        // a utility class.
        style={{ width: `${percentage}%` }}
        className="h-full rounded-full bg-control-accent transition-[width] duration-300 motion-reduce:transition-none"
      />
    </div>
  );

  if (!label) return bar;

  return (
    <div className="flex w-full flex-col gap-1">
      <span id={labelId} className="dial-small-text text-primary">
        {label}
      </span>
      {bar}
    </div>
  );
};
