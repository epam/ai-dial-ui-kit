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
 *   fieldLabel="Password"
 *   value={password}
 *   onChange={setPassword}
 *   errorText={error}
 *   optional={false}
 * />
 * ```
 * @params - Component properties extending:
 * - {@link FieldControlProps} - Field control properties (fieldLabel, optional)
 * @param [onChange] - Callback function called when the input value changes
 */
export const DialPasswordInputField: FC<DialPasswordInputFieldProps> = ({
  fieldLabel,
  optional,
  elementClassName,
  elementId,
  errorText,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <DialFieldLabel
        fieldLabel={fieldLabel}
        optional={optional}
        htmlFor={elementId}
      />
      <DialPasswordInput
        className={elementClassName}
        elementId={elementId}
        invalid={!!errorText}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
