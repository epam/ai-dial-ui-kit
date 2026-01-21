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
import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';
import { DialPopup } from '@/components/Popup/Popup';
import {
  DialFileNodeType,
  DialFileResourceType,
  type DialFile,
  type DialRootFolder,
} from '@/models/file';
import type { DialUploadFileItem } from '@/models/file-manager';
import {
  DialFileManagerConflictActions,
  DialFileManagerConflictStrategies,
  DialFileManagerTabs,
} from '@/types/file-manager';
import { PopupSize } from '@/types/popup';
import { FileManagerColumnKey } from '@/types/file-manager';
import {
  IconBuildingCommunity,
  IconFileDescription,
  IconUsers,
} from '@tabler/icons-react';
import type { FileManagerGridRow } from './FileManagerContext';
import type { ColDef } from 'ag-grid-community';
import { DialDateCellRenderer } from '@/components/Grid/renderers/DateCellRenderer';

const meta = {
  title: 'FileManager/FileManager',
  component: DialFileManager,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    path: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    items: { control: 'object' },
    treeOptions: { control: 'object' },
    navigationPanelOptions: { control: 'object' },
    onPathChange: { action: 'onPathChange' },
  },
  args: {
    defaultPath: 'All files',
    items: itemsMock,
    treeOptions: {
      expandedPaths: new Set<string>([
        'All files',
        'All files/Design',
        'All files/Design/Icons',
        'All files/Design/Icons/SVG',
        'All files/Media',
        'All files/Projects',
      ]),
    },
    navigationPanelOptions: {
      searchable: true,
    },
    toolbarOptions: {
      newActions: {
        newFolder: { label: 'New Folder' },
        uploadFiles: { label: 'Upload Files' },
        uploadArchive: { label: 'Upload Archive' },
      },
      disabledNewButtonTooltip: 'Uploads are not allowed in this folder',
    },
  },
} satisfies Meta<DialFileManagerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const PreselectedNode: Story = {
  args: {
    path: 'All files/Design/Icons/SVG/24px/logo.svg',
    treeOptions: {
      expandedPaths: new Set<string>([
        'All files',
        'All files/Design',
        'All files/Design/Icons',
        'All files/Design/Icons/SVG',
        'All files/Design/Icons/SVG/24px',
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
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with controlled search input. Parent component manages search state. Uses local search by default.',
      },
    },
  },
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
  args: { className: 'bg-layer-4 h-[640px]' },
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

const WithTabsInitialTabComponent = (args: DialFileManagerProps) => {
  const { activeTab, handleTabChange, tabs } = useDialFileManagerTabs(
    {
      my_files: 'My Files',
      shared: 'Shared with Me',
      organization: 'Organization',
    },
    DialFileManagerTabs.Shared,
  );

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

export const WithTabsInitialTab: Story = {
  render: WithTabsInitialTabComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with tabs that starts with "Shared with Me" tab as initial active tab. The `initialTab` parameter allows you to control which tab is selected by default.',
      },
    },
  },
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
  const [destinationPath, setDestinationPath] = useState<string | undefined>();
  const [loadedPaths, setLoadedPaths] = useState<Set<string>>(new Set());
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>();

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

  const handleCreateFolder = useCallback(
    async (file: DialUploadFileItem, parentPath: string, id: string) => {
      alert(
        `Creating folder "${file.name}" in path: ${parentPath}. File ID: ${id}. File size: ${file.fileContent.size} bytes.`,
      );
    },
    [],
  );

  const handleCreateFolderValidate = useCallback((name: string) => {
    const forbiddenChars = /[<>:"/\\|?*]/;
    if (forbiddenChars.test(name)) {
      return 'Folder name contains forbidden characters: < > : " / \\ | ? *';
    }

    return null;
  }, []);

  const rootFolder = rootItem;
  switch (activeTab) {
    case 'my_files':
      rootFolder.label = 'My Files';
      break;
    case 'shared':
      rootFolder.label = 'Shared with Me';
      break;
    case 'organization':
      rootFolder.label = 'Organization';
      break;
    default:
      rootFolder.label = 'Files';
      break;
  }

  return (
    <div className="h-[640px] w-full flex items-center justify-center">
      <DialPrimaryButton
        label="Toggle File Manager"
        onClick={() => setIsOpen(!isOpen)}
      />
      <DialPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-[1000px] !h-[600px]"
        size={PopupSize.Lg}
      >
        <DialFileManager
          {...args}
          allowedFileTypes={['.ico', '.svg', 'text/plain', 'application/pdf']}
          onPathChange={(path) => {
            if (path) {
              setLoadedPaths((prev) => new Set(prev).add(path));
            }
            args.onPathChange?.(path);
          }}
          items={itemsMock}
          sharedByMePaths={
            new Set([
              'All files/Design/Icons/SVG/24px/alert.svg',
              'All files/Empty folder',
              'All files/This is a very long folder name designed to test the maximum width limit in the folders tree component and see how text overflow is handled in the UI',
              '/All files/Design/ThisIsAVeryLongFolderNameWithoutSpacesToTestTheUIBehaviorInDifferentComponents',
              'All files/Deep Nest',
            ])
          }
          selectedPaths={selectedPaths}
          onSelectedPathsChange={setSelectedPaths}
          destinationFolderPopupOptions={{
            destinationFolderPath: destinationPath,
            setDestinationFolderPath: setDestinationPath,
            getCopyHeader: (itemsCount, itemName) =>
              itemsCount === 1 && itemName
                ? `Copy "${itemName}"`
                : `Copy ${itemsCount} item(s)`,
            getMoveHeader: (itemsCount, itemName) =>
              itemsCount === 1 && itemName
                ? `Move "${itemName}"`
                : `Move ${itemsCount} item(s)`,
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
              rename: 'Rename',
            },
          }}
          toolbarOptions={{
            ...(args.toolbarOptions ?? {}),
            tabs: tabs,
            activeTab: activeTab,
            onTabChange: handleTabChange,
            newActions: {
              newFolder: { label: 'New Folder' },
              uploadFiles: { label: 'Upload Files' },
              uploadArchive: { label: 'Upload Archive' },
            },
          }}
          bulkActionsToolbarOptions={{
            getSelectionLabel: (selectedCount: number) =>
              `${selectedCount} item(s) selected`,
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
            expandedPaths: new Set<string>([rootFolder.path]),
            header: 'Folder tree',
            loadedPaths,
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
          onRenameValidate={handleRenameValidation}
          onUploadFiles={handleUploadFiles}
          onUploadArchive={(file, destinationFolder) => {
            alert(`Uploaded archive ${file.name} to ${destinationFolder}`);
          }}
          onCreateFolder={handleCreateFolder}
          onCreateFolderValidate={handleCreateFolderValidate}
          folderCreationValidationMessages={{
            emptyName: 'Please enter a folder name',
            duplicateName:
              'A folder with this name already exists in this location',
          }}
          maxFileSize={10 * 1024 * 1024} // 10MB
          rootItem={rootFolder}
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
        <DialPrimaryButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          label={isCollapsed ? 'Expand Tree' : 'Collapse Tree'}
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
  path: 'All files',
  name: 'All files',
  label: 'My Workspace',
  nodeType: DialFileNodeType.FOLDER,
  items: itemsMock,
};

const WithRootItemComponent = (args: DialFileManagerProps) => {
  const treeOptions = useMemo(
    () => ({
      ...args.treeOptions,
      expandedPaths: new Set<string>([
        'All files',
        'All files/Design',
        'All files/Design/Icons',
      ]),
    }),
    [args.treeOptions],
  );
  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        rootItem={rootItem}
        path="All files/Design/Icons"
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

const WithConflictResolutionComponent = (args: DialFileManagerProps) => {
  const [items] = useState<DialFile[]>(itemsMock);
  const [destinationPath, setDestinationPath] = useState<string | undefined>();

  const itemsWithDuplicates = useMemo(() => {
    const clonedItems = JSON.parse(JSON.stringify(items)) as DialFile[];
    const designFolder = clonedItems[0]?.items?.find(
      (item) => item.name === 'Design',
    );
    if (designFolder?.items) {
      designFolder.items.push({
        id: 'duplicate-test-1',
        name: 'alert.svg',
        path: 'All files/Design/alert.svg',
        parentPath: 'All files/Design',
        nodeType: DialFileNodeType.ITEM,
        resourceType: DialFileResourceType.FILE,
        extension: 'svg',
        contentType: 'image/svg+xml',
        folderId: 'design',
        updatedAt: '2025-01-20',
        contentLength: 5120,
      });
    }
    return clonedItems;
  }, [items]);

  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        items={itemsWithDuplicates}
        destinationFolderPopupOptions={{
          destinationFolderPath: destinationPath,
          setDestinationFolderPath: setDestinationPath,
        }}
        conflictResolutionPopupOptions={{
          actionLabels: {
            [DialFileManagerConflictActions.Replace]: 'Replace',
            [DialFileManagerConflictActions.Duplicate]: 'Duplicate',
            [DialFileManagerConflictActions.Cancel]: 'Cancel',
          },
          strategyLabels: {
            [DialFileManagerConflictStrategies.ReplaceAll]: 'Replace All',
            [DialFileManagerConflictStrategies.DuplicateAll]: 'Duplicate All',
            [DialFileManagerConflictStrategies.DecideForEach]:
              'Decide For Each',
          },
        }}
        gridOptions={{
          ...(args.gridOptions ?? {}),
          actionLabels: {
            duplicate: 'Duplicate',
            copy: 'Copy to',
            move: 'Move to',
            download: 'Download',
            delete: 'Delete',
          },
        }}
        bulkActionsToolbarOptions={{
          getSelectionLabel: (selectedCount: number) =>
            `${selectedCount} item(s) selected`,
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
          expandedPaths: new Set<string>([
            'All files',
            'All files/Design',
            'All files/Design/Icons',
            'All files/Design/Icons/SVG',
            'All files/Design/Icons/SVG/24px',
          ]),
        }}
        onCopyFiles={(items, destinationFolder) => {
          // eslint-disable-next-line no-console
          console.log('Copy files:', items, 'to', destinationFolder);
          alert(
            `Copied ${items.length} file(s) to ${destinationFolder}:\n${items
              .map(
                (f) =>
                  `${f.sourceUrl} -> ${f.destinationUrl} (overwrite: ${f.overwrite})`,
              )
              .join('\n')}`,
          );
        }}
        onMoveToFiles={(items, sourceFolder, destinationFolder) => {
          alert(
            `Moved ${items.length} file(s) from ${sourceFolder} to ${destinationFolder}:\n${items
              .map(
                (f) =>
                  `${f.sourceUrl} -> ${f.destinationUrl} (overwrite: ${f.overwrite})`,
              )
              .join('\n')}`,
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
      />
    </div>
  );
};

export const WithConflictResolution: Story = {
  render: WithConflictResolutionComponent,
  parameters: {
    docs: {
      description: {
        story:
          'Test conflict resolution by:\n' +
          '1. Navigate to /All files/Design/Icons/SVG/24px\n' +
          '2. Select "alert.svg" file\n' +
          '3. Click "Copy to" action\n' +
          '4. Select /All files/Design as destination\n' +
          '5. Click "Copy" - conflict popup should appear\n' +
          '6. Choose "Replace" (overwrite: true) or "Duplicate" (overwrite: false)',
      },
    },
  },
};

const WithMultipleConflictsComponent = (args: DialFileManagerProps) => {
  const [destinationPath, setDestinationPath] = useState<string | undefined>();

  const itemsWithMultipleDuplicates = useMemo(() => {
    const clonedItems = JSON.parse(JSON.stringify(itemsMock)) as DialFile[];
    const designFolder = clonedItems[0]?.items?.find(
      (item) => item.name === 'Design',
    );
    if (designFolder?.items) {
      designFolder.items.push(
        {
          id: 'duplicate-test-1',
          name: 'alert.svg',
          path: 'All files/Design/alert.svg',
          parentPath: 'All files/Design',
          nodeType: DialFileNodeType.ITEM,
          resourceType: DialFileResourceType.FILE,
          extension: 'svg',
          contentType: 'image/svg+xml',
          folderId: 'design',
          updatedAt: '2025-01-20',
          contentLength: 5120,
        },
        {
          id: 'duplicate-test-2',
          name: 'settings.svg',
          path: 'All files/Design/settings.svg',
          parentPath: 'All files/Design',
          nodeType: DialFileNodeType.ITEM,
          resourceType: DialFileResourceType.FILE,
          extension: 'svg',
          contentType: 'image/svg+xml',
          folderId: 'design',
          updatedAt: '2025-01-20',
          contentLength: 6144,
        },
        {
          id: 'duplicate-test-3',
          name: 'logo.svg',
          path: 'All files/Design/logo.svg',
          parentPath: 'All files/Design',
          nodeType: DialFileNodeType.ITEM,
          resourceType: DialFileResourceType.FILE,
          extension: 'svg',
          contentType: 'image/svg+xml',
          folderId: 'design',
          updatedAt: '2025-01-20',
          contentLength: 5120,
        },
      );
    }
    return clonedItems;
  }, []);

  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        items={itemsWithMultipleDuplicates}
        path="All files/Design/Icons/SVG/24px"
        destinationFolderPopupOptions={{
          destinationFolderPath: destinationPath,
          setDestinationFolderPath: setDestinationPath,
        }}
        conflictResolutionPopupOptions={{
          actionLabels: {
            [DialFileManagerConflictActions.Replace]: 'Replace',
            [DialFileManagerConflictActions.Duplicate]: 'Duplicate',
            [DialFileManagerConflictActions.Cancel]: 'Cancel',
          },
          strategyLabels: {
            [DialFileManagerConflictStrategies.ReplaceAll]: 'Replace All',
            [DialFileManagerConflictStrategies.DuplicateAll]: 'Duplicate All',
            [DialFileManagerConflictStrategies.DecideForEach]:
              'Decide For Each',
          },
        }}
        gridOptions={{
          actionLabels: {
            copy: 'Copy to',
          },
        }}
        bulkActionsToolbarOptions={{
          getSelectionLabel: (selectedCount: number) =>
            `${selectedCount} item(s) selected`,
          actionLabels: {
            copy: 'Copy to',
            move: 'Move to',
          },
        }}
        treeOptions={{
          expandedPaths: new Set<string>([
            'All files',
            'All files/Design',
            'All files/Design/Icons',
            'All files/Design/Icons/SVG',
            'All files/Design/Icons/SVG/24px',
          ]),
        }}
        onCopyFiles={(items, destinationFolder) => {
          alert(
            `Copied ${items.length} file(s) to ${destinationFolder}:\n${items
              .map(
                (f) =>
                  `${f.sourceUrl} -> ${f.destinationUrl} (overwrite: ${f.overwrite})`,
              )
              .join('\n')}`,
          );
        }}
        onMoveToFiles={(items, sourceFolder, destinationFolder) => {
          alert(
            `Moved ${items.length} file(s) from ${sourceFolder} to ${destinationFolder}:\n${items
              .map(
                (f) =>
                  `${f.sourceUrl} -> ${f.destinationUrl} (overwrite: ${f.overwrite})`,
              )
              .join('\n')}`,
          );
        }}
      />
    </div>
  );
};

export const WithMultipleConflicts: Story = {
  render: WithMultipleConflictsComponent,
  parameters: {
    docs: {
      description: {
        story:
          'Test multiple file conflicts by:\n' +
          '1. Select multiple files (alert.svg, settings.svg, logo.svg)\n' +
          '2. Click "Copy to" action\n' +
          '3. Select /All files/Design as destination\n' +
          '4. Click "Copy" - conflict popup should show multiple files',
      },
    },
  },
};

export const WithCustomVisibleColumns: Story = {
  args: {
    gridOptions: {
      visibleColumns: [
        FileManagerColumnKey.Name,
        FileManagerColumnKey.UpdatedAt,
        FileManagerColumnKey.Author,
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'File Manager with custom visible columns (without Size column)',
      },
    },
  },
};

export const OnlyNameColumn: Story = {
  args: {
    gridOptions: {
      visibleColumns: [FileManagerColumnKey.Name],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'File Manager showing only Name column',
      },
    },
  },
};

const WithFileMetadataComponent = (args: DialFileManagerProps) => {
  const [fileMetadata, setFileMetadata] = useState<DialFile | undefined>();
  const [metadataLoading, setMetadataLoading] = useState(false);

  const handleGetInfo = useCallback(async (file: DialFile) => {
    setMetadataLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFileMetadata(file);
    setMetadataLoading(false);
  }, []);

  const handleCloseMetadata = useCallback(() => {
    setFileMetadata(undefined);
    setMetadataLoading(false);
  }, []);

  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        gridOptions={{
          ...(args.gridOptions ?? {}),
          actionLabels: {
            info: 'Info',
            duplicate: 'Duplicate',
            copy: 'Copy to',
            move: 'Move to',
            download: 'Download',
            delete: 'Delete',
            rename: 'Rename',
          },
        }}
        treeOptions={{
          ...(args.treeOptions ?? {}),
          expandedPaths: new Set<string>([
            'All files',
            'All files/Design',
            'All files/Design/Icons',
          ]),
        }}
        fileMetadataPopupOptions={{
          fileMetadata,
          loading: metadataLoading,
          clearMetadata: handleCloseMetadata,
        }}
        onGetInfo={handleGetInfo}
      />
    </div>
  );
};

export const WithFileMetadata: Story = {
  render: WithFileMetadataComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with file metadata popup. Right-click on any file and select "Info" to view metadata. Shows loading skeleton for 1.5 seconds.',
      },
    },
  },
};

