import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';
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

const WithAccessibilityComponent: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <DialAlert
        variant={AlertVariant.Info}
        message="Polite announcement (default)"
        aria-live="polite"
        id="polite-alert"
      />
      <DialAlert
        variant={AlertVariant.Error}
        message="Assertive announcement for critical errors"
        aria-live="assertive"
        aria-atomic="true"
        id="assertive-alert"
      />
      <DialAlert
        variant={AlertVariant.Warning}
        message="Alert with custom ID"
        id="custom-alert"
      />
    </div>
  );
};

export const WithAccessibility: Story = {
  render: () => <WithAccessibilityComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Examples of alerts with enhanced accessibility attributes like `aria-live`, `aria-atomic`, and custom IDs.',
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
          'An interactive example showing multiple closable alerts that can be dismissed. Demonstrates state management and dynamic alert rendering.',
      },
    },
  },
};

const WithCustomHandlersComponent: FC = () => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <DialAlert
        variant={AlertVariant.Info}
        message={
          hovered ? 'Mouse is hovering over this alert!' : 'Hover over me'
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ transition: 'all 0.3s' }}
      />
      <DialAlert
        variant={AlertVariant.Success}
        message={
          clicked ? 'Alert was clicked!' : 'Click anywhere on this alert'
        }
        onClick={() => setClicked(true)}
        style={{ cursor: 'pointer' }}
      />
      {clicked && (
        <div className="text-secondary dial-small-text">
          ✓ Alert click event triggered
        </div>
      )}
    </div>
  );
};

export const WithCustomHandlers: Story = {
  render: () => <WithCustomHandlersComponent />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates using standard HTML event handlers like `onClick`, `onMouseEnter`, and `onMouseLeave` on alerts.',
      },
    },
  },
};

export const WithInlineStyles: Story = {
  args: {
    variant: AlertVariant.Warning,
    message: 'Alert with inline styles',
    style: {
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: '#423189',
      borderColor: '#6C5DD3',
      color: '#FFFFFF',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of using inline `style` prop to customize alert appearance.',
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
      <div className="text-primary mt-2">Customized</div>
      <DialAlert
        variant={AlertVariant.Info}
        iconSize={14}
        className="py-1 px-2 w-fit"
        message={
          <span className="dial-tiny-text">
            <b>Small</b> info alert
          </span>
        }
      />
      <DialAlert
        closable
        variant={AlertVariant.Error}
        message="Closable error alert"
      />
      <DialAlert
        variant={AlertVariant.Success}
        message="Alert with custom ID"
        id="success-notification"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of all alert variants with various configurations including custom IDs.',
      },
    },
  },
};
