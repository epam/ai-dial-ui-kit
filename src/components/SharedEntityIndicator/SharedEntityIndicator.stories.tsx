import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialSharedEntityIndicator,
  type DialSharedEntityIndicatorProps,
} from './SharedEntityIndicator';

const meta = {
  title: 'FileManager/SharedEntityIndicator',
  component: DialSharedEntityIndicator,
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: { type: 'text' } },
    size: { control: { type: 'number', min: 8, max: 32, step: 1 } },
    stroke: { control: { type: 'number', min: 1, max: 3, step: 0.5 } },
    cssClass: { control: { type: 'text' } },
  },
  args: {
    label: 'Shared entity',
    size: 10,
    stroke: 2,
  },
} satisfies Meta<DialSharedEntityIndicatorProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSize: Story = {
  args: { size: 14 },
};

export const ThickStroke: Story = {
  args: { stroke: 2 },
};

export const WithCustomClass: Story = {
  args: { cssClass: 'rounded-full p-1 shadow' },
};
