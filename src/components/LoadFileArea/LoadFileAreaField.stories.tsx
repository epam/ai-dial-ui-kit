import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  DialLoadFileAreaField,
  type DialLoadFileAreaFieldProps,
} from './LoadFileAreaField';
import {
  IconFile,
  IconFileTypePdf,
  IconFileText,
  IconFileTypeSvg,
} from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';

const meta: Meta<typeof DialLoadFileAreaField> = {
  title: 'Form/LoadFileAreaField',
  component: DialLoadFileAreaField,
  tags: ['upload', 'file', 'drag and drop', 'form', 'input'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`LoadFileAreaField` combines a field label, upload buttons (add/remove), and the `DialLoadFileArea` dropzone. It handles file validation, multiple uploads, and deletion logic.',
      },
    },
  },
  argTypes: {
    fieldTitle: {
      control: 'text',
      description: 'Label for the file upload field',
    },
    maxFilesCount: {
      control: 'number',
      description: 'Maximum allowed file count',
    },
    acceptTypes: {
      control: 'text',
      description: 'Accepted MIME types (e.g. image/*, .pdf)',
    },
    isMultiple: {
      control: 'boolean',
      description: 'Allows multiple file selection',
    },
    deleteAllButtonLabel: {
      control: 'text',
      description: 'Label for delete-all button',
    },
    addButtonLabel: { control: 'text', description: 'Label for add button' },
    fileFormatError: {
      control: 'text',
      description: 'Displayed when an unsupported file is uploaded',
    },
    fileCountError: {
      control: 'text',
      description: 'Displayed when max file count exceeded',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveLoadFileAreaField = (args: DialLoadFileAreaFieldProps) => {
  const [files, setFiles] = useState<File[]>(args.files || []);

  const getIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf'))
      return <IconFileTypePdf {...BASE_ICON_PROPS} />;
    if (fileName.endsWith('.txt')) return <IconFileText {...BASE_ICON_PROPS} />;
    if (fileName.endsWith('.svg'))
      return <IconFileTypeSvg {...BASE_ICON_PROPS} />;
    return <IconFile {...BASE_ICON_PROPS} />;
  };

  return (
    <div className="h-[250px] w-[480px]">
      <DialLoadFileAreaField
        {...args}
        files={files}
        onChange={setFiles}
        dynamicIcon={(file) => getIcon(file)}
      />
    </div>
  );
};

export const Empty: Story = {
  render: (args) => <InteractiveLoadFileAreaField {...args} />,
  args: {
    fieldTitle: 'Documents',
    elementId: 'upload-docs',
    acceptTypes: 'application/pdf, application/txt, image/svg+xml',
    isMultiple: true,
    maxFilesCount: 5,
    deleteAllButtonLabel: 'Delete all',
    addButtonLabel: 'Add files',
    fileFormatError: 'Invalid file format',
    fileCountError: 'Too many files selected',
    emptyTextFirstLine: 'Drop file here',
    emptyTextSecondLine: 'or',
    emptyButtonLabel: 'Browse',
  },
};

export const WithFiles: Story = {
  render: (args) => {
    const mockFiles = [
      new File(['text'], 'report.pdf', { type: 'application/pdf' }),
      new File(['data'], 'notes.txt', { type: 'text/plain' }),
    ];
    return <InteractiveLoadFileAreaField {...args} files={mockFiles} />;
  },
  args: {
    ...Empty.args,
  },
};

export const FileCountExceeded: Story = {
  render: (args) => {
    const mockFiles = [
      new File(['data'], 'file1.pdf', { type: 'application/pdf' }),
      new File(['data'], 'file2.pdf', { type: 'application/pdf' }),
      new File(['data'], 'file3.pdf', { type: 'application/pdf' }),
      new File(['data'], 'file4.pdf', { type: 'application/pdf' }),
      new File(['data'], 'file5.pdf', { type: 'application/pdf' }),
      new File(['data'], 'file6.pdf', { type: 'application/pdf' }),
    ];
    return <InteractiveLoadFileAreaField {...args} files={mockFiles} />;
  },
  args: {
    ...Empty.args,
    maxFilesCount: 5,
    fileCountError: 'Maximum of 5 files allowed',
  },
};

export const InvalidFormat: Story = {
  render: (args) => {
    const mockFiles = [
      new File(['fake'], 'malware.exe', { type: 'application/x-msdownload' }),
    ];
    return <InteractiveLoadFileAreaField {...args} files={mockFiles} />;
  },
  args: {
    ...Empty.args,
    fileFormatError: 'Unsupported file type',
    isInvalid: (file: File) => file.name.endsWith('.exe'),
  },
};

export const WithDynamicIcons: Story = {
  render: (args) => {
    const mockFiles = [
      new File(['data'], 'manual.pdf', { type: 'application/pdf' }),
      new File(['data'], 'summary.txt', { type: 'text/plain' }),
      new File(['data'], 'generic.file', { type: 'application/octet-stream' }),
    ];

    return <InteractiveLoadFileAreaField {...args} files={mockFiles} />;
  },
  args: {
    ...Empty.args,
  },
};
