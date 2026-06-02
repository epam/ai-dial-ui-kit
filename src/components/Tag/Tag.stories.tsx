import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialTag } from '@/components/Tag/Tag';
import { IconEye } from '@tabler/icons-react';
import { DIAL_ICON_SIZE } from '@/constants/icon';

const meta: Meta<typeof DialTag> = {
  title: 'DIAL/Tag',
  component: DialTag,
  tags: ['display', 'label', 'badge'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small, labeled label used to display categories, filters, or selections. Supports removable behavior and multiple visual variants.',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'The text displayed inside the label.',
    },
    className: {
      control: { type: 'text' },
      description: 'Optional additional CSS classes for custom styling.',
    },
    onRemove: {
      action: 'removed',
      description:
        'Callback triggered when the remove (X) button is clicked. If not provided, the button will not be shown.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'React',
  },
};

export const Selected: Story = {
  args: {
    label: 'React',
    selected: true,
  },
};

export const Icon: Story = {
  render: (args) => (
    <DialTag
      label="Review required"
      onRemove={args.onRemove}
      className="border-[#F4CE46] bg-warning"
      icon={<IconEye size={DIAL_ICON_SIZE.SM} className="text-warning" />}
    />
  ),
};

export const DashedBorder: Story = {
  render: () => (
    <DialTag label="Business implementation" className="border-dashed" />
  ),
};

export const Closable: Story = {
  render: (args) => (
    <DialTag
      label="Business implementation"
      closable
      onRemove={args.onRemove}
    />
  ),
};
