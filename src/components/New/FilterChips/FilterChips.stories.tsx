import { IconShare, IconUsers } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { FilterChips, type FilterChipItem } from './FilterChips';

const CHAT_ITEMS: FilterChipItem[] = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'My chats' },
  { value: 'shared', label: 'Shared' },
  { value: 'organization', label: 'Organization' },
];

const meta = {
  title: 'Components_2_0/FilterChips',
  component: FilterChips,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A row of filter chips that picks one value out of a few. Each chip is a toggle button with `aria-pressed`, inside a named `role="group"`, so every chip is its own tab stop and arrowing onto one never changes the filter by accident.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Chips to render, in order; each needs a unique `value`',
    },
    value: {
      control: 'text',
      description: 'The `value` of the selected chip',
    },
    onChange: {
      action: 'changed',
      control: false,
      description: 'Called with the `value` of the chip the user picked',
    },
    stretch: {
      control: 'boolean',
      description: 'Grows the chips to share the row width equally',
    },
    className: {
      control: 'text',
      description: 'Additional classes for the row',
    },
    chipClassName: {
      control: 'text',
      description: 'Additional classes for every chip',
    },
  },
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = ({
  items = CHAT_ITEMS,
  initialValue = 'all',
  stretch,
  className,
  chipClassName,
}: {
  items?: FilterChipItem[];
  initialValue?: string;
  stretch?: boolean;
  className?: string;
  chipClassName?: string;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <FilterChips
      aria-label="Filter chats"
      items={items}
      value={value}
      onChange={setValue}
      stretch={stretch}
      className={className}
      chipClassName={chipClassName}
    />
  );
};

export const Default: Story = {
  args: { items: CHAT_ITEMS, value: 'all', onChange: () => {} },
  render: () => <Interactive />,
};

/**
 * `stretch` grows the chips to share the row width equally — how a filter row
 * sits above a side panel, where the chips span the panel rather than hugging
 * their labels.
 */
export const Stretched: Story = {
  args: { items: CHAT_ITEMS, value: 'all', onChange: () => {}, stretch: true },
  render: () => (
    <div className="w-[320px] border border-secondary p-3">
      <Interactive stretch />
    </div>
  ),
};

/**
 * A panel narrower than the chips' default padding tightens it through
 * `chipClassName` instead of shrinking the labels.
 */
export const NarrowPanel: Story = {
  args: { items: CHAT_ITEMS, value: 'mine', onChange: () => {} },
  render: () => (
    <div className="w-[260px] border border-secondary p-3">
      <Interactive initialValue="mine" stretch chipClassName="!px-2" />
    </div>
  ),
};

/** A chip can carry an icon before its label. */
export const WithIcons: Story = {
  args: {
    items: CHAT_ITEMS,
    value: 'shared',
    onChange: () => {},
  },
  render: () => (
    <Interactive
      initialValue="shared"
      items={[
        { value: 'all', label: 'All' },
        {
          value: 'shared',
          label: 'Shared',
          icon: (
            <IconShare size={DIAL_ICON_SIZE.SM} stroke={DIAL_KIT_ICON_STROKE} />
          ),
        },
        {
          value: 'organization',
          label: 'Organization',
          icon: (
            <IconUsers size={DIAL_ICON_SIZE.SM} stroke={DIAL_KIT_ICON_STROKE} />
          ),
        },
      ]}
    />
  ),
};

/**
 * More chips than the row can hold. The default row does not wrap, so a caller
 * that wants a second line asks for it with `flex-wrap`.
 */
export const Wrapping: Story = {
  args: { items: CHAT_ITEMS, value: 'all', onChange: () => {} },
  render: () => (
    <div className="w-[320px] border border-secondary p-3">
      <Interactive
        className="flex-wrap"
        items={[
          ...CHAT_ITEMS,
          { value: 'archived', label: 'Archived' },
          { value: 'published', label: 'Published' },
        ]}
      />
    </div>
  ),
};
