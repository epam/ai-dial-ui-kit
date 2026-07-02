import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAnalyticsHistogram } from './Histogram';

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
