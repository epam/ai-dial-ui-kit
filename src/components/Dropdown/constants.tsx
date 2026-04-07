import classNames from 'classnames';
import { IconChevronRight } from '@tabler/icons-react';

export const dropdownBaseClassName = classNames(
  'flex items-center gap-2 align-middle',
  'h-auto px-0 bg-transparent border-0',
);

export const dropdownListBaseClassName = classNames(
  'z-[53] overflow-auto rounded bg-layer-0 text-primary shadow focus-visible:outline-none',
);

export const dropdownItemBaseClassName = classNames(
  'flex w-full cursor-pointer items-center gap-3',
  'focus-visible:border-none focus-visible:outline-none',
  'hover:bg-accent-primary-alpha px-3',
  'dial-small-text h-[34px] rounded text-primary',
);

export const dropdownItemDisabledClassName = 'opacity-75 !cursor-not-allowed';
export const dropdownItemDangerClassName = 'text-error';
export const dropdownDividerClassName =
  'my-1 border-t border-hover border-secondary';

export const dropdownGap = 4;

export const submenuCaretIcon = <IconChevronRight size={14} />;
