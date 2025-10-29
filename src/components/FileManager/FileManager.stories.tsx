import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialFileManager, type DialFileManagerProps } from './FileManager';
import { itemsMock } from './__mocks__/files';
import { useDialFileManagerTabs } from './hooks/use-file-manager-tabs';
import { ButtonVariant } from '@/types/button';
import { DialButton } from '@/components/Button/Button';
import { DialPopup } from '@/components/Popup/Popup';

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
    toolbarOptions: {},
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
        }}
        gridOptions={{
          ...args.gridOptions,
          filterable: false,
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

const PopupComponent = (args: DialFileManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeTab, handleTabChange, tabs } = useDialFileManagerTabs({
    my_files: 'My Files',
    shared: 'Shared with Me',
    organization: 'Organization',
  });

  return (
    <div className="h-[640px] w-full flex items-center justify-center">
      <DialButton
        onClick={() => setIsOpen(!isOpen)}
        variant={ButtonVariant.Primary}
        title="Toggle File Manager"
      />
      <DialPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        cssClass="w-[1000px] !h-[600px]"
      >
        <DialFileManager
          {...args}
          gridOptions={{ ...args.gridOptions, filterable: false }}
          toolbarOptions={{
            ...args.toolbarOptions,
            tabs: tabs,
            activeTab: activeTab,
            onTabChange: handleTabChange,
          }}
          treeOptions={{
            ...args.treeOptions,
            collapsed: false,
            actionLabels: {
              ...args.treeOptions?.actionLabels,
              copy: 'Copy',
              cut: 'Cut',
              paste: 'Paste',
            },
          }}
          onCopyFiles={(files, destination) =>
            alert(
              `Copying files: ${files
                .map((f) => f)
                .join(', ')} to ${destination}`,
            )
          }
          onMoveToFiles={(files, destination) =>
            alert(
              `Moving files: ${files
                .map((f) => f)
                .join(', ')} to ${destination}`,
            )
          }
        />
      </DialPopup>
    </div>
  );
};

export const InPopup: Story = {
  render: PopupComponent,
};
