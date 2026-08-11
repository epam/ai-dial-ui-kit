import { useState } from 'react';
import { DialItemType } from '@/types/item';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFileManagerItemName } from './FileManagerItemName';
import { DialNeutralButton } from '@/components/Button/ButtonWrappers';

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

/**
 * Reproduces the create-folder scenario from
 * https://github.com/epam/ai-dial-chat/issues/7968: type a name containing a
 * forbidden character (e.g. "/"), leave the inline error visible, then blur
 * the field (click outside, or press Enter which blurs the input). The
 * creation must be cancelled instead of silently committing the "New
 * folder" placeholder — see `useEditableItem.saveOnBlur`.
 */
const CreatingFolderWrapper = (props: Story['args']) => {
  const [isCreating, setIsCreating] = useState(true);
  const [createdFolders, setCreatedFolders] = useState<string[]>([]);
  const [cancelCount, setCancelCount] = useState(0);

  return (
    <div className="flex flex-col items-start gap-6">
      {isCreating && (
        <DialFileManagerItemName
          {...props}
          elementId={props?.elementId ?? 'creating-folder'}
          type={DialItemType.Folder}
          name="New folder"
          creating
          validate={(v) =>
            /[/\\]/.test(v) ? 'Folder name cannot contain "/" or "\\"' : null
          }
          onCreateFolderSave={(newValue) => {
            setCreatedFolders((prev) => [...prev, newValue]);
            setIsCreating(false);
          }}
          onCreateFolderCancel={() => {
            setCancelCount((prev) => prev + 1);
            setIsCreating(false);
          }}
        />
      )}

      <DialNeutralButton
        className="Start creating a folder"
        onClick={() => setIsCreating(true)}
      />

      <p className="dial-small-text">
        Created folders: {createdFolders.join(', ') || 'none'}
        <br />
        Cancelled attempts: {cancelCount}
      </p>
    </div>
  );
};

export const CreatingFolderWithInvalidName: Story = {
  render: (args) => <CreatingFolderWrapper {...args} />,
  args: {
    elementId: 'creating-folder-invalid',
  },
};
