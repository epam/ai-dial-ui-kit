import { mergeClasses } from '@/utils/merge-classes';
import type { FC, HTMLAttributes } from 'react';
import { CaptionType } from '@/types/caption';

export interface CaptionTextProps extends HTMLAttributes<HTMLSpanElement> {
  text?: string;
  variant?: CaptionType;
}

/**
 * A component for displaying caption text with consistent styling
 * aliases: HelperText|ValidationText
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <CaptionText text="This field is required" variant={CaptionType.Error} />
 * ```
 *
 * @param [text] - The text to display. If undefined or empty, nothing is rendered
 * @param [variant] - The variant of the caption text, e.g., error or description.
 */
export const CaptionText: FC<CaptionTextProps> = ({
  text,
  className,
  variant = CaptionType.Description,
  ...props
}) => {
  if (!text) return null;

  return (
    <span
      {...props}
      role="alert"
      className={mergeClasses(
        'dial-tiny-text',
        variant === CaptionType.Error ? 'text-error' : 'text-secondary',
        className,
      )}
    >
      {text}
    </span>
  );
};

export const ErrorText: FC<Omit<CaptionTextProps, 'variant'>> = ({
  ...props
}) => {
  return <CaptionText {...props} variant={CaptionType.Error} />;
};
