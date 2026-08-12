import { IconTag } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { Tag } from './Tag';

const meta = {
  title: 'Components_2_0/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A compact label from the 2.0 design system, used for selections, filters, or categories. Supports an optional remove control and a selected state.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Text content of the tag' },
    size: {
      control: 'radio',
      options: [ElementSize.Small, ElementSize.Standard],
      description: 'Tag height: standard is 24px, small is 20px',
    },
    selected: {
      control: 'boolean',
      description: 'Applies the accent-tinted selected styling',
    },
    disabled: {
      control: 'boolean',
      description: 'Dims the tag and suppresses the remove control',
    },
    closable: {
      control: 'boolean',
      description: 'Renders the remove button (needs `onRemove`)',
    },
    removeLabel: {
      control: 'text',
      description: 'Accessible name of the remove button',
    },
    onRemove: {
      action: 'removed',
      control: false,
      description: 'Called when the remove button is clicked',
    },
    onClick: {
      action: 'clicked',
      control: false,
      description: 'Called when the tag itself is activated',
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'TypeScript' },
};

export const Closable: Story = {
  args: { label: 'TypeScript', closable: true, onRemove: () => {} },
};

export const Selected: Story = {
  args: { label: 'TypeScript', selected: true },
};

export const WithIcon: Story = {
  args: {
    label: 'TypeScript',
    icon: <IconTag size={DIAL_ICON_SIZE.SM} />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'TypeScript',
    closable: true,
    disabled: true,
    onRemove: () => {},
  },
};

export const Truncated: Story = {
  args: {
    label: 'A tag label far too long for the space it was given',
    closable: true,
    onRemove: () => {},
    className: 'max-w-[160px]',
  },
};

const SelectableTags = () => {
  const [selected, setSelected] = useState<string[]>(['Drafts']);

  const toggle = (value: string) =>
    setSelected((current) =>
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );

  return (
    <div className="flex flex-wrap gap-1">
      {['Drafts', 'Shared', 'Archived'].map((value) => (
        <Tag
          key={value}
          label={value}
          selected={selected.includes(value)}
          onClick={() => toggle(value)}
        />
      ))}
    </div>
  );
};

export const Clickable: Story = {
  args: { label: 'Drafts' },
  render: () => <SelectableTags />,
};

export const AllVariants: Story = {
  args: { label: 'Tag' },
  render: () => (
    <div className="flex min-w-[400px] flex-col gap-y-6 p-8">
      {[ElementSize.Standard, ElementSize.Small].map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <div className="text-primary dial-small-semi-text">{size}</div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag size={size} label="Default" />
            <Tag size={size} label="Selected" selected />
            <Tag size={size} label="Closable" closable onRemove={() => {}} />
            <Tag
              size={size}
              label="With icon"
              icon={<IconTag size={DIAL_ICON_SIZE.SM} />}
            />
            <Tag
              size={size}
              label="Disabled"
              closable
              disabled
              onRemove={() => {}}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};
