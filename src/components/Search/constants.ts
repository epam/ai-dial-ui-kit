import { ElementSize } from '@/types/size';

export const SIZE_CONFIG: Record<
  ElementSize,
  {
    className: string;
    wrapperClassName: string;
    containerClassName: string;
    iconSize: number;
    iconStroke: number;
  }
> = {
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
  [ElementSize.Large]: {
    className: '',
    wrapperClassName: '',
    containerClassName: '',
    iconSize: 0,
    iconStroke: 0,
  },
};
