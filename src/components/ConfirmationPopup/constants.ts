import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';

export const actionsBaseClassName =
  'flex justify-end gap-2 px-6 py-4 border-t border-tertiary';

export const descriptionBaseClassName =
  'text-secondary dial-small-150 px-6 pb-4';

export const defaultCancelLabel = 'Cancel';

export const defaultConfirmLabel = 'Ok';

export const variantConfig: Record<
  ConfirmationPopupVariant,
  {
    container?: string;
    confirm?: {
      variant: ButtonVariant;
      appearance: ButtonAppearance;
    };
    confirmClassName?: string;
    cancel?: {
      variant: ButtonVariant;
      appearance: ButtonAppearance;
    };
  }
> = {
  [ConfirmationPopupVariant.Info]: {
    confirm: {
      variant: ButtonVariant.Primary,
      appearance: ButtonAppearance.Solid,
    },
    cancel: {
      variant: ButtonVariant.Neutral,
      appearance: ButtonAppearance.Outlined,
    },
  },
  [ConfirmationPopupVariant.Danger]: {
    container: 'dial-danger-popup',
    confirm: {
      variant: ButtonVariant.Danger,
      appearance: ButtonAppearance.Solid,
    },
    cancel: {
      variant: ButtonVariant.Neutral,
      appearance: ButtonAppearance.Outlined,
    },
  },
};
