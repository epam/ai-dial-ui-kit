import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InlineSelect,
  InlineSelectTrigger,
  type InlineSelectProps,
  type InlineSelectTriggerProps,
} from './InlineSelect';

const meta = {
  title: 'Components_2.0/InlineSelectTrigger',
  component: InlineSelectTrigger,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A trigger button for an inline select control. Displays the currently selected option label followed by a chevron icon. Extends `ButtonHTMLAttributes<HTMLButtonElement>`.',
      },
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description:
        "Currently selected option's label, shown before the chevron",
    },
  },
  args: {
    label: 'Option A',
  },
} satisfies Meta<InlineSelectTriggerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
};

export const Active: Story = {
  parameters: { pseudo: { active: true } },
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LongLabel: Story = {
  args: {
    label: 'A very long option label that may overflow',
  },
};

const selectItems = [
  { key: 'a', label: 'Option A' },
  { key: 'b', label: 'Option B' },
  { key: 'c', label: 'Option C' },
];

export const WithDropdown: Story = {
  render: () => <InlineSelect items={selectItems} />,
  parameters: {
    docs: {
      description: {
        story:
          'InlineSelect composes InlineSelectTrigger with DialDropdown to provide a full select control.',
      },
    },
  },
};

export const WithDropdownDisabled: Story = {
  render: () => <InlineSelect items={selectItems} disabled />,
};

export type { InlineSelectProps };
