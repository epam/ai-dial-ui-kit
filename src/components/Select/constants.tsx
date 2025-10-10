// Select/constants.tsx
import type { ReactNode } from 'react';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export const selectTriggerBaseClasses =
  'dial-input flex px-3 py-2 w-full items-center justify-between gap-2 h-auto';

export const selectOverlayBaseClasses = 'w-fit rounded bg-surface';

export const selectOptionBaseClasses =
  'flex w-full items-center justify-between gap-2 px-3 h-[34px] dial-small text-primary hover:bg-accent-primary-alpha focus:bg-accent-primary-alpha focus:outline-none';

export const selectOptionSelectedClasses = 'bg-accent-primary-alpha';

export const selectOptionSingleSelectedClasses =
  'bg-accent-primary-alpha border-l border-accent-primary border-1';

export const selectOptionDisabledClasses = 'opacity-75';

export const selectTagBaseClasses =
  'flex items-center gap-1 rounded-full border border-secondary px-2 py-0.5 text-xs text-primary border-1 rounded bg-layer-2 border-primary';

export const selectChevronIcon = <IconChevronDown size={16} />;
export const selectCheckIcon = <IconCheck size={16} />;
