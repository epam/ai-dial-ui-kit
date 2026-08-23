import { mergeClasses } from '@/utils/merge-classes';
import type { FC, LabelHTMLAttributes, ReactNode } from 'react';

import { ElementSize } from '../../../types/size';
import { InfoButton } from '../InfoButton/InfoButton';

type NativeLabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'defaultValue' | 'onChange'
>;

export interface LabelProps extends NativeLabelProps {
  label?: ReactNode;
  required?: boolean;
  caption?: string;
  size?: ElementSize;
  containerClassName?: string;
}

/**
 * A label component
 * aliases: FormLabel|RequiredIndicator
 * Design system 2.0
 *
 * @example
 * ```tsx
 * // Basic  label
 * <Label htmlFor="email-input" label="Email Address" />
 * ```
 *
 * Pass `htmlFor` with the id of the control this labels — without it the label
 * names nothing. The `caption` info button renders as a sibling of the `<label>`
 * rather than inside it: a button nested in a label forwards its clicks to the
 * labelled control and leaks its own text into that control's accessible name.
 *
 * @param [label] - The label text to display for the label
 * @param [required=false] - Whether the field is required. Renders a visual `*`
 * plus visually hidden text so the requirement is announced too.
 * @param [caption] - Explanatory text, exposed through an info button next to the label
 * @param [size] - The size of the label, which can be 'small', 'medium', or 'large'.
 * @param [containerClassName] - Additional classes for the wrapper holding the
 * `<label>` and its info button. Needed when the label is a flex item that has
 * to shrink: a wrapper left at `min-width: auto` cannot, so its text overflows
 * instead of truncating.
 */
export const Label: FC<LabelProps> = ({
  label,
  required,
  className,
  containerClassName,
  caption,
  size = ElementSize.Small,
  ...props
}) => {
  if (!label) return null;

  return (
    <span
      className={mergeClasses('flex items-center gap-0.5', containerClassName)}
    >
      <label
        {...props}
        className={mergeClasses(
          'text-secondary flex items-center gap-0.5',
          size === ElementSize.Small
            ? 'dial-tiny-semi-text'
            : 'dial-small-text',
          className,
        )}
      >
        {typeof label === 'string' ? (
          <span className="min-h-4">{label}</span>
        ) : (
          label
        )}
        {required && (
          <>
            <span aria-hidden="true" className="text-error dial-tiny-text">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>

      <InfoButton caption={caption} />
    </span>
  );
};
