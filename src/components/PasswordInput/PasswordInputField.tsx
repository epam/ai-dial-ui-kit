import type { FC } from 'react';

import { DialPasswordInput } from './PasswordInput';
import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { DialFieldLabel } from '@/components/Field/Field';
import type { DialInputFieldBaseProps } from '@/components/InputField/InputField';

export interface DialPasswordInputFieldProps extends DialInputFieldBaseProps {
  onChange?: (value?: string) => void;
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
 * @params - Component properties extending:
 * - {@link DialInputFieldBaseProps} - Base input properties (id, value, placeholder, disabled, readOnly, invalid, etc.)
 *
 * @param [onChange] - Callback function called when the input value changes
 */
export const DialPasswordInputField: FC<DialPasswordInputFieldProps> = ({
  fieldTitle,
  optional,
  elementClassName,
  id,
  errorText,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <DialFieldLabel
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={id}
      />
      <DialPasswordInput
        className={elementClassName}
        id={id}
        invalid={!!errorText}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
