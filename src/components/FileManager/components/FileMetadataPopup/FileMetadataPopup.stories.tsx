import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileMetadataPopup } from './FileMetadataPopup';
import { useState, type FC, type ReactNode } from 'react';
import { DialButton } from '@/components/Button/Button';
import { DialFileNodeType, type DialFile } from '@/models/file';
import { ButtonVariant } from '@/types/button';

const meta: Meta<typeof FileMetadataPopup> = {
  title: 'FileManager/components/FileMetadataPopup',
  component: FileMetadataPopup,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockFile: DialFile = {
  id: 'file-1',
  name: 'File name 3.svg',
  path: 'My files/Folder 4',
  updatedAt: '2025-09-05T10:30:00Z',
  contentLength: 2150,
  author: 'Leslie Alexander',
  contentType: 'image/svg+xml',
  nodeType: DialFileNodeType.ITEM,
  folderId: 'folder-4',
};

const StoryWrapper: FC<{
  loading?: boolean;
  fileMetadata?: DialFile;
  header?: ReactNode;
  nameLabel?: string;
  pathLabel?: string;
  modifiedDateLabel?: string;
  sizeLabel?: string;
  authorLabel?: string;
}> = ({ loading = false, fileMetadata = mockFile, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show File Information"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        {...props}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={fileMetadata}
        loading={loading}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <StoryWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Default file metadata popup with all information displayed.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => <StoryWrapper {...args} loading={true} />,
  parameters: {
    docs: {
      description: {
        story:
          'File metadata popup in loading state, showing skeleton placeholders.',
      },
    },
  },
};

const LoadingThenDataComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setIsOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={handleOpen}
          label="Show File Information"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={mockFile}
        loading={loading}
      />
    </div>
  );
};

export const LoadingTransition: Story = {
  render: () => <LoadingThenDataComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the transition from loading skeleton to actual data. Shows skeleton for 2.5 seconds, then displays file information.',
      },
    },
  },
};

const SmallFileComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const smallFile: DialFile = {
    id: 'file-2',
    name: 'document.pdf',
    path: 'Documents',
    updatedAt: '2025-12-10T08:15:00Z',
    contentLength: 524,
    author: 'John Doe',
    contentType: 'application/pdf',
    nodeType: DialFileNodeType.ITEM,
    folderId: 'folder-1',
  };

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show Small File Info"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={smallFile}
      />
    </div>
  );
};

export const SmallFile: Story = {
  render: () => <SmallFileComponent />,
  parameters: {
    docs: {
      description: {
        story: 'File metadata popup for a small file (524 bytes).',
      },
    },
  },
};

const LargeFileComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const largeFile: DialFile = {
    id: 'file-3',
    name: 'presentation-final-v2-updated.pptx',
    path: 'Work/Projects/Q4 2025/Presentations',
    updatedAt: '2025-11-28T16:45:00Z',
    contentLength: 15728640, // 15 MB
    author: 'Sarah Johnson',
    nodeType: DialFileNodeType.ITEM,
    folderId: 'folder-7',
    contentType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show Large File Info"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={largeFile}
      />
    </div>
  );
};

export const LargeFile: Story = {
  render: () => <LargeFileComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'File metadata popup for a large file (15 MB) with a long name and deep path.',
      },
    },
  },
};

const NoAuthorComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const fileWithoutAuthor: DialFile = {
    id: 'file-4',
    name: 'image.png',
    path: 'Images/Screenshots',
    updatedAt: '2025-12-09T12:00:00Z',
    contentLength: 2048000, // 2 MB
    contentType: 'image/png',
    nodeType: DialFileNodeType.ITEM,
    folderId: 'folder-9',
  };

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show File Without Author"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={fileWithoutAuthor}
      />
    </div>
  );
};

export const NoAuthor: Story = {
  render: () => <NoAuthorComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'File metadata popup for a file without author information (shows "—").',
      },
    },
  },
};

const EncodedPathComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const fileWithEncodedPath: DialFile = {
    id: 'file-5',
    name: 'Screenshot 2025-12-10 at 09.44.24.png',
    path: 'files/akWB1YBFr8MR1nshJgXHKUWfPCLZf8x6nMKGsa9WMxmggzPWW42NdcfpPRiPjRHT5/13/Screenshot%202025-12-10%20at%2009.44.24.png',
    updatedAt: '2025-12-10T09:44:24Z',
    contentLength: 3456789,
    author: 'Jane Doe',
    contentType: 'image/png',
    nodeType: DialFileNodeType.ITEM,
    folderId: 'folder-13',
  };

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show File with Encoded Path"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={fileWithEncodedPath}
      />
    </div>
  );
};

export const EncodedPath: Story = {
  render: () => <EncodedPathComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'File metadata popup displaying a URI-encoded path with spaces and special characters. The path is automatically decoded for display (e.g., `%20` becomes space).',
      },
    },
  },
};

const SpecialCharactersPathComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const fileWithSpecialChars: DialFile = {
    id: 'file-6',
    name: 'file with & special # chars.txt',
    path: 'My%20Files/Special%20%26%20Important/file%20with%20%26%20special%20%23%20chars.txt',
    updatedAt: '2025-12-15T14:30:00Z',
    contentLength: 1024,
    author: 'Bob Smith',
    contentType: 'text/plain',
    nodeType: DialFileNodeType.ITEM,
    folderId: 'folder-spec',
  };

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show File with Special Characters"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={fileWithSpecialChars}
      />
    </div>
  );
};

export const SpecialCharactersPath: Story = {
  render: () => <SpecialCharactersPathComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'File metadata popup with special characters in the path (& and #). These are properly decoded from URI encoding.',
      },
    },
  },
};

const CustomLabelsComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show Custom Labels"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={mockFile}
        header="File Details"
        nameLabel="File Name:"
        pathLabel="Location:"
        modifiedDateLabel="Last Updated:"
        sizeLabel="File Size:"
        authorLabel="Created By:"
      />
    </div>
  );
};

export const CustomLabels: Story = {
  render: () => <CustomLabelsComponent />,
  parameters: {
    docs: {
      description: {
        story: 'File metadata popup with custom labels for all fields.',
      },
    },
  },
};

const NoFileDataComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={() => setIsOpen(true)}
          label="Show Empty Popup"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => setIsOpen(false)}
        fileMetadata={undefined}
        loading={false}
      />
    </div>
  );
};

export const NoFileData: Story = {
  render: () => <NoFileDataComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'File metadata popup with no file data provided (empty popup content).',
      },
    },
  },
};

const RealisticLoadingComponent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<DialFile | undefined>();

  const simulateFileLoad = () => {
    setIsOpen(true);
    setLoading(true);
    setFileData(undefined);

    // Simulate API call
    setTimeout(() => {
      setFileData(mockFile);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full h-[100px] flex items-center justify-center">
      {!isOpen && (
        <DialButton
          onClick={simulateFileLoad}
          label="Load File Information"
          variant={ButtonVariant.Primary}
        />
      )}
      <FileMetadataPopup
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setFileData(undefined);
        }}
        fileMetadata={fileData}
        loading={loading}
      />
    </div>
  );
};

export const RealisticLoading: Story = {
  render: () => <RealisticLoadingComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Realistic scenario: popup opens immediately with loading skeleton, then loads and displays data after 1.5 seconds (simulating API call).',
      },
    },
  },
};
