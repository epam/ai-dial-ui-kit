import { AlertVariant } from '@/types/alert';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  type ReactNode,
} from '@tabler/icons-react';

export const variantIcons = (props: {
  size: number;
  stroke: number;
}): Record<AlertVariant, ReactNode> => ({
  info: <IconInfoCircle {...props} />,
  error: <IconAlertCircle {...props} />,
  warning: <IconAlertTriangle {...props} />,
  success: <IconCircleCheck {...props} />,
});

export const alertVariantClassNameMap: Record<AlertVariant, string> = {
  [AlertVariant.Info]: 'bg-info border-info text-info',
  [AlertVariant.Success]: 'bg-success border-success text-success',
  [AlertVariant.Warning]: 'bg-warning border-warning text-warning',
  [AlertVariant.Error]: 'bg-error border-error text-error',
};

export const alertBaseClassName =
  'items-center justify-between gap-2 p-3 border border-solid dial-small-150 rounded flex';
