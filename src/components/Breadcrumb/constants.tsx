import type { ReactNode } from 'react';
import { IconChevronRight } from '@tabler/icons-react';

export const breadcrumbBaseClassName = 'w-full overflow-hidden';
export const breadcrumbListClassName =
  'flex flex-nowrap items-center gap-2 min-w-0 px-0 py-0 whitespace-nowrap';

export const breadcrumbItemBaseClassName =
  'flex items-center gap-2 min-w-0 shrink-0 dial-small';

export const breadcrumbItemVisibleClassName =
  'max-w-[20%] basis-[20%] flex-none';
export const breadcrumbItemLastClassName = 'flex-1 min-w-0';

export const breadcrumbLinkBaseClassName =
  'inline-flex items-center gap-1 min-w-0 transition-colors';

export const breadcrumbLinkInteractiveClassName =
  'text-secondary hover:text-accent-primary';

export const breadcrumbCurrentClassName = 'text-primary cursor-default';

export const breadcrumbSeparatorClassName =
  'flex-none inline-flex items-center leading-none text-secondary';

export const breadcrumbEllipsisButtonClassName =
  'items-center gap-1 min-w-0 transition-colors text-secondary hover:text-accent-primary';

export const defaultSeparator: ReactNode = (
  <IconChevronRight size={16} aria-hidden="true" />
);
