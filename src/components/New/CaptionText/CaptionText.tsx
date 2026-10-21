import { mergeClasses } from '@/utils/merge-classes';
import type { FC, HTMLAttributes } from 'react';
import { CaptionType } from '@/types/caption';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';

export interface CaptionTextProps extends HTMLAttributes<HTMLSpanElement> {
  text?: string;
  variant?: CaptionType;
}

/**
 * A component for displaying caption text with consistent styling
 * aliases: HelperText|ValidationText
 * Design system 2.0
 *
 * It carries no live-region role: a field caption or error is described, not
 * announced. Give it an `id` and point the control's `aria-describedby` at it
 * (the 2.0 form controls do this for their own `caption` / `error`). Wrap it in
 * a `role="alert"` region only for a message that must interrupt, such as a
 * failed submit.
 *
 * @example
 * ```tsx
 * <input aria-describedby="name-error" aria-invalid />
 * <CaptionText id="name-error" text="This field is required" variant={CaptionType.Error} />
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
      className={mergeClasses(
        'dial-tiny-text',
        variant === CaptionType.Error ? 'text-error' : 'text-secondary',
        className,
        DIAL_KIT_CLASS.captionText,
        variant === CaptionType.Error && DIAL_KIT_CLASS.errorText,
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
