import { PopupSize } from '@/types/popup';

export const popupOverlayBaseClassName =
  'z-[52] flex items-center justify-center bg-backdrop md:p-4 gap-5 p-6';

export const popupBaseClassName =
  'relative flex w-full max-h-full flex-col rounded-xl bg-layer-raised md:h-auto';

export const popupHeaderClassName =
  'flex flex-row items-center justify-between px-6 py-4';

export const popupTitleClassName =
  'flex-1 min-w-0 mr-3 truncate dial-h1-text text-primary';

/**
 * Max widths per size. Full width below the `md` breakpoint, where the popup
 * fills the screen.
 */
export const popupSizeClassMap: Record<PopupSize, string> = {
  [PopupSize.Sm]: 'max-w-full md:max-w-[400px]',
  [PopupSize.Md]: 'max-w-full md:max-w-[800px]',
  [PopupSize.Lg]: 'max-w-full md:max-w-[1200px]',
};
