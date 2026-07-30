import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { variantClassMap } from './constants';

export const getButtonClassNames = (
  variant = ButtonVariant.Primary,
  appearance = ButtonAppearance.Solid,
): string => {
  const existingVariant = variantClassMap[variant]?.[appearance];
  if (!existingVariant) {
    console.warn(
      `Could not find Button styles for variant: ${variant} and appearance: ${appearance}. Using default primary solid button styles.`,
    );
    return variantClassMap[ButtonVariant.Primary][ButtonAppearance.Solid];
  }
  return existingVariant;
};
