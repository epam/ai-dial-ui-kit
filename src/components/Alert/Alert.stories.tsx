import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAlert, type DialAlertProps } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: DialAlert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A contextual feedback component for displaying important messages with optional close button.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
      description: 'Defines the visual style and icon of the alert',
    },
    message: {
      control: { type: 'text' },
      description: 'Message text displayed inside the alert',
    },
    cssClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to the alert container',
    },
    closable: {
      control: { type: 'boolean' },
      description: 'Whether the close button should be shown',
    },
    onClose: {
      control: false,
      description: 'Callback fired when the close button is clicked',
    },
  },
  args: {
    variant: 'info',
    message: 'This is an info alert',
    closable: true,
  },
} satisfies Meta<DialAlertProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    message: 'Information alert',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    message: 'Operation successful',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    message: 'Be careful',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    message: 'Something went wrong',
  },
};

export const NotClosable: Story = {
  args: {
    variant: 'error',
    message: 'Critical error (cannot be dismissed)',
    closable: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-6 max-w-[600px] flex flex-col gap-4">
      <DialAlert variant="info" message="Info alert" />
      <DialAlert variant="success" message="Success alert" />
      <DialAlert variant="warning" message="Warning alert" />
      <DialAlert variant="error" message="Error alert" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A showcase of all alert variants (Info, Success, Warning, Error).',
      },
    },
  },
};
