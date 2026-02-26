import { SearchSize } from '@/types/search';

export const SIZE_CONFIG = {
  [SearchSize.Small]: {
    className: 'dial-tiny-text',
    containerClassName: 'h-[22px]',
    iconSize: 16,
    iconStroke: 1,
  },
  [SearchSize.Standard]: {
    className: 'dial-small-text',
    containerClassName: '',
    iconSize: 20,
    iconStroke: 1.5,
  },
};
