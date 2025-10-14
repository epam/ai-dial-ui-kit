import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialCloseButton, type DialCloseButtonProps } from './CloseButton';

const meta: Meta<typeof DialCloseButton> = {
  title: 'Utility/CloseButton',
  component: DialCloseButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A contextual feedback component for displaying important messages with optional close button.',
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessibility label (used when title is not provided)',
    },
    size: {
      control: { type: 'number' },
      description: 'Size of the close icon',
    },
    cssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to the alert container',
    },
    onClose: {
      control: false,
      description: 'Callback fired when the close button is clicked',
    },
  },
} satisfies Meta<DialCloseButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: 'Close',
    onClose: () => alert('Closed!'),
  },
};

export const CustomSize: Story = {
  args: {
    ariaLabel: 'Close',
    size: 32,
    onClose: () => alert('Closed!'),
  },
};

export const WithCustomClass: Story = {
  args: {
    ariaLabel: 'Close',
    cssClass: 'bg-layer-2 text-primary hover:text-accent-tertiary',
    onClose: () => alert('Closed!'),
  },
};

export const NoAriaLabel: Story = {
  args: {
    onClose: () => alert('Closed!'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-8 flex flex-col gap-y-6">
      {/* Default */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">Default</div>
        <DialCloseButton
          ariaLabel="Close dialog"
          onClose={() => alert('Closed!')}
        />
      </div>

      {/* CustomSize */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">Custom Size</div>
        <DialCloseButton
          ariaLabel="Close dialog"
          size={32}
          onClose={() => alert('Closed!')}
        />
      </div>

      {/* WithCustomClass */}
      <div className="flex flex-row items-center">
        <div className="text-primary pr-4 py-2">With custom class</div>
        <DialCloseButton
          ariaLabel="Close dialog"
          cssClass="bg-error text-error hover:text-error"
          onClose={() => alert('Closed!')}
        />
      </div>
    </div>
  ),
};
