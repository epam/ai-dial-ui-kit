import classNames from 'classnames';
import type {
  ChangeEvent,
  FC,
  FocusEvent,
  KeyboardEvent,
  WheelEvent,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import type {
  InputBaseProps,
  NumberInputBaseProps,
} from '@/models/field-control-props';
import { handleKeyDown } from './utils';

export interface DialInputProps
  extends InputBaseProps,
    Partial<NumberInputBaseProps> {
  type?: string;
  containerCssClass?: string;
  cssClass?: string;
  hideBorder?: boolean;
  tooltipText?: string;
  tooltipTriggerClassName?: string;
  onChange?: (value?: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void;
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
 * @params Component properties extending:
 * - {@link InputBaseProps} - Base input properties (elementId, value, placeholder, disabled, readonly, invalid, icons, etc.)
 * - {@link NumberInputBaseProps} - Number input properties (min, max, isOnlyInteger) - partial
 *
 * @param type - The HTML input type (text, password, email, number, etc.)
 * @param containerCssClass - Additional CSS classes to apply to the container div
 * @param cssClass - Additional CSS classes to apply to the input element
 * @param hideBorder - Whether to hide the input border styling
 * @param tooltipText - The text to display inside the tooltip. If empty, the tooltip will display the value prop.
 * @param tooltipTriggerClassName - Additional CSS classes to apply to the tooltip
 * @param onChange - Callback function called when the input value changes
 * @param onBlur - Callback function called when the input blurs
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
  isOnlyInteger,
  prefix,
  suffix,
  textBeforeInput,
  textAfterInput,
  onBlur,
  defaultValue,
  tooltipText,
}) => {
  const handleWheel = (e: WheelEvent<HTMLInputElement>) =>
    (e.target as HTMLInputElement).blur();

  const isNumericInput =
    type === 'number' || min !== undefined || max !== undefined;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e, type, min, max, isOnlyInteger);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;

    if (isNumericInput && newValue !== '') {
      const numericValue = parseFloat(newValue);

      // If it's not a valid number (except for partial inputs like "-" or ".")
      if (isNaN(numericValue) && newValue !== '-' && newValue !== '.') {
        return;
      }

      // Forbid "." for integer-only inputs
      if (newValue.includes('.') && isOnlyInteger) {
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

    onChange?.(!newValue ? void 0 : newValue);
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
        <div className="mr-2">
          <DialInput
            hideBorder={true}
            containerCssClass="rounded-r-none border-r-0"
            cssClass="overflow-hidden overflow-ellipsis dial-small"
            value={textBeforeInput}
            disabled={true}
            elementId={textBeforeInput + 'textBefore'}
          />
        </div>
      )}
      {prefix && <p className="text-secondary dial-small mr-2"> {prefix}</p>}
      <DialIcon
        icon={iconBefore}
        className={classNames(!!iconBefore && 'mr-2')}
      />

      <DialTooltip
        tooltip={tooltipText || value}
        triggerClassName={classNames(tooltipTriggerClassName, 'flex-1')}
      >
        <input
          type={type}
          autoComplete="off"
          id={elementId}
          placeholder={placeholder}
          value={defaultValue ? undefined : (value ?? '')}
          disabled={disabled}
          className={classNames(
            'border-0 bg-transparent w-full truncate',
            cssClass,
          )}
          onChange={(event) => !readonly && handleChange?.(event)}
          onKeyDown={onKeyDown}
          onWheel={handleWheel}
          onBlur={onBlur}
          min={min}
          max={max}
          defaultValue={defaultValue}
        />
      </DialTooltip>

      <DialIcon
        icon={iconAfter}
        className={classNames(!!iconAfter && 'ml-2')}
      />
      {suffix && <p className="text-secondary dial-small ml-2"> {suffix}</p>}
      {textAfterInput && (
        <div className="ml-2">
          <DialInput
            hideBorder={true}
            containerCssClass="rounded-l-none border-l-0"
            value={textAfterInput}
            disabled={true}
            elementId={textAfterInput + 'textAfter'}
          />
        </div>
      )}
    </div>
  );
};
