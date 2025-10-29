import type { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
}
