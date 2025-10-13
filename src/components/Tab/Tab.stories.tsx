import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { TabModel } from '@/models/tab';
import { DialTab } from './Tab';

const sampleTab: TabModel = { id: 'overview', name: 'Overview' };

const meta: Meta<typeof DialTab> = {
  title: 'Components/Tab',
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
    isActive: {
      control: 'boolean',
      description: 'Marks the tab as active.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the tab so it is non-interactive.',
    },
    invalid: {
      control: 'boolean',
      description: 'Marks the tab as invalid, showing an error icon.',
    },
    isHorizontal: {
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
    isActive: true,
    onClick: () => null,
  },
};

export const Inactive: Story = {
  args: {
    tab: { id: 'details', name: 'Details' },
    isActive: false,
    isHorizontal: true,
    onClick: () => null,
  },
};

export const Disabled: Story = {
  args: {
    tab: { id: 'settings', name: 'Settings' },
    isActive: false,
    disabled: true,
    isHorizontal: true,
    onClick: () => null,
  },
};

export const Invalid: Story = {
  args: {
    tab: { id: 'analytics', name: 'Analytics' },
    isActive: false,
    invalid: true,
    isHorizontal: true,
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
            <div className="flex gap-2 bg-gray-50 rounded">
              {tabs.map((t) => (
                <DialTab
                  key={t.id}
                  tab={t}
                  isActive={t.id === activeId}
                  isHorizontal
                  onClick={setActiveId}
                />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Vertical</h4>
            <div className="flex flex-col gap-2 bg-gray-50 p-2 rounded">
              {tabs.map((t) => (
                <DialTab
                  key={t.id}
                  tab={t}
                  isActive={t.id === activeId}
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
