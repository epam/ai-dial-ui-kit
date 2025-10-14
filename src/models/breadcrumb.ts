import type { ReactNode, MouseEvent } from 'react';

export interface DialBreadcrumbPathItem {
  title: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  cssClass?: string;
  iconBefore?: ReactNode;
}
