import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialFileManagerBulkActionsToolbar,
  type DialActionDropdownItem,
} from './FileManagerBulkActionsToolbar';
import {
  IconArrowMoveRight,
  IconCopy,
  IconCut,
  IconDownload,
  IconEyeShare,
  IconInfoCircle,
  IconShare,
  IconTrashX,
  IconZip,
} from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';

const meta: Meta<typeof DialFileManagerBulkActionsToolbar> = {
  title: 'FileManager/components/FileManagerBulkActionsToolbar',
  component: DialFileManagerBulkActionsToolbar,
  tags: ['layout', 'toolbar', 'file-manager'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive toolbar component displayed when files or items are selected in the file manager. It shows a label with the number or name of selected items and provides contextual action buttons.',
      },
    },
  },
  argTypes: {
    getSelectionLabel: {
      control: false,
      description:
        'Function to get the label showing current selection status (e.g., "3 files selected").',
    },
    selectedCount: {
      control: 'number',
      description: 'Count of currently selected items.',
    },
    onClearSelection: {
      action: 'onClearSelections',
      description: 'Callback fired when the clear selection button is clicked.',
    },
    actions: {
      control: false,
      description:
        'List of action buttons with icons and callbacks, displayed on the right side of the toolbar.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockActions: DialActionDropdownItem[] = [
  {
    key: 'cut',
    title: 'Cut',
    label: 'Cut',
    icon: <IconCut {...BASE_ICON_PROPS} />,
    onClick: () => alert('Cut clicked'),
  },
  {
    key: 'copy',
    title: 'Copy',
    label: 'Copy',
    icon: <IconCopy {...BASE_ICON_PROPS} />,
    onClick: () => alert('Copy clicked'),
  },
  {
    key: 'delete',
    title: 'Delete',
    label: 'Delete',
    disabled: true,
    icon: <IconTrashX {...BASE_ICON_PROPS} />,
    onClick: () => alert('Delete clicked'),
  },
  {
    key: 'download',
    title: 'Download',
    label: 'Download',
    icon: <IconDownload {...BASE_ICON_PROPS} />,
    onClick: () => alert('Download clicked'),
  },
];

const extraMockActions = [
  {
    key: 'share',
    title: 'Share',
    label: 'Share',
    icon: <IconShare {...BASE_ICON_PROPS} />,
    onClick: () => alert('Share clicked'),
  },
  {
    key: 'move',
    title: 'Move',
    label: 'Move',
    icon: <IconArrowMoveRight {...BASE_ICON_PROPS} />,
    onClick: () => alert('Move clicked'),
  },
  {
    key: 'info',
    title: 'Info',
    label: 'Info',
    icon: <IconInfoCircle {...BASE_ICON_PROPS} />,
    onClick: () => alert('Info clicked'),
  },
  {
    key: 'archive',
    title: 'Archive',
    label: 'Archive',
    icon: <IconZip {...BASE_ICON_PROPS} />,
    onClick: () => alert('Archive clicked'),
  },
  {
    key: 'publish',
    title: 'Publish',
    label: 'Publish',
    icon: <IconEyeShare {...BASE_ICON_PROPS} />,
    onClick: () => alert('Publish clicked'),
  },
];

export const Default: Story = {
  args: {
    getSelectionLabel: (selectedCount: number) =>
      `${selectedCount} items selected`,
    onClearSelection: () => alert('Selections cleared'),
    actions: mockActions,
    selectedCount: 3,
  },
  render: (args) => <DialFileManagerBulkActionsToolbar {...args} />,
};

export const ManyActions: Story = {
  args: {
    getSelectionLabel: (selectedCount: number) =>
      `${selectedCount} items selected`,
    onClearSelection: () => alert('Selections cleared'),
    actions: [...mockActions, ...extraMockActions],
    selectedCount: 5,
  },
  render: (args) => <DialFileManagerBulkActionsToolbar {...args} />,
};
