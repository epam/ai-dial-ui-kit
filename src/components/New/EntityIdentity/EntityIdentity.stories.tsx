import type { Meta, StoryObj } from '@storybook/react-vite';

import { EntityType } from '@/types/entity-type';
import { EntityIdentity, type EntityIdentityProps } from './EntityIdentity';

const meta = {
  title: 'Components_2_0/EntityIdentity',
  component: EntityIdentity,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The identity block of a DIAL entity: icon, coloured type label, name and version, with an optional featured chip.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    iconSize: {
      control: { type: 'number', min: 24, max: 64, step: 4 },
      description: 'Icon size in px',
    },
    headingLevel: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
      description: 'Heading level of the name',
    },
    showVersion: { control: 'boolean' },
    hasFeaturedTag: { control: 'boolean' },
    query: { control: { type: 'text' } },
  },
  args: {
    item: {
      type: EntityType.Model,
      name: 'Google Gemini 3.5 Flash Lite',
      version: '1.0.3',
    },
  },
} satisfies Meta<EntityIdentityProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A compact header, as in a form field showing the selected model. */
export const Compact: Story = {
  args: {
    iconSize: 44,
    nameClassName: 'dial-body-semi-text',
    typeClassName: 'dial-caption-text font-semibold',
  },
};

/** A featured entity shows a chip in the type colour. */
export const Featured: Story = {
  args: {
    item: {
      type: EntityType.Agent,
      name: 'Code Reviewer',
      version: '2.1.0',
      isFeatured: true,
    },
  },
};

/** Every type keeps its own colour. */
export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {Object.values(EntityType).map((type) => (
        <EntityIdentity
          key={type}
          {...args}
          item={{ type, name: `Sample ${type}`, version: '1.0.0' }}
        />
      ))}
    </div>
  ),
};

/** The matching part of the name is highlighted. */
export const WithQuery: Story = {
  args: { query: 'flash' },
};

/** A long name truncates with an ellipsis and keeps the version visible. */
export const LongName: Story = {
  args: {
    item: {
      type: EntityType.Model,
      name: 'An extremely long deployment display name that does not fit',
      version: '2025-01-01-preview',
    },
  },
};
