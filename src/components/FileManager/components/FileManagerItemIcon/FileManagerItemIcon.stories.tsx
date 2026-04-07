import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DialFileManagerItemIcon,
  type DialFileManagerItemIconProps,
} from './FileManagerItemIcon';
import { DialItemType } from '@/types/item';

const meta = {
  title: 'FileManager/components/FileManagerItemIcon',
  component: DialFileManagerItemIcon,
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: Object.values(DialItemType),
    },
    name: { control: { type: 'text' } },
    shared: { control: { type: 'boolean' } },
    loading: { control: { type: 'boolean' } },
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
    stroke: { control: { type: 'number', min: 1, max: 2, step: 0.25 } },
    className: { control: { type: 'text' } },
    decorative: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
  },
  args: {
    type: DialItemType.File,
    name: 'example.txt',
    shared: false,
    loading: false,
    size: 20,
    stroke: 1.5,
    decorative: false,
  },
} satisfies Meta<DialFileManagerItemIconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const File: Story = {
  args: {
    type: DialItemType.File,
    name: 'document.pdf',
  },
};

export const Folder: Story = {
  args: {
    type: DialItemType.Folder,
    name: 'My Folder',
  },
};

export const SharedFile: Story = {
  args: {
    type: DialItemType.File,
    name: 'shared_image.png',
    shared: true,
  },
};

export const SharedFolder: Story = {
  args: {
    type: DialItemType.Folder,
    name: 'Shared Folder',
    shared: true,
  },
};

export const Loading: Story = {
  args: {
    type: DialItemType.File,
    name: 'loading-file.docx',
    loading: true,
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div className="flex flex-col items-center gap-1">
        <DialFileManagerItemIcon
          {...args}
          name="photo.jpg"
          type={DialItemType.File}
        />
        <span className="dial-tiny-text text-secondary">File</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <DialFileManagerItemIcon
          {...args}
          name="Shared Folder"
          type={DialItemType.Folder}
          shared
        />
        <span className="dial-tiny-text text-secondary">Shared Folder</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <DialFileManagerItemIcon
          {...args}
          name="Report.pdf"
          type={DialItemType.File}
          shared
        />
        <span className="dial-tiny-text text-secondary">Shared File</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <DialFileManagerItemIcon
          {...args}
          name="Loading.docx"
          type={DialItemType.File}
          loading
        />
        <span className="dial-tiny-text text-secondary">Loading</span>
      </div>
    </div>
  ),
  args: { size: 24 },
};
