import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  DateCellRenderer,
  type DateCellRendererProps,
} from './DateCellRenderer';

const meta = {
  title: 'Components_2_0/Grid/DateCellRenderer',
  component: DateCellRenderer,
  tags: ['grid', 'cell', 'date'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Date cell for the 2.0 Grid, usable as an ag-Grid `cellRenderer` or on its own. A valid date is rendered inside a `<time datetime>`, and the full string is only offered in a tooltip when the column is too narrow to show it.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'ISO string, epoch milliseconds, or a Date',
    },
    locale: { control: { type: 'text' } },
    options: { control: false, description: 'Intl.DateTimeFormat options' },
    emptyPlaceholder: { control: { type: 'text' } },
  },
  args: {
    value: '2026-07-20T09:30:00Z',
    locale: 'en-US',
    options: { timeZone: 'UTC' },
  },
  render: (args) => (
    <div className="w-[280px] rounded-lg bg-layer-raised p-3">
      <DateCellRenderer {...args} />
    </div>
  ),
} satisfies Meta<DateCellRendererProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EpochMilliseconds: Story = {
  args: {
    value: 1752969600000,
  },
};

export const OtherLocale: Story = {
  args: {
    locale: 'de-DE',
    options: { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' },
  },
};

export const Truncated: Story = {
  args: {
    options: { timeZone: 'UTC', dateStyle: 'full', timeStyle: 'long' },
  },
  render: (args) => (
    <div className="w-[140px] rounded-lg bg-layer-raised p-3">
      <DateCellRenderer {...args} />
    </div>
  ),
};

export const NoValue: Story = {
  args: {
    value: null,
    emptyPlaceholder: '—',
  },
};
