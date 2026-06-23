import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTrendingUp } from '@tabler/icons-react';
import { DialAnalyticsCard } from './Card';
import { AnalyticsCardVariant } from '@/types/analytics';

const meta: Meta<typeof DialAnalyticsCard> = {
  title: 'Analytics/Card',
  component: DialAnalyticsCard,
  tags: ['analytics', 'card', 'metric'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple analytics summary card that displays a single metric: a title, a prominent value, and an optional description. The description accepts a plain string or any ReactNode. Intended as a building block for the analytics component family.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Short label describing the metric.',
    },
    value: {
      control: 'text',
      description: 'The primary metric value, displayed prominently.',
    },
    description: {
      control: 'text',
      description: 'Optional supporting text. Accepts a string or a ReactNode.',
    },
    variant: {
      control: 'select',
      options: Object.values(AnalyticsCardVariant),
      description:
        'Visual style of the card. `compact` is a denser bg-layer-2 card with a smaller value and no description.',
    },
    error: {
      control: 'boolean',
      description: 'Renders an error tag in place of the value.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the card container.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Total requests',
    value: '12,480',
    description: '+12% vs last week',
    className: 'w-[240px]',
  },
};

export const WithoutDescription: Story = {
  args: {
    title: 'Active users',
    value: '3,201',
    className: 'w-[240px]',
  },
};

export const WithReactNodeDescription: Story = {
  args: {
    title: 'Revenue',
    value: '$48.2K',
    description: (
      <span className="flex items-center gap-1 text-success">
        <IconTrendingUp size={12} />
        +8.4% this month
      </span>
    ),
    className: 'w-[240px]',
  },
};

export const Compact: Story = {
  args: {
    title: 'Avg. latency',
    value: '248ms',
    variant: AnalyticsCardVariant.Compact,
    className: 'w-[200px]',
  },
};

export const Error: Story = {
  args: {
    title: 'Avg. latency',
    variant: AnalyticsCardVariant.Compact,
    error: true,
    className: 'w-[200px]',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-start gap-4 text-primary">
      <DialAnalyticsCard
        title="Total requests"
        value="12,480"
        description="+12% vs last week"
        className="w-[240px]"
      />
      <DialAnalyticsCard
        title="Total requests"
        value="12,480"
        variant={AnalyticsCardVariant.Compact}
        className="w-[200px]"
      />
    </div>
  ),
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 text-primary">
      <DialAnalyticsCard
        title="Total requests"
        value="12,480"
        description="+12% vs last week"
      />
      <DialAnalyticsCard
        title="Active users"
        value="3,201"
        description="+8.4% this month"
      />
      <DialAnalyticsCard title="Avg. latency" value="248ms" />
      <DialAnalyticsCard
        title="Error rate"
        value="0.4%"
        description={<span className="text-error">+0.1% vs last week</span>}
      />
    </div>
  ),
};
