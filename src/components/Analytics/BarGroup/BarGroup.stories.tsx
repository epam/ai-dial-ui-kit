import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAnalyticsBarGroup } from './BarGroup';

const meta: Meta<typeof DialAnalyticsBarGroup> = {
  title: 'Analytics/BarGroup',
  component: DialAnalyticsBarGroup,
  tags: ['analytics', 'bar', 'accordion', 'metric'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A collapsible group of analytics bars built from a key/value map. The title is shown in the accordion header, the number of entries as the header description, and each entry renders a bar with the key as its title and the value as its value.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Accordion header title.' },
    data: { control: 'object', description: 'Map of metric name to value.' },
    maxValue: {
      control: 'number',
      description: 'Upper bound passed to every bar.',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the accordion is expanded initially.',
    },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    className: 'w-[420px]',
  },
};

export const Collapsed: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91 },
    defaultExpanded: false,
    className: 'w-[420px]',
  },
};

export const CustomMaxValue: Story = {
  args: {
    title: 'Token usage',
    data: { prompt: 420, completion: 180, total: 600 },
    maxValue: 1000,
    className: 'w-[420px]',
  },
};
