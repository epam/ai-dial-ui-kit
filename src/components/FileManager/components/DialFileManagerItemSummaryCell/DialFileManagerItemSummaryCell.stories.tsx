import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialFileManagerItemSummaryCell } from './DialFileManagerItemSummaryCell';
import { DialFileNodeType } from '@/models/file';

const meta: Meta<typeof DialFileManagerItemSummaryCell> = {
  title: 'FileManager/components/FileManagerItemSummaryCell',
  component: DialFileManagerItemSummaryCell,
  parameters: { layout: 'centered' },
  argTypes: {
    id: { control: 'text' },
    name: { control: 'text' },
    nodeType: {
      control: 'select',
      options: [DialFileNodeType.ITEM, DialFileNodeType.FOLDER],
    },
    size: { control: { type: 'number' } },
    updatedAt: { control: 'text' },
    dateLocale: { control: 'text' },
    dateOptions: { control: 'object' },
  },
  args: {
    id: '1',
    name: 'Example File.txt',
    nodeType: DialFileNodeType.ITEM,
    size: 15 * 1024,
    updatedAt: '2025-07-20T00:00:00Z',
    dateLocale: 'en-US',
    dateOptions: {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FileItem: Story = {};

export const FolderItem: Story = {
  args: {
    id: '2',
    name: 'Projects',
    nodeType: DialFileNodeType.FOLDER,
  },
};

export const LongName: Story = {
  args: {
    name: 'Very long file name that should demonstrate ellipsis handling in the UI.txt',
  },
};

export const DifferentLocale: Story = {
  args: {
    dateLocale: 'fr-FR',
    dateOptions: {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  },
};

export const TimestampValue: Story = {
  args: {
    updatedAt: '1752969600000',
  },
};

export const MissingDate: Story = {
  args: {
    updatedAt: undefined,
  },
};
