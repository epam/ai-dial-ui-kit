import type { ReactNode } from 'react';
import { DialIcon } from '@/components/Icon/Icon';
import classNames from 'classnames';

export interface DialSearchInputProps {
  elementId: string;
  value?: string | number | null;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  iconAfterInput?: ReactNode;
  iconBeforeInput?: ReactNode;
  cssClass?: string;
  containerCssClass?: string;
  onChange?: (value: string) => void;
}

/**
 * A low-level search input wrapper with optional icons before and after the input field.
 * It provides basic styling, state handling (disabled, readonly, invalid), and value change callbacks.
 *
 * @example
 * ```tsx
 * <DialSearchInput
 *   elementId="search-basic"
 *   placeholder="Search"
 *   value={query}
 *   onChange={(val) => setQuery(val)}
 *   iconBeforeInput={<IconSearch size={16} />}
 *   iconAfterInput={<IconX size={16} />}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element
 * @param [value] - The current value of the input
 * @param [placeholder] - Placeholder text shown when input is empty
 * @param [disabled=false] - Whether the input is disabled
 * @param [readonly=false] - Whether the input is read-only (non-editable)
 * @param [invalid=false] - Whether the input should be styled as invalid
 * @param [iconBeforeInput] - Icon displayed before the input field
 * @param [iconAfterInput] - Icon displayed after the input field
 * @param [cssClass] - Additional CSS classes applied to the input element
 * @param [containerCssClass] - Additional CSS classes applied to the container
 * @param [onChange] - Callback fired when the input value changes
 */
export const DialSearchInput = ({
  elementId,
  value,
  placeholder,
  disabled,
  invalid,
  readonly,
  iconAfterInput,
  iconBeforeInput,
  cssClass,
  containerCssClass,
  onChange,
}: DialSearchInputProps) => {
  return (
    <div
      className={classNames(
        'dial-input flex flex-row items-center justify-between',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        readonly && 'dial-input-readonly',
        containerCssClass,
      )}
    >
      <DialIcon icon={iconBeforeInput} />
      <input
        id={elementId}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value ?? ''}
        title={value ? String(value) : ''}
        disabled={disabled}
        className={classNames('border-0 bg-transparent', cssClass)}
        onChange={(event) => !readonly && onChange?.(event.currentTarget.value)}
      />
      <DialIcon icon={iconAfterInput} />
    </div>
  );
};
