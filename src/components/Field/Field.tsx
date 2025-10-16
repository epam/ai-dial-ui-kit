import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { DialIcon } from '@/components/Icon/Icon';
import { IconInfoCircle } from '@tabler/icons-react';

export interface DialFieldLabelProps {
  fieldTitle?: string | ReactNode;
  htmlFor: string;
  optional?: boolean;
  optionalText?: string;
  cssClass?: string;
  description?: string;
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
 * @param htmlFor - The ID of the form element this label is associated with
 * @param [fieldTitle] - The title/label text to display for the field
 * @param [optional=false] - Whether the field is optional (displays "(Optional)" text if optionalText is not provided)
 * @param [optionalText="(Optional)"] - Custom text for optional indicator
 * @param [cssClass] - Additional CSS classes to apply to the label element
 * @param [description] - Additional description text, displayed below the label.
 */
export const DialFieldLabel: FC<DialFieldLabelProps> = ({
  fieldTitle,
  htmlFor,
  optional,
  optionalText,
  cssClass,
  description,
}) => {
  return fieldTitle ? (
    <label
      className={classNames(
        'dial-tiny text-secondary flex gap-1',
        cssClass,
        !cssClass?.includes('mb') && 'mb-2',
      )}
      htmlFor={htmlFor}
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
  ) : null;
};
