import { SearchSize } from '@/types/search';

export const SIZE_CONFIG = {
  [SearchSize.Small]: {
    textClass: 'text-xs px-1',
    containerClassName: 'px-[6px] py-1 h-[22px]',
    iconSize: 10,
    iconStroke: 1,
  },
  [SearchSize.Base]: {
    textClass: 'text-sm px-2',
    containerClassName: 'px-3 py-2 h-[38px]',
    iconSize: 18,
    iconStroke: 1.5,
  },
};
