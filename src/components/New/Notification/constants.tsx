import { DialSpinner } from '@/components/Spinner/Spinner';
import { NotificationVariant } from '@/types/notification';
import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
  type ReactNode,
} from '@tabler/icons-react';

export const variantIcons = (props: {
  size: number;
  stroke: number;
}): Record<NotificationVariant, ReactNode> => ({
  info: <IconInfoCircleFilled size={props.size} />,
  error: <IconAlertCircleFilled size={props.size} />,
  warning: <IconAlertTriangleFilled size={props.size} />,
  success: <IconCircleCheckFilled size={props.size} />,
  loading: <DialSpinner size={props.size} />,
});

export const notificationVariantClassNameMap: Record<
  NotificationVariant,
  string
> = {
  [NotificationVariant.Info]: 'bg-info text-info',
  [NotificationVariant.Success]: 'bg-success text-success',
  [NotificationVariant.Warning]: 'bg-warning text-warning',
  [NotificationVariant.Error]: 'bg-error text-error',
  [NotificationVariant.Loading]: 'bg-layer-raised text-info',
};

/**
 * Live-region role per variant.
 *
 * `role="alert"` is implicitly `aria-live="assertive"`: it interrupts whatever a
 * screen reader is currently saying. That is right for a problem the user must
 * deal with, and wrong for routine feedback — an assertive info or success
 * message cuts the user off mid-sentence, and a section message rendered with
 * the page announces itself on mount even though nothing changed.
 * `role="status"` is polite and queues instead.
 */
export const notificationVariantRoleMap: Record<
  NotificationVariant,
  'alert' | 'status'
> = {
  [NotificationVariant.Info]: 'status',
  [NotificationVariant.Success]: 'status',
  [NotificationVariant.Warning]: 'alert',
  [NotificationVariant.Error]: 'alert',
  [NotificationVariant.Loading]: 'status',
};

export const alertBaseClassName =
  'items-center justify-between rounded-xl relative gap-3 p-3 border flex border-transparent';
