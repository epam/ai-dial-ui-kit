import type { ReactNode } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { DIAL_ICON_SIZE } from '@/constants/icon';

export const breadcrumbBaseClassName = 'w-full overflow-hidden';
export const breadcrumbListClassName =
  'flex flex-nowrap items-center gap-2 min-w-0 px-0 py-0 whitespace-nowrap';

export const breadcrumbItemBaseClassName =
  'flex items-center gap-2 min-w-0 shrink dial-small-text';

export const breadcrumbItemWidthClassName: Record<
  'first' | 'middle' | 'last',
  string
> = {
  first: '',
  middle: 'max-w-[30%]',
  last: 'max-w-[51%]',
};

export const breadcrumbLinkBaseClassName =
  'flex flex-1 items-center gap-1 min-w-0 transition-colors';

export const breadcrumbLinkInteractiveClassName =
  'text-secondary hover:text-accent-primary';

export const breadcrumbCurrentClassName = 'text-primary cursor-default';

export const breadcrumbSeparatorClassName =
  'flex-none inline-flex items-center leading-none text-secondary';

export const breadcrumbEllipsisButtonClassName =
  'items-center gap-1 min-w-0 transition-colors text-secondary hover:text-accent-primary';

export const defaultSeparator: ReactNode = (
  <IconChevronRight size={DIAL_ICON_SIZE.SM} aria-hidden="true" />
);
