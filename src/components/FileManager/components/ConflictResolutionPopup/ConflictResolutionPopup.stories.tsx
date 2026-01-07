import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import {
  DialFileManagerConflictActions,
  DialFileManagerConflictStrategies,
} from '@/types/file-manager';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ConflictResolutionPopup } from './ConflictResolutionPopup';

const singleFile: DialFile = {
  id: '1',
  name: 'test.svg',
  path: '/Design/Icons/test.svg',
  nodeType: DialFileNodeType.ITEM,
  parentPath: '/Design/Icons',
} as DialFile;

const multipleFiles: DialFile[] = [
  {
    id: '1',
    name: 'Cennik-uslug-powszechnych-w-obrocie-krajowym-i-miedzynarodowym.pdf',
    path: '/Documents/Cennik.pdf',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '2',
    name: 'test.svg',
    path: '/Design/test.svg',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '3',
    name: 'Screenshot_20251027-113416 (2).png',
    path: '/Images/Screenshot.png',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '4',
    name: 'Grok-feb-2025-logo.svg',
    path: '/Logos/Grok.svg',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '5',
    name: 'File name 2.svg',
    path: '/Files/File2.svg',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '6',
    name: 'epam_logo.png',
    path: '/Logos/epam.png',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '7',
    name: 'File name 3.svg',
    path: '/Files/File3.svg',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '8',
    name: 'test-test.svg',
    path: '/Design/test-test.svg',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '9',
    name: 'Screenshot_20251027-113416.png',
    path: '/Images/Screenshot2.png',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
  {
    id: '10',
    name: 'test copy.svg',
    path: '/Design/test-copy.svg',
    nodeType: DialFileNodeType.ITEM,
  } as DialFile,
];

const StoryWrapper = ({
  conflictingFiles,
  ...args
}: {
  conflictingFiles: DialFile[];
  [key: string]: unknown;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialPrimaryButton
          onClick={() => setIsOpen(true)}
          label="Show Conflict Resolution Popup"
        />
      )}

      <ConflictResolutionPopup
        {...args}
        open={isOpen}
        conflictingFiles={conflictingFiles}
        onClose={() => {
          setIsOpen(false);
          // eslint-disable-next-line no-console
          console.log('Popup closed');
        }}
        onReplace={() => {
          // eslint-disable-next-line no-console
          console.log('Replace All selected');
          alert('Replace All selected');
          setIsOpen(false);
        }}
        onDuplicate={() => {
          // eslint-disable-next-line no-console
          console.log('Duplicate All selected');
          alert('Duplicate All selected');
          setIsOpen(false);
        }}
        onDecideForEach={(decisions) => {
          // eslint-disable-next-line no-console
          console.log('Decisions:', decisions);
          alert(
            `Decisions:\n${decisions
              .map((d) => `${d.file.name}: ${d.action}`)
              .join('\n')}`,
          );
          setIsOpen(false);
        }}
      />
    </div>
  );
};

const meta: Meta<typeof ConflictResolutionPopup> = {
  title: 'FileManager/components/ConflictResolutionPopup',
  component: ConflictResolutionPopup,
  tags: ['popup', 'conflict-resolution', 'file-manager'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A popup dialog for resolving file name conflicts during copy or move operations. Shows different UI based on number of conflicting files.',
      },
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    onClose: { action: 'onClose' },
    onReplace: { action: 'onReplace' },
    onDuplicate: { action: 'onDuplicate' },
    onDecideForEach: { action: 'onDecideForEach' },
  },
  render: (args) => <StoryWrapper {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleFileConflict: Story = {
  args: {
    conflictingFiles: [singleFile],
  },
};

export const MultipleFilesConflict: Story = {
  args: {
    conflictingFiles: multipleFiles,
  },
};

export const WithCustomLabels: Story = {
  args: {
    conflictingFiles: multipleFiles,
    singleFileTitle: 'File Already Exists',
    multipleFilesTitle: 'Multiple Files Already Exist',
    actionLabels: {
      [DialFileManagerConflictActions.Replace]: 'Overwrite',
      [DialFileManagerConflictActions.Duplicate]: 'Keep Both',
      [DialFileManagerConflictActions.Cancel]: 'Skip',
    },
    strategyLabels: {
      [DialFileManagerConflictStrategies.ReplaceAll]: 'Overwrite All',
      [DialFileManagerConflictStrategies.DuplicateAll]: 'Keep All',
      [DialFileManagerConflictStrategies.DecideForEach]: 'Choose Individually',
    },
    confirmLabel: 'Apply',
    cancelLabel: 'Close',
    nameColumnLabel: 'File Name',
    actionColumnLabel: 'Resolution',
  },
};

export const WithFolderConflict: Story = {
  args: {
    conflictingFiles: [
      {
        id: '1',
        name: 'Documents',
        path: '/Documents',
        nodeType: DialFileNodeType.FOLDER,
      } as DialFile,
      {
        id: '2',
        name: 'report.pdf',
        path: '/Documents/report.pdf',
        nodeType: DialFileNodeType.ITEM,
      } as DialFile,
    ],
  },
};

export const CustomMessage: Story = {
  args: {
    conflictingFiles: multipleFiles,
    message: 'These files already exist. What would you like to do?',
  },
};
