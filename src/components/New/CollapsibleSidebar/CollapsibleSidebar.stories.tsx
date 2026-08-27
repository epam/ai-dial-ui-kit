import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconSettings } from '@tabler/icons-react';
import { useState } from 'react';

import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import {
  CollapsibleSidebar,
  type CollapsibleSidebarProps,
} from './CollapsibleSidebar';

const SidebarContent = (
  <div className="flex flex-col gap-4">
    <p className="dial-small-text text-primary">
      This is the collapsible content.
    </p>
    <p className="dial-small-paragraph-text text-secondary">
      Any custom content goes here — text, lists, forms or buttons. It stays
      mounted while the sidebar is collapsed, so scroll position and form state
      survive the toggle.
    </p>
    <Button label="Action" className="w-fit" variant={ButtonVariant.Primary} />
  </div>
);

const Layout = (args: CollapsibleSidebarProps) => (
  <div className="flex h-[280px] bg-layer-base">
    <CollapsibleSidebar {...args} />
    <div className="flex flex-1 items-center justify-center">
      <p className="dial-small-text text-secondary">Main content area</p>
    </div>
  </div>
);

const meta = {
  title: 'Components_2_0/CollapsibleSidebar',
  component: CollapsibleSidebar,
  tags: ['collapse', 'sidebar', 'panel'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A side panel that collapses to a narrow rail carrying its title vertically. The toggle is a real `aria-expanded` control naming the content region it operates, and the content stays mounted while collapsed so its state survives. The container paints no background and no radius — it sits on the surface it belongs to.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Name of the panel, shown vertically while collapsed',
    },
    width: {
      control: { type: 'number' },
      description: 'Width in px while expanded',
    },
    collapsedWidth: {
      control: { type: 'number' },
      description: 'Width in px while collapsed',
    },
    defaultOpened: {
      control: { type: 'boolean' },
      description: 'Initial open state when uncontrolled',
    },
    isOpened: {
      control: { type: 'boolean' },
      description: 'Controlled open state',
    },
    children: {
      control: false,
      description: 'Content shown while expanded',
    },
    additionalButtons: {
      control: false,
      description: 'Extra footer controls, rendered while expanded',
    },
    onToggle: { control: false },
  },
  args: {
    title: 'Panel',
    width: 300,
    children: SidebarContent,
  },
  render: Layout,
} satisfies Meta<CollapsibleSidebarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InitiallyCollapsed: Story = {
  args: {
    title: 'Filters',
    defaultOpened: false,
  },
};

export const Narrow: Story = {
  args: {
    title: 'Menu',
    width: 200,
  },
};

export const WithAdditionalButtons: Story = {
  args: {
    title: 'Settings',
    additionalButtons: (
      <IconButton
        variant={ButtonVariant.Primary}
        appearance={ButtonAppearance.Ghost}
        aria-label="Panel settings"
        tooltipProps={{ tooltip: 'Panel settings' }}
        icon={<IconSettings size={DIAL_ICON_SIZE.MD} aria-hidden="true" />}
      />
    ),
  },
};

const ControlledStory = (args: CollapsibleSidebarProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="flex h-[280px] bg-layer-base">
      <CollapsibleSidebar
        {...args}
        isOpened={opened}
        onToggle={(next) => setOpened(next)}
      />
      <div className="flex flex-col items-start gap-2 p-4">
        <Button
          variant={ButtonVariant.Neutral}
          appearance={ButtonAppearance.Outlined}
          label={opened ? 'Close from outside' : 'Open from outside'}
          onClick={() => setOpened((value) => !value)}
        />
        <p className="dial-small-text text-secondary">
          State: {opened ? 'Open' : 'Closed'}
        </p>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  args: {
    title: 'Filters',
    width: 320,
  },
  render: ControlledStory,
};
