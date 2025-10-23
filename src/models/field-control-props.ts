import type { ReactNode } from 'react';

/**
 * Base properties for field controls providing label and optional status
 *
 * @param fieldTitle - The label text to display above the input field
 * @param optional - Whether the field is optional (displays "(Optional)" indicator when true)
 */
export interface FieldControlProps {
  fieldTitle?: string;
  optional?: boolean;
}

/**
 * Base properties for input elements providing core input functionality
 *
 * @param elementId - Unique identifier for the input element
 * @param value - The current value of the input (string, number, or null)
 * @param defaultValue - The default value for the input
 * @param placeholder - Placeholder text shown when input is empty
 * @param disabled - Whether the input is disabled and cannot be interacted with
 * @param readonly - Whether the input is read-only (displays value as text, no input element)
 * @param invalid - Whether the input has validation errors (applies error styling)
 * @param iconAfter - Icon or element to display after the input
 * @param iconBefore - Icon or element to display before the input
 * @param textBeforeInput - Text to display before the input
 * @param textAfterInput - Text to display after the input
 * @param prefix - Text to display inside the input on the left
 * @param suffix - Text to display inside the input on the right
 */
export interface InputBaseProps {
  elementId: string;
  value?: string | number | null;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  iconAfter?: ReactNode;
  iconBefore?: ReactNode;
  textBeforeInput?: string;
  textAfterInput?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Properties specific to numeric input controls for validation and formatting
 *
 * @param min - Minimum allowed value for the number input
 * @param max - Maximum allowed value for the number input
 */
export interface NumberInputBaseProps {
  min?: number;
  max?: number;
}
