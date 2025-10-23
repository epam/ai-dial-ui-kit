import classNames from 'classnames';
import { IconChevronRight } from '@tabler/icons-react';

export const dropdownBaseClasses = classNames(
  'flex items-center gap-2 align-middle',
  'h-auto px-0 bg-transparent border-0',
);

export const dropdownListBaseClasses = classNames(
  'z-[53] overflow-auto rounded bg-layer-0 text-primary shadow focus-visible:outline-none',
  'w-max',
);

export const dropdownItemBaseClasses = classNames(
  'flex w-full cursor-pointer items-center gap-3',
  'focus-visible:border-none focus-visible:outline-none',
  'hover:bg-accent-primary-alpha px-3',
  'dial-small h-[34px] rounded text-primary',
);

export const dropdownItemDisabledClasses = 'opacity-75 !cursor-not-allowed';
export const dropdownItemDangerClasses = 'text-error';
export const dropdownDividerClasses =
  'my-1 border-t border-hover border-secondary';

export const dropdownGap = 8;

export const submenuCaretIcon = <IconChevronRight size={14} />;
