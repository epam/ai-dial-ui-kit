import React, {
  type FC,
  type HTMLAttributes,
  type KeyboardEvent,
  useCallback,
  useRef,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DialFormItem } from '@/components/FormItem/FormItem';

export interface DialSliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** The label text or element to display for the form item */
  label?: string | React.ReactNode;
  /** Description text to display near the label */
  labelDescription?: string;
  /** 2-element or 3-element label tuple rendered below the track */
  labels?: [string, string] | [string, string, string];
  /** Custom formatter for the thumb value; defaults to fixed-decimal based on step */
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
  /** Additional classes for the track bar (default: `bg-layer-1`) */
  trackClassName?: string;
  /** Additional classes for the filled portion of the track (default: `bg-controls-accent-primary`) */
  fillClassName?: string;
  /** Additional classes for the thumb circle (default: `bg-layer-3 text-primary dial-small-text`) */
  thumbClassName?: string;
  /** Additional classes for the labels row (default: `text-secondary dial-tiny-text`) */
  labelsClassName?: string;
  /** Additional classes for the label element (default: inherited from DialFormItem) */
  labelClassName?: string;
  /** Additional classes for the outer container (default: inherited from DialFormItem) */
  containerClassName?: string;
}

const getPrecision = (step: number): number =>
  (step.toString().split('.')[1] ?? '').length;

/**
 * A range slider with a custom thumb showing the current value and optional labels.
 * aliases: RangeInput|TemperatureSlider
 *
 * @example
 * ```tsx
 * <DialSlider
 *   value={0.5}
 *   min={0}
 *   max={1}
 *   step={0.1}
 *   labels={['Precise', 'Neutral', 'Creative']}
 *   aria-label="Temperature"
 *   onChange={(v) => console.log(v)}
 * />
 * ```
 *
 * @param value - Current slider value
 * @param [min=0] - Minimum value
 * @param [max=1] - Maximum value
 * @param [step=0.1] - Step increment
 * @param [disabled=false] - Disables interaction
 * @param [labels] - 2 or 3 strings rendered below the track (start, [middle,] end)
 * @param [formatValue] - Custom value formatter for the thumb display *
 * @param [label] - The label text or element to display for the form item
 * @param [labelDescription] - Description text to display near the label
 * @param [onChange] - Callback fired with the new value on interaction
 * @param [className] - Additional CSS classes for the outer container
 * @param [trackClassName] - Additional CSS classes for the track bar
 * @param [fillClassName] - Additional CSS classes for the fill portion of the track
 * @param [thumbClassName] - Additional CSS classes for the thumb circle
 * @param [labelsClassName] - Additional CSS classes for the labels row
 * @param [labelClassName] - Additional CSS classes for the label element
 * @param [containerClassName] - Additional CSS classes for the outer container
 */
export const DialSlider: FC<DialSliderProps> = ({
  value,
  min = 0,
  max = 1,
  step = 0.1,
  disabled = false,
  labels,
  formatValue,
  onChange,
  containerClassName,
  className,
  label,
  labelDescription,
  trackClassName,
  fillClassName,
  thumbClassName,
  labelsClassName,
  labelClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...divProps
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const percent = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100),
  );
  const precision = getPrecision(step);
  const displayValue = formatValue
    ? formatValue(value)
    : value.toFixed(precision);

  const getValueFromClientX = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const raw = min + ratio * (max - min);
      const prec = getPrecision(step);
      const snapped = parseFloat(
        (Math.round((raw - min) / step) * step + min).toFixed(prec),
      );
      return Math.min(max, Math.max(min, snapped));
    },
    [min, max, step, value],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      onChange?.(getValueFromClientX(e.clientX));
    },
    [disabled, getValueFromClientX, onChange],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.buttons === 0) return;
      onChange?.(getValueFromClientX(e.clientX));
    },
    [disabled, getValueFromClientX, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const prec = getPrecision(step);
      const snap = (v: number) =>
        parseFloat((Math.round((v - min) / step) * step + min).toFixed(prec));
      const clamp = (v: number) => Math.min(max, Math.max(min, v));

      let newValue = value;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = clamp(snap(value + step));
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = clamp(snap(value - step));
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      if (newValue !== value) onChange?.(newValue);
    },
    [disabled, value, step, min, max, onChange],
  );

  return (
    <DialFormItem
      id={divProps.id}
      label={label}
      labelClassName={labelClassName}
      description={labelDescription}
      className={containerClassName}
    >
      <div
        className={mergeClasses(
          'flex flex-col gap-2',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...divProps}
      >
        {/* Track area — 38px tall to contain the thumb without clipping */}
        <div
          ref={trackRef}
          className="relative flex h-[38px] cursor-pointer items-center"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          {/* Track bar */}
          <div
            className={mergeClasses(
              'pointer-events-none absolute inset-x-0 h-3 rounded-[10px] bg-layer-1',
              trackClassName,
            )}
          />
          {/* Fill */}
          <div
            className={mergeClasses(
              'pointer-events-none absolute left-0 h-3 rounded-[10px] bg-controls-accent-primary',
              fillClassName,
            )}
            style={{ width: `${percent}%` }}
          />
          {/* Thumb */}
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuenow={value}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-disabled={disabled || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={mergeClasses(
              'dial-small-text absolute -translate-x-1/2 flex size-[38px] cursor-grab select-none items-center justify-center rounded-full bg-layer-3 text-primary shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              thumbClassName,
            )}
            style={{ left: `${percent}%` }}
            onKeyDown={handleKeyDown}
          >
            {displayValue}
          </div>
        </div>
        {labels && (
          <div
            className={mergeClasses(
              'dial-tiny-text flex text-secondary',
              labelsClassName,
            )}
          >
            {labels.length === 3 ? (
              <>
                <span>{labels[0]}</span>
                <span className="flex-1 text-center">{labels[1]}</span>
                <span>{labels[2]}</span>
              </>
            ) : (
              <>
                <span>{labels[0]}</span>
                <span className="ml-auto">{labels[1]}</span>
              </>
            )}
          </div>
        )}
      </div>
    </DialFormItem>
  );
};
