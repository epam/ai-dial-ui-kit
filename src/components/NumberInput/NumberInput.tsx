import type { FC } from 'react';

import { DialInput, type DialInputProps } from '@/components/Input/Input';

const lessThanOnePattern = /^0+\.(\d+)?$/;
const leadingZerosPattern = /^0+/;

export interface DialNumberInputProps extends Omit<DialInputProps, 'onChange'> {
  onChange?: (value?: number | string) => void;
}

/**
 * A number input field component
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
 * @param onChange - Callback function called when the input value changes.
 *                        Returns either a number (for most values) or a string (for decimal values < 1 with leading zeros)
 */
export const DialNumberInput: FC<DialNumberInputProps> = ({
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
    <DialInput
      type="number"
      onChange={(inputValue) => onChange?.(getInputValue(inputValue))}
      {...props}
    />
  );
};
