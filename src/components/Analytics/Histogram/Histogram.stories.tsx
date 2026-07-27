import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAnalyticsHistogram } from './Histogram';

const compareValues = [
  0.05, 0.08, 0.1, 0.15, 0.2, 0.3, 0.35, 0.38, 0.42, 0.47, 0.5, 0.55, 0.58,
  0.62, 0.67, 0.71, 0.75, 0.8, 0.83, 0.86, 0.89, 0.92, 0.96, 0.98, 1,
];

const sampleValues = [
  0.02, 0.05, 0.07, 0.12, 0.18, 0.22, 0.25, 0.28, 0.31, 0.34, 0.41, 0.43, 0.44,
  0.48, 0.52, 0.55, 0.61, 0.68, 0.73, 0.79, 0.84, 0.88, 0.91, 0.95, 1, 1,
];

const meta: Meta<typeof DialAnalyticsHistogram> = {
  title: 'Analytics/Histogram',
  component: DialAnalyticsHistogram,
  tags: ['analytics', 'histogram', 'distribution', 'chart'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A histogram that distributes values across the bands of a color map and draws one column per band. Column heights are relative to the most populated band; empty columns are outlined, populated ones are filled with their band color. Hovering a column reveals its share of the total.',
      },
    },
  },
  argTypes: {
    title: { control: 'text', description: 'Title above the histogram.' },
    values: { control: 'object', description: 'Values to distribute.' },
    valueTitle: {
      control: 'text',
      description: 'Noun used in the hover tooltip.',
    },
    showCount: {
      control: 'boolean',
      description: "Renders each column's count inside its bar.",
    },
    isLoading: {
      control: 'boolean',
      description:
        'Renders a loader in place of the histogram while data loads.',
    },
    compareValues: {
      control: false,
      description:
        'Second set of values; enables compare mode (primary striped, compare solid).',
    },
    valueSetLabel: {
      control: 'text',
      description:
        'Label for the primary values set, shown on the first tooltip line in compare mode.',
    },
    compareValueSetLabel: {
      control: 'text',
      description:
        'Label for the compare values set, shown on the first tooltip line in compare mode.',
    },
    className: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Score distribution',
    values: sampleValues,
    valueTitle: 'responses',
    className: 'w-[480px]',
  },
};

export const WithCounts: Story = {
  args: {
    title: 'Score distribution',
    values: sampleValues,
    valueTitle: 'responses',
    showCount: true,
    className: 'w-[480px]',
  },
};

export const WithZeroBucket: Story = {
  args: {
    title: 'Score distribution',
    // several exact-0 values land in the leading zero bucket
    values: [0, 0, 0, 0, ...sampleValues],
    valueTitle: 'responses',
    showCount: true,
    className: 'w-[480px]',
  },
};

export const OnlyZeros: Story = {
  args: {
    title: 'Score distribution',
    values: [0, 0, 0],
    valueTitle: 'responses',
    showCount: true,
    className: 'w-[480px]',
  },
};

export const Sparse: Story = {
  args: {
    title: 'Score distribution',
    values: [0, 0.05, 0.06, 0.45, 1],
    valueTitle: 'results',
    className: 'w-[480px]',
  },
};

export const Empty: Story = {
  args: {
    title: 'Score distribution',
    values: [],
    valueTitle: 'responses',
    className: 'w-[480px]',
  },
};

export const Loading: Story = {
  args: {
    title: 'Score distribution',
    values: [],
    valueTitle: 'responses',
    isLoading: true,
    className: 'w-[480px]',
  },
};

export const CompareMode: Story = {
  args: {
    title: 'Score distribution',
    values: sampleValues,
    compareValues,
    valueTitle: 'responses',
    valueSetLabel: 'This week',
    compareValueSetLabel: 'Last week',
    className: 'w-[480px]',
  },
};

export const CompareModeWithCounts: Story = {
  args: {
    title: 'Score distribution',
    values: sampleValues,
    compareValues,
    valueTitle: 'responses',
    valueSetLabel: 'This week',
    compareValueSetLabel: 'Last week',
    showCount: true,
    className: 'w-[480px]',
  },
};

export const CompareModeWithZeroBucket: Story = {
  args: {
    title: 'Score distribution',
    values: [0, 0, ...sampleValues],
    compareValues: [0, 0, 0, ...compareValues],
    valueTitle: 'responses',
    valueSetLabel: 'This week',
    compareValueSetLabel: 'Last week',
    showCount: true,
    className: 'w-[480px]',
  },
};
