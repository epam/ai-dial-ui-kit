import { PopupSize } from '@/types/popup';

export const popupOverlayBaseClassName =
  'z-[52] flex items-center justify-center bg-backdrop md:p-4 gap-5 p-6';

export const popupBaseClassName =
  'relative flex w-full max-h-full flex-col rounded-xl bg-layer-raised md:h-auto';

export const popupHeaderClassName =
  'flex flex-row items-center justify-between px-6 py-4';

export const popupTitleClassName =
  'flex-1 min-w-0 mr-3 truncate dial-h1-text text-primary';

/** Rule under the header. Opt-in: by default sections are separated by spacing. */
export const popupHeaderDividerClassName = 'border-b border-tertiary';

export const popupFooterClassName =
  'flex flex-row items-center gap-2 px-6 py-4';

/** Rule above the footer, mirroring the header. */
export const popupFooterDividerClassName = 'border-t border-tertiary';

/** Groups the controls sitting on one side of the header or footer. */
export const popupActionsGroupClassName =
  'flex shrink-0 flex-row items-center gap-2';

/**
 * Max widths per size. Full width below the `md` breakpoint, where the popup
 * fills the screen.
 */
export const popupSizeClassMap: Record<PopupSize, string> = {
  [PopupSize.Sm]: 'max-w-full md:max-w-[400px]',
  [PopupSize.Md]: 'max-w-full md:max-w-[800px]',
  [PopupSize.Lg]: 'max-w-full md:max-w-[1200px]',
};