const WithFileMetadataInPopupComponent = (args: DialFileManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileMetadata, setFileMetadata] = useState<DialFile | undefined>();
  const [metadataLoading, setMetadataLoading] = useState(false);
  const { activeTab, handleTabChange, tabs } = useDialFileManagerTabs({
    my_files: 'My Files',
    shared: 'Shared with Me',
    organization: 'Organization',
  });

  const handleGetInfo = useCallback(async (file: DialFile) => {
    setMetadataLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFileMetadata(file);
    setMetadataLoading(false);
  }, []);

  const handleCloseMetadata = useCallback(() => {
    setFileMetadata(undefined);
    setMetadataLoading(false);
  }, []);

  const rootFolder: DialRootFolder = useMemo(() => {
    const folder = { ...rootItem };
    switch (activeTab) {
      case 'my_files':
        folder.label = 'My Files';
        break;
      case 'shared':
        folder.label = 'Shared with Me';
        break;
      case 'organization':
        folder.label = 'Organization';
        break;
      default:
        folder.label = 'Files';
        break;
    }
    return folder;
  }, [activeTab]);

  return (
    <div className="h-[640px] w-full flex items-center justify-center">
      <DialPrimaryButton
        label="Toggle File Manager"
        onClick={() => setIsOpen(!isOpen)}
      />
      <DialPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-[1000px] !h-[600px]"
        size={PopupSize.Lg}
      >
        <DialFileManager
          {...args}
          items={itemsMock}
          rootItem={rootFolder}
          gridOptions={{
            ...(args.gridOptions ?? {}),
            filterable: false,
            actionLabels: {
              info: 'Info',
              duplicate: 'Duplicate',
              copy: 'Copy to',
              move: 'Move to',
              download: 'Download',
              delete: 'Delete',
              rename: 'Rename',
            },
          }}
          toolbarOptions={{
            ...(args.toolbarOptions ?? {}),
            tabs: tabs,
            activeTab: activeTab,
            onTabChange: handleTabChange,
          }}
          treeOptions={{
            ...(args.treeOptions ?? {}),
            collapsed: false,
            expandedPaths: new Set<string>([rootFolder.path]),
          }}
          fileMetadataPopupOptions={{
            fileMetadata,
            loading: metadataLoading,
            clearMetadata: handleCloseMetadata,
          }}
          onGetInfo={handleGetInfo}
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
        />
      </DialPopup>
    </div>
  );
};

