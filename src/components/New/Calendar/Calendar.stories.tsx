import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { CalendarMode } from '@/types/calendar';
import { Calendar, type CalendarProps, type CalendarValue } from './Calendar';

const meta = {
  title: 'Components_2_0/Calendar',
  component: Calendar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A date/time picker supporting four selection modes: `date`, `datetime`, `time` and `weekday`. The date and datetime modes open a rounded month-grid popover; time renders a native time field; weekday renders a popover list of weekday names. Month/weekday names and date formatting are localized via the `locale` prop.',
      },
    },
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: Object.values(CalendarMode),
    },
    value: { control: false },
    onChange: { control: false },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    labelProps: { control: { type: 'object' } },
    placeholder: { control: { type: 'text' } },
    locale: { control: { type: 'text' } },
    fieldClassName: { control: { type: 'text' } },
  },
  args: {
    labelProps: { label: 'Date' },
    placeholder: 'Select date',
    disabled: false,
    invalid: false,
  },
  render: (args) => {
    const [value, setValue] = useState<CalendarValue>(args.value ?? null);
    return (
      <div className="w-[280px]">
        <Calendar {...args} value={value} onChange={setValue} />
      </div>
    );
  },
} satisfies Meta<CalendarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Date_: Story = {
  name: 'Date',
  args: {
    mode: CalendarMode.Date,
  },
};

export const DateTime: Story = {
  args: {
    mode: CalendarMode.DateTime,
    labelProps: { label: 'Start date' },
    placeholder: 'Select date and time',
  },
};

export const Time: Story = {
  args: {
    mode: CalendarMode.Time,
    labelProps: { label: 'Time' },
    placeholder: undefined,
  },
};

export const Weekday: Story = {
  args: {
    mode: CalendarMode.Weekday,
    labelProps: { label: 'Day' },
    placeholder: 'Select day',
  },
};

export const Preselected: Story = {
  args: {
    mode: CalendarMode.Date,
    value: new Date(2026, 2, 11),
  },
};

export const Disabled: Story = {
  args: {
    mode: CalendarMode.Date,
    disabled: true,
    value: new Date(2026, 2, 11),
  },
};

export const Invalid: Story = {
  args: {
    mode: CalendarMode.Date,
    invalid: true,
  },
};

export const Localized: Story = {
  name: 'Localized (de-DE)',
  args: {
    mode: CalendarMode.Date,
    value: new Date(2026, 2, 11),
    locale: 'de-DE',
    labelProps: { label: 'Datum' },
  },
};

export const CustomFieldStyle: Story = {
  name: 'Custom field style',
  args: {
    mode: CalendarMode.Date,
    fieldClassName: 'rounded border-primary h-[40px]',
  },
};
