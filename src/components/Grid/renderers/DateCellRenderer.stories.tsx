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
    timeZone: { control: 'text' },
    emptyPlaceholder: { control: 'text' },
    cssClass: { control: 'text' },
  },
  args: {
    value: '2025-07-20T00:00:00Z',
    locale: 'en-US',
    timeZone: 'UTC',
    emptyPlaceholder: '—',
    cssClass: 'max-w-[120px]',
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

export const TimestampSeconds: Story = {
  args: {
    value: 1752969600,
  },
};

export const DifferentLocale: Story = {
  args: {
    locale: 'fr-FR',
  },
};

export const Ellipsis: Story = {
  args: {
    cssClass: 'max-w-[80px]',
  },
};

export const InvalidValue: Story = {
  args: {
    value: 'not-a-date',
  },
};
