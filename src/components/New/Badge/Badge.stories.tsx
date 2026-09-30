import type { Meta, StoryObj } from '@storybook/react-vite';

import { BadgeColor, BadgeVariant } from '@/types/badge';
import { Badge, type BadgeProps } from './Badge';

const meta = {
  title: 'Components_2_0/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A short, static label: a topic, a category, or a status that is not a control. Use `Tag` for labels that are selected, filtered by or dismissed.',
      },
    },
  },
  argTypes: {
    label: { control: { type: 'text' }, description: 'Text of the badge' },
    variant: {
      control: 'inline-radio',
      options: Object.values(BadgeVariant),
      description: 'How the badge is drawn',
    },
    color: {
      control: 'select',
      options: Object.values(BadgeColor),
      description: 'Colour of a filled badge',
    },
  },
  args: { label: 'Translation' },
} satisfies Meta<BadgeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {};

export const Filled: Story = {
  args: {
    label: 'Featured',
    variant: BadgeVariant.Filled,
    color: BadgeColor.Green,
  },
};

/** Every filled colour, each drawn from the theme's visual tokens. */
export const FilledColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Object.values(BadgeColor).map((color) => (
        <Badge
          key={color}
          label={color}
          variant={BadgeVariant.Filled}
          color={color}
        />
      ))}
    </div>
  ),
};
