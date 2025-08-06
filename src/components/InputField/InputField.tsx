import type { FC, ReactNode } from 'react';
import classNames from 'classnames';

import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { DialFieldLabel } from '@/components/Field/Field';
import { DialInput } from '@/components/Input/Input';
import type { FieldControlProps } from '@/models/field-control-props';

const lessThanOnePattern = /^0+\.(\d+)?$/;
const leadingZerosPattern = /^0+/;

export interface DialInputFieldBaseProps extends FieldControlProps {
  placeholder?: string;
  value?: string | number;
  elementId: string;
  elementCssClass?: string;
  elementContainerCssClass?: string;
  containerCssClass?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  errorText?: string;
  iconAfterInput?: ReactNode;
  iconBeforeInput?: ReactNode;
  textBeforeInput?: string;
  defaultEmptyText?: string;
}

export interface DialInputFieldProps extends DialInputFieldBaseProps {
  type: string;
  onChange?: (value: string | number) => void;
}

/**
 * A generic input field component that serves as the base for specialized input types
 *
 * @example
 * ```tsx
 * <DialInputField
 *   elementId="username"
 *   fieldTitle="Username"
 *   type="text"
 *   placeholder="Enter username"
 *   value="john_doe"
 *   onChange={(value) => setUsername(value as string)}
 * />
 *
 * @param required elementId - Unique identifier for the input element
 * @param required type - The HTML input type (text, email, password, number, etc.)
 * @param [fieldTitle] - The label text to display above the input
 * @param [placeholder] - Placeholder text shown when input is empty
 * @param [value] - The current value of the input (string or number)
 * @param [onChange] - Callback function called when the input value changes, receives the new value
 * @param [optional=false] - Whether the field is optional (displays "(Optional)" indicator)
 * @param [disabled=false] - Whether the input is disabled and cannot be interacted with
 * @param [readonly=false] - Whether the input is read-only (displays value as text, no input element)
 * @param [invalid=false] - Whether the input has validation errors (applies error styling)
 * @param [errorText] - Error message text to display below the input
 * @param [defaultEmptyText="None"] - Text to display when readonly and value is empty
 * @param [iconBeforeInput] - Icon or element to display before the input
 * @param [iconAfterInput] - Icon or element to display after the input
 * @param [textBeforeInput] - Text to display before the input
 * @param [elementCssClass] - Additional CSS classes to apply to the input element
 * @param [elementContainerCssClass] - Additional CSS classes to apply to the input container
 * @param [containerCssClass] - Additional CSS classes to apply to the outer container
 */
const DialInputField: FC<DialInputFieldProps> = ({
  fieldTitle,
  errorText,
  optional,
  elementCssClass,
  elementContainerCssClass,
  elementId,
  containerCssClass,
  readonly,
  defaultEmptyText,
  ...props
}) => {
  return (
    <div className={classNames('flex flex-col', containerCssClass)}>
      <DialFieldLabel
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={elementId}
      />

      {readonly ? (
        <span>{props.value || (defaultEmptyText ?? 'None')}</span>
      ) : (
        <>
          <DialInput
            inputId={elementId}
            cssClass={elementCssClass}
            containerCssClass={elementContainerCssClass}
            invalid={errorText != null}
            {...props}
          />
          <DialErrorText errorText={errorText} />
        </>
      )}
    </div>
  );
};

export interface DialNumberInputFieldProps extends DialInputFieldBaseProps {
  onChange?: (value: number | string) => void;
}

/**
 * A number input field component
 *
 * @example
 * ```tsx
 * <DialNumberInputField
 *   elementId="age"
 *   fieldTitle="Age"
 *   placeholder="Enter your age"
 *   value={25}
 *   onChange={(value) => setAge(value)}
 * />
 * ```
 *
 * @param required elementId - Unique identifier for the input element
 * @param [fieldTitle] - The label text to display above the input
 * @param [placeholder] - Placeholder text shown when input is empty
 * @param [value] - The current numeric value of the input
 * @param [onChange] - Callback function called when the input value changes.
 *                   Returns either a number (for most values) or a string (for decimal values < 1 with leading zeros)
 * @param [optional=false] - Whether the field is optional
 * @param [disabled=false] - Whether the input is disabled
 * @param [readonly=false] - Whether the input is read-only
 * @param [invalid=false] - Whether the input has validation errors (applies error styling)
 * @param [errorText] - Error message text to display below the input
 * @param [defaultEmptyText="None"] - Text to display when readonly and value is empty
 * @param [iconBeforeInput] - Icon or element to display before the input
 * @param [iconAfterInput] - Icon or element to display after the input
 * @param [elementCssClass] - Additional CSS classes to apply to the input element
 * @param [elementContainerCssClass] - Additional CSS classes to apply to the input container
 * @param [containerCssClass] - Additional CSS classes to apply to the DialNumberInputField container
 */
export const DialNumberInputField: FC<DialNumberInputFieldProps> = ({
  onChange,
  value,
  ...props
}) => {
  const getInputValue = (inputValue: string | number): string | number => {
    return String(inputValue)?.match(lessThanOnePattern)
      ? String(inputValue)?.replace(leadingZerosPattern, '0')
      : Number(inputValue);
  };

  return (
    <DialInputField
      type="number"
      onChange={(inputValue) => onChange?.(getInputValue(inputValue))}
      value={value}
      {...props}
    />
  );
};

export interface DialTextInputFieldProps extends DialInputFieldBaseProps {
  onChange?: (value: string) => void;
}

/**
 * A text input field component
 *
 * @example
 * Basic usage:
 * ```tsx
 * <DialTextInputField
 *   elementId="name"
 *   fieldTitle="Full Name"
 *   placeholder="Enter your full name"
 *   value="John Doe"
 *   onChange={(value) => setName(value)}
 * />
 * ```
 *
 * @param required elementId - Unique identifier for the input element
 * @param [fieldTitle] - The label text to display above the input
 * @param [placeholder] - Placeholder text shown when input is empty
 * @param [value] - The current text value of the input
 * @param [onChange] - Callback function called when the input value changes, receives the new string value
 * @param [optional=false] - Whether the field is optional (displays "(Optional)" indicator)
 * @param [disabled=false] - Whether the input is disabled and cannot be interacted with
 * @param [readonly=false] - Whether the input is read-only (displays value as text, no input element)
 * @param [invalid=false] - Whether the input has validation errors (applies error styling)
 * @param [errorText] - Error message text to display below the input
 * @param [defaultEmptyText="None"] - Text to display when readonly and value is empty
 * @param [iconBeforeInput] - Icon or element to display before the input
 * @param [iconAfterInput] - Icon or element to display after the input
 * @param [elementCssClass] - Additional CSS classes to apply to the input element
 * @param [elementContainerCssClass] - Additional CSS classes to apply to the input container
 * @param [containerCssClass] - Additional CSS classes to apply to the outer container
 */
export const DialTextInputField: FC<DialTextInputFieldProps> = ({
  onChange,
  ...props
}) => {
  return (
    <DialInputField
      type="text"
      onChange={(v) => onChange?.(v as string)}
      {...props}
    />
  );
};
