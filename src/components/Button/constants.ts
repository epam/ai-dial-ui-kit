import { ButtonVariant } from '@/types/button';

export const variantClassMap: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: 'dial-primary-button',
  [ButtonVariant.Secondary]: 'dial-secondary-button',
  [ButtonVariant.Tertiary]: 'dial-tertiary-button',
  [ButtonVariant.Danger]: 'dial-danger-button',
};
