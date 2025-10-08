import { PopupSize } from '@/types/popup';

export const overlayBaseClasses =
  'z-[52] flex items-center justify-center bg-blackout md:p-4';

export const popupDividerClasses = 'divide-tertiary divide-y';

export const popupHeaderClasses =
  'flex flex-row justify-between py-4 px-6 items-center';

export const popupSizeClassMap: Record<PopupSize, string> = {
  [PopupSize.Sm]: 'dial-sm-popup',
  [PopupSize.Md]: 'dial-md-popup',
  [PopupSize.Lg]: 'dial-lg-popup',
};
