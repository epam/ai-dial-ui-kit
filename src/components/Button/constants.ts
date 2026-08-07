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

  [ButtonVariant.Danger]: {
    [ButtonAppearance.Solid]: 'dial-danger-solid-button',
    [ButtonAppearance.Ghost]: 'dial-danger-ghost-button',
    [ButtonAppearance.Outlined]: 'dial-danger-outlined-button',
  },

  [ButtonVariant.Success]: {
    [ButtonAppearance.Ghost]: 'dial-success-ghost-button',
  },
  [ButtonVariant.Secondary]: {
    [ButtonAppearance.Ghost]: 'dial-secondary-ghost-button',
  },
  [ButtonVariant.Tertiary]: {
    [ButtonAppearance.Ghost]: 'dial-tertiary-ghost-button',
  },
  [ButtonVariant.Static]: {},
};
