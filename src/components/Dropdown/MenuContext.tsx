import type { Dispatch, HTMLProps, SetStateAction } from 'react';
import { createContext } from 'react';

export const MenuContext = createContext<{
  getItemProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  setHasFocusInside: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean | undefined;
}>({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => ({}),
  setHasFocusInside: () => ({}),
  isOpen: false,
});
