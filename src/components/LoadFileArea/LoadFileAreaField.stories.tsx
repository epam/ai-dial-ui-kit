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
  IconUpload,
} from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialPrimaryButton } from '@/components/Button/ButtonWrappers';

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
    maxFileSize: {
      control: 'number',
      description: 'Maximum allowed file size',
    },
    acceptTypes: {
      control: 'text',
      description: 'Accepted MIME types (e.g. image/*, .pdf)',
    },
    multiple: {
      control: 'boolean',
      description: 'Allows multiple file selection',
    },
    deleteAllButtonLabel: {
      control: 'text',
      description: 'Label for delete-all button',
    },
    addButtonLabel: { control: 'text', description: 'Label for add button' },
    additionalActionButtons: {
      control: false,
      description:
        'Optional custom buttons or content rendered near the default action buttons',
    },
    fileFormatError: {
      control: 'text',
      description: 'Displayed when an unsupported file is uploaded',
    },
    fileCountError: {
      control: 'text',
      description: 'Displayed when max file count exceeded',
    },
    fileSizeError: {
      control: 'text',
      description: 'Displayed when max file size exceeded',
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
    multiple: true,
    maxFilesCount: 5,
    maxFileSize: 4,
    deleteAllButtonLabel: 'Delete all',
    addButtonLabel: 'Add files',
    fileFormatError: 'Invalid file format',
    fileCountError: 'Too many files selected',
    fileSizeError: 'File exceed max file size limit',
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

export const WithAdditionalButtons: Story = {
  render: (args) => {
    const mockFiles = [
      new File(['text'], 'report.pdf', { type: 'application/pdf' }),
      new File(['data'], 'notes.txt', { type: 'text/plain' }),
    ];

    return (
      <InteractiveLoadFileAreaField
        {...args}
        files={mockFiles}
        additionalActionButtons={
          <DialPrimaryButton
            label="Upload selected"
            iconBefore={<IconUpload {...BASE_ICON_PROPS} />}
          />
        }
      />
    );
  },
  args: {
    ...Empty.args,
  },
};

export const InvalidTotalFileSize: Story = {
  render: (args) => {
    const fileSize = 1 * 1024 * 1024;
    const mockFiles = ['file1.txt', 'file2.txt'].map((fileName) => {
      const content = new Array(fileSize).fill('a').join('');
      const blob = new Blob([content], { type: 'text/plain' });

      return new File([blob], fileName, { type: 'text/plain' });
    });
    return <InteractiveLoadFileAreaField {...args} files={mockFiles} />;
  },
  args: {
    ...Empty.args,
    maxMultiFilesSize: 1,
    multiFilesSizeError: 'Total files size is more than 1 MB',
  },
};
