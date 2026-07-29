import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { CalendarMode } from '@/types/calendar';

export const DEFAULT_CALENDAR_LOCALE = 'en-GB';

export const calendarModeDefaultPlaceholder: Record<CalendarMode, string> = {
  [CalendarMode.Date]: 'Select date',
  [CalendarMode.DateTime]: 'Select date and time',
  [CalendarMode.Time]: '--:--',
  [CalendarMode.Weekday]: 'Select day',
};

export const calendarFieldBaseClassName =
  'flex w-full items-center justify-between gap-2 rounded-xl border border-secondary bg-layer-0 px-4 py-3 dial-small-text text-primary outline-none transition-colors hover:border-accent-primary focus-within:border-accent-primary';

export const calendarFieldDisabledClassName =
  '!cursor-not-allowed !border-transparent bg-controls-disable text-controls-primary-disable hover:!border-transparent';

export const calendarFieldInvalidClassName = '!border-error';

export const calendarPopoverClassName =
  'z-[53] flex w-[248px] flex-col gap-4 rounded-lg bg-layer-0 px-3 py-4 shadow-md';

export const calendarDayButtonBaseClassName =
  'flex size-8 items-center justify-center rounded-full dial-small-text text-primary hover:bg-control-accent-alpha focus:outline-none focus-visible:outline';

export const calendarDaySelectedClassName =
  'bg-control-accent text-controls-permanent hover:bg-control-accent';

export const calendarDayTodayClassName = 'text-accent font-semibold';

export const calendarDayOutsideClassName = 'text-secondary opacity-50';

export const calendarFieldIconClassName = 'text-secondary';

export const calendarIcon = (
  <IconCalendar
    size={DIAL_ICON_SIZE.MD}
    className={calendarFieldIconClassName}
  />
);

export const calendarNavIcons = {
  prev: <IconChevronLeft size={DIAL_ICON_SIZE.SM} />,
  next: <IconChevronRight size={DIAL_ICON_SIZE.SM} />,
};
