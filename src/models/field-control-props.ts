import type { InputHTMLAttributes, ReactNode } from 'react';

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
 * @param invalid - Whether the input has validation errors (applies error styling)
 * @param iconAfter - Icon or element to display after the input
 * @param iconBefore - Icon or element to display before the input
 * @param textBeforeInput - Text to display before the input
 * @param textAfterInput - Text to display after the input
 * @param prefix - Text to display inside the input on the left
 * @param suffix - Text to display inside the input on the right
 */
export interface InputBaseProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'onChange'> {
  invalid?: boolean;

  iconBefore?: ReactNode;
  iconAfter?: ReactNode;

  textBeforeInput?: string;
  textAfterInput?: string;

  prefix?: string;
  suffix?: string;
}
