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
    container?: string;
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
    // Utilities rather than the legacy `.dial-danger-popup` SCSS rule, which is
    // scoped as `div .dial-danger-popup` and only lands by accident of nesting.
    container: 'border-t-4 border-error',
    confirm: {
      variant: ButtonVariant.Danger,
      appearance: ButtonAppearance.Solid,
    },
  },
};