export const InPopupWithMetadata: Story = {
  render: WithFileMetadataInPopupComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager in a popup with file metadata support. Right-click on any file and select "Info" to view its metadata.',
      },
    },
  },
};

export const WithUnshareAction: Story = {
  render: (args) => (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        gridOptions={{
          actionLabels: {
            unshare: 'Unshare',
            duplicate: 'Duplicate',
            copy: 'Copy to',
            move: 'Move to',
            download: 'Download',
            delete: 'Delete',
            rename: 'Rename',
            info: 'Info',
          },
        }}
        treeOptions={{
          actionLabels: {
            unshare: 'Unshare',
            duplicate: 'Duplicate',
            copy: 'Copy to',
            move: 'Move to',
            rename: 'Rename',
            download: 'Download',
            delete: 'Delete',
          },
        }}
        bulkActionsToolbarOptions={{
          getSelectionLabel: (selectedCount: number) =>
            `${selectedCount} item(s) selected`,
          actionLabels: {
            duplicate: 'Duplicate',
            copy: 'Copy to',
            move: 'Move to',
            download: 'Download',
            delete: 'Delete',
            unshare: 'Unshare',
          },
        }}
        onUnshareFiles={(files) => {
          alert(`Unsharing file: ${files.map((f) => f.name).join(',')}`);
        }}
        sharedWithMeIds={['All files/Design']}
      />
    </div>
  ),
};

