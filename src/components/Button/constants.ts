import { ButtonVariant } from '@/types/button';

export const variantClassMap: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'dial-primary-button',
  [ButtonVariant.Neutral]: 'dial-neutral-button',
  [ButtonVariant.Error]: 'dial-error-button',

  [ButtonVariant.Secondary]: 'dial-secondary-button',
  [ButtonVariant.Tertiary]: 'dial-tertiary-button',
  [ButtonVariant.Success]: '', // TODO: add styles for icon button
};
