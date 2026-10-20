import { type FC, type KeyboardEvent, useEffect, useMemo, useRef } from 'react';

import { mergeClasses } from '@/utils/merge-classes';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0'),
);

const optionBaseClassName =
  'flex w-full shrink-0 items-center justify-center rounded-lg px-3 py-2 dial-small-text text-primary hover:bg-control-accent-alpha-hover focus:outline-hidden focus-visible:outline focus-visible:outline-focus';

const optionSelectedClassName =
  'bg-control-accent text-control-permanent hover:bg-control-accent';

interface TimeColumnProps {
  label: string;
  options: string[];
  selected: string | undefined;
  onSelect: (option: string) => void;
}

/**
 * One scrollable column of a time picker. Centers the selected option when
 * mounted and supports ArrowUp/ArrowDown/Home/End between options, so the
 * column is a single tab stop instead of 24–60.
 * @param label - accessible name of the listbox ("Hours" / "Minutes")
 * @param options - zero-padded option labels in display order
 * @param selected - currently selected option, if any
 * @param onSelect - fired with the clicked or Enter/Space-activated option
 */
const TimeColumn: FC<TimeColumnProps> = ({
  label,
  options,
  selected,
  onSelect,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !active) return;
    list.scrollTop =
      active.offsetTop - list.clientHeight / 2 + active.offsetHeight / 2;
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button'),
    );
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const target = {
      ArrowDown: buttons[index + 1],
      ArrowUp: buttons[index - 1],
      Home: buttons[0],
      End: buttons[buttons.length - 1],
    }[event.key];

    if (!target) return;
    event.preventDefault();
    target.focus();
  };

  const tabStop = selected ?? options[0];

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={label}
      tabIndex={-1}
      className="flex h-56 flex-1 flex-col gap-0.5 overflow-y-auto"
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="option"
          aria-selected={option === selected}
          tabIndex={option === tabStop ? 0 : -1}
          className={mergeClasses(
            optionBaseClassName,
            option === selected && optionSelectedClassName,
          )}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export interface TimePickerPanelProps {
  /** Current `"HH:mm"` value, or an empty/partial string when nothing is picked yet. */
  value: string;
  /** Fired with a complete `"HH:mm"` value; `done` is true once the minutes were chosen. */
  onSelect: (next: string, done: boolean) => void;
}

/**
 * Two-column hour/minute list shown in the `time` mode popover. Picking an
 * hour keeps the current minutes (or `00`); picking minutes keeps the current
 * hour (or `00`) and signals completion so the popover can close.
 * @param value - current `"HH:mm"` value
 * @param onSelect - fired with the next complete value and whether to close
 */
export const TimePickerPanel: FC<TimePickerPanelProps> = ({
  value,
  onSelect,
}) => {
  const [hours, minutes] = useMemo(() => {
    const match = /^(\d{2}):(\d{2})$/.exec(value);
    return match ? [match[1], match[2]] : [undefined, undefined];
  }, [value]);

  return (
    <div className="flex w-[168px] gap-1">
      <TimeColumn
        label="Hours"
        options={HOURS}
        selected={hours}
        onSelect={(h) => onSelect(`${h}:${minutes ?? '00'}`, false)}
      />
      <TimeColumn
        label="Minutes"
        options={MINUTES}
        selected={minutes}
        onSelect={(m) => onSelect(`${hours ?? '00'}:${m}`, true)}
      />
    </div>
  );
};
