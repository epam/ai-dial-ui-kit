import type { Meta, StoryObj } from '@storybook/react-vite';

import { DialItemType } from '@/types/item';
import { FileIcon, type FileIconProps } from './FileIcon';

const meta = {
  title: 'Components_2_0/FileIcon',
  component: FileIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The icon of a file or folder row: a file-type glyph picked by extension, or a folder, with an optional shared badge and loading state.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: Object.values(DialItemType),
      description: 'Whether the item is a file or a folder',
    },
    name: {
      control: { type: 'text' },
      description: "Item name; a file's extension is read from it",
    },
    fileExtension: {
      control: { type: 'text' },
      description: 'Extension overriding the one in `name`',
    },
    shared: { control: { type: 'boolean' }, description: 'Shared badge' },
    loading: { control: { type: 'boolean' }, description: 'Loading state' },
    size: {
      control: { type: 'number', min: 12, max: 48, step: 2 },
      description: 'Glyph size in px',
    },
    decorative: {
      control: { type: 'boolean' },
      description: 'Hide from assistive technology',
    },
    label: { control: { type: 'text' }, description: 'Accessible name' },
    sharedIndicatorTooltip: {
      control: { type: 'text' },
      description: 'Tooltip over the shared badge',
    },
  },
  args: {
    type: DialItemType.File,
    name: 'document.pdf',
    shared: false,
    loading: false,
    decorative: false,
  },
} satisfies Meta<FileIconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const File: Story = {};

export const Folder: Story = {
  args: { type: DialItemType.Folder, name: 'Projects' },
};

export const Shared: Story = {
  args: { name: 'report.docx', shared: true },
};

export const SharedFolder: Story = {
  args: { type: DialItemType.Folder, name: 'Team', shared: true },
};

export const Loading: Story = {
  args: { name: 'upload.zip', loading: true },
};

const variants: Array<Pick<FileIconProps, 'name' | 'type'>> = [
  { name: 'Folder', type: DialItemType.Folder },
  { name: 'unknown', type: DialItemType.File },
  ...['png', 'mp4', 'mp3', 'ts', 'txt', 'pdf', 'xlsx', 'pptx', 'zip'].map(
    (ext) => ({ name: `file.${ext}`, type: DialItemType.File }),
  ),
];

export const AllTypes: Story = {
  render: (args) => (
    <div className="grid grid-cols-5 gap-4">
      {variants.map((variant) => (
        <div key={variant.name} className="flex flex-col items-center gap-1">
          <FileIcon {...args} {...variant} />
          <span className="dial-tiny-text text-secondary">{variant.name}</span>
        </div>
      ))}
    </div>
  ),
};
