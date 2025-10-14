import { ButtonVariant } from '@/types/button';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';

export const actionsBaseClasses = 'flex justify-end gap-2 px-6 py-4';

export const descriptionBaseClasses = 'text-secondary dial-small-150 px-6 py-4';

export const defaultCancelLabel = 'Cancel';

export const variantConfig: Record<
  ConfirmationPopupVariant,
  {
    container?: string;
    confirmVariant: ButtonVariant;
    confirmClass?: string;
    cancelVariant: ButtonVariant;
  }
> = {
  [ConfirmationPopupVariant.Info]: {
    confirmVariant: ButtonVariant.Primary,
    cancelVariant: ButtonVariant.Secondary,
  },
  [ConfirmationPopupVariant.Danger]: {
    container: 'dial-danger-popup',
    confirmVariant: ButtonVariant.Danger,
    cancelVariant: ButtonVariant.Secondary,
  },
};
