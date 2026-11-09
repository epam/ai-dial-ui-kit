import { Spinner } from '@/components/Spinner/Spinner';
import { NotificationVariant } from '@/types/notification';
import {
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
  IconCheck,
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
  loading: <Spinner size={props.size} />,
  general: <IconCheck size={props.size} stroke={props.stroke} />,
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
  [NotificationVariant.General]: 'bg-layer-sunken text-primary',
};

/** Surface classes for `NotificationSurface.Neutral`, whatever the variant. */
export const notificationNeutralSurfaceClassName =
  'bg-layer-sunken text-primary';

/**
 * Icon colour per variant on `NotificationSurface.Neutral`.
 *
 * On the variant surface the icon inherits the container's text colour. The
 * neutral surface sets primary text, so the icon names its status colour
 * itself; `warning` uses the dedicated `text-warning-icon` token, as the design
 * does for a warning triangle outside a warning surface.
 */
export const notificationNeutralSurfaceIconClassNameMap: Record<
  NotificationVariant,
  string
> = {
  [NotificationVariant.Info]: 'text-info',
  [NotificationVariant.Success]: 'text-success',
  [NotificationVariant.Warning]: 'text-warning-icon',
  [NotificationVariant.Error]: 'text-error',
  [NotificationVariant.Loading]: 'text-info',
  [NotificationVariant.General]: 'text-primary',
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
  [NotificationVariant.General]: 'status',
};

export const alertBaseClassName =
  'items-center justify-between rounded-xl relative gap-3 p-3 border flex border-transparent';
