import type { ReactNode } from 'react';

export interface TabModel {
  id: string;
  label: string | ReactNode;
  invalid?: boolean;
  disabled?: boolean;
}
