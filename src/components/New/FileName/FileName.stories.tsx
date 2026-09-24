import type { Meta, StoryObj } from '@storybook/react-vite';

import { DialItemType } from '@/types/item';
import { FileName, type FileNameProps } from './FileName';

const meta = {
  title: 'Components_2_0/FileName',
  component: FileName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A file or folder name with its type icon, truncated with a tooltip when it does not fit. With `details` the text switches to two lines.',
      },
    },
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Full item name, with or without an extension',
    },
    type: {
      control: { type: 'select' },
      options: Object.values(DialItemType),
      description: 'Whether the item is a file or a folder',
    },
    shared: { control: { type: 'boolean' }, description: 'Shared badge' },
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
    name: 'Document.pdf',
    shared: false,
    isInvalidName: false,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<FileNameProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoExtension: Story = {
  args: { name: 'README' },
};

export const Folder: Story = {
  args: { name: 'Projects', type: DialItemType.Folder },
};

export const Shared: Story = {
  args: { name: 'report.docx', shared: true },
};

export const InvalidName: Story = {
  args: { name: 'bad:name?.txt', isInvalidName: true },
};

export const LongName: Story = {
  args: {
    name: 'Quarterly Performance Review – Mobile App v2.7.3 (final-approved).xlsx',
  },
};

export const WithDetails: Story = {
  args: {
    name: 'Document.pdf',
    details: (
      <span className="dial-tiny-text text-secondary">
        24 KB · Jul 20, 2025
      </span>
    ),
  },
};
