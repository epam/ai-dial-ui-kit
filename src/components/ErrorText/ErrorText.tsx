import type { FC } from 'react';

export interface Props {
  errorText?: string;
}

/**
 * A component for displaying error messages with consistent styling
 *
 * @example
 * ```tsx
 * <DialErrorText errorText="This field is required" />
 * ```
 *
 * @param errorText - The error message text to display. If undefined or empty, nothing is rendered
 * @returns A span element with error styling, or null if no error text is provided
 */
export const DialErrorText: FC<Props> = ({ errorText }) => {
  return (
    errorText && <span className="text-error dial-tiny mt-1">{errorText}</span>
  );
};
