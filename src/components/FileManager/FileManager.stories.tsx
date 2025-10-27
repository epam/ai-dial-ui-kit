import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialFileManager, type DialFileManagerProps } from './FileManager';
import { itemsMock } from './__mocks__/files';
import { useDialFileManagerTabs } from './hooks/use-file-manager-tabs';

const meta = {
  title: 'FileManager/FileManager',
  component: DialFileManager,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    path: { control: { type: 'text' } },
    cssClass: { control: { type: 'text' } },
    items: { control: 'object' },
    treeOptions: { control: 'object' },
    navigationPanelOptions: { control: 'object' },
    onPathChange: { action: 'onPathChange' },
  },
  args: {
    path: '/All files/Folder 4',
    items: itemsMock,
    treeOptions: {
      expandedPaths: new Set<string>([
        '/All files',
        '/All files/Design',
        '/All files/Design/Icons',
        '/All files/Design/Icons/SVG',
        '/All files/Folder 4',
        '/All files/Media',
        '/All files/Projects',
      ]),
    },
    navigationPanelOptions: {
      searchable: true,
    },
    toolbarOptions: {
      areHiddenFilesVisible: false,
    },
  },
} satisfies Meta<DialFileManagerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const PreselectedNode: Story = {
  args: {
    path: '/All files/Design/Icons/SVG/24px/logo.svg',
    treeOptions: {
      expandedPaths: new Set<string>([
        '/All files',
        '/All files/Design',
        '/All files/Design/Icons',
        '/All files/Design/Icons/SVG',
        '/All files/Design/Icons/SVG/24px',
      ]),
    },
  },
};

const WithSearchControlledComponent = (args: DialFileManagerProps) => {
  const [query, setQuery] = useState('');
  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        navigationPanelOptions={{
          ...args.navigationPanelOptions,
          searchable: true,
          value: query,
          onSearchChange: (v) => setQuery(String(v ?? '')),
        }}
      />
    </div>
  );
};

export const WithSearchControlled: Story = {
  render: WithSearchControlledComponent,
};

export const GridWithoutFilters: Story = {
  args: {
    navigationPanelOptions: { searchable: true },
    gridOptions: { filterable: false },
  },
};

export const WithFilesInTree: Story = {
  args: {
    treeOptions: {
      showFiles: true,
    },
  },
};

export const CustomClasses: Story = {
  args: { cssClass: 'bg-layer-4 h-[640px]' },
};

const WithTabsControlledComponent = (args: DialFileManagerProps) => {
  const { activeTab, handleTabChange, tabs } = useDialFileManagerTabs({
    my_files: 'My Files',
    shared: 'Shared with Me',
    organization: 'Organization',
  });

  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        toolbarOptions={{
          ...args.toolbarOptions,
          tabs: tabs,
          activeTab: activeTab,
          onTabChange: handleTabChange,
          areHiddenFilesVisible: false,
        }}
      />
    </div>
  );
};

export const WithTabsControlled: Story = {
  render: WithTabsControlledComponent,
};

export const HandleTableFileClick: Story = {
  args: {
    onTableFileClick: (file) => alert(`File clicked: ${file.name}`),
  },
};
