import { useState } from 'react';
import { DialItemType } from '@/types/item';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFileManagerItemName } from './FileManagerItemName';
import { DialNeutralButton } from '@/components/Button/Buttons';

const meta: Meta<typeof DialFileManagerItemName> = {
  title: 'FileManager/components/FileManagerItemName',
  component: DialFileManagerItemName,
  argTypes: {
    type: {
      control: 'radio',
      options: [DialItemType.File, DialItemType.Folder],
    },
    editing: { control: 'boolean' },
    loading: { control: 'boolean' },
    shared: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof DialFileManagerItemName>;

const EditableWrapper = (props: Story['args']) => {
  const [name, setName] = useState(props?.name ?? '');
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-col items-start gap-6">
      <DialFileManagerItemName
        {...props}
        elementId={props?.elementId ?? 'editable-item'}
        type={props?.type ?? DialItemType.File}
        name={name}
        editing={editing}
        validate={(v) => (v.trim() ? null : 'Name cannot be empty')}
        onSave={(newValue) => {
          setName(newValue);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />

      <DialNeutralButton
        className="Edit name"
        onClick={() => setEditing(true)}
      />
    </div>
  );
};

export const FileView: Story = {
  render: (args) => <EditableWrapper {...args} />,
  args: {
    name: 'main.ts',
    type: DialItemType.File,
    elementId: 'file-1',
    editing: false,
    shared: false,
  },
};

export const FolderView: Story = {
  render: (args) => <EditableWrapper {...args} />,
  args: {
    name: 'src',
    type: DialItemType.Folder,
    elementId: 'folder-1',
    editing: false,
    shared: true,
  },
};

export const EditableFile: Story = {
  render: (args) => <EditableWrapper {...args} />,
  args: {
    name: 'index.ts',
    type: DialItemType.File,
    elementId: 'file-edit-1',
  },
};

export const EditableFolder: Story = {
  render: (args) => <EditableWrapper {...args} />,
  args: {
    name: 'components',
    type: DialItemType.Folder,
    elementId: 'folder-edit-1',
  },
};
