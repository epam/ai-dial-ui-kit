import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { TabModel } from '@/models/tab';
import { DialTab } from './Tab';

const sampleTab: TabModel = { id: 'overview', name: 'Overview' };

const meta: Meta<typeof DialTab> = {
  title: 'Navigation/Tab',
  component: DialTab,
  tags: ['navigation', 'tab', 'display'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A single tab used within DialTabs. Supports active, disabled, and invalid states, horizontal or vertical orientations, and optional additional styling.',
      },
    },
  },
  argTypes: {
    tab: {
      control: 'object',
      description: 'The tab object containing `id` and `name`.',
    },
    active: {
      control: 'boolean',
      description: 'Marks the tab as active.',
    },
    horizontal: {
      control: 'boolean',
      description: 'Determines horizontal vs vertical orientation.',
    },
    cssClass: {
      control: 'text',
      description: 'Optional additional CSS classes.',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tab: sampleTab,
    active: true,
    onClick: () => null,
  },
};

export const Inactive: Story = {
  args: {
    tab: { id: 'details', name: 'Details' },
    active: false,
    horizontal: true,
    onClick: () => null,
  },
};

export const Disabled: Story = {
  args: {
    tab: { id: 'settings', name: 'Settings', disabled: true },
    active: false,
    horizontal: true,
    onClick: () => null,
  },
};

export const Invalid: Story = {
  args: {
    tab: { id: 'analytics', name: 'Analytics', invalid: true },
    active: false,
    horizontal: true,
    onClick: () => null,
  },
};

export const TooLongText: Story = {
  args: {
    tab: {
      id: 'analytics',
      name: 'Analytics Settings DialTabs Support Variant Of Long Text Message',
    },
    active: false,
    horizontal: true,
    onClick: () => null,
  },
};

export const OrientationVariants: Story = {
  render: () => {
    const TabDemo = () => {
      const tabs: TabModel[] = [
        { id: 'overview', name: 'Overview' },
        { id: 'details', name: 'Details' },
        { id: 'settings', name: 'Settings' },
      ];

      const [activeId, setActiveId] = useState(tabs[0].id);

      return (
        <div className="flex gap-4 text-primary">
          <div>
            <h4 className="text-sm font-semibold mb-2">Horizontal</h4>
            <div className="flex gap-2 rounded">
              {tabs.map((t) => (
                <DialTab
                  key={t.id}
                  tab={t}
                  active={t.id === activeId}
                  horizontal
                  onClick={setActiveId}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="dial-small font-semibold mb-2">Vertical</h4>
            <div className="flex flex-col gap-2 bg-layer-3 p-2 rounded">
              {tabs.map((t) => (
                <DialTab
                  key={t.id}
                  tab={t}
                  active={t.id === activeId}
                  onClick={setActiveId}
                />
              ))}
            </div>
          </div>
        </div>
      );
    };

    return <TabDemo />;
  },
};
