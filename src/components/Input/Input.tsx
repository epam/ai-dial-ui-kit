import classNames from 'classnames';
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  type Ref,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import {
  DialTooltip,
  type DialTooltipProps,
} from '@/components/Tooltip/Tooltip';
import type { InputBaseProps } from '@/models/field-control-props';
import { useMergeRefs } from '@floating-ui/react';
import { handleKeyDown } from './utils';

export interface DialInputProps extends InputBaseProps {
  containerClassName?: string;
  className?: string;
  hideBorder?: boolean; // TODO: really need?
  tooltipProps?: DialTooltipProps;
  hideTooltip?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: (value?: string) => void;
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
 * - {@link InputBaseProps} - Base input properties (elementId, value, placeholder, disabled, invalid, icons, etc.)
 *
 * @param containerClassName - Additional CSS classes to apply to the container div
 * @param className - Additional CSS classes to apply to the input element
 * @param hideBorder - Whether to hide the input border styling
 * @param tooltipProps - Props to pass to the internal tooltip component
 * @param hideTooltip - Whether to hide the tooltip
 * @param onChange - Callback function called when the input value changes
 */
export const DialInput: FC<DialInputProps> = ({
  iconBefore,
  iconAfter,
  hideBorder,
  className = '',
  containerClassName,
  type = 'text',
  value,
  invalid,
  onChange,
  min,
  max,
  prefix,
  suffix,
  textBeforeInput,
  textAfterInput,
  defaultValue,
  hideTooltip = false,
  tooltipProps,
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
        !textBeforeInput && 'pl-3',
        !textAfterInput && 'pr-3',
        containerClassName,
      )}
      aria-label="input-container"
    >
      {textBeforeInput && (
        <div className="mr-2">
          <DialInput
            hideBorder
            containerClassName="rounded-r-none border-r-0"
            className="truncate"
            value={textBeforeInput}
            disabled
            id={`${textBeforeInput}_textBefore`}
          />
        </div>
      )}

      {prefix && <p className="text-secondary dial-small mr-2"> {prefix}</p>}

      <DialIcon
        icon={iconBefore}
        className={classNames(!!iconBefore && 'mr-2')}
      />

      <DialTooltip
        {...(hideTooltip
          ? { tooltip: null }
          : ({
              ...tooltipProps,
              triggerClassName: classNames(
                tooltipProps?.triggerClassName,
                'flex-1',
              ),
            } as DialTooltipProps))}
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
          onChange={handleChange}
          onKeyDown={onKeyDown}
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
            hideBorder
            containerClassName="rounded-l-none border-l-0"
            value={textAfterInput}
            disabled
            id={`${textAfterInput}_textAfter`}
          />
        </div>
      )}
    </div>
  );
};
