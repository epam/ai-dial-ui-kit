import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useMemo, useState } from 'react';
import {
  DialFileManager,
  DialFileManagerView,
  type DialFileManagerProps,
} from './FileManager';
import { FileManagerProvider } from './FileManagerProvider';
import { itemsMock } from './__mocks__/files';
import { useDialFileManagerTabs } from './hooks/use-file-manager-tabs';
import { ButtonVariant } from '@/types/button';
import { DialButton } from '@/components/Button/Button';
import { DialPopup } from '@/components/Popup/Popup';
import {
  DialFileNodeType,
  type DialFile,
  type DialRootFolder,
} from '@/models/file';
import type { DialUploadFileItem } from '@/models/file-manager';

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

  const [items, setItems] = useState<DialFile[]>(itemsMock);
  const [renaming, setRenaming] = useState<string | undefined>();
  const [destinationPath, setDestinationPath] = useState<string | undefined>();

  const updateItemNameByPath = useCallback(
    (items: DialFile[], path: string, newName: string): DialFile[] => {
      return items.map((item) => {
        if (item.path === path) {
          return { ...item, name: newName };
        }
        if (item.items) {
          return {
            ...item,
            items: updateItemNameByPath(item.items, path, newName),
          };
        }
        return item;
      });
    },
    [],
  );

  const handleRename = useCallback((path: string) => {
    setRenaming(path);
  }, []);

  const handleRenameSave = useCallback(
    (value: string) => {
      if (renaming) {
        setItems((prevItems) =>
          updateItemNameByPath(prevItems, renaming, value),
        );
        setRenaming(undefined);
      }
    },
    [renaming, setItems, updateItemNameByPath],
  );

  const handleRenameCancel = useCallback(() => setRenaming(undefined), []);

  const handleRenameValidation = useCallback(
    (value: string, item: DialFile) => {
      if (!value) {
        return 'Item name should not be empty';
      }

      const isFolder = item.nodeType === DialFileNodeType.FOLDER;

      if (isFolder) {
        const isValid = /^[a-zA-Z0-9_]+$/.test(value);
        if (!isValid) {
          return 'Folder name contains special symbols. Only letters, numbers, and underscores are allowed.';
        }
        return null;
      } else {
        const fileNamePattern = /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)?$/;
        if (!fileNamePattern.test(value)) {
          return 'File name is invalid. Only one dot is allowed (for extension), and only letters, numbers, and underscores are allowed in the name and extension.';
        }
        return null;
      }
    },
    [],
  );

  const handleUploadFiles = useCallback(
    (files: DialUploadFileItem[], destinationFolder: string) => {
      alert(
        `Uploaded ${files.length} file(s) to ${destinationFolder}:\n${files
          .map(
            (f) => `${f.name} (${(f.fileContent.size / 1024).toFixed(2)} KB)`,
          )
          .join('\n')}`,
      );
    },
    [],
  );

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
          items={items}
          destinationFolderPopupOptions={{
            destinationFolderPath: destinationPath,
            setDestinationFolderPath: setDestinationPath,
          }}
          gridOptions={{
            ...(args.gridOptions ?? {}),
            filterable: false,
            dateLocale: 'en-US',
            dateOptions: {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            },
            actionLabels: {
              duplicate: 'Duplicate',
              copy: 'Copy to',
              move: 'Move to',
              download: 'Download',
              delete: 'Delete',
            },
          }}
          toolbarOptions={{
            ...(args.toolbarOptions ?? {}),
            tabs: tabs,
            activeTab: activeTab,
            onTabChange: handleTabChange,
          }}
          bulkActionsToolbarOptions={{
            selectionLabel: 'items selected',
            actionLabels: {
              duplicate: 'Duplicate',
              copy: 'Copy to',
              move: 'Move to',
              download: 'Download',
              delete: 'Delete',
            },
          }}
          treeOptions={{
            ...(args.treeOptions ?? {}),
            collapsed: false,
            expandedPaths: new Set<string>([rootItem.path]),
            actionLabels: {
              ...(args.treeOptions?.actionLabels ?? {}),
              duplicate: 'Duplicate',
              copy: 'Copy to',
              move: 'Move to',
              rename: 'Rename',
              download: 'Download',
              delete: 'Delete',
            },
          }}
          onCopyFiles={(items, destinationFolder) => {
            alert(
              `Copying files: ${items
                .map((f) => f.sourceUrl)
                .join(', ')} to ${destinationFolder}`,
            );
          }}
          onMoveToFiles={(items, sourceFolder, destinationFolder) => {
            alert(
              `Moving files from ${sourceFolder} to ${destinationFolder}: ${items
                .map((f) => f.sourceUrl)
                .join(', ')}`,
            );
          }}
          onDeleteFiles={(items, sourceFolder) => {
            alert(
              `Deleting ${items.length} file(s) from ${sourceFolder}: ${items.map((f) => f.sourceUrl).join(', ')}`,
            );
          }}
          onDownloadFiles={(items) => {
            alert(
              `Downloading ${items.length} file(s): ${items.map((f) => f.name).join(', ')}`,
            );
          }}
          onRename={handleRename}
          onRenameSave={handleRenameSave}
          onRenameCancel={handleRenameCancel}
          onRenameValidate={handleRenameValidation}
          onUploadFiles={handleUploadFiles}
          maxFileSize={10 * 1024 * 1024} // 10MB
          rootItem={rootItem}
        />
      </DialPopup>
    </div>
  );
};

