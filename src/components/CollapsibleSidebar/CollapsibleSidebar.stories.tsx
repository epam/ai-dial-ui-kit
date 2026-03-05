import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import {
  DialCollapsibleSidebar,
  type DialCollapsibleSidebarProps,
} from './CollapsibleSidebar';
import { DialButton } from '@/components/Button/Button';
import { BASE_ICON_SIZE } from '@/constants/icon';

const BarContent = (
  <div className="flex flex-col gap-4">
    <p className="text-primary">This is the collapsible content.</p>
    <p className="text-secondary">
      You can place any custom content here — text, lists, buttons, etc.
    </p>
    <DialPrimaryButton label="Action" className="w-fit" />
  </div>
);

const InteractiveCollapseBar = (args: DialCollapsibleSidebarProps) => {
  return (
    <div className="flex text-primary h-[250px]">
      <DialCollapsibleSidebar {...args}>{args.children}</DialCollapsibleSidebar>
      <div className="flex-1 bg-layer-3 flex items-center justify-center">
        <p className="text-sm text-secondary">Main content area</p>
      </div>
    </div>
  );
};

const meta: Meta<typeof DialCollapsibleSidebar> = {
  title: 'Navigation/CollapsibleSidebar',
  component: DialCollapsibleSidebar,
  tags: ['collapse', 'sidebar', 'panel'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A collapsible horizontal sidebar with toggle button, title, and optional additional buttons. Useful for adjustable side panels in dashboards or editors.',
      },
    },
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Width of the sidebar when expanded (in px)',
    },
    title: {
      control: { type: 'text' },
      description: 'Title displayed when collapsed (rotated text)',
    },
    titleClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for title',
    },
    additionalButtons: {
      control: false,
      description: 'ReactNode with additional buttons displayed when open',
    },
    children: {
      control: false,
      description: 'Content inside the collapsible area',
    },
    containerClassName: {
      control: { type: 'text' },
      description: 'Additional CSS classes for container',
    },
    iconSize: {
      control: { type: 'number' },
      description: 'Icon size for the toggle button',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveCollapseBar,
  args: {
    width: 300,
    title: 'Panel',
    children: BarContent,
  },
};

export const WithAdditionalButtons: Story = {
  render: InteractiveCollapseBar,
  args: {
    width: 300,
    title: 'Settings',
    children: BarContent,
    additionalButtons: (
      <DialButton
        iconBefore={<IconSettings size={BASE_ICON_SIZE} />}
        onClick={() => alert('Settings clicked!')}
        className="hover:text-accent-primary"
      />
    ),
  },
};

export const Narrow: Story = {
  render: InteractiveCollapseBar,
  args: {
    width: 200,
    title: 'Menu',
    children: BarContent,
  },
};

export const AllVariants: Story = {
  render: () => {
    const variants = [
      {
        label: 'Default',
        args: { width: 300, title: 'Panel', children: BarContent },
      },
      {
        label: 'With Buttons',
        args: {
          width: 300,
          title: 'Tools',
          children: BarContent,
          additionalButtons: (
            <DialButton
              iconBefore={<IconSettings size={BASE_ICON_SIZE} />}
              onClick={() => alert('Settings clicked!')}
            />
          ),
        },
      },
      {
        label: 'Narrow',
        args: { width: 200, title: 'Menu', children: BarContent },
      },
    ];

    return (
      <div className="flex flex-col gap-8 p-4 min-h-screen">
        {variants.map(({ label, args }) => (
          <div key={label}>
            <h3 className="text-lg font-semibold mb-4 text-primary">{label}</h3>
            <InteractiveCollapseBar {...args} />
          </div>
        ))}
      </div>
    );
  },
};

const ControlledExternalComponent = (args: DialCollapsibleSidebarProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-4 p-4 h-[300px]">
      <DialCollapsibleSidebar
        {...args}
        isOpened={open}
        onToggle={(next) => setOpen(next)}
        containerClassName="text-primary"
        title="Filters"
      >
        {BarContent}
      </DialCollapsibleSidebar>
      <div className="flex flex-col gap-2">
        <DialButton
          label={open ? 'Close from outside' : 'Open from outside'}
          onClick={() => setOpen((v) => !v)}
        />
        <p className="text-secondary text-sm">
          State: {open ? 'Open' : 'Closed'}
        </p>
      </div>
    </div>
  );
};

export const ControlledExternal: Story = {
  render: ControlledExternalComponent,
  args: {
    width: 320,
    title: 'Filters',
  },
};
