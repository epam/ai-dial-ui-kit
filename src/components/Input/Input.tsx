import classNames from 'classnames';
import type { ChangeEvent, FC, KeyboardEvent, WheelEvent } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import type { InputBaseProps } from '@/models/field-control-props';
import { handleKeyDown } from './utils';

export interface DialInputProps extends InputBaseProps {
  type?: string;
  containerCssClass?: string;
  cssClass?: string;
  hideBorder?: boolean;
  tooltipTriggerClassName?: string;
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
 *   iconBefore={<SearchIcon />}
 *   iconAfter={<ClearIcon />}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element
 * @param [value] - The current value of the input
 * @param [onChange] - Callback function called when the input value changes
 * @param [iconBefore] - Icon or element to display before the input
 * @param [iconAfter] - Icon or element to display after the input
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
 * @param [tooltipTriggerClassName] - Additional CSS classes to apply to the tooltip
 * @param [textAfterInput] - Text to display after the input in a separate field
 */
export const DialInput: FC<DialInputProps> = ({
  iconBefore,
  iconAfter,
  hideBorder,
  value,
  elementId,
  placeholder = '',
  cssClass = '',
  containerCssClass,
  tooltipTriggerClassName,
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
  const handleWheel = (e: WheelEvent<HTMLInputElement>) =>
    (e.target as HTMLInputElement).blur();

  const isNumericInput =
    type === 'number' || min !== undefined || max !== undefined;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e, type, min, max);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;

    if (isNumericInput && newValue !== '') {
      const numericValue = parseFloat(newValue);

      // If it's not a valid number (except for partial inputs like "-" or ".")
      if (isNaN(numericValue) && newValue !== '-' && newValue !== '.') {
        return;
      }

      // Check range constraints for complete numbers
      if (!isNaN(numericValue)) {
        if (min !== undefined && numericValue < min) {
          return;
        }
        if (max !== undefined && numericValue > max) {
          return;
        }
      }
    }

    onChange?.(newValue);
  };

  return (
    <div
      className={classNames(
        'dial-input-field flex flex-row items-center justify-between py-2',
        hideBorder ? 'dial-input-no-border' : 'dial-input',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        readonly && 'dial-input-readonly',
        !textBeforeInput && 'pl-3',
        !textAfterInput && 'pr-3',
        containerCssClass,
      )}
    >
      {textBeforeInput && (
        <div>
          <DialInput
            hideBorder={true}
            containerCssClass="rounded-r-none border-r-0"
            cssClass="px-2 overflow-hidden overflow-ellipsis dial-small"
            value={textBeforeInput}
            disabled={true}
            elementId={textBeforeInput + 'textBefore'}
          />
        </div>
      )}
      {prefix && <p className="text-secondary dial-small"> {prefix}</p>}
      <DialIcon icon={iconBefore} />

      <DialTooltip
        tooltip={value}
        triggerClassName={classNames(tooltipTriggerClassName, 'flex-1')}
      >
        <input
          type={type}
          autoComplete="off"
          id={elementId}
          placeholder={placeholder}
          value={value ?? ''}
          disabled={disabled}
          className={classNames('border-0 bg-transparent px-2', cssClass)}
          onChange={(event) => !readonly && handleChange?.(event)}
          onKeyDown={onKeyDown}
          onWheel={handleWheel}
          min={min}
          max={max}
        />
      </DialTooltip>

      <DialIcon icon={iconAfter} />
      {suffix && <p className="text-secondary dial-small"> {suffix}</p>}
      {textAfterInput && (
        <div>
          <DialInput
            hideBorder={true}
            containerCssClass="rounded-l-none border-l-0"
            cssClass="px-2"
            value={textAfterInput}
            disabled={true}
            elementId={textAfterInput + 'textAfter'}
          />
        </div>
      )}
    </div>
  );
};
