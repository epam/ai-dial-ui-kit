import { DialIcon } from '@/components/Icon/Icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { IconInfoCircle } from '@tabler/icons-react';
import type { FC, LabelHTMLAttributes, ReactNode } from 'react';

type NativeLabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'>;

export interface DialFieldLabelProps extends NativeLabelProps {
  fieldTitle?: string | ReactNode;
  optional?: boolean;
  optionalText?: string;
  description?: ReactNode;
}

/**
 * A field label component
 *
 * @example
 * ```tsx
 * // Basic field label
 * <DialFieldLabel htmlFor="email-input" fieldTitle="Email Address" />
 * ```
 *
 * @param [fieldTitle] - The title/label text to display for the field
 * @param [optional=false] - Whether the field is optional (displays "(Optional)" text if optionalText is not provided)
 * @param [optionalText="(Optional)"] - Custom text for optional indicator
 * @param [description] - Additional description text, displayed below the label.
 */
export const DialFieldLabel: FC<DialFieldLabelProps> = ({
  fieldTitle,
  optional,
  optionalText,
  className,
  description,
  ...props
}) => {
  if (!fieldTitle) return null;

  return (
    <label
      {...props}
      className={mergeClasses(
        'dial-tiny text-secondary flex gap-1',
        className,
        !className?.includes('mb') && 'mb-2',
      )}
    >
      {typeof fieldTitle === 'string' ? (
        <span className="min-h-4">{fieldTitle}</span>
      ) : (
        fieldTitle
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
