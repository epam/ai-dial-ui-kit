import { mergeClasses } from '@/utils/merge-classes';
import type { FC, HTMLAttributes } from 'react';
import { CaptionType } from '@/types/caption';

export interface DialCaptionTextProps extends HTMLAttributes<HTMLSpanElement> {
  text?: string;
  variant?: CaptionType;
}

/**
 * A component for displaying error messages with consistent styling
 *
 * @example
 * ```tsx
 * <DialCaptionText text="This field is required" variant={CaptionType.Error} />
 * ```
 *
 * @param [text] - The text to display. If undefined or empty, nothing is rendered
 * @param [variant] - The variant of the caption text, e.g., error or description.
 */
export const DialCaptionText: FC<DialCaptionTextProps> = ({
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

export const DialErrorText: FC<Omit<DialCaptionTextProps, 'variant'>> = ({
  ...props
}) => {
  return <DialCaptionText {...props} variant={CaptionType.Error} />;
};
