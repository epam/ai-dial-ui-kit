import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { IconChevronDown } from '@tabler/icons-react';
import {
  type FC,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import { Label } from '@/components/New/Label/Label';
import { StaticIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { CalendarMode } from '@/types/calendar';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import {
  DEFAULT_CALENDAR_LOCALE,
  calendarDayButtonBaseClassName,
  calendarDayOutsideClassName,
  calendarDaySelectedClassName,
  calendarDayTodayClassName,
  calendarFieldBaseClassName,
  calendarFieldDisabledClassName,
  calendarFieldIconClassName,
  calendarFieldInvalidClassName,
  calendarIcon,
  calendarModeDefaultPlaceholder,
  calendarNavIcons,
  calendarPopoverClassName,
} from './constants';
import {
  formatDateLabel,
  formatDayAriaLabel,
  formatMonthLabel,
  formatTimeLabel,
  getMonthGrid,
  getWeekdayOptions,
  getWeekdayShortLabels,
  isCompleteTimeString,
  isDateOutOfRange,
  isSameDay,
  sanitizeTimeInput,
  setTimeOnDate,
} from './utils';

export type CalendarValue = Date | string | null;

export interface CalendarProps {
  mode?: CalendarMode;
  value?: CalendarValue;
  onChange?: (value: CalendarValue) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  /** BCP 47 locale tag used to localize month/weekday names and date formatting. */
  locale?: string;
  fieldClassName?: string;
}

interface CalendarPopoverFieldProps {
  id?: string;
  disabled?: boolean;
  invalid?: boolean;
  trigger: ReactNode;
  panelClassName?: string;
  fieldClassName?: string;
  panel: (close: () => void) => ReactNode;
  /**
   * Ids naming the trigger. The trigger is a `div[role="button"]`, which is not
   * a labelable element, so the `<label htmlFor>` above it is inert — the name
   * has to be wired up explicitly.
   */
  labelledBy?: string;
  /** Accessible name for the popover, which is exposed as `role="dialog"`. */
  panelLabel: string;
}

const CalendarPopoverField: FC<CalendarPopoverFieldProps> = ({
  id,
  disabled,
  invalid,
  trigger,
  panelClassName,
  fieldClassName,
  panel,
  labelledBy,
  panelLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (next) => setIsOpen(disabled ? false : next),
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const click = useClick(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <div
        id={id}
        ref={refs.setReference}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        aria-labelledby={labelledBy}
        tabIndex={disabled ? -1 : 0}
        className={mergeClasses(
          calendarFieldBaseClassName,
          'focus-visible:outline focus-visible:outline-focus-black',
          invalid && calendarFieldInvalidClassName,
          disabled && calendarFieldDisabledClassName,
          fieldClassName,
        )}
        {...getReferenceProps()}
      >
        {trigger}
      </div>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
            returnFocus
          >
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              aria-label={panelLabel}
              className={mergeClasses(calendarPopoverClassName, panelClassName)}
              {...getFloatingProps()}
            >
              {panel(() => setIsOpen(false))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};

interface TimeFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  ariaLabel?: string;
  placeholder?: string;
}

/**
 * A masked `"HH:mm"` text field. Deliberately avoids the native
 * `<input type="time">` picker overlay, whose look is browser-dependent and
 * doesn't match this design system.
 */
const TimeField: FC<TimeFieldProps> = ({
  id,
  value,
  onChange,
  disabled,
  invalid,
  className,
  ariaLabel,
  placeholder = '--:--',
}) => {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label={ariaLabel}
      placeholder={placeholder}
      disabled={disabled}
      value={draft}
      onChange={(e) => {
        const next = sanitizeTimeInput(e.target.value);
        setDraft(next);
        if (isCompleteTimeString(next)) onChange(next);
      }}
      className={mergeClasses(
        calendarFieldBaseClassName,
        invalid && calendarFieldInvalidClassName,
        disabled && calendarFieldDisabledClassName,
        className,
      )}
    />
  );
};

/**
 * A date/time picker supporting four selection modes.
 * aliases: DatePicker|DateTimePicker
 *
 * Renders a text-field trigger that opens a rounded month-grid popover for
 * the `date`/`datetime` modes, a masked `"HH:mm"` text field for `time`, and
 * a popover list of weekday names for `weekday`. Month/weekday names and
 * date formatting are localized via the `locale` prop.
 *
 * @example
 * ```tsx
 * <Calendar mode={CalendarMode.Date} value={date} onChange={setDate} />
 * <Calendar mode={CalendarMode.DateTime} value={date} onChange={setDate} />
 * <Calendar mode={CalendarMode.Time} value={time} onChange={setTime} />
 * <Calendar mode={CalendarMode.Weekday} value={weekday} onChange={setWeekday} />
 * <Calendar mode={CalendarMode.Date} value={date} onChange={setDate} locale="de-DE" />
 * ```
 *
 * @param [mode=CalendarMode.Date] - Selection mode: date, datetime, time or weekday
 * @param [value] - Controlled value: a `Date` for date/datetime, an `"HH:mm"` string for time, an ISO weekday number (`"1"`=Monday…`"7"`=Sunday) for weekday
 * @param [onChange] - Callback fired with the next value when the selection changes
 * @param [label] - Optional label rendered above the control
 * @param [placeholder] - Placeholder shown when there is no value; defaults to a mode-appropriate string ("Select date", "Select date and time", "--:--" or "Select day")
 * @param [disabled=false] - Disables the control
 * @param [invalid=false] - Applies error styling
 * @param [id] - id applied to the control, linked to the label
 * @param [className] - Additional CSS classes applied to the outer container
 * @param [minDate] - Earliest selectable date (date/datetime modes)
 * @param [maxDate] - Latest selectable date (date/datetime modes)
 * @param [locale="en-GB"] - BCP 47 locale tag used to localize month/weekday names and date formatting
 * @param [fieldClassName] - Additional classes merged onto the trigger field, overriding conflicting defaults
 */
export const Calendar: FC<CalendarProps> = ({
  mode = CalendarMode.Date,
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  invalid = false,
  id,
  className,
  minDate,
  maxDate,
  locale = DEFAULT_CALENDAR_LOCALE,
  fieldClassName,
}) => {
  const resolvedPlaceholder =
    placeholder ?? calendarModeDefaultPlaceholder[mode];
  const dateValue = value instanceof Date ? value : null;

  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  // Name the trigger from the label *and* its own content, so the field name
  // and the current value are both announced. Without the self-reference the
  // label would replace the value rather than precede it.
  const triggerLabelledBy = label ? `${labelId} ${fieldId}` : undefined;
  const [visibleMonth, setVisibleMonth] = useState(
    () => dateValue ?? new Date(),
  );
  const today = useMemo(() => new Date(), []);

  const weekdayShortLabels = useMemo(
    () => getWeekdayShortLabels(locale),
    [locale],
  );
  const weekdayOptions = useMemo(() => getWeekdayOptions(locale), [locale]);

  const grid = useMemo(
    () => getMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth],
  );

  const goToMonth = (offsetMonths: number) => {
    setVisibleMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offsetMonths, 1),
    );
  };

  const handleSelectDay = (day: Date, close: () => void) => {
    if (isDateOutOfRange(day, minDate, maxDate)) return;

    const next =
      mode === CalendarMode.DateTime && dateValue
        ? setTimeOnDate(day, formatTimeLabel(dateValue))
        : day;

    onChange?.(next);
    if (mode === CalendarMode.Date) close();
  };

  const handleTimeChange = (time: string) => {
    onChange?.(setTimeOnDate(dateValue ?? new Date(), time));
  };

  const triggerLabel = () => {
    if (!dateValue) return resolvedPlaceholder;
    return mode === CalendarMode.DateTime
      ? `${formatDateLabel(dateValue, locale)}, ${formatTimeLabel(dateValue)}`
      : formatDateLabel(dateValue, locale);
  };

  if (mode === CalendarMode.Time) {
    const timeValue =
      typeof value === 'string'
        ? value
        : dateValue
          ? formatTimeLabel(dateValue)
          : '';

    return (
      <div className={mergeClasses('flex flex-col gap-y-3', className)}>
        {label && <Label id={labelId} label={label} htmlFor={fieldId} />}
        <TimeField
          id={fieldId}
          value={timeValue}
          onChange={(next) => onChange?.(next)}
          disabled={disabled}
          invalid={invalid}
          placeholder={resolvedPlaceholder}
          className={fieldClassName}
        />
      </div>
    );
  }

  if (mode === CalendarMode.Weekday) {
    const weekdayValue = typeof value === 'string' ? value : undefined;
    const selectedOption = weekdayOptions.find((o) => o.value === weekdayValue);

    return (
      <div className={mergeClasses('flex flex-col gap-y-3', className)}>
        {label && <Label id={labelId} label={label} htmlFor={fieldId} />}
        <CalendarPopoverField
          id={fieldId}
          disabled={disabled}
          invalid={invalid}
          labelledBy={triggerLabelledBy}
          panelLabel={label ?? resolvedPlaceholder}
          fieldClassName={fieldClassName}
          trigger={
            <>
              <span
                className={mergeClasses(
                  'truncate',
                  !selectedOption && 'text-secondary',
                )}
              >
                {selectedOption?.label ?? resolvedPlaceholder}
              </span>
              <IconChevronDown
                size={DIAL_ICON_SIZE.MD}
                aria-hidden="true"
                className={calendarFieldIconClassName}
              />
            </>
          }
          panel={(close) => (
            <div
              role="listbox"
              aria-label={label ?? resolvedPlaceholder}
              className="flex flex-col gap-0.5"
            >
              {weekdayOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === weekdayValue}
                  className={mergeClasses(
                    'flex w-full items-center rounded-lg px-3 py-2 text-left dial-small-text text-primary hover:bg-control-accent-alpha-hover',
                    'focus-visible:outline focus-visible:outline-focus-black',
                    option.value === weekdayValue &&
                      'bg-control-accent-alpha-hover',
                  )}
                  onClick={() => {
                    onChange?.(option.value);
                    close();
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>
    );
  }

  return (
    <div className={mergeClasses('flex flex-col gap-y-3', className)}>
      {label && <Label id={labelId} label={label} htmlFor={fieldId} />}
      <CalendarPopoverField
        id={fieldId}
        disabled={disabled}
        invalid={invalid}
        labelledBy={triggerLabelledBy}
        panelLabel={label ?? resolvedPlaceholder}
        fieldClassName={fieldClassName}
        trigger={
          <>
            <span
              className={mergeClasses(
                'truncate',
                !dateValue && 'text-secondary',
              )}
            >
              {triggerLabel()}
            </span>
            {calendarIcon}
          </>
        }
        panel={(close) => (
          <>
            <div className="flex items-center justify-between">
              <StaticIconButton
                aria-label="Previous month"
                icon={calendarNavIcons.prev}
                size={ElementSize.Small}
                onClick={() => goToMonth(-1)}
              />
              <div
                className="dial-small-semi-text text-primary"
                aria-live="polite"
              >
                {formatMonthLabel(visibleMonth, locale)}
              </div>
              <StaticIconButton
                aria-label="Next month"
                icon={calendarNavIcons.next}
                size={ElementSize.Small}
                onClick={() => goToMonth(1)}
              />
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {/*
                Abbreviations ("Mo", "Tu") that are not associated with their
                columns, so they read as loose text. Each day button already
                announces its own weekday, making these purely visual.
              */}
              {weekdayShortLabels.map((weekday) => (
                <div
                  key={weekday}
                  aria-hidden="true"
                  className="dial-tiny-text py-1 text-secondary"
                >
                  {weekday}
                </div>
              ))}

              {grid.map((day) => {
                const outside = day.getMonth() !== visibleMonth.getMonth();
                const selected = isSameDay(day, dateValue);
                const isToday = isSameDay(day, today);
                const dayDisabled = isDateOutOfRange(day, minDate, maxDate);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={dayDisabled}
                    // The visible text is just the day number, which announces
                    // as a bare "15" with no month, year, or weekday.
                    aria-label={formatDayAriaLabel(day, locale)}
                    aria-pressed={selected}
                    aria-current={isToday ? 'date' : undefined}
                    className={mergeClasses(
                      calendarDayButtonBaseClassName,
                      outside && calendarDayOutsideClassName,
                      isToday && !selected && calendarDayTodayClassName,
                      selected && calendarDaySelectedClassName,
                      dayDisabled &&
                        'cursor-not-allowed opacity-40 hover:bg-transparent',
                    )}
                    onClick={() => handleSelectDay(day, close)}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {mode === CalendarMode.DateTime && (
              <div className="flex items-center justify-between gap-3 border-t border-secondary pt-3">
                <span className="dial-small-text text-primary">Time</span>
                <TimeField
                  ariaLabel="Time"
                  value={dateValue ? formatTimeLabel(dateValue) : ''}
                  onChange={handleTimeChange}
                  className="w-[120px] px-3 py-1.5"
                />
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};
