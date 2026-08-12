import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Popup } from '@/components/New/Popup/Popup';
import { PopupSize } from '@/types/popup';
import { FileDropzone, type FileDropzoneProps } from './FileDropzone';

const UPLOAD_COPY = {
  label: 'Drag and drop it or click here to upload',
  description: 'File formats .md, .zip and .skill',
  accept: '.md,.zip,.skill',
};

const InteractiveFileDropzone = (args: FileDropzoneProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | undefined>(args.errorText);

  return (
    <div className="flex w-[520px] flex-col gap-3">
      <FileDropzone
        {...args}
        errorText={error}
        onChange={(selected) => {
          setError(undefined);
          setFiles(selected);
          args.onChange(selected);
        }}
        onReject={(rejected) => {
          setError(`Unsupported file format: ${rejected[0].name}`);
          args.onReject?.(rejected);
        }}
      />
      {files.length > 0 && (
        <ul className="dial-tiny-text text-secondary">
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const meta = {
  title: 'Components_2_0/FileDropzone',
  component: FileDropzone,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A dashed drop area that takes files by drag-and-drop or through the file picker. The area is a label over a visually hidden file input, so it stays keyboard operable and is announced as a file input. `accept` is enforced on drops too — the browser only filters the picker.',
      },
    },
  },
  argTypes: {
    labelProps: {
      control: 'object',
      description:
        'Props of the `Label` naming the field, rendered above the area',
    },
    label: {
      control: 'text',
      description: 'Primary line of copy',
    },
    description: {
      control: 'text',
      description: 'Secondary line of copy',
    },
    onChange: {
      action: 'files accepted',
      control: false,
      description: 'Fired with the accepted files',
    },
    onReject: {
      action: 'files rejected',
      control: false,
      description: 'Fired with dropped files that `accept` excluded',
    },
    accept: {
      control: 'text',
      description: "Comma-separated `accept` tokens, e.g. '.md,.zip,.skill'",
    },
    multiple: {
      control: 'boolean',
      description: 'Whether more than one file can be selected at a time',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables picking and dropping',
    },
    errorText: {
      control: 'text',
      description: 'Error message rendered below the area',
    },
    icon: {
      control: false,
      description: 'Icon rendered above the copy',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name; needed when `label` carries no text',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the drop area',
    },
  },
} satisfies Meta<typeof FileDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => undefined;

export const Default: Story = {
  render: InteractiveFileDropzone,
  args: {
    ...UPLOAD_COPY,
    onChange: noop,
  },
};

/**
 * `labelProps` names the field the dropzone fills, above the area. The copy
 * inside the area says how to use the control; the label says what it is for.
 */
export const WithFieldLabel: Story = {
  render: InteractiveFileDropzone,
  args: {
    ...UPLOAD_COPY,
    labelProps: {
      label: 'Attachments',
      required: true,
      caption: 'Up to 10 MB per file',
    },
    onChange: noop,
  },
};

export const Multiple: Story = {
  render: InteractiveFileDropzone,
  args: {
    ...UPLOAD_COPY,
    multiple: true,
    onChange: noop,
  },
};

export const WithError: Story = {
  render: InteractiveFileDropzone,
  args: {
    ...UPLOAD_COPY,
    errorText: 'Unsupported file format',
    onChange: noop,
  },
};

export const Disabled: Story = {
  render: InteractiveFileDropzone,
  args: {
    ...UPLOAD_COPY,
    disabled: true,
    onChange: noop,
  },
};

export const AcceptsAnyFile: Story = {
  render: InteractiveFileDropzone,
  args: {
    label: 'Drag and drop it or click here to upload',
    description: 'Any file format',
    onChange: noop,
  },
};

/** The dropzone as it appears in an upload dialog. */
export const InPopup: Story = {
  args: { ...UPLOAD_COPY, onChange: noop },
  render: (args) => {
    const UploadPopup = () => {
      const [open, setOpen] = useState(true);

      return (
        <div className="flex h-[420px] items-center justify-center">
          <Popup
            open={open}
            header="Upload prompt"
            size={PopupSize.Md}
            onClose={() => setOpen(false)}
          >
            <div className="px-6 pb-6">
              <FileDropzone {...args} />
            </div>
          </Popup>
          {!open && (
            <button
              type="button"
              className="dial-small-text text-accent"
              onClick={() => setOpen(true)}
            >
              Reopen the dialog
            </button>
          )}
        </div>
      );
    };

    return <UploadPopup />;
  },
};

export const AllVariants: Story = {
  args: { ...UPLOAD_COPY, onChange: noop },
  render: (args) => (
    <div className="flex w-[560px] flex-col gap-y-8 p-8">
      <div>
        <div className="dial-small-semi-text mb-2 text-primary">Default</div>
        <FileDropzone {...args} />
      </div>
      <div>
        <div className="dial-small-semi-text mb-2 text-primary">With error</div>
        <FileDropzone {...args} errorText="Unsupported file format" />
      </div>
      <div>
        <div className="dial-small-semi-text mb-2 text-primary">Disabled</div>
        <FileDropzone {...args} disabled />
      </div>
    </div>
  ),
};
