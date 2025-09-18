import classNames from 'classnames';
import type { FC } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import type { InputBaseProps } from '@/models/field-control-props';

export interface DialInputProps extends InputBaseProps {
  type?: string;
  containerCssClass?: string;
  cssClass?: string;
  hideBorder?: boolean;
  onChange?: (value: string) => void;
}

/**
 * A flexible input component with icon support and various styling options
 *
 * @example
 * ```tsx
 * <DialInput
 *   elementId="search"
 *   placeholder="Search..."
 *   iconBeforeInput={<SearchIcon />}
 *   iconAfterInput={<ClearIcon />}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element
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
 * @param [min] - Minimum value for number inputs
 * @param [max] - Maximum value for number inputs
 * @param [prefix] - Text to display inside the input on the left
 * @param [suffix] - Text to display inside the input on the right
 * @param [textBeforeInput] - Text to display before the input in a separate field
 * @param [textAfterInput] - Text to display after the input in a separate field
 */
export const DialInput: FC<DialInputProps> = ({
  iconBeforeInput,
  iconAfterInput,
  hideBorder,
  value,
  elementId,
  placeholder = '',
  cssClass = '',
  containerCssClass,
  type = 'text',
  disabled,
  readonly,
  invalid,
  onChange,
  min,
  max,
  prefix,
  suffix,
  textBeforeInput,
  textAfterInput,
}) => {
  return (
    <div
      className={classNames(
        'dial-input-field flex flex-row items-center justify-between',
        hideBorder ? 'dial-input-no-border' : 'dial-input',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        readonly && 'dial-input-readonly',
        !textBeforeInput && 'pl-1',
        !textAfterInput && 'pr-1',
        containerCssClass,
      )}
    >
      {textBeforeInput && (
        <DialTooltip tooltip={textBeforeInput}>
          <DialInput
            hideBorder={true}
            containerCssClass="rounded-r-none border-r-0"
            cssClass="px-2 overflow-hidden overflow-ellipsis dial-small"
            value={textBeforeInput}
            disabled={true}
            elementId={textBeforeInput + 'textBefore'}
          />
        </DialTooltip>
      )}
      {prefix && <p className="text-secondary dial-small pl-2"> {prefix}</p>}
      <DialIcon icon={iconBeforeInput} className="pl-2" />

      <input
        type={type}
        autoComplete="new-password"
        id={elementId}
        placeholder={placeholder}
        value={value ?? ''}
        title={value ? String(value) : ''}
        disabled={disabled}
        min={min}
        max={max}
        className={classNames('border-0 bg-transparent px-2', cssClass)}
        onChange={(event) => !readonly && onChange?.(event.currentTarget.value)}
      />

      <DialIcon icon={iconAfterInput} className="pr-2" />
      {suffix && <p className="text-secondary dial-small pr-2"> {suffix}</p>}
      {textAfterInput && (
        <DialTooltip tooltip={textAfterInput}>
          <DialInput
            hideBorder={true}
            containerCssClass="rounded-l-none border-l-0"
            cssClass="px-2"
            value={textAfterInput}
            disabled={true}
            elementId={textAfterInput + 'textAfter'}
          />
        </DialTooltip>
      )}
    </div>
  );
};
