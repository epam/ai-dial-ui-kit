import type { FC } from 'react';

import { DialTag } from '@/components/Tag/Tag';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialAnalyticsErrorTagProps {
  /** Text shown inside the tag. Defaults to `'Error'`. */
  label?: string;
  /** Additional CSS classes applied to the tag. */
  className?: string;
}

/**
 * A non-interactive error tag used across analytics components to indicate that a
 * Design system 1.0
 * metric value could not be provided. Renders a {@link DialTag} styled with the
 * error palette (`bg-error`, `text-error`, `border-error`).
 *
 * @example
 * ```tsx
 * <DialAnalyticsErrorTag />
 * ```
 *
 * @param [label='Error'] - Text shown inside the tag.
 * @param [className] - Additional CSS classes applied to the tag.
 */
export const DialAnalyticsErrorTag: FC<DialAnalyticsErrorTagProps> = ({
  label = 'Error',
  className,
}) => (
  <DialTag
    label={label}
    className={mergeClasses(
      'dial-tiny-semi-text cursor-default rounded-[120px] border-transparent bg-error text-error',
      className,
    )}
  />
);
