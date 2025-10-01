import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialLoader, type DialLoaderProps } from './Loader';

const meta = {
  title: 'Components/Loader',
  component: DialLoader,
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: 'A simple loading spinner.' },
    },
  },
  argTypes: {
    size: { control: { type: 'number' }, description: 'Icon size in px' },
    cssClass: { control: { type: 'text' }, description: 'Container classes' },
    iconClass: { control: { type: 'text' }, description: 'SVG icon classes' },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Stretch to full width/height of container',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible label (for screen readers)',
    },
  },
  args: {
    size: 18,
    fullWidth: true,
    ariaLabel: 'Loading',
  },
} satisfies Meta<DialLoaderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inline: Story = {
  args: { fullWidth: false },
};

export const CustomSize: Story = {
  args: { size: 28 },
};

export const WithCustomClasses: Story = {
  args: {
    iconClass: 'text-accent-primary',
    cssClass: 'bg-layer-3',
    size: 28,
    fullWidth: false,
  },
};
