import {
  useCallback,
  useId,
  type ChangeEvent,
  type FC,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { CaptionText, ErrorText } from '../CaptionText/CaptionText';
import { Label, type LabelProps } from '../Label/Label';
import { getTickPercents } from './utils';

/**
 * Rendered thumb diameter, mirrored from `.dial-kit-slider` in `slider.scss`.
 * The fill has to stop at the thumb's centre rather than at a plain percentage
 * of the track: the browser insets the thumb's travel by half its width at each
 * end, so an uncompensated fill runs 6px ahead of the thumb at the minimum and
 * 6px behind it at the maximum.
 */
const THUMB_SIZE = 12;

const getPrecision = (step: number): number =>
  (step.toString().split('.')[1] ?? '').length;

/** Horizontal position of the thumb's centre for a 0–100 percentage. */
const getThumbCenter = (percent: number): string =>
  `calc(${percent}% + ${(0.5 - percent / 100) * THUMB_SIZE}px)`;

/**
 * Column templates for the field row, one per combination of side slots — a
 * Tailwind class has to be a static string, so they cannot be assembled.
 */
const getGridColumns = (hasLeft: boolean, hasRight: boolean): string => {
  if (hasLeft && hasRight) {
    return 'grid-cols-[auto_minmax(0,1fr)_auto]';
  }
  if (hasLeft) {
    return 'grid-cols-[auto_minmax(0,1fr)]';
  }
  if (hasRight) {
    return 'grid-cols-[minmax(0,1fr)_auto]';
  }
  return 'grid-cols-[minmax(0,1fr)]';
};

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
>;

export interface SliderProps extends NativeInputProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  labelProps?: LabelProps;
  /** 2-element or 3-element label tuple rendered below the track */
  labels?: [string, string] | [string, string, string];
  /** Custom formatter for the displayed value; defaults to fixed-decimal based on step */
  formatValue?: (value: number) => string;
  /** Renders the current value at the end of the label row */
  showValue?: boolean;
  /** Renders the current value in a bubble above the thumb */
  showTooltip?: boolean;
  /** Renders a tick mark at every value the thumb can snap to */
  showTicks?: boolean;
  /** Content before the track, e.g. an icon */
  leftContent?: ReactNode;
  /** Content after the track, e.g. a `NumberInput` or the formatted value */
  rightContent?: ReactNode;
  caption?: string;
  error?: string;
  onChange?: (value: number) => void;
  containerClassName?: string;
  /** Additional classes for the unfilled track */
  trackClassName?: string;
  /** Additional classes for the filled portion of the track */
  fillClassName?: string;
}

/**
 * A range slider from the 2.0 design system.
 * aliases: RangeInput|TemperatureSlider|RangeSlider
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <Slider
 *   id="temperature"
 *   labelProps={{ label: 'Temperature' }}
 *   value={temperature}
 *   labels={['Precise', 'Neutral', 'Creative']}
 *   onChange={setTemperature}
 * />
 * ```
 *
 * With `showTooltip` the value sits in a bubble above the thumb, and with
 * `showTicks` the track marks every value the thumb snaps to — the discrete
 * slider of the design. `leftContent` and `rightContent` are the container's
 * side slots, centred on the track: an icon on the left, a `NumberInput` or the
 * formatted value on the right. The kit does not wire a `NumberInput` to the
 * slider; the caller passes both the same `value` and `onChange`.
 *
 * Built on a native `<input type="range">`, so the browser owns the drag, the
 * arrow / Home / End steps, touch and the writing direction. Only the thumb is
 * restyled; the track and its fill are separate elements so the fill can be
 * driven from `value`. Thumb states live in `slider.scss`, because a
 * pseudo-element cannot be reached by a utility class.
 *
 * The interactive row is 24px tall and spans the full width, so the pointer
 * target meets WCAG 2.5.8 (Minimum) but not the 44px of 2.5.5 (Enhanced) — see
 * the exception table in the README.
 *
 * @param value - Current slider value
 * @param [min=0] - Minimum value
 * @param [max=1] - Maximum value
 * @param [step=0.1] - Step increment
 * @param [disabled=false] - Whether the slider is disabled
 * @param [labelProps] - Props of the {@link Label} rendered above the track
 * @param [labels] - 2 or 3 strings rendered below the track (start, [middle,] end)
 * @param [formatValue] - Custom formatter for the displayed value; also becomes the announced `aria-valuetext`
 * @param [showValue=false] - Renders the current value at the end of the label row
 * @param [showTooltip=false] - Renders the current value in a bubble above the thumb; hidden while disabled
 * @param [showTicks=false] - Renders a tick mark at every step on the unfilled track; hidden while disabled
 * @param [leftContent] - Content before the track, vertically centred on it
 * @param [rightContent] - Content after the track, vertically centred on it
 * @param [caption] - Helper text rendered below the track, and described by the slider
 * @param [error] - Error message rendered below the track; replaces the caption
 * @param [onChange] - Callback fired with the new value
 * @param [containerClassName] - Additional classes for the outer container
 * @param [trackClassName] - Additional classes for the unfilled track
 * @param [fillClassName] - Additional classes for the filled portion of the track
 * @param [className] - Additional classes for the underlying range input
 */