export const WithOwnerColumn: Story = {
  args: {
    gridOptions: {
      visibleColumns: [
        FileManagerColumnKey.Name,
        FileManagerColumnKey.UpdatedAt,
        FileManagerColumnKey.Size,
        FileManagerColumnKey.Owner,
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'File Manager with Owner column instead of Author.',
      },
    },
  },
};

const WithLocalSearchComponent = (args: DialFileManagerProps) => {
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

export const WithLocalSearch: Story = {
  render: WithLocalSearchComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with local search functionality. Search works across all files and folders in the tree without external API calls. Try searching for "svg", "design", or "alert".',
      },
    },
  },
};

const WithServerSearchComponent = (args: DialFileManagerProps) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DialFile[]>([]);
  const [searchInProgress, setSearchInProgress] = useState(false);

  const handleSearch = useCallback((_folder: string, _searchQuery: string) => {
    setSearchInProgress(true);

    // Simulate API call that returns ALL files
    setTimeout(() => {
      const allFiles: DialFile[] = [];
      const traverse = (items: DialFile[]) => {
        items.forEach((item) => {
          allFiles.push(item);
          if (item.items) {
            traverse(item.items);
          }
        });
      };
      traverse(itemsMock);

      setSearchResults(allFiles);
      setSearchInProgress(false);
    }, 800);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchInProgress(false);
  }, []);

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
        onSearchFiles={handleSearch}
        searchResults={searchResults}
        searchInProgress={searchInProgress}
        clearSearchResults={clearSearch}
      />
    </div>
  );
};

