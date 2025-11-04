import type { DropdownItemType } from '@/types/dropdown';
import type { ReactNode, MouseEvent } from 'react';

export interface DropdownItem {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  type?: DropdownItemType;
  onClick?: (info: {
    key: string;
    domEvent: MouseEvent<Element, MouseEvent>;
  }) => void;
}
