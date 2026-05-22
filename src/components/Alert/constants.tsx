import { DialSpinner } from '@/components/Spinner/Spinner';
import { AlertVariant } from '@/types/alert';
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
}): Record<AlertVariant, ReactNode> => ({
  info: <IconInfoCircleFilled size={props.size} />,
  error: <IconAlertCircleFilled size={props.size} />,
  warning: <IconAlertTriangleFilled size={props.size} />,
  success: <IconCircleCheckFilled size={props.size} />,
  loading: <DialSpinner size={props.size} />,
});

export const alertVariantClassNameMap: Record<AlertVariant, string> = {
  [AlertVariant.Info]: 'bg-info border-info text-info',
  [AlertVariant.Success]: 'bg-success border-success text-success',
  [AlertVariant.Warning]: 'bg-warning border-warning text-warning',
  [AlertVariant.Error]: 'bg-error border-error text-error',
  [AlertVariant.Loading]: 'bg-info border-info text-info',
};

export const alertBaseClassName =
  'items-center justify-between gap-3 p-3 border border-solid dial-small-text-150 rounded shadow flex';