export const WithServerSearch: Story = {
  render: WithServerSearchComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with server-side search. The API is called once to fetch all files from the current folder. Further filtering by typed characters happens locally in the browser. Shows loading state during initial fetch. Try searching for "svg" or "alert".',
      },
    },
  },
};

const WithSearchInPopupComponent = (args: DialFileManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="h-[640px] w-full flex items-center justify-center">
      <DialPrimaryButton
        label="Toggle File Manager with Search"
        onClick={() => setIsOpen(!isOpen)}
      />
      <DialPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-[1000px] !h-[600px]"
        size={PopupSize.Lg}
      >
        <DialFileManager
          {...args}
          items={itemsMock}
          navigationPanelOptions={{
            searchable: true,
            value: query,
            onSearchChange: (v) => setQuery(String(v ?? '')),
          }}
          gridOptions={{
            ...(args.gridOptions ?? {}),
            filterable: false,
          }}
          treeOptions={{
            ...(args.treeOptions ?? {}),
            collapsed: false,
            expandedPaths: new Set<string>(['All files']),
          }}
        />
      </DialPopup>
    </div>
  );
};

export const WithSearchInPopup: Story = {
  render: WithSearchInPopupComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with search functionality inside a popup. Local search is enabled by default.',
      },
    },
  },
};

