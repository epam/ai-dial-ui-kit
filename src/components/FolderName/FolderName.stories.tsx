import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFolderName, type DialFolderNameProps } from './FolderName';

const meta = {
  title: 'FileManager/components/FolderName',
  component: DialFolderName,
  parameters: { layout: 'centered' },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Folder name',
    },
    cssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the root container',
    },
    shared: {
      control: { type: 'boolean' },
      description: 'Whether the folder is shared',
    },
  },
  args: {
    name: 'Organization',
    shared: false,
  },
} satisfies Meta<DialFolderNameProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Organization' },
};

export const Shared: Story = {
  args: { name: 'Mindmap details', shared: true },
};

export const LongName: Story = {
  args: {
    name: 'Project Documentation and Reference Materials For 2025 Q4 Internal Review and Approval Process',
  },
  render: (args) => (
    <div className="w-64">
      <DialFolderName {...args} />
    </div>
  ),
};

export const WithCustomClass: Story = {
  args: {
    name: 'Reference Materials',
    cssClass: 'bg-layer-2 border-2 border-accent-primary p-2 rounded-xl',
  },
};
