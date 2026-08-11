import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ConfirmationPopup,
  type ConfirmationPopupProps,
} from './ConfirmationPopup';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';
import { PrimaryButton } from '@/components/New/Button/ButtonWrappers';

const meta = {
  title: 'Components_2_0/ConfirmationPopup',
  component: ConfirmationPopup,
  parameters: { layout: 'centered' },
  argTypes: {
    open: { control: false },
    variant: {
      control: { type: 'radio' },
      options: [ConfirmationPopupVariant.Info, ConfirmationPopupVariant.Danger],
    },
    header: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    descriptionClassName: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    confirmClassName: { control: { type: 'text' } },
    confirmLabel: { control: { type: 'text' } },
    cancelLabel: { control: { type: 'text' } },
    isLoading: { control: { type: 'boolean' } },
    disableConfirmButton: { control: { type: 'boolean' } },
    onClose: { action: 'onClose', control: false },
    onConfirm: { action: 'onConfirm', control: false },
    onCancel: { action: 'onCancel', control: false },
  },
  args: {
    header: 'Title',
    description: 'Body area',
  },
} satisfies Meta<ConfirmationPopupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// Reusable stateful renderer that opens the popup via a button click
const StatefulRender = (
  args: ConfirmationPopupProps & { buttonLabel?: string },
) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PrimaryButton
        onClick={() => setOpen(true)}
        label={args.buttonLabel || 'Open Confirmation'}
      />

      <ConfirmationPopup
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose?.();
        }}
        onCancel={() => {
          setOpen(false);
          args.onCancel?.();
        }}
        onConfirm={() => {
          setOpen(false);
          args.onConfirm?.();
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: StatefulRender,
  args: {
    onClose: () => null,
    onConfirm: () => null,
  },
};

export const Danger: Story = {
  render: StatefulRender,
  args: {
    variant: ConfirmationPopupVariant.Danger,
    header: 'Confirm Deletion',
    description: (
      <div className="space-y-2">
        <p>Are you sure you want to delete this item?</p>
        <div className="opacity-70">
          <div>
            <span className="opacity-70">ID:</span> 1234567890
          </div>
          <div>
            <span className="opacity-70">Display name:</span> Test Item
          </div>
          <div>
            <span className="opacity-70">Version:</span> 1.0.0
          </div>
          <div>
            <span className="opacity-70">Created:</span> Jan 1, 2023 by John Doe
          </div>
        </div>
      </div>
    ),
    confirmLabel: 'Delete',
    onClose: () => null,
    onConfirm: () => null,
  },
};

export const PrimarySave: Story = {
  render: StatefulRender,
  args: {
    variant: ConfirmationPopupVariant.Info,
    header: 'Unsaved Changes',
    description:
      'You have unsaved changes. Do you want to save them before leaving?',
    confirmLabel: 'Save',
    cancelLabel: 'Continue editing',
    onClose: () => null,
    onConfirm: () => null,
  },
};

export const WithoutDescription: Story = {
  render: (args) => (
    <StatefulRender
      {...args}
      description={undefined}
      children={
        <div className="px-6 py-4">
          <p className="text-secondary dial-small-paragraph-text">
            Replace description with <strong>custom content</strong>.
          </p>
        </div>
      }
    />
  ),
  args: {
    onClose: () => null,
    onConfirm: () => null,
  },
};

export const Loading: Story = {
  render: StatefulRender,
  args: {
    isLoading: true,
    header: 'Processing…',
    confirmLabel: 'Save',
    onClose: () => null,
    onConfirm: () => null,
  },
};

export const CustomFooter: Story = {
  render: StatefulRender,
  args: {
    footer: (
      <div className="flex justify-between items-center px-6 py-3">
        <span className="text-secondary dial-small-text">Custom footer</span>
        <PrimaryButton label="Action" onClick={() => alert('Custom action')} />
      </div>
    ),
    onClose: () => null,
    onConfirm: () => null,
  },
};

export const CustomClasses: Story = {
  render: StatefulRender,
  args: {
    className: 'ring-2 ring-offset-2 ring-sky-400 !bg-success',
    onClose: () => null,
    onConfirm: () => null,
  },
};
