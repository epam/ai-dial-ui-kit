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

export const alertBaseClassName =
  'items-center justify-between rounded-xl relative gap-3 p-3 border border-secondary flex';
