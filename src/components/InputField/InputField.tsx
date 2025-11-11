import type { FC } from 'react';

import { DialFormItem } from '@/components/FormItem/FormItem';
import { DialInput } from '@/components/Input/Input';
import type {
  FieldControlProps,
  InputBaseProps,
  NumberInputBaseProps,
} from '@/models/field-control-props';
import type { DialFormItemBaseProps } from '@/types/form-item';

const lessThanOnePattern = /^0+\.(\d+)?$/;
const leadingZerosPattern = /^0+/;

export interface DialInputFieldBaseProps
  extends FieldControlProps,
    DialFormItemBaseProps,
    InputBaseProps {
  value?: string | number;
  defaultEmptyText?: string;
  errorText?: string;
  elementCssClass?: string;
  elementContainerCssClass?: string;
  containerCssClass?: string;
}

export interface DialInputFieldProps
  extends DialInputFieldBaseProps,
    Partial<NumberInputBaseProps> {
  type: string;
  onChange?: (value?: string | number) => void;
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
 * ```
 *
 * @params - Component properties extending:
 * - {@link FieldControlProps} - Field control properties (fieldTitle, optional)
 * - {@link DialFormItemBaseProps} - Form item properties (label, error, description, etc.)
 * - {@link InputBaseProps} - Base input properties (elementId, value, placeholder, disabled, readonly, invalid, icons, etc.)
 * - {@link NumberInputBaseProps} - Number input properties (min, max) - partial
 *
 * @param type - The HTML input type (text, email, password, number, etc.)
 * @param onChange - Callback function called when the input value changes, receives the new value
 * @param defaultEmptyText - Text to display when readonly and value is empty (default: "None")
 * @param errorText - Error message text to display below the input
 * @param elementCssClass - Additional CSS classes to apply to the input element
 * @param elementContainerCssClass - Additional CSS classes to apply to the input container
 * @param containerCssClass - Additional CSS classes to apply to the outer container
 */
const DialInputField: FC<DialInputFieldProps> = ({
  // form item props
  label,
  optional,
  optionalText,
  description,
  error,
  captionDescription,
  readonly,
  orientation,

  // other props
  elementId,
  fieldTitle,
  errorText,
  elementCssClass,
  elementContainerCssClass,
  containerCssClass,
  defaultEmptyText,
  ...props
}) => {
  return (
    <DialFormItem
      label={label ?? fieldTitle}
      error={error ?? errorText}
      optionalText={optionalText}
      optional={optional}
      description={description}
      captionDescription={captionDescription}
      readonly={readonly}
      orientation={orientation}
      elementId={elementId}
      cssClass={containerCssClass}
      defaultEmptyText={defaultEmptyText}
      value={props.value}
    >
      <DialInput
        elementId={elementId}
        cssClass={elementCssClass}
        containerCssClass={elementContainerCssClass}
        invalid={errorText != null}
        {...props}
      />
    </DialFormItem>
  );
};

export interface DialNumberInputFieldProps
  extends DialInputFieldBaseProps,
    Partial<NumberInputBaseProps> {
  onChange?: (value?: number | string) => void;
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
 * @params - Component properties extending:
 * - {@link FieldControlProps} - Field control properties (fieldTitle, optional)
 * - {@link DialFormItemBaseProps} - Form item properties (label, error, description, etc.)
 * - {@link InputBaseProps} - Base input properties (elementId, value, placeholder, disabled, readonly, invalid, icons, etc.)
 * - {@link NumberInputBaseProps} - Number input properties (min, max) - partial
 *
 * @param onChange - Callback function called when the input value changes.
 *                        Returns either a number (for most values) or a string (for decimal values < 1 with leading zeros)
 */
export const DialNumberInputField: FC<DialNumberInputFieldProps> = ({
  onChange,
  ...props
}) => {
  const getInputValue = (
    inputValue?: string | number,
  ): string | number | undefined => {
    if (!inputValue || inputValue === '-') {
      return inputValue;
    }

    return String(inputValue)?.match(lessThanOnePattern)
      ? String(inputValue)?.replace(leadingZerosPattern, '0')
      : Number(inputValue);
  };

  return (
    <DialInputField
      type="number"
      onChange={(inputValue) => onChange?.(getInputValue(inputValue))}
      {...props}
    />
  );
};

export interface DialTextInputFieldProps extends DialInputFieldBaseProps {
  onChange?: (value?: string) => void;
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
 * @params - Component properties extending:
 * - {@link FieldControlProps} - Field control properties (fieldTitle, optional)
 * - {@link DialFormItemBaseProps} - Form item properties (label, error, description, etc.)
 * - {@link InputBaseProps} - Base input properties (elementId, value, placeholder, disabled, readonly, invalid, icons, etc.)
 *
 * @param onChange - Callback function called when the input value changes, receives the new string value
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
