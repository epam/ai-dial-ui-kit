import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  SharedEntityIndicator,
  type SharedEntityIndicatorProps,
} from './SharedEntityIndicator';

const meta = {
  title: 'Components_2_0/SharedEntityIndicator',
  component: SharedEntityIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small arrow badge marking an entity as shared. `FileIcon` draws it over its glyph.',
      },
    },
  },
  argTypes: {
    label: { control: { type: 'text' }, description: 'Accessible name' },
    tooltip: { control: { type: 'text' }, description: 'Hover tooltip' },
    size: {
      control: { type: 'number', min: 8, max: 32, step: 2 },
      description: 'Arrow size in px',
    },
    className: { control: { type: 'text' }, description: 'Extra classes' },
  },
  args: { label: 'Shared' },
} satisfies Meta<SharedEntityIndicatorProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTooltip: Story = {
  args: { tooltip: 'Shared with 3 people' },
};

export const Large: Story = {
  args: { size: 20 },
};