export const InPopup: Story = {
  render: PopupComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager in a popup with drag and drop upload support. Try dragging files from your computer into the grid area. Validates file names for forbidden characters, checks file size limits (max 10MB), and prevents hidden files (starting with dot) and reserved system names.',
      },
    },
  },
};

export const WithCustomProvider: Story = {
  render: (args) => (
    <div className="h-[640px] flex flex-col gap-3">
      <FileManagerProvider {...args} items={itemsMock}>
        <div className="bg-layer-3 px-4 py-2 text-secondary">
          My app wants to show its own toolbar here (uses same context)
        </div>
        <DialFileManagerView />
        <div className="bg-layer-3 px-4 py-2 text-secondary">
          Footer actions / secondary info
        </div>
      </FileManagerProvider>
    </div>
  ),
};

const TreeCollapsedControlledComponent = (args: DialFileManagerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="h-[640px] flex flex-col gap-4">
      <div className="flex gap-2 items-center p-4">
        <DialButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant={ButtonVariant.Primary}
          title={isCollapsed ? 'Expand Tree' : 'Collapse Tree'}
        />
      </div>
      <DialFileManager
        {...args}
        treeOptions={{
          ...args.treeOptions,
          collapsed: isCollapsed,
          onCollapseChange: setIsCollapsed,
        }}
      />
    </div>
  );
};

export const TreeCollapsedControlled: Story = {
  render: TreeCollapsedControlledComponent,
};

const rootItem: DialRootFolder = {
  id: 'root',
  folderId: 'root',
  path: '/All files',
  name: 'All files',
  breadcrumbLabel: 'My Workspace',
  nodeType: DialFileNodeType.FOLDER,
  items: itemsMock,
};

const WithRootItemComponent = (args: DialFileManagerProps) => {
  const treeOptions = useMemo(
    () => ({
      ...args.treeOptions,
      expandedPaths: new Set<string>([
        '/All files',
        '/All files/Design',
        '/All files/Design/Icons',
      ]),
    }),
    [args.treeOptions],
  );
  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        rootItem={rootItem}
        path="/All files/Design/Icons"
        treeOptions={treeOptions}
      />
    </div>
  );
};

export const WithRootItem: Story = {
  render: WithRootItemComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with rootItem that replaces the root path in breadcrumb. For example, "/All files" is shown as "My Workspace".',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    filesLoading: true,
    items: [],
  },
};

export const LoadingWithData: Story = {
  args: {
    filesLoading: true,
  },
};
