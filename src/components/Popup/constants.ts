import { PopupSize } from '@/types/popup';

export const overlayBaseClasses =
  'z-[52] flex items-center justify-center bg-blackout md:p-4';

export const popupBaseClasses =
  'relative max-h-full rounded bg-layer-3 flex flex-col shadow w-full h-full md:h-auto';

export const popupDividerClasses = 'divide-tertiary divide-y';

export const popupHeaderClasses =
  'flex flex-row justify-between py-4 px-6 items-center';

export const popupSizeClassMap: Record<PopupSize, string> = {
  [PopupSize.Sm]: 'max-w-full md:max-w-[400px]',
  [PopupSize.Md]: 'max-w-full md:max-w-[800px]',
  [PopupSize.Lg]: 'max-w-full md:max-w-[1200px]',
};
