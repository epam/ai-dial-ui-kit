import type { ReactNode } from 'react';

export interface TabModel {
  id: string;
  label: ReactNode;
  invalid?: boolean;
  warning?: boolean;
  disabled?: boolean;
}
