import { IconCopy, IconStar, IconTrash } from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { ElementSize } from '@/types/size';
import { MenuItemMark } from '@/types/menu-item';
import { MenuItem } from './MenuItem';

const copyIcon = (
  <IconCopy
    size={DIAL_ICON_SIZE.MD}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
  />
);

const meta = {
  title: 'Components_2_0/MenuItem',
  component: MenuItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'One row of a dropdown menu or a select list. Owns the Menu-item states of the 2.0 design system, so the dropdown and the select cannot drift apart.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: "The row's text" },
    mark: {
      control: 'radio',
      options: [
        MenuItemMark.None,
        MenuItemMark.Check,
        MenuItemMark.Tint,
        MenuItemMark.Checkbox,
        MenuItemMark.Highlight,
      ],
      description: 'How a chosen row is marked',
    },
    selected: {
      control: 'boolean',
      description: 'Whether this row is the chosen one',
    },
    disabled: { control: 'boolean', description: 'Stops the row responding' },
    danger: {
      control: 'boolean',
      description: 'Paints the row in the error colour',
    },
    description: {
      control: 'text',
      description: "Secondary text at the row's trailing edge",
    },
  },
  args: {
    label: 'Label',
    icon: copyIcon,
    role: 'menuitem',
  },
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {};

export const SelectedWithCheck: Story = {
  name: 'Selected, with check',
  args: { mark: MenuItemMark.Check, selected: true },
};

export const SelectedInList: Story = {
  name: 'Selected, in a select list',
  args: { mark: MenuItemMark.Tint, selected: true },
};

export const SelectedInNavigation: Story = {
  name: 'Selected, in navigation',
  args: { mark: MenuItemMark.Highlight, selected: true, 'aria-current': true },
};

export const Multiselect: Story = {
  args: { mark: MenuItemMark.Checkbox, selected: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Danger: Story = {
  args: {
    label: 'Delete',
    danger: true,
    icon: (
      <IconTrash
        size={DIAL_ICON_SIZE.MD}
        stroke={DIAL_KIT_ICON_STROKE}
        aria-hidden="true"
      />
    ),
  },
};

export const WithDescription: Story = {
  name: 'With description',
  args: { description: '⌘C' },
};

/**
 * The design's Menu-item matrix: every mark against every state. Hover and
 * focus are live — point at a row or tab into it.
 */
export const StatesMatrix: Story = {
  name: 'All states',
  parameters: { layout: 'padded' },
  render: () => {
    const columns = [
      { title: 'Unselected', mark: MenuItemMark.None, selected: false },
      {
        title: 'Selected, with check',
        mark: MenuItemMark.Check,
        selected: true,
      },
      { title: 'Selected, in a list', mark: MenuItemMark.Tint, selected: true },
      {
        title: 'Selected, in navigation',
        mark: MenuItemMark.Highlight,
        selected: true,
      },
      { title: 'Multiselect', mark: MenuItemMark.Checkbox, selected: true },
    ];

    return (
      <div className="flex gap-4">
        {columns.map((column) => (
          <div key={column.title} className="w-[240px]">
            <p className="mb-2 text-secondary dial-caption-text">
              {column.title}
            </p>
            <div className="rounded-xl bg-layer-raised p-1 shadow-md">
              <MenuItem
                role="menuitem"
                label="Label"
                icon={copyIcon}
                mark={column.mark}
                selected={column.selected}
              />
              <MenuItem
                role="menuitem"
                label="Disabled"
                icon={copyIcon}
                mark={column.mark}
                selected={column.selected}
                disabled
              />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * A control of its own at the trailing edge — the favourite toggle of the
 * design's select list. It is a sibling of the row, so it keeps its own click
 * and stays out of the row's accessible name; the focus ring moves to the
 * rectangle around both.
 */
export const WithRightControl: Story = {
  name: 'With a right control',
  args: {
    label: 'GPT-4o',
    rightControl: (
      <GhostIconButton
        aria-label="Add GPT-4o to favourites"
        size={ElementSize.Small}
        icon={
          <IconStar
            size={DIAL_ICON_SIZE.SM}
            stroke={DIAL_KIT_ICON_STROKE}
            aria-hidden="true"
          />
        }
      />
    ),
  },
};
