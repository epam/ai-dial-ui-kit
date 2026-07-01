import type { ReactNode } from 'react';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}
