import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DialFileManagerToolbar } from './DialFileManagerToolbar';
import type { TabModel } from '@/models/tab';
import type { DropdownItem } from '@/models/dropdown';
import { ButtonVariant } from '@/types/button';
import { IconFile, IconFileZip, IconFolder } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';

const meta: Meta<typeof DialFileManagerToolbar> = {
  title: 'FileManager/components/FileManagerToolbar',
  component: DialFileManagerToolbar,
  tags: ['layout', 'toolbar', 'file-manager'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toolbar component for a file manager. Contains navigation tabs, a switch for hidden files, refresh button, and an optional create button with dropdown.',
      },
    },
  },
  argTypes: {
    onTabChange: { action: 'onTabChange' },
    onToggleHiddenFiles: { action: 'onToggleHiddenFiles' },
    onRefresh: { action: 'onRefresh' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const mockTabs: TabModel[] = [
  { id: 'organization', name: 'Organization' },
  { id: 'shared', name: 'Shared with me' },
  { id: 'all', name: 'All files' },
];

const mockCreateItems: DropdownItem[] = [
  {
    key: 'new-folder',
    label: 'New folder',
    icon: <IconFolder className="text-secondary" {...BASE_ICON_PROPS} />,
    onClick: () => alert('Create new folder'),
  },
  {
    key: 'upload-files',
    label: 'Upload files',
    icon: <IconFile className="text-secondary" {...BASE_ICON_PROPS} />,
    onClick: () => alert('Upload files'),
  },
  {
    key: 'upload-archive',
    label: 'Upload archive',
    icon: <IconFileZip className="text-secondary" {...BASE_ICON_PROPS} />,
    onClick: () => alert('Upload archive'),
  },
];

export const Default: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('organization');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(false);

      return (
        <div className="w-[800px] p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            onRefresh={() => alert('Refresh')}
            isCreateButtonVisible
            createButtonVariant={ButtonVariant.Primary}
            createButtonDropdownItems={mockCreateItems}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};

export const WithSecondaryCreateButton: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('shared');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(true);

      return (
        <div className="w-[800px] p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            onRefresh={() => alert('Refresh')}
            isCreateButtonVisible
            createButtonVariant={ButtonVariant.Secondary}
            createButtonDropdownItems={mockCreateItems}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};

export const WithoutCreateButton: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('organization');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(false);

      return (
        <div className="w-[800px] p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            onRefresh={() => alert('Refresh')}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};
