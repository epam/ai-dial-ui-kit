import type { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  /**
   * Custom node rendered in place of `label` in the option list, trigger and
   * submenu. `label` is still used for filtering/search matching and as the
   * accessible name, so keep it as a plain-text representation of `labelNode`.
   */
  labelNode?: ReactNode;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  children?: SelectOption[];
}
