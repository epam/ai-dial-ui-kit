import type { FC } from 'react';

import {
  NotificationType,
  NotificationVariant,
} from '../../../types/notification';
import { Notification, type NotificationProps } from './Notification';

type NotificationVariantProps = Omit<NotificationProps, 'variant'>;

const NotificationVariantCreator = (
  variant: NotificationVariant,
  defaultType: NotificationType,
): FC<NotificationVariantProps> => {
  const Wrapper: FC<NotificationVariantProps> = ({ type, ...props }) => {
    return (
      <Notification {...props} variant={variant} type={type || defaultType} />
    );
  };
  return Wrapper;
};

type NotificationTypeProps = Omit<NotificationProps, 'type'>;

const NotificationTypeCreator = (
  type: NotificationType,
  defaultVariant: NotificationVariant,
): FC<NotificationTypeProps> => {
  const Wrapper: FC<NotificationTypeProps> = ({ variant, ...props }) => {
    return (
      <Notification
        {...props}
        variant={variant || defaultVariant}
        type={type}
      />
    );
  };
  return Wrapper;
};

export const ErrorToastNotification = NotificationVariantCreator(
  NotificationVariant.Error,
  NotificationType.Toast,
);

export const InfoToastNotification = NotificationVariantCreator(
  NotificationVariant.Info,
  NotificationType.Toast,
);

export const SuccessToastNotification = NotificationVariantCreator(
  NotificationVariant.Success,
  NotificationType.Toast,
);

export const WarningToastNotification = NotificationVariantCreator(
  NotificationVariant.Warning,
  NotificationType.Toast,
);

export const LoadingToastNotification = NotificationVariantCreator(
  NotificationVariant.Loading,
  NotificationType.Toast,
);

export const ErrorSectionMessageNotification = NotificationTypeCreator(
  NotificationType.SectionMessage,
  NotificationVariant.Error,
);

export const InfoSectionMessageNotification = NotificationTypeCreator(
  NotificationType.SectionMessage,
  NotificationVariant.Info,
);

export const SuccessSectionMessageNotification = NotificationTypeCreator(
  NotificationType.SectionMessage,
  NotificationVariant.Success,
);

export const WarningSectionMessageNotification = NotificationTypeCreator(
  NotificationType.SectionMessage,
  NotificationVariant.Warning,
);

export const LoadingSectionMessageNotification = NotificationTypeCreator(
  NotificationType.SectionMessage,
  NotificationVariant.Loading,
);
