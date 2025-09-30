import { AlertVariant } from '@/types/alert';
import type { ReactNode } from 'react';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react';

export const variantIcons: Record<AlertVariant, ReactNode> = {
  info: <IconInfoCircle size={24} />,
  error: <IconAlertCircle size={24} />,
  warning: <IconAlertTriangle size={24} />,
  success: <IconCircleCheck size={24} />,
};

export const alertVariantClassMap: Record<AlertVariant, string> = {
  [AlertVariant.Info]: 'bg-info border-info text-info',
  [AlertVariant.Success]: 'bg-success border-success text-success',
  [AlertVariant.Warning]: 'bg-warning border-warning text-warning',
  [AlertVariant.Error]: 'bg-error border-error text-error',
};

export const alertBaseClasses =
  'inline-flex items-center justify-between gap-2 px-3 py-2 border border-solid shadow text-sm w-auto rounded';
