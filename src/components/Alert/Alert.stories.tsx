import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAlert, type DialAlertProps } from './Alert';
import { AlertVariant } from '@/types/alert';

const meta = {
  title: 'Components/Alert',
  component: DialAlert,
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
    variant: AlertVariant.Info,
    message: 'This is an info alert',
    closable: false,
    fullWidth: true,
  },
} satisfies Meta<DialAlertProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: AlertVariant.Info, message: 'Information alert' },
};

export const Success: Story = {
  args: { variant: AlertVariant.Success, message: 'Operation successful' },
};

export const Warning: Story = {
  args: { variant: AlertVariant.Warning, message: 'Be careful' },
};

export const Error: Story = {
  args: { variant: AlertVariant.Error, message: 'Something went wrong' },
};

export const Closable: Story = {
  args: {
    variant: AlertVariant.Success,
    message: 'Closable alert example',
    closable: true,
    onClose: (e) => alert('Alert closed! Event: ' + e.type),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4">
      <DialAlert variant={AlertVariant.Info} message="Info alert" />
      <DialAlert variant={AlertVariant.Success} message="Success alert" />
      <DialAlert variant={AlertVariant.Warning} message="Warning alert" />
      <DialAlert variant={AlertVariant.Error} message="Error alert" />
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
