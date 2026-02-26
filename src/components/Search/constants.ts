import { ElementSize } from '@/types/size';

export const SIZE_CONFIG = {
  [ElementSize.Small]: {
    className: 'dial-tiny-text',
    wrapperClassName: 'pl-2 py-0',
    containerClassName: 'h-[24px]',
    iconSize: 16,
    iconStroke: 1,
  },
  [ElementSize.Standard]: {
    className: 'dial-small-text',
    wrapperClassName: '',
    containerClassName: '',
    iconSize: 20,
    iconStroke: 1.5,
  },
};
