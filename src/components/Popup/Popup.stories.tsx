import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialPopup, type DialPopupProps } from './Popup';

const meta = {
  title: 'Components/Popup',
  component: DialPopup,
  parameters: { layout: 'centered' },
  argTypes: {
    open: { control: false },
    title: { control: { type: 'text' } },
    cssClass: { control: { type: 'text' } },
    overlayClass: { control: { type: 'text' } },
    headingClass: { control: { type: 'text' } },
    dividers: { control: { type: 'boolean' } },
    footer: { control: { type: 'text' } },
    onClose: { action: 'onClose', control: false },
  },
  args: {
    title: 'Title',
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
const StatefulRender = (args: DialPopupProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="px-3 py-2 rounded bg-accent-primary text-white hover:opacity-90"
        onClick={() => setOpen(true)}
      >
        Open popup
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
  args: { title: undefined },
};

export const WithLongTitle: Story = {
  render: StatefulRender,
  args: {
    title:
      'This is a very long title that should wrap onto multiple lines to demonstrate text wrapping behavior in the popup header. It might even be long enough to require truncation with an ellipsis if it exceeds a certain length',
  },
};
