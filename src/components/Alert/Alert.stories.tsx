import type { Meta, StoryObj } from '@storybook/react-vite';
import { DialAlert, type DialAlertProps } from './Alert';
import { AlertVariant } from '@/types/alert';

const meta = {
  title: 'Feedback/Alert',
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
      options: [
        AlertVariant.Info,
        AlertVariant.Success,
        AlertVariant.Warning,
        AlertVariant.Error,
      ],
      description: 'Defines the visual style and icon of the alert',
    },
    message: {
      control: { type: 'text' },
      description: 'Message text displayed inside the alert',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes applied to the alert container',
    },
    closable: {
      control: { type: 'boolean' },
      description: 'Whether the close button should be shown',
    },
    iconSize: {
      control: { type: 'number' },
      description: 'Size of the icon displayed in the alert',
    },
    iconStroke: {
      control: { type: 'number' },
      description: 'Stroke width of the icon displayed in the alert',
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

export const LongMessage: Story = {
  args: {
    variant: AlertVariant.Warning,
    message:
      'This is a long alert message that should wrap onto multiple lines to demonstrate the alert’s behavior with longer text content. Please pay attention to how the layout adjusts accordingly.',
    closable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'An example of an alert with a long message that wraps onto multiple lines.',
      },
    },
  },
};

export const CustomClass: Story = {
  args: {
    variant: AlertVariant.Info,
    message: (
      <span>
        Alert with <span className="italic">custom CSS class</span>
      </span>
    ),
    iconSize: 12,
    iconStroke: 1,
    className: 'py-1 px-2 border-dashed dial-tiny-sensory w-[250px] bg-layer-2',
  },
  parameters: {
    docs: {
      description: {
        story:
          'An example of an alert with a custom CSS class applied to change its border style.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4">
      <DialAlert variant={AlertVariant.Info} message="Info alert" />
      <DialAlert variant={AlertVariant.Success} message="Success alert" />
      <DialAlert variant={AlertVariant.Warning} message="Warning alert" />
      <DialAlert variant={AlertVariant.Error} message="Error alert" />
      <div className="dial-caption text-primary">Additional</div>
      <DialAlert
        variant={AlertVariant.Info}
        iconSize={14}
        className="py-1 px-2 w-fit"
        message={
          <span className="dial-tiny">
            <b>Customized</b> to be smaller Info alert
          </span>
        }
      />
      <DialAlert
        closable
        variant={AlertVariant.Error}
        message="Closable error alert"
      />
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
