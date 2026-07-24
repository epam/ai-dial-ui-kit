import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type FC } from 'react';
import { NotificationVariant } from '@/types/notification';
import { Notification, type NotificationProps } from './Notification';
import {
  ErrorSectionMessageNotification,
  ErrorToastNotification,
  InfoSectionMessageNotification,
  InfoToastNotification,
  LoadingSectionMessageNotification,
  LoadingToastNotification,
  SuccessSectionMessageNotification,
  SuccessToastNotification,
  WarningSectionMessageNotification,
  WarningToastNotification,
} from './NotificationWrapper';

const meta = {
  title: 'Components/Notification',
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
      </div>
      <div className="flex flex-col gap-4">
        <p className="dial-small-semi-text">Section message</p>

        <InfoSectionMessageNotification
          title="Info"
          message="This is an info section message notification"
        />
        <InfoSectionMessageNotification
          title="Info"
          message="This is a long info section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />
        <WarningSectionMessageNotification
          title="Warning"
          message="This is a warning section message notification"
        />

        <WarningSectionMessageNotification
          title="Warning"
          message="This is a long warning section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />
        <SuccessSectionMessageNotification
          title="Success"
          message="This is a success section message notification"
        />

        <SuccessSectionMessageNotification
          title="Success"
          message="This is a long success section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />

        <ErrorSectionMessageNotification
          title="Error"
          message="This is an error section message notification"
        />

        <ErrorSectionMessageNotification
          title="Error"
          message="This is a long error section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
        />

        <LoadingSectionMessageNotification
          title="Loading"
          message="This is a loading section message notification"
        />
        <LoadingSectionMessageNotification
          title="Loading"
          message="This is a long loading section message notification that should wrap onto multiple lines to demonstrate the alert's behavior with longer text content. Please pay attention to how the layout adjusts accordingly."
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
