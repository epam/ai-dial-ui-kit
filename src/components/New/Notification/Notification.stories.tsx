import { Button } from '@/components/New/Button/Button';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { NotificationVariant } from '@/types/notification';
import { ElementSize } from '@/types/size';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification, type NotificationProps } from './Notification';
import {
  ErrorMessageNotification,
  ErrorToastNotification,
  GeneralMessageNotification,
  GeneralToastNotification,
  InfoMessageNotification,
  InfoToastNotification,
  LoadingMessageNotification,
  LoadingToastNotification,
  SuccessMessageNotification,
  SuccessToastNotification,
  WarningMessageNotification,
  WarningToastNotification,
} from './NotificationWrapper';

const meta = {
  title: 'Components_2_0/Notification',
  component: Notification,
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
        NotificationVariant.Info,
        NotificationVariant.Success,
        NotificationVariant.Warning,
        NotificationVariant.Error,
        NotificationVariant.Loading,
        NotificationVariant.General,
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
    action: {
      control: false,
      description:
        'Optional control rendered at the inline end, after the text and before the close button',
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
    variant: NotificationVariant.Info,
    message: 'This is an info alert',
    closable: false,
  },
} satisfies Meta<NotificationProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4">
      <div className=" flex flex-col gap-4">
        <p className="dial-small-semi-text">Toast Notifications</p>
        <InfoToastNotification
          title="Info"
          message="This is an info toast notification"
          closable
        />
        <WarningToastNotification
          title="Warning"
          message="This is a warning toast notification"
          closable
        />
        <ErrorToastNotification
          title="Error"
          message="This is an error toast notification"
          closable
        />
        <SuccessToastNotification
          title="Success"
          message="This is a success toast notification"
          closable
        />
        <LoadingToastNotification
          title="Loading"
          message="This is a loading toast notification"
          closable
        />
        <GeneralToastNotification
          title="General"
          message="This is a general toast notification"
          closable
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="dial-small-semi-text">Section message</p>

        <InfoMessageNotification
          title="Info"
          message="This is an info section message notification"
        />
        <InfoMessageNotification
          title="Info"
          message="This is a long info section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />
        <WarningMessageNotification
          title="Warning"
          message="This is a warning section message notification"
        />

        <WarningMessageNotification
          title="Warning"
          message="This is a long warning section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />
        <SuccessMessageNotification
          title="Success"
          message="This is a success section message notification"
        />

        <SuccessMessageNotification
          title="Success"
          message="This is a long success section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />

        <ErrorMessageNotification
          title="Error"
          message="This is an error section message notification"
        />

        <ErrorMessageNotification
          title="Error"
          message="This is a long error section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />

        <LoadingMessageNotification
          title="Loading"
          message="This is a loading section message notification"
        />
        <LoadingMessageNotification
          title="Loading"
          message="This is a long loading section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />
        <GeneralMessageNotification
          title="General"
          message="This is a general section message notification"
        />
        <GeneralMessageNotification
          title="General"
          message="This is a long general section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />
      </div>
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

export const General: Story = {
  render: () => (
    <div className="p-6 grid gap-4 md:grid-cols-2">
      <GeneralMessageNotification
        title="Title"
        message="Description text example"
      />
      {/* Same variant with the message stacked under the title instead of inline. */}
      <GeneralMessageNotification
        title="Title"
        message="Description text example"
        textClassName="flex-col"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The neutral `general` variant, shown with the message inline with the title (default for a section message) and stacked under it via `textClassName`.',
      },
    },
  },
};

export const WithAction: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4 max-w-[600px]">
      <ErrorMessageNotification
        title="Couldn't finish this response"
        message="Something went wrong while generating the response. Try again in a moment."
        action={
          <Button
            variant={ButtonVariant.Neutral}
            appearance={ButtonAppearance.Outlined}
            size={ElementSize.Small}
            label="Try again"
          />
        }
      />
      <InfoToastNotification
        message="A new version is available"
        action={
          <Button
            variant={ButtonVariant.Neutral}
            appearance={ButtonAppearance.Outlined}
            size={ElementSize.Small}
            label="Reload"
          />
        }
        closable
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`action` places a control at the inline end of the notification, after the text and before the close button, vertically centred against the text. Pass a small button with a visible label; it flips sides with the document direction.',
      },
    },
  },
};

export const ClosableLineCount: Story = {
  render: () => (
    <div className="p-6 flex flex-col gap-4 max-w-[600px]">
      <SuccessToastNotification message="Successfully logged out" closable />
      <SuccessToastNotification
        title="File downloaded successfully"
        message="dial-report-2026-09.csv is in your Downloads folder"
        closable
      />
      <InfoToastNotification
        title="Successful login"
        message="This is a long toast message that wraps onto several lines so the close button can be checked against a tall notification. The button stays on the first line, opposite the variant icon, however far the text runs."
        closable
      />
      <ErrorMessageNotification
        title="Error"
        message="A closable section message that wraps onto multiple lines, so the close button is checked outside the toast layout too."
        closable
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The close button across one, two and many lines. It sits on the first line next to the variant icon rather than drifting as the message grows — the layout that Issue #880 reported broken for multi-line toasts.',
      },
    },
  },
};
