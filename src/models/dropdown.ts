import type { ReactNode } from 'react';

export interface DropdownItemsModel {
  id: string;
  name: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
}

export enum DropdownType {
  Dropdown = 'dropdown',
  Menu = 'menu',
}
