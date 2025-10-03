import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialCloseButton, type DialCloseButtonProps } from './CloseButton';

const meta: Meta<typeof DialCloseButton> = {
  title: 'Components/DialCloseButton',
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
    cssClass: 'bg-red-100',
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
    <div className="min-w-[800px] p-8 flex flex-col gap-y-6">
      {/* Default */}
      <div>
        <div className="text-primary text-right pr-4 py-2">Default</div>
        <div className="flex justify-center">
          <DialCloseButton
            ariaLabel="Close dialog"
            onClose={() => alert('Closed!')}
          />
        </div>
      </div>

      {/* CustomSize */}
      <div>
        <div className="text-primary text-right pr-4 py-2">Custom Size</div>
        <div className="flex justify-center">
          <DialCloseButton
            ariaLabel="Close dialog"
            size={32}
            onClose={() => alert('Closed!')}
          />
        </div>
      </div>

      {/* WithCustomClass */}
      <div>
        <div className="text-primary text-right pr-4 py-2">
          With custom class
        </div>
        <div className="flex justify-center">
          <DialCloseButton
            ariaLabel="Close dialog"
            cssClass="bg-red-100 text-red-600 hover:text-red-800"
            onClose={() => alert('Closed!')}
          />
        </div>
      </div>
    </div>
  ),
};
