import type { DropdownItemType } from '@/types/dropdown';
import type { ReactNode, MouseEvent } from 'react';

export interface DropdownItem {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  type?: DropdownItemType;
  className?: string;
  onClick?: (info: { key: string; domEvent: MouseEvent }) => void;
  children?: DropdownItem[];
}
