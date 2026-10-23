import { IconCopy } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '@/components/New/IconButton/IconButton';
import { LabelledText } from './LabelledText';

const meta = {
  title: 'Components_2_0/LabelledText',
  component: LabelledText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A read-only label/value pair from the 2.0 design system: a small caption above a value. The value truncates with an ellipsis and shows a tooltip only when it is clipped. The caption is the kit `Label`.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Caption above the value' },
    text: { control: 'text', description: 'The value' },
    tooltip: {
      control: 'text',
      description:
        'Tooltip content shown instead of `text` while it is clipped',
    },
    postfix: { control: false, description: 'Element after the value' },
    children: {
      control: false,
      description: 'Custom value content, rendered instead of `text`',
    },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
  args: { label: 'Endpoint', text: 'https://example.com/v1' },
} satisfies Meta<typeof LabelledText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Truncated: Story = {
  args: {
    text: 'https://very-long-hostname.example.com/openai/deployments/gpt-4o/chat/completions',
  },
};

export const WithCustomTooltip: Story = {
  args: {
    ...Truncated.args,
    tooltip: 'Chat completions endpoint',
  },
};

export const WithPostfix: Story = {
  args: {
    label: 'API key',
    text: 'sk-0000-1111-2222',
    postfix: (
      <IconButton
        icon={<IconCopy aria-hidden="true" />}
        aria-label="Copy key"
      />
    ),
  },
};

export const WithChildren: Story = {
  args: {
    label: 'Status',
    children: <span className="text-accent">Running</span>,
  },
};
