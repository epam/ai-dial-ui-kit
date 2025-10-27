import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialFileNodeType, type DialFile } from '@/models/file';
import { DialFoldersTree } from './FoldersTree';
import type { DropdownItem } from '@/models/dropdown';
import {
  IconClipboardCopy,
  IconCopy,
  IconCut,
  IconDownload,
  IconPencil,
  IconTrashX,
} from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';

const meta: Meta<typeof DialFoldersTree> = {
  title: 'Data Display/FoldersTree',
  component: DialFoldersTree,
  tags: ['display', 'tree', 'folders'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A hierarchical tree view for folders and files with selection, loading, and context menu support.',
      },
    },
  },
  argTypes: {
    onItemClick: {
      action: 'onItemClick',
      description: 'Callback fired when an item is clicked.',
    },
    showFiles: {
      control: 'boolean',
      description: 'Whether to display files in addition to folders.',
      defaultValue: false,
    },
    getContextMenuItems: {
      description:
        'Function that provides context menu items for a given folder or file.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const mockFolders: DialFile[] = [
  {
    name: 'Root Folder',
    path: '/root',
    nodeType: DialFileNodeType.FOLDER,
    folderId: '1',
    items: [
      {
        name: 'Documents',
        path: '/root/Documents',
        nodeType: DialFileNodeType.FOLDER,
        folderId: '2',
        items: [
          {
            name: 'Reports',
            path: '/root/Documents/Reports',
            nodeType: DialFileNodeType.FOLDER,
            folderId: '3',
          },
        ],
      },
      {
        name: 'Images',
        path: '/root/Images',
        nodeType: DialFileNodeType.FOLDER,
        folderId: '4',
        items: [
          {
            name: 'icon.svg',
            path: '/root/Images/icon.svg',
            nodeType: DialFileNodeType.ITEM,
            folderId: '7',
          },
        ],
      },
      {
        name: 'Videos',
        path: '/root/Videos',
        nodeType: DialFileNodeType.FOLDER,
        folderId: '5',
        items: [
          {
            name: '2024',
            path: '/root/Videos/2024',
            nodeType: DialFileNodeType.FOLDER,
            folderId: '6',
          },
        ],
      },
    ],
  },
];

const getMenu = (node: DialFile): DropdownItem[] => [
  {
    key: 'copy',
    label: 'Copy',
    icon: <IconCopy {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log('Copy', node.name);
    },
  },
  {
    key: 'cut',
    label: 'Cut',
    icon: <IconCut {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log('Cut', node.name);
    },
  },
  {
    key: 'paste',
    label: 'Paste',
    icon: <IconClipboardCopy {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log('Paste', node.name);
    },
  },
  {
    key: 'download',
    label: 'Download',
    icon: <IconDownload {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log('Download', node.name);
    },
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log('Delete', node.name);
    },
  },
  {
    key: 'rename',
    label: 'Rename',
    icon: <IconPencil {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log('Rename', node.name);
    },
  },
];

export const Default: Story = {
  args: {
    items: mockFolders,
    expandedPaths: new Set(),
    showFiles: false,
    getContextMenuItems: getMenu,
  },
  render: (args) => {
    const Wrapper = () => {
      const [expanded, setExpanded] = useState(new Set<string>());
      const [loading, setLoading] = useState(new Set<string>());
      const [loaded, setLoaded] = useState(new Set<string>());
      const [selected, setSelected] = useState<string | undefined>();

      const handleItemClick = (item: DialFile) => {
        const newExpanded = new Set(expanded);
        setSelected(item.path);
        setSelected(selected);

        if (newExpanded.has(item.path)) {
          newExpanded.delete(item.path);
        } else {
          newExpanded.add(item.path);

          if (!loaded.has(item.path)) {
            const newLoading = new Set(loading).add(item.path);
            setLoading(newLoading);

            setTimeout(() => {
              const doneLoading = new Set(newLoading);
              doneLoading.delete(item.path);
              setLoading(doneLoading);
              setLoaded(new Set(loaded).add(item.path));
              setExpanded(newExpanded);
            }, 750);
            return;
          }
        }

        setExpanded(newExpanded);
      };

      return (
        <div className="w-[400px] h-[400px] border rounded p-4 bg-background">
          <DialFoldersTree
            {...args}
            expandedPaths={expanded}
            loadingPaths={loading}
            selectedPath={selected}
            onItemClick={handleItemClick}
          />
        </div>
      );
    };

    return <Wrapper />;
  },
};

export const WithExpandedFolders: Story = {
  args: {
    items: mockFolders,
    expandedPaths: new Set(['/root', '/root/Documents', '/root/Videos']),
    showFiles: false,
    getContextMenuItems: getMenu,
  },
};

export const WithFilesVisible: Story = {
  args: {
    items: mockFolders,
    expandedPaths: new Set(['/root', '/root/Images']),
    showFiles: true,
    getContextMenuItems: getMenu,
  },
};

export const WithLoaders: Story = {
  args: {
    items: mockFolders,
    expandedPaths: new Set(['/root', '/root/Images']),
    loadingPaths: new Set(['/root/Documents']),
    getContextMenuItems: getMenu,
  },
};

export const EmptyState: Story = {
  args: {
    items: [],
    expandedPaths: new Set(),
    showFiles: false,
    emptyStateTitle: 'No folders available',
  },
};
