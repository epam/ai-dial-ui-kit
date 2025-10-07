import classNames from 'classnames';

export const menuItemClassNames = classNames(
  'flex w-full cursor-pointer items-center gap-3 focus-visible:border-none focus-visible:outline-none',
  'hover:bg-accent-primary-alpha pl-3 border-l-2',
);

export const dropdownMenuClassNames = classNames(
  'z-[53] overflow-auto rounded bg-layer-0 text-primary shadow focus-visible:outline-none',
);

export const checkboxClassNames = classNames(
  'block w-[18px] h-[18px]',
  'border border-solid border-hover shadow-none',
  'bg-transparent',
);

export const ALL_ID = 'ALL';
