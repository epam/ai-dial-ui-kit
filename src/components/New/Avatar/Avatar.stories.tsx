import type { Meta, StoryObj } from '@storybook/react-vite';

import { AVATAR_PALETTE } from '@/utils/avatar';
import { AvatarColor, AvatarShape } from '@/types/avatar';
import { Avatar, type AvatarProps } from './Avatar';

const meta = {
  title: 'Components_2_0/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "A person's or an entity's picture, or its initials on a colour picked from its name. A missing or broken image falls back to the initials.",
      },
    },
  },
  argTypes: {
    name: { control: { type: 'text' }, description: 'Display name' },
    initials: { control: { type: 'text' }, description: 'Initials override' },
    src: { control: { type: 'text' }, description: 'Image URL' },
    alt: { control: { type: 'text' }, description: 'Accessible name' },
    size: {
      control: { type: 'number', min: 16, max: 96, step: 4 },
      description: 'Width and height in px',
    },
    shape: {
      control: 'inline-radio',
      options: Object.values(AvatarShape),
      description: 'Outline of the avatar',
    },
    color: {
      control: { type: 'object' },
      description:
        'Explicit colour pair overriding the deterministic pick from `name`',
    },
  },
  args: { name: 'Ada Lovelace', size: 32 },
} satisfies Meta<AvatarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** An application or model: a rounded square. */
export const Square: Story = {
  args: { name: 'Summarizer', shape: AvatarShape.Square, size: 36 },
};

/** The URL does not resolve, so the avatar shows the initials instead. */
export const BrokenImage: Story = {
  args: { src: '/does-not-exist.png', alt: 'Ada Lovelace' },
};

/** Each name keeps its own colour from the theme's visual tokens. */
export const Palette: Story = {
  render: (args) => (
    <div className="flex gap-2">
      {[
        'Ada Lovelace',
        'Grace Hopper',
        'Alan Turing',
        'Summarizer',
        'Code Reviewer',
        'Олена Коваль',
        'Linus',
      ].map((name) => (
        <Avatar key={name} {...args} name={name} />
      ))}
    </div>
  ),
};

/*
 * One palette entry pinned on every row, so names — and their translations —
 * cannot reshuffle the colour.
 */
export const PinnedColour: Story = {
  render: (args) => (
    <div className="flex gap-2">
      {['Summarizer', 'Code Reviewer', 'Олена Коваль', 'Linus'].map((name) => (
        <Avatar
          key={name}
          {...args}
          name={name}
          color={AVATAR_PALETTE[AvatarColor.Violet1]}
        />
      ))}
    </div>
  ),
};
