import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { CalendarMode } from '@/types/calendar';

export const DEFAULT_CALENDAR_LOCALE = 'en-GB';

export const calendarModeDefaultPlaceholder: Record<CalendarMode, string> = {
  [CalendarMode.Date]: 'Select date',
  [CalendarMode.DateTime]: 'Select date and time',
  [CalendarMode.Time]: '--:--',
  [CalendarMode.Weekday]: 'Select day',
};

export const calendarFieldBaseClassName = // TODO: check after design review for input
  'flex w-full items-center justify-between gap-2 rounded-xl border border-secondary bg-layer-raised px-4 py-3 dial-small-text text-primary outline-none transition-colors hover:border-accent-alpha focus-within:border-accent-focus';

export const calendarFieldDisabledClassName = // TODO: check after design review for input
  '!cursor-not-allowed !border-transparent bg-layer-sunken text-control-disable-primary hover:!border-transparent';

export const calendarFieldInvalidClassName = '!border-error'; // TODO: check after design review for input

export const calendarPopoverClassName =
  'z-[53] flex w-[248px] flex-col gap-4 rounded-lg bg-layer-raised px-2 py-4 shadow-md';

export const calendarDayButtonBaseClassName =
  'flex size-10 items-center justify-center rounded-full dial-small-text text-primary hover:bg-control-accent-alpha-hover hover:text-primary focus:outline-none focus-visible:outline focus-visible:outline-focus';

export const calendarDaySelectedClassName =
  'bg-control-accent text-control-permanent';

export const calendarDayTodayClassName = 'text-accent dial-small-semi-text';

export const calendarDayOutsideClassName = 'text-control-disable-primary';

export const calendarFieldIconClassName = 'text-secondary';

export const calendarIcon = (
  <IconCalendar
    size={DIAL_ICON_SIZE.MD}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
    className={calendarFieldIconClassName}
  />
);

export const calendarNavIcons = {
  prev: (
    <IconChevronLeft
      size={DIAL_ICON_SIZE.SM}
      stroke={DIAL_KIT_ICON_STROKE}
      aria-hidden="true"
    />
  ),
  next: (
    <IconChevronRight
      size={DIAL_ICON_SIZE.SM}
      stroke={DIAL_KIT_ICON_STROKE}
      aria-hidden="true"
    />
  ),
};
