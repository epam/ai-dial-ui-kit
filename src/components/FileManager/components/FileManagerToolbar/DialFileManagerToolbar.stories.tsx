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
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A toolbar component for a file manager. Contains navigation tabs, a switch for hidden files, refresh button, and an optional new button with dropdown.',
      },
    },
  },
  argTypes: {
    onTabChange: { action: 'onTabChange' },
    onToggleHiddenFiles: { action: 'onToggleHiddenFiles' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const mockTabs: TabModel[] = [
  { id: 'organization', label: 'Organization' },
  { id: 'shared', label: 'Shared with me' },
  { id: 'all', label: 'All files' },
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
        <div className="p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            isNewButtonVisible
            newButtonVariant={ButtonVariant.Primary}
            newButtonDropdownItems={mockCreateItems}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};

export const WithSecondaryNewButton: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('shared');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(true);

      return (
        <div className="p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            isNewButtonVisible
            newButtonVariant={ButtonVariant.Secondary}
            newButtonDropdownItems={mockCreateItems}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};

export const WithoutNewButton: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('organization');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(false);

      return (
        <div className="p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};

export const WithDisabledNewButton: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('organization');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(false);

      return (
        <div className="p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            isNewButtonVisible
            isNewButtonDisabled
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};

export const WithTextNewActions: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('organization');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(false);

      const mockCreateItems = [
        {
          key: 'new-folder',
          label: 'New folder',
          icon: null,
          onClick: () => alert('Create new folder'),
        },
        {
          key: 'upload-files',
          label: 'Upload files',
          icon: null,
          onClick: () => alert('Upload files'),
        },
      ];

      return (
        <div className="p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            isNewButtonVisible
            newButtonDropdownItems={mockCreateItems}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};

export const WithoutHiddenFilesToggle: Story = {
  render: () => {
    const StoryWrapper = () => {
      const [activeTab, setActiveTab] = useState('organization');
      const [areHiddenFilesVisible, setAreHiddenFilesVisible] = useState(false);

      return (
        <div className="p-4 border rounded-lg bg-background">
          <DialFileManagerToolbar
            tabs={mockTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            areHiddenFilesVisible={areHiddenFilesVisible}
            onToggleHiddenFiles={setAreHiddenFilesVisible}
            isNewButtonVisible
            newButtonVariant={ButtonVariant.Primary}
            newButtonDropdownItems={mockCreateItems}
            showHiddenFilesToggle={false}
          />
        </div>
      );
    };

    return <StoryWrapper />;
  },
};
