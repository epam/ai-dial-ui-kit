import classNames from 'classnames';
import type { FC } from 'react';

export interface DialFieldLabelProps {
  fieldTitle?: string;
  htmlFor: string;
  optional?: boolean;
  optionalText?: string;
  cssClass?: string;
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
 * @param fieldTitle - The title/label text to display for the field
 * @param htmlFor - The ID of the form element this label is associated with
 * @param optional - Whether the field is optional (displays "(Optional)" text if optionalText is not provided)
 * @param optionalText - Custom text for optional indicator
 * @param cssClass - Additional CSS classes to apply to the label element
 */
export const DialFieldLabel: FC<DialFieldLabelProps> = ({
  fieldTitle,
  htmlFor,
  optional,
  optionalText,
  cssClass,
}) => {
  return fieldTitle ? (
    <label
      className={classNames(
        'dial-tiny text-secondary',
        cssClass,
        !cssClass?.includes('mb') && 'mb-2',
      )}
      htmlFor={htmlFor}
    >
      <span className="min-h-4">{fieldTitle}</span>
      {optional && <span className="ml-1">{optionalText ?? '(Optional)'}</span>}
    </label>
  ) : null;
};
