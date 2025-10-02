import type { FC } from 'react';

import { DialPasswordInput } from './PasswordInput';
import { DialErrorText } from '../ErrorText/ErrorText';
import { DialFieldLabel } from '../Field/Field';
import type { DialInputFieldBaseProps } from '../InputField/InputField';

export interface DialPasswordInputFieldProps extends DialInputFieldBaseProps {
  onChange?: (value: string) => void;
}
/**
 * A password input field component with label, error text, and show/hide functionality.
 *
 * @example
 * ```tsx
 * <DialPasswordInputField
 *   elementId="password"
 *   fieldTitle="Password"
 *   value={password}
 *   onChange={setPassword}
 *   errorText={error}
 *   optional={false}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element
 * @param [fieldTitle] - The label text for the field
 * @param [value] - The current value of the input
 * @param [onChange] - Callback function called when the input value changes
 * @param [errorText] - Error message to display below the input
 * @param [optional=false] - Whether the field is optional
 * @param [cssClass] - Custom CSS class for the input element
 */
export const DialPasswordInputField: FC<DialPasswordInputFieldProps> = ({
  fieldTitle,
  optional,
  elementCssClass,
  elementId,
  errorText,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <DialFieldLabel
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={elementId}
      />
      <DialPasswordInput
        cssClass={elementCssClass}
        elementId={elementId}
        invalid={!!errorText}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