const EmptyStatePerTabComponent = (args: DialFileManagerProps) => {
  const { activeTab, handleTabChange, tabs } = useDialFileManagerTabs({
    my_files: 'My Files',
    shared: 'Shared with Me',
    organization: 'Organization',
  });

  const emptyState = useMemo(() => {
    switch (activeTab) {
      case DialFileManagerTabs.MyFiles:
        return {
          icon: (
            <IconFileDescription
              size={100}
              stroke={0.5}
              className="text-secondary"
            />
          ),
          title: "You don't have any files",
          description: 'Upload or drag and drop files',
        };

      case DialFileManagerTabs.Shared:
        return {
          icon: (
            <IconUsers size={100} stroke={0.5} className="text-secondary" />
          ),
          title: 'Nothing has been shared with you',
          description: 'Ask teammates to share files or upload your own',
        };

      case DialFileManagerTabs.Organization:
        return {
          icon: (
            <IconBuildingCommunity
              size={100}
              stroke={0.5}
              className="text-secondary"
            />
          ),
          title: 'No organization files found',
          description: 'Files shared within your organization will appear here',
        };

      default:
        return undefined;
    }
  }, [activeTab]);

  return (
    <div className="h-[640px] w-full flex items-center justify-center">
      <DialFileManager
        {...args}
        items={[]}
        emptyStateIcon={emptyState?.icon}
        emptyStateTitle={emptyState?.title}
        emptyStateDescription={emptyState?.description}
        toolbarOptions={{
          ...args.toolbarOptions,
          tabs: tabs,
          activeTab: activeTab,
          onTabChange: handleTabChange,
        }}
      />
    </div>
  );
};

