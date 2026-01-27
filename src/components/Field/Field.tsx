import { IconInfoCircle } from '@tabler/icons-react';
import type { FC, LabelHTMLAttributes } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import type { FieldControlProps } from '@/models/field-control-props';

type NativeLabelProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'defaultValue' | 'onChange'
>;

export interface DialFieldLabelProps
  extends NativeLabelProps,
    FieldControlProps {
  optionalText?: string;
  description?: string;
}

/**
 * A field label component
 *
 * @example
 * ```tsx
 * // Basic field label
 * <DialFieldLabel htmlFor="email-input" fieldLabel="Email Address" />
 * ```
 *
 * @params - Component properties extending:
 * - {@link FieldControlProps} - Field control properties (fieldLabel, optional)
 * - {@link LabelHTMLAttributes<HTMLLabelElement>} - Form item properties (label, error, description, etc.)
 *
 * @param [optionalText="(Optional)"] - Custom text for optional indicator
 * @param [description] - Additional description text, displayed below the label.
 */
export const DialFieldLabel: FC<DialFieldLabelProps> = ({
  fieldLabel,
  optional,
  optionalText,
  className,
  description,
  ...props
}) => {
  if (!fieldLabel) return null;

  return (
    <label
      {...props}
      className={mergeClasses(
        'dial-tiny text-secondary flex gap-1',
        className,
        !className?.includes('mb') && 'mb-2',
      )}
    >
      {typeof fieldLabel === 'string' ? (
        <span className="min-h-4">{fieldLabel}</span>
      ) : (
        fieldLabel
      )}
      {optional && <span>{optionalText ?? '(Optional)'}</span>}
      {description && (
        <DialTooltip tooltip={description}>
          <DialIcon
            icon={<IconInfoCircle size={14} className="text-secondary" />}
          />
        </DialTooltip>
      )}
    </label>
  );
};
