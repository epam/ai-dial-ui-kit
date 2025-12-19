import { ButtonVariant, ButtonAppearance } from '@/types/button';

export const variantClassMap: Record<ButtonVariant, Record<string, string>> = {
  [ButtonVariant.Primary]: {
    [ButtonAppearance.Solid]: 'dial-primary-solid-button',
    [ButtonAppearance.Ghost]: 'dial-primary-ghost-button',
    [ButtonAppearance.Link]: 'dial-primary-link-button',
  },

  [ButtonVariant.Neutral]: {
    [ButtonAppearance.Outlined]: 'dial-neutral-outlined-button',
  },

  [ButtonVariant.Error]: {
    [ButtonAppearance.Solid]: 'dial-error-solid-button',
    [ButtonAppearance.Ghost]: '',
  },

  [ButtonVariant.Success]: { [ButtonAppearance.Ghost]: '' },
  [ButtonVariant.Secondary]: {
    [ButtonAppearance.Ghost]: '',
  },
  [ButtonVariant.Tertiary]: { [ButtonAppearance.Ghost]: '' },
};
