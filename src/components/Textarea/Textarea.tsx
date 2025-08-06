import classNames from 'classnames';
import type { FC } from 'react';

export interface DialTextareaProps {
  value?: string | number;
  placeholder?: string;
  textareaId: string;
  cssClass?: string;
  disabled?: boolean;
  invalid?: boolean;
  readonly?: boolean;
  onChange?: (value: string) => void;
}

/**
 * A flexible textarea component with validation support and consistent styling
 *
 * @example
 * ```tsx
 * <DialTextarea
 *   textareaId="description"
 *   placeholder="Enter description..."
 *   value={value}
 *   onChange={(value) => setValue(value)}
 * />
 * ```
 *
 * @param required textareaId - Unique identifier for the textarea element
 * @param [value] - The current value of the textarea
 * @param [onChange] - Callback function called when the textarea value changes
 * @param [placeholder] - Placeholder text displayed when textarea is empty
 * @param [cssClass=""] - Additional CSS classes to apply to the textarea element
 * @param [disabled=false] - Whether the textarea is disabled
 * @param [readonly=false] - Whether the textarea is read-only (no user input allowed)
 * @param [invalid=false] - Whether the textarea has validation errors (applies error styling)
 */
export const DialTextarea: FC<DialTextareaProps> = ({
  value,
  textareaId,
  placeholder,
  cssClass = '',
  disabled,
  invalid,
  readonly,
  onChange,
}) => {
  return (
    <textarea
      id={textareaId}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      className={classNames(
        'dial-textarea dial-input',
        invalid ? 'dial-input-error' : '',
        disabled && 'dial-input-disable',
        readonly && 'dial-input-readonly',
        cssClass,
      )}
      onChange={(event) => !readonly && onChange?.(event.currentTarget.value)}
    />
  );
};
