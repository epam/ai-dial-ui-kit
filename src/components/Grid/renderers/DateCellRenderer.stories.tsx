import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialDateCellRenderer,
  type DialDateCellRendererProps,
} from './DateCellRenderer';

const meta = {
  title: 'Grid/DateCellRenderer',
  component: DialDateCellRenderer,
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: 'text' },
    locale: { control: 'text' },
    options: { control: 'object' },
    emptyPlaceholder: { control: 'text' },
    className: { control: 'text' },
  },
  args: {
    value: '2025-07-20T00:00:00Z',
    locale: 'en-US',
    emptyPlaceholder: '—',
    className: 'max-w-[180px]',
  },
} satisfies Meta<DialDateCellRendererProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ISOString: Story = {};

export const TimestampMs: Story = {
  args: {
    value: 1752969600000,
  },
};

export const DifferentLocale: Story = {
  args: {
    locale: 'fr-FR',
    options: {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  },
};

export const Ellipsis: Story = {
  args: {
    className: 'max-w-[80px]',
    options: {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  },
};

export const InvalidValue: Story = {
  args: {
    value: 'not-a-date',
  },
};
