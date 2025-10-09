import type { DropdownItemType } from '@/types/dropdown';
import type { ReactNode } from 'react';

export interface DropdownItem {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  type?: DropdownItemType;
  onClick?: (info: {
    key: string;
    domEvent: React.MouseEvent<Element, MouseEvent>;
  }) => void;
}
