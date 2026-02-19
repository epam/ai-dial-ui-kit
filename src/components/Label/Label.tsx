import { DialIcon } from '@/components/Icon/Icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { IconInfoCircle } from '@tabler/icons-react';
import type { FC, LabelHTMLAttributes, ReactNode } from 'react';

type NativeLabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'defaultValue' | 'onChange'
>;

export interface DialLabelProps extends NativeLabelProps {
  fieldLabel?: ReactNode;
  required?: boolean;
  caption?: string;
}

/**
 * A label component
 *
 * @example
 * ```tsx
 * // Basic  label
 * <DialLabel htmlFor="email-input" fieldLabel="Email Address" />
 * ```
 *
 * @param [fieldLabel] - The label text to display for the label
 * @param [required=false] - Whether the field is required
 * @param [caption] - Additional caption text, displayed below the label.
 */
export const DialLabel: FC<DialLabelProps> = ({
  fieldLabel,
  required,
  className,
  caption,
  ...props
}) => {
  if (!fieldLabel) return null;

  return (
    <label
      {...props}
      className={mergeClasses('dial-tiny text-secondary flex gap-1', className)}
    >
      {typeof fieldLabel === 'string' ? (
        <span className="min-h-4">{fieldLabel}</span>
      ) : (
        fieldLabel
      )}
      {required && <span>*</span>}
      {caption && (
        <DialTooltip tooltip={caption}>
          <DialIcon
            icon={<IconInfoCircle size={14} className="text-secondary" />}
          />
        </DialTooltip>
      )}
    </label>
  );
};
