import type { ClipboardEvent, FC, KeyboardEvent } from 'react';

import { Input, type InputProps } from '@/components/New/Input/Input';
import { handleKeyDown } from '@/components/New/Input/utils';

const lessThanOnePattern = /^0+\.(\d+)?$/;
const leadingZerosPattern = /^0+/;
const integerBlockedKeys = ['.', '-', '+', 'e', 'E'];

/**
 * Normalizes a raw field value: decimals below one keep their string form so a
 * trailing digit can still be typed ("0.00" would otherwise collapse to 0),
 * everything else becomes a number.
 */
const toNumberValue = (
  inputValue?: string | number,
): string | number | undefined => {
  if (!inputValue || inputValue === '-') {
    return inputValue;
  }

  return String(inputValue).match(lessThanOnePattern)
    ? String(inputValue).replace(leadingZerosPattern, '0')
    : Number(inputValue);
};

export interface NumberInputProps extends Omit<
  InputProps,
  'onChange' | 'type'
> {
  /** When true, restricts input to integer values only — blocks decimal points, minus, plus, and scientific notation (e/E) */
  integer?: boolean;
  onChange?: (value?: number | string) => void;
}

/**
 * A number field, built on {@link Input}.
 * aliases: NumericField|NumberField
 *
 * `type` is owned by this component; every other {@link Input} prop is passed
 * through, so it shares the 2.0 field styling, sizes, label, caption and error
 * states.
 *
 * @example
 * ```tsx
 * <NumberInput
 *   id="age"
 *   placeholder="Enter your age"
 *   value={25}
 *   onChange={(value) => setAge(value)}
 * />
 * ```
 *
 * @param [integer] - When true, restricts input to integer values only — blocks decimal points, minus, plus, and scientific notation (e/E)
 * @param [min] - Minimum allowed value
 * @param [max] - Maximum allowed value
 * @param [size=ElementSize.Standard] - Field height: standard is 40px, small is 24px
 * @param [onKeyDown] - Called after the numeric key guard has run, unless the key was blocked
 * @param [onPaste] - Called after pasted text has been sanitized in `integer` mode
 * @param onChange - Callback function called when the input value changes.
 *                        Returns either a number (for most values) or a string (for decimal values < 1 with leading zeros)
 */
export const NumberInput: FC<NumberInputProps> = ({
  integer,
  onChange,
  min,
  max,
  onKeyDown,
  onPaste,
  ...props
}) => {
  // `Input` guards numeric keystrokes through its own `onKeyDown`, which this
  // component has to replace — so the guard is re-applied here. Chaining the
  // consumer's handler after it keeps a custom `onKeyDown` from silently
  // disabling the guard.
  const handleNumberKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (integer && integerBlockedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }

    handleKeyDown(e, 'number', min, max);
    onKeyDown?.(e);
  };

  const handleNumberPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (integer) {
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
          onChange?.(toNumberValue(newValue));
        }
      }
    }

    onPaste?.(e);
  };

  return (
    <Input
      {...props}
      type="number"
      min={min}
      max={max}
      onChange={(inputValue) => onChange?.(toNumberValue(inputValue))}
      onKeyDown={handleNumberKeyDown}
      onPaste={handleNumberPaste}
    />
  );
};
