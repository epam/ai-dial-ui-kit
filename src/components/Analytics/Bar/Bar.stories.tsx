import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAnalyticsBar } from './Bar';

const meta: Meta<typeof DialAnalyticsBar> = {
  title: 'Analytics/Bar',
  component: DialAnalyticsBar,
  tags: ['analytics', 'bar', 'meter', 'metric'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact analytics meter: a horizontal bar whose fill width and color reflect a value relative to `maxValue`, with an optional title on the left and value on the right. The fill color is resolved from a `colorMap` keyed by the normalized ratio, so the bar shifts hue as the value grows.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', step: 0.05 },
      description: 'Current value used to size and color the bar.',
    },
    maxValue: {
      control: 'number',
      description: 'Upper bound of the scale (defaults to 1).',
    },
    title: { control: 'text', description: 'Label rendered on the left.' },
    valueLabel: {
      control: 'text',
      description: 'Text rendered on the right. Defaults to the raw value.',
    },
    error: {
      control: 'boolean',
      description:
        'Renders the error state: error-colored bar and an error tag instead of the value.',
    },
    className: { control: 'text' },
    ariaLabel: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Relevance',
    value: 0.82,
    valueLabel: '82%',
    className: 'w-[280px]',
  },
};

export const Empty: Story = {
  args: {
    title: 'Relevance',
    value: 0,
    valueLabel: '0%',
    className: 'w-[280px]',
  },
};

export const Full: Story = {
  args: {
    title: 'Relevance',
    value: 1,
    valueLabel: '100%',
    className: 'w-[280px]',
  },
};

export const CustomMaxValue: Story = {
  args: {
    title: 'Score',
    value: 640,
    maxValue: 1000,
    valueLabel: '640 / 1000',
    className: 'w-[280px]',
  },
};

export const Error: Story = {
  args: {
    title: 'Relevance',
    error: true,
    className: 'w-[280px]',
  },
};

export const ColorScale: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-4 text-primary">
      {[0.05, 0.25, 0.45, 0.65, 0.85, 1].map((value) => (
        <DialAnalyticsBar
          key={value}
          title={`Ratio ${value}`}
          value={value}
          valueLabel={`${Math.round(value * 100)}%`}
        />
      ))}
    </div>
  ),
};
