import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconFlame, IconSnowflake } from '@tabler/icons-react';

import { DialIcon } from './Icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';

const meta: Meta<typeof DialIcon> = {
  title: 'Data Display/Icon',
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
      <div className="text-accent-secondary">
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
    <div className="flex gap-4 items-center text-accent-primary">
      <DialIcon icon={<IconSnowflake size={12} />} />
      <DialIcon icon={<IconSnowflake size={DIAL_ICON_SIZE.SM} />} />
      <DialIcon icon={<IconSnowflake size={22} />} />
      <DialIcon icon={<IconSnowflake size={48} />} />
      <DialIcon icon={<IconSnowflake size={64} />} />
    </div>
  ),
};
