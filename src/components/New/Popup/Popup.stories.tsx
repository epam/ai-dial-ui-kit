import {
  NeutralButton,
  PrimaryButton,
} from '@/components/New/Button/ButtonWrappers';
import { DialLoader } from '@/components/Loader/Loader';
import { ButtonAppearance } from '@/types/button';
import { PopupSize } from '@/types/popup';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Popup, type PopupProps } from './Popup';

const meta = {
  title: 'Components_2_0/Popup',
  component: Popup,
  parameters: { layout: 'centered' },
  argTypes: {
    open: { control: false },
    header: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    overlayClassName: { control: { type: 'text' } },
    titleClassName: { control: { type: 'text' } },
    ariaLabel: { control: { type: 'text' } },
    footer: { control: { type: 'text' } },
    onClose: { action: 'onClose', control: false },
  },
  args: {
    header: 'Title',
    children: <div className="px-6 py-4 min-h-[220px]">Body area</div>,
    footer: (
      <div className="px-6 py-4 flex justify-end gap-2">
        <NeutralButton label="Button label" />
        <PrimaryButton label="Button label" />
      </div>
    ),
  },
} satisfies Meta<PopupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// Reusable stateful renderer that opens the popup via a button click
const StatefulRender = (args: PopupProps & { buttonLabel?: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PrimaryButton
        label={args.buttonLabel || 'Open Popup'}
        onClick={() => setOpen(true)}
      />

      <Popup
        {...args}
        open={open}
        onClose={() => {
          setOpen(false);
          args.onClose?.(null);
        }}
      />
    </>
  );
};

export const Default: Story = { render: StatefulRender };

export const WithoutFooter: Story = {
  render: StatefulRender,
  args: { footer: undefined },
};

export const WithoutTitle: Story = {
  render: StatefulRender,
  args: { header: undefined },
};

export const WithLongTitle: Story = {
  render: StatefulRender,
  args: {
    header:
      'This is a very long title that should wrap onto multiple lines to demonstrate text wrapping behavior in the popup header. It might even be long enough to require truncation with an ellipsis if it exceeds a certain length',
  },
};

export const CustomClasses: Story = {
  render: StatefulRender,
  args: {
    className: 'ring-2 ring-offset-2 ring-sky-400 !bg-success',
    titleClassName: 'font-medium bg-error',
  },
};

export const DifferentSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div>
        <StatefulRender
          {...args}
          size={PopupSize.Sm}
          buttonLabel="Open Small Popup"
        />
      </div>
      <div>
        <StatefulRender
          {...args}
          size={PopupSize.Md}
          buttonLabel="Open Medium Popup"
        />
      </div>
      <div>
        <StatefulRender
          {...args}
          size={PopupSize.Lg}
          buttonLabel="Open Large Popup"
        />
      </div>
    </div>
  ),
  args: {},
};

export const WithoutHeaderAndDismiss: Story = {
  render: StatefulRender,
  args: {
    className: '!w-[280px]',
    header: undefined,
    ariaLabel: 'Moving items',
    footer: undefined,
    headerClassName: 'hidden',
    hideClose: true,
    children: (
      <div className="flex items-center flex-col gap-6 p-9">
        <DialLoader size={120} />
        <div className="flex flex-col gap-2 text-center text-primary">
          <div className="text-lg font-semibold">Moving items</div>
          <div className="text-sm">8 of 24 items moved...</div>
        </div>
        <PrimaryButton
          className="w-fit"
          appearance={ButtonAppearance.Ghost}
          label="Cancel"
        />
      </div>
    ),
  },
};

export const WithoutCloseButton: Story = {
  render: StatefulRender,
  args: { hideClose: true },
};
