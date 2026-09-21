import {
  IconChartBar,
  IconInfoCircle,
  IconPalette,
  IconSettings,
} from '@tabler/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TabOrientation } from '@/types/tab';
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
          'A row or rail of tabs from the 2.0 design system. Follows the ARIA tabs pattern with automatic activation: the arrow keys move focus and selection, `Home` and `End` jump to the ends. `TabOrientation.Horizontal` underlines the active tab; `TabOrientation.Vertical` draws the settings-page rail, where the active row sits on a tinted pill and `ArrowUp` / `ArrowDown` drive it.',
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
    orientation: {
      control: 'radio',
      options: Object.values(TabOrientation),
      description: 'Layout direction of the tab list',
    },
    sectionLabel: {
      control: 'text',
      description:
        'Heading rendered above the tabs, which also names the tab list',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the tab list',
    },
    className: {
      control: 'text',
      description:
        'Additional CSS classes for the root element — the heading wrapper when sectionLabel is set, the tab list itself when it is not',
    },
    tabClassName: {
      control: 'text',
      description: 'Additional CSS classes applied to every tab',
    },
    sectionLabelClassName: {
      control: 'text',
      description: 'Additional CSS classes for the sectionLabel heading',
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

const settingsSections = [
  {
    id: 'preferences',
    label: 'Preferences',
    icon: <IconSettings size={18} />,
  },
  { id: 'appearance', label: 'Appearance', icon: <IconPalette size={18} /> },
  { id: 'usage', label: 'Usage', icon: <IconChartBar size={18} /> },
  { id: 'about', label: 'About', icon: <IconInfoCircle size={18} /> },
];

export const Vertical: Story = {
  render: InteractiveTabs,
  args: {
    orientation: TabOrientation.Vertical,
    tabs: settingsSections,
    activeTabId: 'preferences',
    onTabChange: noop,
    ariaLabel: 'Settings sections',
    className: 'w-[240px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The rail shape: full-width rows with an optional leading icon, the active one on a tinted pill. `ArrowUp` and `ArrowDown` move the selection; the horizontal arrows do nothing.',
      },
    },
  },
};

export const VerticalWithSectionLabel: Story = {
  render: InteractiveTabs,
  args: {
    orientation: TabOrientation.Vertical,
    sectionLabel: 'Settings',
    tabs: settingsSections,
    activeTabId: 'preferences',
    onTabChange: noop,
    className: 'w-[240px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `sectionLabel` the heading also names the tab list through `aria-labelledby`, so no separate `ariaLabel` is needed. The heading wrapper becomes the root, and `className` lands on it.',
      },
    },
  },
};

export const VerticalWithCounts: Story = {
  render: InteractiveTabs,
  args: {
    orientation: TabOrientation.Vertical,
    tabs: [
      { id: 'all', label: 'All', count: 12 },
      { id: 'shared', label: 'Shared with me', count: 3 },
      { id: 'published', label: 'Published', count: 0 },
      { id: 'archived', label: 'Archived', disabled: true },
    ],
    activeTabId: 'all',
    onTabChange: noop,
    ariaLabel: 'Conversation views',
    className: 'w-[240px]',
  },
  parameters: {
    docs: {
      description: {
        story:
          'In a rail the count badge sits at the far end of the row rather than beside the label. Disabled rows are greyed out and skipped by the arrow keys.',
      },
    },
  },
};

export const SettingsPageLayout: Story = {
  args: { tabs, activeTabId: 'all', onTabChange: noop },
  render: () => (
    <div className="flex h-[420px] w-[720px] bg-layer-base">
      <InteractiveTabs
        orientation={TabOrientation.Vertical}
        sectionLabel="Settings"
        tabs={settingsSections}
        activeTabId="preferences"
        onTabChange={noop}
        className="w-[240px] shrink-0 border-e border-e-tertiary bg-layer-raised"
      />
      <div className="dial-small-text flex-1 p-6 text-secondary">
        The selected section&apos;s panel renders here — `Tabs` draws the
        navigation only.
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'The shape the rail was drawn for: a settings surface whose tabs each own a whole page. The panel stays with the consumer.',
      },
    },
  },
};
