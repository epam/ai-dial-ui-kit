import { IconChevronDown } from '@tabler/icons-react';

export const selectTriggerBaseClasses =
  'dial-input flex w-full items-center justify-between gap-2 dial-small';

export const selectOverlayBaseClasses = 'w-full rounded flex flex-col';

export const selectOptionBaseClasses =
  'flex w-full items-center justify-between gap-2 px-3 h-[34px] dial-small text-primary truncate hover:bg-accent-primary-alpha focus:bg-accent-primary-alpha focus:outline-none';

export const selectOptionSelectedClasses = 'bg-accent-primary-alpha';

export const selectOptionSingleSelectedClasses =
  'bg-accent-primary-alpha border-l border-accent-primary border-1';

export const selectOptionDisabledClasses = 'opacity-75';
export const dropdownMenuMaxHeight = 352;
export const selectChevronIcon = <IconChevronDown size={16} />;