export const EmptyStatePerTab: Story = {
  render: EmptyStatePerTabComponent,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how the File Manager displays different empty states depending on the active tab. The example configures unique icons, titles, and descriptions for the "My Files", "Shared with Me", and "Organization" tabs, and shows how to control the active tab via toolbar options.',
      },
    },
  },
};

export const WithoutNavigationPanel: Story = {
  args: { showNavigationPanel: false },
};

export const WithInsertSiblingChildrenActions: Story = {
  render: (args) => (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        gridOptions={{
          actionLabels: {
            addSibling: 'Add Sibling',
            addChild: 'Add Child',
            duplicate: 'Duplicate',
            copy: 'Copy to',
            move: 'Move to',
            download: 'Download',
            delete: 'Delete',
            rename: 'Rename',
          },
        }}
        treeOptions={{
          actionLabels: {
            addSibling: 'Add Sibling',
            addChild: 'Add Child',
            duplicate: 'Duplicate',
            copy: 'Copy to',
            move: 'Move to',
            download: 'Download',
            delete: 'Delete',
            rename: 'Rename',
          },
        }}
        onAddChild={(files) => {
          alert(`Adding child to: ${files.map((f) => f.name).join(',')}`);
        }}
        onAddSibling={(files) => {
          alert(`Adding sibling to: ${files.map((f) => f.name).join(',')}`);
        }}
      />
    </div>
  ),
};

const WithCustomColumnsComponent = (args: DialFileManagerProps) => {
  const customColumns = useMemo<ColDef<FileManagerGridRow>[]>(() => {
    return [
      {
        colId: 'nodeType',
        field: 'nodeType',
        headerName: 'Type',
        width: 120,
        suppressSizeToFit: true,
        cellRenderer: (params: { data: FileManagerGridRow }) => {
          return params.data.nodeType === DialFileNodeType.FOLDER
            ? 'Folder'
            : 'File';
        },
      },
      {
        colId: FileManagerColumnKey.UpdatedAt,
        field: 'updatedAt',
        headerName: 'Modified Date',
        width: 168,
        suppressSizeToFit: true,
        cellRenderer: DialDateCellRenderer,
        cellRendererParams: {
          locale: 'en-US',
          options: {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          },
        },
      },
      {
        colId: FileManagerColumnKey.Size,
        field: 'size',
        headerName: 'Size',
        width: 120,
        suppressSizeToFit: false,
      },
    ];
  }, []);

  return (
    <div className="h-[640px]">
      <DialFileManager
        {...args}
        gridOptions={{
          ...args.gridOptions,
          columnDefs: customColumns,
          filterable: false,
        }}
      />
    </div>
  );
};

export const WithCustomColumns: Story = {
  render: WithCustomColumnsComponent,
  parameters: {
    docs: {
      description: {
        story:
          'File Manager with custom columns including a Type column that shows whether the item is a File or Folder.',
      },
    },
  },
};
