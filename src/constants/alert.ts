import { AlertVariant } from '@/types/alert';

export const alertVariantClassMap: Record<AlertVariant, string> = {
  [AlertVariant.Info]: 'bg-info border-info text-info',
  [AlertVariant.Success]: 'bg-success border-success text-success',
  [AlertVariant.Warning]: 'bg-warning border-warning text-warning',
  [AlertVariant.Error]: 'bg-error border-error text-error',
};
