import { mergeClasses } from '@/utils/merge-classes';
import type { FC, HTMLAttributes } from 'react';

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  errorText?: string;
}

/**
 * A component for displaying error messages with consistent styling
 */
export const DialErrorText: FC<Props> = ({ errorText, className, ...rest }) => {
  if (!errorText) return null;

  return (
    <span
      {...rest}
      className={mergeClasses('text-error dial-tiny mt-1', className)}
    >
      {errorText}
    </span>
  );
};
