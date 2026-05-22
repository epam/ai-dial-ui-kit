import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialProgressBar,
  DialProgressBarSize,
  type DialProgressBarProps,
} from './ProgressBar';

const meta = {
  title: 'DIAL/Status/ProgressBar',
  component: DialProgressBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A horizontal bar indicating progress toward a goal.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Current progress value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum value (default 100)',
    },
    size: {
      control: { type: 'select' },
      options: Object.values(DialProgressBarSize),
      description: 'Height of the progress bar',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional classes on the track element',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible label for screen readers',
    },
  },
  args: {
    value: 50,
    max: 100,
    size: DialProgressBarSize.Medium,
    ariaLabel: 'Progress',
  },
} satisfies Meta<DialProgressBarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: DialProgressBarSize.Small },
};

export const Full: Story = {
  args: { value: 100 },
};

export const Empty: Story = {
  args: { value: 0 },
};

export const CustomMax: Story = {
  args: { value: 3, max: 10 },
};
