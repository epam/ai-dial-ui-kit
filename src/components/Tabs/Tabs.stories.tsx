import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialTabs, type DialTabsProps } from './Tabs';
import { TabOrientation } from '@/types/tab';
import type { TabModel } from '@/models/tab';

const sampleTabs: TabModel[] = [
  { id: 'overview', name: 'Overview' },
  { id: 'details', name: 'Details' },
  { id: 'settings', name: 'Settings' },
  { id: 'analytics', name: 'Analytics' },
];

const manySampleTabs: TabModel[] = [
  ...sampleTabs,
  ...sampleTabs.map((t) => ({
    id: t.id + '_copy',
    name: t.name + ' Copy',
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
          'A responsive tabs component that switches between horizontal and dropdown (mobile) layouts. Supports horizontal and vertical orientations and integrates with JSON editor states.',
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
    jsonEditorEnabled: {
      control: 'boolean',
      description:
        'Hides the tab UI when the JSON editor mode is active (used for special contexts).',
    },
    onClick: {
      action: 'tabClicked',
      description:
        'Callback fired when a tab is clicked. Receives the tab’s ID as a parameter.',
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-10 text-primary">
      <div className="flex flex-col gap-10 w-[600px] text-primary">
        <div>
          <h4 className="text-lg font-semibold mb-2">Horizontal</h4>
          <InteractiveTabs
            tabs={sampleTabs}
            activeTab="settings"
            orientation={TabOrientation.Horizontal}
            onClick={() => null}
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Vertical</h4>
          <InteractiveTabs
            tabs={sampleTabs}
            activeTab="details"
            orientation={TabOrientation.Vertical}
            onClick={() => null}
          />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Many horizontal tabs</h4>
          <InteractiveTabs
            tabs={manySampleTabs}
            activeTab="details"
            orientation={TabOrientation.Horizontal}
            onClick={() => null}
          />
        </div>
      </div>
    </div>
  ),
};
