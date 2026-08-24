import {
  NeutralButton,
  PrimaryButton,
} from '@/components/New/Button/ButtonWrappers';
import { InfoButton } from '@/components/New/InfoButton/InfoButton';
import { DialLoader } from '@/components/Loader/Loader';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { PopupSize } from '@/types/popup';
import { IconArrowLeft } from '@tabler/icons-react';
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
    headerDivider: { control: { type: 'boolean' } },
    footerDivider: { control: { type: 'boolean' } },
    additionalButtonsOnLeft: { control: { type: 'boolean' } },
    onClose: { action: 'onClose', control: false },
    onBack: { action: 'onBack', control: false },
  },
  args: {
    header: 'Title',
    children: <div className="px-6 py-4 min-h-[220px]">Body area</div>,
    mainButtons: [
      { label: 'Button' },
      { label: 'Button', variant: ButtonVariant.Primary },
    ],
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
  args: { mainButtons: undefined },
};

/** Back control, header actions and both rules — the "max view" of the design. */
export const MaxView: Story = {
  render: StatefulRender,
  args: {
    onBack: () => {},
    backAriaLabel: 'Back to the previous step',
    headerActions: <InfoButton caption="What this dialog does" />,
    headerDivider: true,
    footerDivider: true,
    additionalButtonsOnLeft: true,
    additionalButtons: [
      {
        label: 'Button',
        variant: ButtonVariant.Primary,
        appearance: ButtonAppearance.Link,
        iconBefore: <IconArrowLeft size={DIAL_ICON_SIZE.MD} aria-hidden />,
      },
    ],
  },
};

export const WithBackButton: Story = {
  render: StatefulRender,
  args: { onBack: () => {}, backAriaLabel: 'Back to the previous step' },
};

export const WithHeaderActions: Story = {
  render: StatefulRender,
  args: { headerActions: <InfoButton caption="What this dialog does" /> },
};

export const WithDividers: Story = {
  render: StatefulRender,
  args: { headerDivider: true, footerDivider: true },
};

/**
 * Additional buttons sit beside the main ones by default; flip
 * `additionalButtonsOnLeft` to move them to the opposite edge.
 */
export const WithAdditionalButtons: Story = {
  render: StatefulRender,
  args: {
    additionalButtons: [
      { label: 'Learn more', appearance: ButtonAppearance.Link },
    ],
  },
};

/** A `footer` node still overrides the structured buttons entirely. */
export const CustomFooterNode: Story = {
  render: StatefulRender,
  args: {
    footer: (
      <div className="px-6 py-4 flex justify-between gap-2">
        <NeutralButton label="Reset" />
        <PrimaryButton label="Apply" />
      </div>
    ),
  },
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
    mainButtons: undefined,
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
