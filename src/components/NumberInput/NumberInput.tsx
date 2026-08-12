import type { ClipboardEvent, FC, KeyboardEvent } from 'react';

import { DialInput, type DialInputProps } from '@/components/Input/Input';
import { handleKeyDown } from '@/components/Input/utils';

const lessThanOnePattern = /^0+\.(\d+)?$/;
const leadingZerosPattern = /^0+/;

export interface DialNumberInputProps extends Omit<DialInputProps, 'onChange'> {
  /** When true, restricts input to integer values only — blocks decimal points, minus, plus, and scientific notation (e/E) */
  integer?: boolean;
  onChange?: (value?: number | string) => void;
}

/**
 * A number input field component
 * aliases: NumericField|NumberField
 * Design system 1.0
 *
 * @example
 * ```tsx
 * <DialNumberInput
 *   id="age"
 *   placeholder="Enter your age"
 *   value={25}
 *   onChange={(value) => setAge(value)}
 * />
 * ```
 *
 * @params - Component properties extending:
 * - {@link DialInputProps} - Standard input properties (id, value, placeholder, disabled, invalid, etc.) excluding `onChange`
 *
 * @param [integer] - When true, restricts input to integer values only — blocks decimal points, minus, plus, and scientific notation (e/E)
 * @param [min] - Minimum allowed value
 * @param [max] - Maximum allowed value
 * @param [onKeyDown] - Custom keydown handler (ignored when `integer` is true)
 * @param [onPaste] - Custom paste handler (ignored when `integer` is true)
 * @param onChange - Callback function called when the input value changes.
 *                        Returns either a number (for most values) or a string (for decimal values < 1 with leading zeros)
 */
export const DialNumberInput: FC<DialNumberInputProps> = ({
  integer,
  onChange,
  min,
  max,
  onKeyDown,
  onPaste,
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

  const handleIntegerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['.', '-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
      return;
    }
    handleKeyDown(e, 'number', min, max);
  };

  const handleIntegerPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const digitsOnly = pastedText.replace(/\D/g, '');
    if (digitsOnly !== pastedText) {
      e.preventDefault();
      if (digitsOnly) {
        const input = e.currentTarget;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const newValue =
          input.value.slice(0, start) + digitsOnly + input.value.slice(end);
        onChange?.(getInputValue(newValue));
      }
    }
  };

  return (
    <DialInput
      type="number"
      min={min}
      max={max}
      onChange={(inputValue) => onChange?.(getInputValue(inputValue))}
      onKeyDown={integer ? handleIntegerKeyDown : onKeyDown}
      onPaste={integer ? handleIntegerPaste : onPaste}
      {...props}
    />
  );
};
