import classNames from 'classnames';
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
  type Ref,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import type { InputBaseProps } from '@/models/field-control-props';
import { handleKeyDown } from './utils';
import { useMergeRefs } from '@floating-ui/react';

export interface DialInputProps extends InputBaseProps {
  type?: string;
  containerClassName?: string;
  className?: string;
  hideBorder?: boolean;
  tooltipText?: string;
  tooltipTriggerClassName?: string;
  hideTooltip?: boolean;
  inputRef?: Ref<HTMLInputElement>;
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
 *
 * @param type - The HTML input type (text, password, email, number, etc.)
 * @param containerClassName - Additional CSS classes to apply to the container div
 * @param className - Additional CSS classes to apply to the input element
 * @param hideBorder - Whether to hide the input border styling
 * @param tooltipText - The text to display inside the tooltip. If empty, the tooltip will display the value prop.
 * @param tooltipTriggerClassName - Additional CSS classes to apply to the tooltip
 * @param hideTooltip - Whether to hide the tooltip
 * @param onChange - Callback function called when the input value changes
 * @param onBlur - Callback function called when the input blurs
 */
export const DialInput: FC<DialInputProps> = ({
  iconBefore,
  iconAfter,
  hideBorder,
  className = '',
  containerClassName,
  tooltipTriggerClassName,
  type = 'text',
  value,
  readOnly,
  invalid,
  onChange,
  min,
  max,
  prefix,
  suffix,
  textBeforeInput,
  textAfterInput,
  onBlur,
  defaultValue,
  tooltipText,
  hideTooltip = false,
  inputRef,
  ...props
}) => {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const ref = useMergeRefs([inputRef, innerRef]);

  // disable mouse wheel changing input value
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const stopScroll = (e: Event) => {
      e.preventDefault();
    };

    el.addEventListener('wheel', stopScroll, { passive: false });

    return () => {
      el.removeEventListener('wheel', stopScroll);
    };
  }, []);

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
        if (min !== undefined && numericValue < +min) {
          return;
        }
        if (max !== undefined && numericValue > +max) {
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
        props.disabled && 'dial-input-disable',
        readOnly && 'dial-input-readonly',
        !textBeforeInput && 'pl-3',
        !textAfterInput && 'pr-3',
        containerClassName,
      )}
      aria-label="input-container"
    >
      {textBeforeInput && (
        <div className="mr-2">
          <DialInput
            hideBorder={true}
            containerClassName="rounded-r-none border-r-0"
            className="overflow-hidden overflow-ellipsis dial-small"
            value={textBeforeInput}
            disabled={true}
            id={textBeforeInput + 'textBefore'}
          />
        </div>
      )}
      {prefix && <p className="text-secondary dial-small mr-2"> {prefix}</p>}
      <DialIcon
        icon={iconBefore}
        className={classNames(!!iconBefore && 'mr-2')}
      />

      <DialTooltip
        tooltip={hideTooltip ? undefined : tooltipText || value}
        triggerClassName={classNames(tooltipTriggerClassName, 'flex-1')}
      >
        <input
          ref={ref}
          type={type}
          autoComplete="off"
          value={defaultValue ? undefined : (value ?? '')}
          className={classNames(
            'border-0 bg-transparent w-full truncate',
            className,
          )}
          onChange={(event) => !readOnly && handleChange?.(event)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          min={min}
          max={max}
          {...props}
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
            containerClassName="rounded-l-none border-l-0"
            value={textAfterInput}
            disabled={true}
            id={textAfterInput + 'textAfter'}
          />
        </div>
      )}
    </div>
  );
};
