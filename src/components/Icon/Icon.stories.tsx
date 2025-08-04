import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconFlame, IconSnowflake } from '@tabler/icons-react';

import { DialIcon } from './Icon';

const meta: Meta<typeof DialIcon> = {
  title: 'Components/Icon',
  component: DialIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: {
      description: 'The icon element to render',
      control: false,
    },
    className: {
      description: 'Additional CSS classes to apply to the icon wrapper',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OneIcon: Story = {
  args: {
    icon: (
      <div className="text-icon-accent-secondary">
        <IconFlame size={40} />
      </div>
    ),
  },
};

export const NoIcon: Story = {
  args: {
    icon: undefined,
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center text-icon-accent-primary">
      <DialIcon icon={<IconSnowflake size={12} />} />
      <DialIcon icon={<IconSnowflake size={16} />} />
      <DialIcon icon={<IconSnowflake size={22} />} />
      <DialIcon icon={<IconSnowflake size={48} />} />
      <DialIcon icon={<IconSnowflake size={64} />} />
    </div>
  ),
};
