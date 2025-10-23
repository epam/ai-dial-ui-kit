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
          'A visual-only tree view component for displaying nested folders. It accepts folder data and interaction callbacks via props, without relying on any external context.',
      },
    },
  },
  argTypes: {
    onToggleFolder: {
      action: 'toggleFolder',
      description: 'Callback fired when a folder is toggled open or closed.',
    },
    showFiles: {
      control: 'boolean',
      description: 'Whether to show files in the tree view.',
      defaultValue: false,
    },
    getContextMenuItems: {
      description:
        'Function to get context menu items for a given file/folder node.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const mockFolders = [
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
      console.log(node.name);
    },
  },
  {
    key: 'cut',
    label: 'Cut',
    icon: <IconCut {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log(node.name);
    },
  },
  {
    key: 'paste',
    label: 'Paste',
    icon: <IconClipboardCopy {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log(node.name);
    },
  },
  {
    key: 'download',
    label: 'Download',
    icon: <IconDownload {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log(node.name);
    },
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <IconTrashX {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log(node.name);
    },
  },
  {
    key: 'rename',
    label: 'Rename',
    icon: <IconPencil {...BASE_ICON_PROPS} className="text-secondary" />,
    onClick: (info) => {
      info.domEvent.stopPropagation();
      // eslint-disable-next-line no-console
      console.log(node.name);
    },
  },
];

export const Default: Story = {
  args: {
    folders: mockFolders,
    expandedFolders: new Set(),
    showFiles: false,
    getContextMenuItems: getMenu,
  },
  render: (args) => {
    const Wrapper = () => {
      const [expanded, setExpanded] = useState(args.expandedFolders);

      return (
        <div className="w-[400px] h-[400px] border rounded p-4 bg-background">
          <DialFoldersTree
            {...args}
            expandedFolders={expanded}
            onToggleFolder={(folder) => {
              const newExpanded = new Set(expanded);
              if (newExpanded.has(folder.path)) newExpanded.delete(folder.path);
              else newExpanded.add(folder.path);
              setExpanded(newExpanded);
            }}
            getContextMenuItems={getMenu}
          />
        </div>
      );
    };

    return <Wrapper />;
  },
};

export const WithExpandedFolders: Story = {
  args: {
    folders: mockFolders,
    expandedFolders: new Set(['/root', '/root/Documents', '/root/Videos']),
    showFiles: false,
    getContextMenuItems: getMenu,
  },
};

export const WithFilesVisible: Story = {
  args: {
    folders: mockFolders,
    expandedFolders: new Set(['/root', '/root/Images']),
    showFiles: true,
    getContextMenuItems: getMenu,
  },
};

export const EmptyState: Story = {
  args: {
    folders: [],
    expandedFolders: new Set(),
    showFiles: false,
    renderEmptyState: (
      <div className="text-secondary text-center py-10 italic">
        No folders available
      </div>
    ),
  },
};
