import { DialPrimaryButton } from '@/components/Button/Button';
import { itemsMock } from '@/components/FileManager/__mocks__/files';
import { DialFileNodeType } from '@/models/file';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  DestinationFolderPopup,
  type DestinationFolderPopupProps,
} from './DestinationFolderPopup';

const StoryWrapper = (args: DestinationFolderPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | undefined>(
    args.path || '/',
  );

  const [showHiddenFiles, setShowHiddenFiles] = useState(false);

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialPrimaryButton
          onClick={() => setIsOpen(true)}
          label="Open Destination Folder Popup"
        />
      )}

      <DestinationFolderPopup
        {...args}
        open={isOpen}
        path={currentPath}
        showHiddenFiles={showHiddenFiles}
        onShowHiddenFilesChange={(value) => {
          setShowHiddenFiles(value);
        }}
        onPathChange={(path) => {
          setCurrentPath(path);
          args.onPathChange?.(path);
        }}
        onClose={() => {
          setIsOpen(false);
          args.onClose?.();
        }}
        onConfirm={() => {
          setIsOpen(false);
          args.onConfirm?.();
        }}
      />
    </div>
  );
};

const meta: Meta<DestinationFolderPopupProps> = {
  title: 'FileManager/components/DestinationFolderPopup',
  component: DestinationFolderPopup,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['copy', 'move'],
    },
    copyLabel: { control: 'text' },
    moveLabel: { control: 'text' },
    hiddenFilesSwitcherLabel: { control: 'text' },
    disabledPathTooltip: { control: 'text' },
    sourceFolder: { control: 'text' },
    destinationFolderPath: { control: 'text' },
  },
  args: {
    mode: 'copy',
    copyLabel: 'Copy',
    moveLabel: 'Move',
    hiddenFilesSwitcherLabel: 'Show hidden files',
    disabledPathTooltip:
      'Unavailable for the original path. Please select another folder',
    items: itemsMock,
    rootItem: {
      id: 'root',
      name: 'Root',
      path: '/',
      folderId: 'root-folder',
      nodeType: DialFileNodeType.FOLDER,
      label: 'Root',
    },
    path: '/',
  },
  render: (args) => <StoryWrapper {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CopyMode: Story = {
  args: {
    mode: 'copy',
  },
};

export const MoveMode: Story = {
  args: {
    mode: 'move',
  },
};

export const CustomLabels: Story = {
  args: {
    mode: 'copy',
    copyLabel: 'Copy Here',
    moveLabel: 'Move Here',
    hiddenFilesSwitcherLabel: 'Display hidden items',
    header: '2 item(s) selected to copy',
  },
};

export const DisabledDestination: Story = {
  args: {
    mode: 'move',
    sourceFolder: '/Documents',
    path: '/Documents',
    header: 'Moving 1 item: Project Files',
  },
};

export const CustomDisabledTooltip: Story = {
  args: {
    mode: 'copy',
    sourceFolder: '/Photos/2024',
    path: '/Photos/2024',
    disabledPathTooltip:
      'Cannot copy to the same location. Choose a different folder.',
    header: 'Copying 3 items',
  },
};
