import type { Meta, StoryObj } from '@storybook/react-vite';

import { ElementSize } from '@/types/size';
import { CloseButton, type CloseButtonProps } from './CloseButton';

const meta = {
  title: 'Components_2_0/CloseButton',
  component: CloseButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A ghost icon button that dismisses the surface it belongs to. Name it ' +
          'after that surface — the default `"Close"` only keeps the control from ' +
          'being unnamed.',
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessible name of the button',
    },
    size: {
      control: { type: 'inline-radio' },
      options: [ElementSize.Small, ElementSize.Standard],
      description: 'Button size: small is 24px, standard is 40px',
    },
    disabled: { control: { type: 'boolean' } },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to the button',
    },
    onClose: {
      control: false,
      description: 'Callback fired when the button is clicked',
    },
  },
  args: {
    ariaLabel: 'Close dialog',
    size: ElementSize.Small,
    disabled: false,
    onClose: () => alert('Closed!'),
  },
} satisfies Meta<CloseButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Standard: Story = {
  args: {
    size: ElementSize.Standard,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The 40px variant, which is the only one carrying the 44×44 pointer ' +
          'target. Use it where the control stands on its own.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithCustomClass: Story = {
  name: 'With custom class',
  args: {
    className: 'text-error hover:text-error',
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-y-6">
      {[
        { label: 'Small (24px)', size: ElementSize.Small },
        { label: 'Standard (40px)', size: ElementSize.Standard },
      ].map(({ label, size }) => (
        <div key={size} className="flex flex-row items-center gap-x-4">
          <div className="w-[140px] text-primary">{label}</div>
          <CloseButton {...args} size={size} />
          <CloseButton {...args} size={size} disabled />
          <CloseButton
            {...args}
            size={size}
            className="text-error hover:text-error"
          />
        </div>
      ))}
    </div>
  ),
};
