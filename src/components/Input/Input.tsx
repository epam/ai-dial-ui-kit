import type { FC, ReactNode } from 'react';
import classNames from 'classnames';

import { DialIcon } from '@/components/Icon/Icon';

export interface DialInputProps {
  inputId: string;
  type?: string;
  value?: string | number | null;
  placeholder?: string;
  containerCssClass?: string;
  cssClass?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  hideBorder?: boolean;
  onChange?: (value: string) => void;
  iconAfterInput?: ReactNode;
  iconBeforeInput?: ReactNode;
}

/**
 * A flexible input component with icon support and various styling options
 *
 * @example
 * ```tsx
 * <DialInput
 *   inputId="search"
 *   placeholder="Search..."
 *   iconBefore={<SearchIcon />}
 *   iconAfter={<ClearIcon />}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param inputId - Unique identifier for the input element
 * @param [value] - The current value of the input
 * @param [onChange] - Callback function called when the input value changes
 * @param [iconBeforeInput] - Icon or element to display before the input
 * @param [iconAfterInput] - Icon or element to display after the input
 * @param [placeholder] - Placeholder text displayed when input is empty
 * @param [containerCssClass] - Additional CSS classes to apply to the container div
 * @param [cssClass] - Additional CSS classes to apply to the input element
 * @param [type="text"] - The type of input (text, password, email, etc.)
 * @param [disabled=false] - Whether the input is disabled
 * @param [readonly=false] - Whether the input is read-only (prevents onChange from firing)
 * @param [invalid=false] - Whether the input has validation errors (applies error styling)
 * @param [hideBorder=false] - Whether to hide the input border styling
 */
export const DialInput: FC<DialInputProps> = ({
  iconBeforeInput,
  iconAfterInput,
  hideBorder,
  value,
  inputId,
  placeholder = '',
  cssClass = '',
  containerCssClass,
  type = 'text',
  disabled,
  readonly,
  invalid,
  onChange,
}) => {
  return (
    <div
      className={classNames(
        'dial-input-field flex flex-row items-center justify-between',
        hideBorder ? 'dial-input-no-border' : 'dial-input',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        readonly && 'dial-input-readonly',
        containerCssClass,
      )}
    >
      <DialIcon icon={iconBeforeInput} />
      <input
        type={type}
        autoComplete="new-password"
        id={inputId}
        placeholder={placeholder}
        value={value ?? ''}
        title={value ? String(value) : ''}
        disabled={disabled}
        className={classNames(
          'border-0 bg-transparent',
          iconBeforeInput ? 'pl-2' : '',
          iconAfterInput ? 'pr-2' : '',
          cssClass,
        )}
        onChange={(event) => !readonly && onChange?.(event.currentTarget.value)}
      />
      <DialIcon icon={iconAfterInput} />
    </div>
  );
};
