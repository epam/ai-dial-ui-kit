import { ButtonVariant } from '@/types/button';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';

export const actionsBaseClassName = 'flex justify-end gap-2 px-6 py-4';

export const descriptionBaseClassName =
  'text-secondary dial-small-150 px-6 py-4';

export const defaultCancelLabel = 'Cancel';

export const defaultConfirmLabel = 'Ok';

export const variantConfig: Record<
  ConfirmationPopupVariant,
  {
    container?: string;
    confirmVariant: ButtonVariant;
    confirmClassName?: string;
    cancelVariant: ButtonVariant;
  }
> = {
  [ConfirmationPopupVariant.Info]: {
    confirmVariant: ButtonVariant.Primary,
    cancelVariant: ButtonVariant.Secondary,
  },
  [ConfirmationPopupVariant.Danger]: {
    // TODO: rename to Error after implement Design system changes
    container: 'dial-danger-popup',
    confirmVariant: ButtonVariant.Error,
    cancelVariant: ButtonVariant.Secondary,
  },
};
