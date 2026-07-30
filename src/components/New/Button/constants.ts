import { ButtonVariant, ButtonAppearance } from '@/types/button';

export const variantClassMap: Record<ButtonVariant, Record<string, string>> = {
  [ButtonVariant.Primary]: {
    [ButtonAppearance.Solid]: 'dial-kit-primary-solid-button',
    [ButtonAppearance.Ghost]: 'dial-kit-primary-ghost-button',
    [ButtonAppearance.Link]: 'dial-kit-primary-link-button',
  },

  [ButtonVariant.Neutral]: {
    [ButtonAppearance.Solid]: 'dial-kit-neutral-solid-button',
    [ButtonAppearance.Outlined]: 'dial-kit-neutral-outlined-button',
  },

  [ButtonVariant.Danger]: {
    [ButtonAppearance.Solid]: 'dial-kit-danger-solid-button',
    [ButtonAppearance.Ghost]: 'dial-kit-danger-ghost-button',
    [ButtonAppearance.Outlined]: 'dial-kit-danger-outlined-button',
  },
  [ButtonVariant.Static]: {
    [ButtonAppearance.Solid]: 'dial-kit-static-solid-button',
  },

  // TODO: remove these once we have a design for the icon button variants
  [ButtonVariant.Success]: {},
  [ButtonVariant.Secondary]: {},
  [ButtonVariant.Tertiary]: {},
};
