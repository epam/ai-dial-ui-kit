import { mergeClasses } from '@/utils/merge-classes';
import type { FC, LabelHTMLAttributes, ReactNode } from 'react';

import { DialInfoButton } from '@/components/InfoButton/InfoButton';

type NativeLabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'defaultValue' | 'onChange'
>;

export interface DialLabelProps extends NativeLabelProps {
  label?: ReactNode;
  required?: boolean;
  caption?: string;
}

/**
 * A label component
 * aliases: FormLabel|RequiredIndicator
 *
 * @example
 * ```tsx
 * // Basic  label
 * <DialLabel htmlFor="email-input" label="Email Address" />
 * ```
 *
 * @param [label] - The label text to display for the label
 * @param [required=false] - Whether the field is required
 * @param [caption] - Additional caption text, displayed below the label.
 */
export const DialLabel: FC<DialLabelProps> = ({
  label,
  required,
  className,
  caption,
  ...props
}) => {
  if (!label) return null;

  return (
    <label
      {...props}
      className={mergeClasses(
        'dial-tiny-text text-secondary flex items-center gap-1',
        className,
      )}
    >
      {typeof label === 'string' ? (
        <span className="min-h-4">{label}</span>
      ) : (
        label
      )}
      {required && <span className="text-accent-primary">*</span>}

      <DialInfoButton caption={caption} />
    </label>
  );
};
