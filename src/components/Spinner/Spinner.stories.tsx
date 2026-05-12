import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialSpinner, type DialSpinnerProps } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: DialSpinner,
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: 'A circular ring spinner for loading states.' },
    },
  },
  argTypes: {
    size: {
      control: { type: 'number' },
      description: 'Spinner diameter in px',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional container classes',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Stretch container to full width/height',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible label for screen readers',
    },
  },
  args: {
    size: 24,
    fullWidth: false,
    ariaLabel: 'Loading',
  },
} satisfies Meta<DialSpinnerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullWidth: Story = {
  args: { fullWidth: true },
};

export const CustomSize: Story = {
  args: { size: 48 },
};

export const WithCustomClass: Story = {
  args: {
    size: 32,
    fullWidth: false,
    className: 'bg-layer-3 p-4',
  },
};
