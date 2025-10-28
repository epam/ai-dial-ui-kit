import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialFileManagerSelectionToolbar,
  type DialActionDropdownItem,
} from './FileManagerSelectionToolbar';
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

const meta: Meta<typeof DialFileManagerSelectionToolbar> = {
  title: 'FileManager/components/FileManagerSelectionToolbar',
  component: DialFileManagerSelectionToolbar,
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
    selectedLabel: {
      control: 'text',
      description: 'Label showing how many items are selected.',
    },
    onClearSelections: {
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
    selectedLabel: '3 items selected',
    onClearSelections: () => alert('Selections cleared'),
    actions: mockActions,
  },
  render: (args) => <DialFileManagerSelectionToolbar {...args} />,
};

export const ManyActions: Story = {
  args: {
    selectedLabel: '1 item selected',
    onClearSelections: () => alert('Selections cleared'),
    actions: [...mockActions, ...extraMockActions],
  },
  render: (args) => <DialFileManagerSelectionToolbar {...args} />,
};
