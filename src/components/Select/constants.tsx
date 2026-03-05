import { DIAL_ICON_SIZE } from '@/constants/icon';
import { IconChevronDown } from '@tabler/icons-react';

export const selectTriggerBaseClassName =
  'dial-input flex w-full items-center justify-between gap-2 dial-small cursor-pointer';

export const selectOverlayBaseClassName = 'w-full rounded flex flex-col';

export const selectOptionBaseClassName =
  'flex w-full items-center justify-between gap-2 px-3 h-[34px] dial-small text-primary truncate hover:bg-accent-primary-alpha focus:bg-accent-primary-alpha focus:outline-none';

export const selectOptionSelectedClassName = 'bg-accent-primary-alpha';

export const selectOptionSingleSelectedClassName =
  'bg-accent-primary-alpha border-l border-accent-primary border-1';

export const selectOptionDisabledClassName = 'opacity-75';
export const dropdownMenuMaxHeight = 352;
export const selectChevronIcon = <IconChevronDown size={DIAL_ICON_SIZE.SM} />;
