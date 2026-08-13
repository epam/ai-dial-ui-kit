import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs, type TabsProps } from './Tabs';

const InteractiveTabs = (args: TabsProps) => {
  const [activeTabId, setActiveTabId] = useState(args.activeTabId);

  return (
    <Tabs {...args} activeTabId={activeTabId} onTabChange={setActiveTabId} />
  );
};

const meta = {
  title: 'Components_2_0/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A horizontal row of tabs from the 2.0 design system. Follows the ARIA tabs pattern with automatic activation: the arrow keys move focus and selection, `Home` and `End` jump to the ends.',
      },
    },
  },
  argTypes: {
    tabs: {
      control: 'object',
      description: 'Ordered list of tabs to render',
    },
    activeTabId: {
      control: 'text',
      description: 'ID of the currently selected tab',
    },
    onTabChange: {
      action: 'tab changed',
      control: false,
      description: "Fired with the tab's id when the user selects a tab",
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the tab list',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the tab list container',
    },
    tabClassName: {
      control: 'text',
      description: 'Additional CSS classes applied to every tab',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'shared', label: 'Shared with me' },
  { id: 'published', label: 'Published' },
];

const tabsWithCounts = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'shared', label: 'Shared with me', count: 3 },
  { id: 'published', label: 'Published', count: 0 },
];

const tabsWithDisabled = [
  { id: 'all', label: 'All', count: 12 },
  { id: 'shared', label: 'Shared with me', disabled: true },
  { id: 'published', label: 'Published', count: 4, disabled: true },
];

const noop = () => undefined;

export const Default: Story = {
  render: InteractiveTabs,
  args: {
    tabs,
    activeTabId: 'all',
    onTabChange: noop,
    ariaLabel: 'Conversation views',
  },
};

export const WithCounts: Story = {
  render: InteractiveTabs,
  args: {
    tabs: tabsWithCounts,
    activeTabId: 'all',
    onTabChange: noop,
    ariaLabel: 'Conversation views',
  },
};

export const WithDisabledTabs: Story = {
  render: InteractiveTabs,
  args: {
    tabs: tabsWithDisabled,
    activeTabId: 'all',
    onTabChange: noop,
    ariaLabel: 'Conversation views',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled tabs are greyed out, cannot be clicked, and the arrow keys skip over them.',
      },
    },
  },
};

export const AllVariants: Story = {
  args: { tabs, activeTabId: 'all', onTabChange: noop },
  render: () => (
    <div className="flex min-w-[480px] flex-col gap-y-8 p-8">
      <div>
        <div className="dial-small-semi-text mb-2 text-primary">Plain</div>
        <InteractiveTabs
          tabs={tabs}
          activeTabId="all"
          onTabChange={() => undefined}
          ariaLabel="Plain tabs"
        />
      </div>
      <div>
        <div className="dial-small-semi-text mb-2 text-primary">
          With count badges
        </div>
        <InteractiveTabs
          tabs={tabsWithCounts}
          activeTabId="shared"
          onTabChange={() => undefined}
          ariaLabel="Tabs with counts"
        />
      </div>
      <div>
        <div className="dial-small-semi-text mb-2 text-primary">
          With disabled tabs
        </div>
        <InteractiveTabs
          tabs={tabsWithDisabled}
          activeTabId="all"
          onTabChange={() => undefined}
          ariaLabel="Tabs with disabled entries"
        />
      </div>
      <div>
        <div className="dial-small-semi-text mb-2 text-primary">
          Full width row
        </div>
        <InteractiveTabs
          tabs={tabs}
          activeTabId="published"
          onTabChange={() => undefined}
          ariaLabel="Full width tabs"
          className="w-full"
        />
      </div>
    </div>
  ),
};
