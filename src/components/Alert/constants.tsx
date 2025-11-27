import { AlertVariant } from '@/types/alert';
import type { ReactNode } from 'react';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react';

export const variantIcons: Record<AlertVariant, ReactNode> = {
  info: <IconInfoCircle size={24} stroke={2} />,
  error: <IconAlertCircle size={24} stroke={2} />,
  warning: <IconAlertTriangle size={24} stroke={2} />,
  success: <IconCircleCheck size={24} stroke={2} />,
};

export const alertVariantClassNameMap: Record<AlertVariant, string> = {
  [AlertVariant.Info]: 'bg-info border-info text-info',
  [AlertVariant.Success]: 'bg-success border-success text-success',
  [AlertVariant.Warning]: 'bg-warning border-warning text-warning',
  [AlertVariant.Error]: 'bg-error border-error text-error',
};

export const alertBaseClassName =
  'items-center justify-between gap-2 p-3 border border-solid dial-small-150 rounded flex';
