import type { ReactNode, MouseEvent } from 'react';

export interface DialBreadcrumbPathItem {
  label: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  className?: string;
  iconBefore?: ReactNode;
}
