import type { Meta, StoryObj } from '@storybook/react-vite';

import { FolderName, type FolderNameProps } from './FolderName';

const meta = {
  title: 'Components_2_0/FolderName',
  component: FolderName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A folder name with the folder icon, truncated with a tooltip when it does not fit. A `FileName` fixed to the folder type.',
      },
    },
  },
  argTypes: {
    name: { control: { type: 'text' }, description: 'Folder name' },
    shared: { control: { type: 'boolean' }, description: 'Shared badge' },
    loading: { control: { type: 'boolean' }, description: 'Loading state' },
    isInvalidName: {
      control: { type: 'boolean' },
      description: 'Mutes the name, marking it as invalid',
    },
    hideTooltip: {
      control: { type: 'boolean' },
      description: 'Suppress the full-name tooltip',
    },
    iconSize: {
      control: { type: 'number', min: 12, max: 48, step: 2 },
      description: 'Icon size in px',
    },
  },
  args: {
    name: 'Organization',
    shared: false,
    loading: false,
    isInvalidName: false,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<FolderNameProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shared: Story = {
  args: { name: 'Team space', shared: true },
};

export const Loading: Story = {
  args: { name: 'Uploads', loading: true },
};

export const InvalidName: Story = {
  args: { name: 'bad:name?', isInvalidName: true },
};

export const LongName: Story = {
  args: {
    name: 'Quarterly reports for the mobile app team – archived drafts 2025',
  },
};
