import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';
import { AlertVariant } from '@/types/alert';
import { DialAlert, type DialAlertProps } from './Alert';

const meta = {
  title: 'DIAL/Elements/Alert',
  component: DialAlert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A contextual feedback component for displaying important messages with optional close button. Supports all standard HTML div attributes for enhanced accessibility.',
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
        AlertVariant.Loading,
      ],
      description: 'Defines the visual style and icon of the alert',
    },
    title: {
      control: { type: 'text' },
      description: 'Optional heading displayed above the message in semibold',
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

export const AllVariants: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4">
      <DialAlert variant={AlertVariant.Info} message="Info alert" />
      <DialAlert variant={AlertVariant.Warning} message="Warning alert" />
      <DialAlert variant={AlertVariant.Error} message="Error alert" />
      <DialAlert variant={AlertVariant.Success} message="Success alert" />
      <DialAlert variant={AlertVariant.Loading} message="Loading alert" />

      <div className="text-primary mt-2">With title + message</div>
      <DialAlert
        variant={AlertVariant.Info}
        title="Info"
        message="This is an informational message."
        closable
      />
      <DialAlert
        variant={AlertVariant.Warning}
        title="Warning"
        message="This is a warning message."
        closable
      />

      <DialAlert
        variant={AlertVariant.Error}
        title="Error"
        message="This is an error message."
        closable
      />

      <DialAlert
        variant={AlertVariant.Success}
        title="Success"
        message="This is a success message."
        closable
      />
      <DialAlert
        variant={AlertVariant.Loading}
        title="Loading"
        message="Loading data, please wait..."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of all alert variants including the Loading variant and title+message layout.',
      },
    },
  },
};

export const LongMessage: Story = {
  args: {
    variant: AlertVariant.Warning,
    message:
      "This is a long alert message that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly.",
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

const InteractiveComponent: FC = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, variant: AlertVariant.Info, message: 'First alert' },
    { id: 2, variant: AlertVariant.Success, message: 'Second alert' },
    { id: 3, variant: AlertVariant.Warning, message: 'Third alert' },
  ]);

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-secondary dial-small-text mb-2">
        Click close buttons to remove alerts
      </div>
      {alerts.map((alert) => (
        <DialAlert
          key={alert.id}
          variant={alert.variant}
          message={alert.message}
          closable
          onClose={() => removeAlert(alert.id)}
        />
      ))}
      {alerts.length === 0 && (
        <div className="text-secondary dial-small-text">All alerts closed</div>
      )}
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'An interactive example showing multiple closable alerts that can be dismissed.',
      },
    },
  },
};
