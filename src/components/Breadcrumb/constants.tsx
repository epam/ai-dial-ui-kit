import type { ReactNode } from 'react';
import { IconChevronRight } from '@tabler/icons-react';

export const breadcrumbBaseClasses = 'w-full overflow-x-auto';
export const breadcrumbListClasses =
  'flex flex-nowrap items-center gap-2 min-w-0 px-0 py-0 whitespace-nowrap';

export const breadcrumbItemBaseClasses =
  'flex items-center gap-2 min-w-0 shrink-0 dial-small';

export const breadcrumbLinkBaseClasses =
  'inline-flex items-center gap-1 min-w-0 transition-colors';

export const breadcrumbLinkInteractiveClasses =
  'text-secondary hover:text-accent-primary';

export const breadcrumbCurrentClasses = 'text-primary cursor-default';

export const breadcrumbSeparatorClasses =
  'flex-none inline-flex items-center leading-none text-icon-secondary';

export const defaultSeparator: ReactNode = (
  <IconChevronRight size={16} aria-hidden="true" />
);
