import type { ReactNode } from 'react';

export enum DropdownItemType {
  Item = 'item',
  Divider = 'divider',
}

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