export const Slider: FC<SliderProps> = ({
  id,
  value,
  min = 0,
  max = 1,
  step = 0.1,
  disabled,
  labelProps,
  labels,
  formatValue,
  showValue = false,
  showTooltip = false,
  showTicks = false,
  leftContent,
  rightContent,
  caption,
  error,
  onChange,
  containerClassName,
  trackClassName,
  fillClassName,
  className,
  ...props
}) => {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const captionId = caption && !error ? `${sliderId}-caption` : undefined;
  const errorId = error ? `${sliderId}-error` : undefined;

  const range = max - min;
  // A zero-width range would divide by zero; the thumb sits at the start.
  const percent =
    range > 0 ? Math.min(100, Math.max(0, ((value - min) / range) * 100)) : 0;
  const thumbCenter = getThumbCenter(percent);
  const ticks = showTicks && !disabled ? getTickPercents(range, step) : [];
  const tooltipVisible = showTooltip && !disabled;
  const hasLeft = leftContent != null;
  const hasRight = rightContent != null;

  const displayValue = formatValue
    ? formatValue(value)
    : value.toFixed(getPrecision(step));

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    },
    [onChange],
  );

  return (
    <div className={mergeClasses('flex flex-col gap-2', containerClassName)}>
      {(labelProps || showValue) && (
        <div className="flex items-center gap-2">
          {labelProps && <Label {...labelProps} htmlFor={sliderId} />}
          {showValue && (
            // The input already reports its value to assistive tech, so this is
            // a visual echo rather than a second announcement.
            <span
              aria-hidden="true"
              className={mergeClasses(
                'dial-small-text ml-auto',
                disabled ? 'text-control-disable-primary' : 'text-primary',
              )}
            >
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div
          className={mergeClasses(
            'grid items-center gap-x-3 gap-y-1',
            getGridColumns(hasLeft, hasRight),
            // Room for the value bubble, which hangs above the track row.
            tooltipVisible && 'mt-7',
          )}
        >
          {hasLeft && <div className="flex items-center">{leftContent}</div>}

          <div className="relative flex h-6 items-center">
            <div
              className={mergeClasses(
                'pointer-events-none absolute inset-x-0 h-1 rounded-full',
                disabled
                  ? 'bg-control-disable-primary'
                  : 'bg-control-accent-alpha-hover',
                trackClassName,
              )}
            />
            {ticks.map((tickPercent) => (
              <span
                key={tickPercent}
                aria-hidden="true"
                className="pointer-events-none absolute size-0.5 -translate-x-1/2 rounded-full bg-control-neutral-default"
                style={{ left: getThumbCenter(tickPercent) }}
              />
            ))}
            <div
              className={mergeClasses(
                'pointer-events-none absolute left-0 h-1 rounded-full',
                disabled ? 'bg-control-disable-secondary' : 'bg-control-accent',
                fillClassName,
              )}
              style={{ width: thumbCenter }}
            />
            {tooltipVisible && (
              // A visual echo like `showValue`: the input already announces
              // its value, so the bubble stays out of the accessibility tree.
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full mb-0.5 flex -translate-x-1/2 flex-col items-center"
                style={{ left: thumbCenter }}
              >
                <span className="whitespace-nowrap rounded-md bg-control-inverted px-2 py-0.5 dial-small-text text-control-inverted shadow-xs">
                  {displayValue}
                </span>
                <svg
                  width="8"
                  height="4"
                  viewBox="0 0 8 4"
                  className="fill-control-inverted"
                >
                  <path d="M0 0h8L4 4z" />
                </svg>
              </span>
            )}
            <input
              {...props}
              type="range"
              id={sliderId}
              value={value}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              onChange={handleChange}
              aria-label={resolveAccessibleName(
                typeof labelProps?.label !== 'string'
                  ? props['aria-label']
                  : undefined,
              )}
              // Without this a formatted slider is announced as its raw number —
              // "0.7" instead of the "70%" the user can see.
              aria-valuetext={formatValue ? displayValue : undefined}
              aria-describedby={errorId ?? captionId}
              className={mergeClasses(
                'dial-kit-slider absolute inset-0 h-full w-full',
                className,
              )}
            />
          </div>

          {hasRight && <div className="flex items-center">{rightContent}</div>}

          {labels && (
            <div
              className={mergeClasses(
                'dial-tiny-text flex text-secondary',
                hasLeft && 'col-start-2',
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

        <ErrorText id={errorId} text={error} />
        {!error && <CaptionText id={captionId} text={caption} />}
      </div>
    </div>
  );
};
