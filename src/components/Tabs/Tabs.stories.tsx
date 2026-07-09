import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialTabs, type DialTabsProps } from './Tabs';
import { TabOrientation, TabView } from '@/types/tab';
import type { TabModel } from '@/models/tab';

const sampleTabs: TabModel[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'settings', label: 'Settings' },
  { id: 'analytics', label: 'Analytics' },
];

const manySampleTabs: TabModel[] = [
  ...sampleTabs,
  ...sampleTabs.map((t) => ({
    id: t.id + '_copy',
    label: t.label + ' Copy',
    invalid: t.id === 'overview',
  })),
];

const InteractiveTabs = (args: DialTabsProps) => {
  const [activeTab, setActiveTab] = useState(
    args.activeTab || sampleTabs[0].id,
  );

  return (
    <div className="w-[600px] text-primary">
      <DialTabs
        {...args}
        tabs={args.tabs || sampleTabs}
        activeTab={activeTab}
        onClick={setActiveTab}
      />
    </div>
  );
};

const meta: Meta<typeof DialTabs> = {
  title: 'Navigation/Tabs',
  component: DialTabs,
  tags: ['navigation', 'tabs', 'layout'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A responsive and overflow-aware tabs component that adapts between horizontal and dropdown (mobile) layouts based on screen size and available space. When there are too many tabs to fit in one line, the component automatically adds a dropdown button for accessing hidden tabs and enables smooth horizontal scrolling.',
      },
    },
  },
  argTypes: {
    tabs: {
      control: 'object',
      description: 'Array of tab objects with `id` and `name` fields.',
    },
    activeTab: {
      control: 'text',
      description: 'ID of the currently active tab.',
    },
    orientation: {
      control: 'select',
      options: Object.values(TabOrientation),
      description: 'Orientation of the tabs (horizontal or vertical).',
    },
    view: {
      control: 'select',
      options: Object.values(TabView),
      description:
        'Visual style of the tabs. `inline` renders a compact segmented control with a check icon on the active tab.',
    },
    onClick: {
      action: 'tabClicked',
      description:
        'Callback fired when a tab is clicked. Receives the tab’s ID as a parameter.',
    },
    smallScreenContainerClassName: {
      control: 'text',
    },
    smallScreenDropdownItemClassName: {
      control: 'text',
    },
    desktopDropdownClassName: {
      control: 'text',
    },
    desktopTabClassName: {
      control: 'text',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: InteractiveTabs,
  args: {
    tabs: sampleTabs,
    activeTab: 'overview',
    orientation: TabOrientation.Horizontal,
  },
};

export const Vertical: Story = {
  render: InteractiveTabs,
  args: {
    tabs: sampleTabs,
    activeTab: 'details',
    orientation: TabOrientation.Vertical,
  },
};

export const WithJsonEditor: Story = {
  render: InteractiveTabs,
  args: {
    tabs: sampleTabs,
    activeTab: 'details',
    orientation: TabOrientation.Vertical,
  },
};

export const ManyHorizontalTabs: Story = {
  render: InteractiveTabs,
  args: {
    tabs: manySampleTabs,
    activeTab: 'overview',
    orientation: TabOrientation.Horizontal,
  },
};

export const ManyVerticalTabs: Story = {
  render: InteractiveTabs,
  args: {
    tabs: manySampleTabs,
    activeTab: 'overview',
    orientation: TabOrientation.Vertical,
  },
};

export const WithInvalidTab: Story = {
  render: InteractiveTabs,
  args: {
    tabs: sampleTabs.map((tab) => ({
      ...tab,
      invalid: tab.id === 'details',
    })),
    activeTab: 'details',
    orientation: TabOrientation.Horizontal,
  },
};

export const StyledDesktopTabs: Story = {
  render: InteractiveTabs,
  args: {
    tabs: manySampleTabs,
    activeTab: 'details',
    desktopDropdownClassName: 'bg-layer-4 w-10 h-8 border-none',
    desktopTabClassName: 'h-8 px-3',
  },
};

export const InlineView: Story = {
  render: InteractiveTabs,
  args: {
    tabs: sampleTabs,
    activeTab: 'overview',
    view: TabView.Inline,
  },
};

export const InlineViewWithDisabledTab: Story = {
  render: InteractiveTabs,
  args: {
    tabs: sampleTabs.map((tab) => ({
      ...tab,
      disabled: tab.id === 'settings',
    })),
    activeTab: 'overview',
    view: TabView.Inline,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-10 text-primary">
      <div className="flex flex-col gap-10 w-[600px] text-primary">
        <div>
          <h3 className="dial-h3-text font-semibold mb-2">Horizontal</h3>
          <InteractiveTabs
            tabs={sampleTabs}
            activeTab="settings"
            orientation={TabOrientation.Horizontal}
            onClick={() => null}
          />
        </div>
        <div>
          <h3 className="dial-h3-text font-semibold mb-2">Vertical</h3>
          <InteractiveTabs
            tabs={sampleTabs}
            activeTab="details"
            orientation={TabOrientation.Vertical}
            onClick={() => null}
          />
        </div>
        <div>
          <h3 className="dial-h3-text font-semibold mb-2">
            Many horizontal tabs and one is invalid
          </h3>
          <InteractiveTabs
            tabs={manySampleTabs}
            activeTab="details"
            orientation={TabOrientation.Horizontal}
            onClick={() => null}
          />
        </div>
        <div>
          <h3 className="dial-h3-text font-semibold mb-2">Inline</h3>
          <InteractiveTabs
            tabs={sampleTabs}
            activeTab="overview"
            view={TabView.Inline}
            onClick={() => null}
          />
        </div>
      </div>
    </div>
  ),
};
