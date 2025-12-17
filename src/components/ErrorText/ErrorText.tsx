import { mergeClasses } from '@/utils/merge-classes';
import type { FC, HTMLAttributes } from 'react';

export interface Props extends HTMLAttributes<HTMLSpanElement> {
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
 * @param [errorText] - The error message text to display. If undefined or empty, nothing is rendered
 */
export const DialErrorText: FC<Props> = ({
  errorText,
  className,
  ...props
}) => {
  if (!errorText) return null;

  return (
    <span
      {...props}
      className={mergeClasses('text-error dial-tiny mt-1', className)}
    >
      {errorText}
    </span>
  );
};
