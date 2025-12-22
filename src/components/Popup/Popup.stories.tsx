import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialPopup, type DialPopupProps } from './Popup';
import { PopupSize } from '@/types/popup';
import { DialLoader } from '@/components/Loader/Loader';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';

const meta = {
  title: 'Overlay/Popup',
  component: DialPopup,
  parameters: { layout: 'centered' },
  argTypes: {
    open: { control: false },
    header: { control: { type: 'text' } },
    className: { control: { type: 'text' } },
    overlayClassName: { control: { type: 'text' } },
    titleClassName: { control: { type: 'text' } },
    dividers: { control: { type: 'boolean' } },
    footer: { control: { type: 'text' } },
    onClose: { action: 'onClose', control: false },
  },
  args: {
    header: 'Title',
    dividers: true,
    children: <div className="px-6 py-4 min-h-[220px]">Body area</div>,
    footer: (
      <div className="px-6 py-4 flex justify-end gap-2">
        <button className="px-3 py-1 rounded border border-tertiary text-secondary hover:text-primary">
          Button label
        </button>
        <button className="px-3 py-1 rounded bg-accent-primary text-white">
          Button label
        </button>
      </div>
    ),
  },
} satisfies Meta<DialPopupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// Reusable stateful renderer that opens the popup via a button click
const StatefulRender = (args: DialPopupProps & { buttonLabel?: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="px-3 py-2 rounded bg-accent-primary text-white hover:opacity-90"
        onClick={() => setOpen(true)}
      >
        {args.buttonLabel || 'Open Popup'}
      </button>

      <DialPopup
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

export const WithoutDividers: Story = {
  render: StatefulRender,
  args: { dividers: false },
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
    className: 'ring-2 ring-offset-2 ring-sky-400 !bg-accent-secondary',
    titleClassName: 'font-medium bg-red-400',
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
    footer: undefined,
    dividers: false,
    headerClassName: 'hidden',
    closable: false,
    children: (
      <div className="flex items-center flex-col gap-6 p-9">
        <DialLoader size={120} />
        <div className="flex flex-col gap-2 text-center text-primary">
          <div className="text-lg font-semibold">Moving items</div>
          <div className="text-sm">8 of 24 items moved...</div>
        </div>
        <DialButton
          className="w-fit"
          variant={ButtonVariant.Tertiary}
          label="Cancel"
        />
      </div>
    ),
  },
};

export const WithoutCloseButton: Story = {
  render: StatefulRender,
  args: { closable: false },
};
