import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { CalendarMode } from '@/types/calendar';
import { Calendar, type CalendarProps, type CalendarValue } from './Calendar';

const meta = {
  title: 'Components_2_0/Calendar/Time',
  component: Calendar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`Calendar` in `time` mode: a typeable `HH:mm` field with a clock button at its trailing edge that opens an hour/minute list popover. Picking an hour keeps the current minutes; picking minutes closes the popover. Set `showTimePicker={false}` to keep only the typeable field.',
      },
    },
  },
  argTypes: {
    mode: { control: false },
    value: { control: { type: 'text' } },
    onChange: { control: false },
    onBlur: { control: false },
    disabled: { control: { type: 'boolean' } },
    invalid: { control: { type: 'boolean' } },
    labelProps: { control: { type: 'object' } },
    placeholder: { control: { type: 'text' } },
    fieldClassName: { control: { type: 'text' } },
    showTimezone: { control: { type: 'boolean' } },
    showTimePicker: { control: { type: 'boolean' } },
  },
  args: {
    mode: CalendarMode.Time,
    labelProps: { label: 'Time' },
    disabled: false,
    invalid: false,
    showTimePicker: true,
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

export const Default: Story = {};

export const Preselected: Story = {
  args: { value: '14:30' },
};

export const Disabled: Story = {
  args: { value: '09:00', disabled: true },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const WithTimezone: Story = {
  name: 'With timezone',
  args: { showTimezone: true },
};

export const TypingOnly: Story = {
  name: 'Typing only',
  args: { showTimePicker: false },
};
