import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { ConfirmationPopupVariant } from '@/types/confirmation-popup';

export const actionsBaseClassName =
  'flex justify-end gap-2 px-6 py-4 border-t border-tertiary';

export const descriptionBaseClassName =
  'text-secondary dial-small-paragraph-text px-6 pb-4';

export const loaderContainerClassName = 'px-6 py-4 h-[120px]';

export const defaultCancelLabel = 'Cancel';

export const defaultConfirmLabel = 'Ok';

export const variantConfig: Record<
  ConfirmationPopupVariant,
  {
    confirm: {
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
  },
  [ConfirmationPopupVariant.Danger]: {
    confirm: {
      variant: ButtonVariant.Danger,
      appearance: ButtonAppearance.Solid,
    },
  },
};
