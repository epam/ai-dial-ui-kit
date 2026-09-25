import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { TransferQueueItemStatus } from '@/types/transfer-queue';
import {
  TransferQueue,
  type TransferQueueItem,
  type TransferQueueProps,
} from './TransferQueue';

const mixedItems: TransferQueueItem[] = [
  {
    id: '1',
    name: 'epam_ai_dial_chat_with_attachments_06_2026.pptx',
    status: TransferQueueItemStatus.Success,
  },
  {
    id: '2',
    name: 'epam_ai_dial_chat_with_attachments_08_2026.txt',
    status: TransferQueueItemStatus.Failed,
    message: 'Upload failed. Please try again.',
  },
  {
    id: '3',
    name: 'epam_ai_dial_chat_with_attachments_04_2026.docx',
    status: TransferQueueItemStatus.Warning,
    message: 'Some attachments could not be uploaded and were skipped.',
  },
  {
    id: '4',
    name: 'epam_ai_dial_chat_with_attachments_09_2026.js',
    status: TransferQueueItemStatus.InProgress,
    percent: 40,
  },
  {
    id: '5',
    name: 'epam_ai_dial_chat_with_attachments_10_2026.pdf',
    status: TransferQueueItemStatus.Canceled,
  },
];

const meta = {
  title: 'Components_2_0/TransferQueue',
  component: TransferQueue,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating panel listing the files of an upload, download, import or export, with a live status per row. Position it yourself — e.g. in a fixed container at the bottom-end corner.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' }, description: 'Heading, verbatim' },
    onClose: { action: 'onClose', control: false },
    onCancelItem: { action: 'onCancelItem', control: false },
    autoCloseDelay: {
      control: { type: 'number', min: 0, step: 1000 },
      description: 'Delay before an all-succeeded queue closes; 0 disables',
    },
  },
  args: {
    title: 'Importing 5 files',
    items: mixedItems,
    onClose: () => undefined,
    onCancelItem: () => undefined,
  },
} satisfies Meta<TransferQueueProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MixedStatuses: Story = {};

export const WithoutCancel: Story = {
  args: { onCancelItem: undefined },
};

export const AllSucceeded: Story = {
  args: {
    title: 'Importing 2 files',
    autoCloseDelay: 0,
    items: [
      { id: '1', name: 'report.pdf', status: TransferQueueItemStatus.Success },
      { id: '2', name: 'data.xlsx', status: TransferQueueItemStatus.Success },
    ],
  },
};

const SimulatedUpload = (args: TransferQueueProps) => {
  const [items, setItems] = useState<TransferQueueItem[]>(() =>
    ['photo.png', 'clip.mp4', 'notes.txt'].map((name, index) => ({
      id: String(index),
      name,
      status: TransferQueueItemStatus.InProgress,
      percent: 0,
    })),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setItems((prev) =>
        prev.map((item, index) => {
          if (item.status !== TransferQueueItemStatus.InProgress) return item;
          const percent = Math.min(100, (item.percent ?? 0) + 10 + index * 5);
          return percent === 100
            ? { ...item, percent, status: TransferQueueItemStatus.Success }
            : { ...item, percent };
        }),
      );
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <TransferQueue
      {...args}
      title={`Uploading ${items.length} files`}
      items={items}
      onCancelItem={(id) =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: TransferQueueItemStatus.Canceled }
              : item,
          ),
        )
      }
    />
  );
};

export const Live: Story = {
  render: (args) => <SimulatedUpload {...args} />,
};
