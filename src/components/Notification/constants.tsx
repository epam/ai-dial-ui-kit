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
  [NotificationVariant.Info]: 'bg-info border-info text-info',
  [NotificationVariant.Success]: 'bg-success border-success text-success',
  [NotificationVariant.Warning]: 'bg-warning border-warning text-warning',
  [NotificationVariant.Error]: 'bg-error border-error text-error',
  [NotificationVariant.Loading]: 'bg-info border-info text-info',
  [NotificationVariant.General]: 'bg-sunken border-secondary text-primary',
};

export const alertBaseClassName =
  'items-center justify-between relative gap-3 p-3 border border-solid dial-small-text-150 rounded shadow flex';
