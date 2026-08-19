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
    description: {
      control: 'text',
      description:
        'Accordion header description. Defaults to the number of entries.',
    },
    data: { control: 'object', description: 'Map of metric name to value.' },
    maxValue: {
      control: 'number',
      description: 'Upper bound passed to every bar.',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the accordion is expanded initially.',
    },
    isLoading: {
      control: 'boolean',
      description: 'Renders a loader in place of the bars while data loads.',
    },
    inline: {
      control: 'boolean',
      description:
        'Renders every bar on a single row (50% title, 50% bar + value).',
    },
    onBarClick: {
      action: 'barClick',
      description:
        'Invoked with the entry key and value when a bar is clicked.',
    },
    compareData: {
      control: false,
      description:
        'Enables compare mode: each entry shows a delta badge (`compareData − data`) and two bars — first for `data`, second for `compareData`.',
    },
    compareLabels: {
      control: false,
      description:
        'Labels shown next to each bar in compare mode. First label for `data`, second for `compareData`.',
    },
    titleTooltip: { control: 'text' },
    barTitleClassName: { control: 'text' },
    barValueClassName: { control: 'text' },
    barClassName: { control: 'text' },
    barDescriptions: { control: false },
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

export const Loading: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91 },
    isLoading: true,
    className: 'w-[420px]',
  },
};

export const CustomDescription: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91 },
    className: 'w-[420px]',
  },
  render: (args) => (
    <DialAnalyticsBarGroup
      {...args}
      description={
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-accent-primary" />
          Updated just now
        </span>
      }
    />
  ),
};

export const Clickable: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    onBarClick: (key, value) => alert(`${key}: ${value}`),
    className: 'w-[420px]',
  },
};

export const Inline: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    inline: true,
    className: 'w-[420px]',
  },
};

export const InlineCustomClasses: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    inline: true,
    barTitleClassName: 'dial-small-semi-text text-secondary',
    barValueClassName: 'text-accent-primary',
    className: 'w-[420px]',
  },
};

export const CompareDefault: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    compareData: { accuracy: 0.64, recall: 0.82, precision: 0.78, f1: 0.86 },
    compareLabels: ['Last week', 'This week'],
    className: 'w-[420px]',
  },
};

export const CompareClickable: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    compareData: { accuracy: 0.64, recall: 0.82, precision: 0.78, f1: 0.86 },
    compareLabels: ['Last week', 'This week'],
    onBarClick: (key, value) => alert(`${key}: ${value}`),
    className: 'w-[420px]',
  },
};

/** Admin compare repro: baseline 0.917 vs compared 1.00 — badge should be +0.083. */
export const CompareScoreIncrease: Story = {
  args: {
    title: 'DeepEval: Answer Relevancy',
    data: { score: 0.917 },
    compareData: { score: 1 },
    compareLabels: ['Run #849', 'Run #1051'],
    className: 'w-[420px]',
  },
};

export const CompareEqualValues: Story = {
  args: {
    title: 'Relevance',
    data: { score: 0.75 },
    compareData: { score: 0.75 },
    compareLabels: ['Last week', 'This week'],
    className: 'w-[420px]',
  },
};

export const CompareInline: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    compareData: { accuracy: 0.64, recall: 0.82, precision: 0.78, f1: 0.86 },
    compareLabels: ['Last week', 'This week'],
    inline: true,
    className: 'w-[420px]',
  },
};

export const CompareWithCustomMaxValue: Story = {
  args: {
    title: 'Token usage',
    data: { prompt: 420, completion: 180, total: 600 },
    compareData: { prompt: 380, completion: 210, total: 590 },
    maxValue: 1000,
    className: 'w-[420px]',
  },
};

export const CompareWithMissingValues: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, onlyCurrent: 0.55 },
    compareData: { accuracy: 0.64, recall: 0.82, onlyPrevious: 0.71 },
    compareLabels: ['Last week', 'This week'],
    className: 'w-[420px]',
  },
};

export const CompareInlineWithMissingValues: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, onlyCurrent: 0.55 },
    compareData: { accuracy: 0.64, recall: 0.82, onlyPrevious: 0.71 },
    compareLabels: ['Last week', 'This week'],
    inline: true,
    className: 'w-[420px]',
  },
};

export const CompareWithBarDescriptions: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    compareData: { accuracy: 0.64, recall: 0.82, precision: 0.78, f1: 0.86 },
    compareLabels: ['Last week', 'This week'],
    barDescriptions: {
      accuracy: 'Proportion of correct predictions out of all predictions',
      recall: 'Proportion of actual positives correctly identified',
      precision:
        'Proportion of positive predictions that are actually positive',
      f1: 'Harmonic mean of precision and recall',
    },
  },
};

export const WithTitleTooltip: Story = {
  args: {
    title: 'Relevance',
    titleTooltip: 'Hover this title to see a tooltip',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    className: 'w-[420px]',
  },
};

export const WithBarDescriptions: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    barDescriptions: {
      accuracy: 'Proportion of correct predictions out of all predictions',
      recall: 'Proportion of actual positives correctly identified',
      precision:
        'Proportion of positive predictions that are actually positive',
      f1: 'Harmonic mean of precision and recall',
    },
    className: 'w-[420px]',
  },
};

export const WithBarClassName: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    barClassName: 'rounded p-1 -mx-1 hover:bg-layer-4 transition-colors',
    className: 'w-[420px]',
  },
};

export const WithBarDescriptionsAndBarClassName: Story = {
  args: {
    title: 'Relevance',
    data: { accuracy: 0.82, recall: 0.64, precision: 0.91, f1: 0.74 },
    barDescriptions: {
      accuracy: 'Proportion of correct predictions out of all predictions',
      recall: 'Proportion of actual positives correctly identified',
      precision:
        'Proportion of positive predictions that are actually positive',
      f1: 'Harmonic mean of precision and recall',
    },
    barClassName: 'rounded p-1 -mx-1 hover:bg-layer-4 transition-colors',
    className: 'w-[420px]',
    inline: true,
  },
};

export const TwoGroupsSideBySide: Story = {
  name: 'Two groups side by side',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82, recall: 0.64, precision: 0.91 }}
          className="w-[320px]"
          nonCollapsible
        />
        <DialAnalyticsBarGroup
          title="Latency"
          data={{ p50: 0.45, p95: 0.78 }}
          className="w-[320px]"
          nonCollapsible
        />
      </div>
      <div className="flex flex-row gap-4">
        <DialAnalyticsBarGroup
          title="Relevance"
          data={{ accuracy: 0.82, recall: 0.64, precision: 0.91 }}
          className="w-[320px]"
          nonCollapsible
          inline
        />
        <DialAnalyticsBarGroup
          title="Latency"
          data={{ p50: 0.45, p95: 0.78 }}
          className="w-[320px]"
          nonCollapsible
          inline
        />
      </div>
    </div>
  ),
};
