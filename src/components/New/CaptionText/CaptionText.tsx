import { mergeClasses } from '@/utils/merge-classes';
import type { FC, HTMLAttributes } from 'react';
import { CaptionType } from '@/types/caption';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { LiveRegionElement, LiveRegionPoliteness } from '@/types/live-region';
import { LiveRegion } from '@/components/New/LiveRegion/LiveRegion';

export interface CaptionTextProps extends HTMLAttributes<HTMLSpanElement> {
  text?: string;
  variant?: CaptionType;
  /**
   * Announce the text through a `LiveRegion` of this politeness. The region is
   * rendered even while `text` is empty, so the first message is heard. Without
   * it the caption has no live-region role and renders nothing for empty text.
   */
  announce?: LiveRegionPoliteness;
}

/**
 * A component for displaying caption text with consistent styling
 * aliases: HelperText|ValidationText
 * Design system 2.0
 *
 * It carries no live-region role by default: a field caption or error is
 * described, not announced. Give it an `id` and point the control's
 * `aria-describedby` at it (the 2.0 form controls do this for their own
 * `caption` / `error`).
 *
 * For a message that must also be heard when it appears — a failed submit, an
 * async error — pass `announce`. The caption is then rendered inside an
 * always-mounted `LiveRegion` (`dial-kit-live-region`), present even while
 * `text` is empty; `id`, `className` and the other props stay on the text
 * element, so `aria-describedby` still resolves to the text itself.
 *
 * @example
 * ```tsx
 * <input aria-describedby="name-error" aria-invalid />
 * <CaptionText id="name-error" text="This field is required" variant={CaptionType.Error} />
 *
 * <ErrorText text={submitError} announce={LiveRegionPoliteness.Assertive} />
 * ```
 *
 * @param [text] - The text to display. If undefined or empty, nothing is rendered unless `announce` is set
 * @param [variant] - The variant of the caption text, e.g., error or description.
 * @param [announce] - Wrap the text in an always-mounted `LiveRegion` of this politeness.
 */
export const CaptionText: FC<CaptionTextProps> = ({
  text,
  className,
  variant = CaptionType.Description,
  announce,
  ...props
}) => {
  const caption = text ? (
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
  ) : null;

  if (!announce) return caption;

  return (
    <LiveRegion politeness={announce} as={LiveRegionElement.Span} atomic>
      {caption}
    </LiveRegion>
  );
};

export const ErrorText: FC<Omit<CaptionTextProps, 'variant'>> = ({
  ...props
}) => {
  return <CaptionText {...props} variant={CaptionType.Error} />;
};
