import classNames from 'classnames';
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type FC,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';

import { useMergeRefs } from '@floating-ui/react';

import { DialIcon } from '@/components/Icon/Icon';
import { mergeClasses } from '@/utils/merge-classes';
import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { DialLabel, type DialLabelProps } from '@/components/Label/Label';
import { handleKeyDown } from './utils';

export interface DialInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'onChange'> {
  labelProps?: DialLabelProps;

  invalid?: boolean;
  errorText?: string;

  iconBefore?: ReactNode;
  iconAfter?: ReactNode;

  textBeforeInput?: string;
  textAfterInput?: string;

  prefix?: string;
  suffix?: string;

  inputRef?: Ref<HTMLInputElement>;

  onChange?: (value?: string) => void;

  containerClassName?: string;
  className?: string;
}

/**
 * A flexible input component with icon support and various styling options
 *
 * @example
 * ```tsx
 * <DialInput
 *   id="search"
 *   placeholder="Search..."
 *   iconBefore={<SearchIcon />}
 *   iconAfter={<ClearIcon />}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param [invalid] - Whether the input has validation errors (applies error styling)
 * @param [iconAfter] - Icon or element to display after the input
 * @param [iconBefore] - Icon or element to display before the input
 * @param [textBeforeInput] - Text to display before the input
 * @param [textAfterInput] - Text to display after the input
 * @param [prefix] - Text to display inside the input on the left
 * @param [suffix] - Text to display inside the input on the right
 * @param [containerClassName] - Additional CSS classes to apply to the container div
 * @param [className] - Additional CSS classes to apply to the input element
 * @param [inputRef] - Ref to access the underlying input element
 * @param [errorText] - Error message to display below the input (also adds error styling)
 * @param [onChange] - Callback function called when the input value changes
 */
export const DialInput: FC<DialInputProps> = ({
  labelProps,
  errorText,
  id,
  containerClassName,
  ...props
}) => {
  return (
    <div className={mergeClasses('flex flex-col', containerClassName)}>
      {labelProps && <DialLabel {...labelProps} htmlFor={id} />}

      <InputWrapper id={id} {...props} />
      <DialErrorText errorText={errorText} />
    </div>
  );
};

interface InputWrapperProps
  extends Omit<
    DialInputProps,
    'labelProps' | 'containerClassName' | 'errorText'
  > {
  wrapperClassName?: string;
  hideBorder?: boolean; // TODO: !!!
}

const InputWrapper: FC<InputWrapperProps> = ({
  invalid,
  disabled,
  textBeforeInput,
  className,
  textAfterInput,
  prefix,
  suffix,
  iconBefore,
  iconAfter,
  wrapperClassName,
  type,
  inputRef,
  value,
  min,
  onChange,
  max,
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
      className={mergeClasses(
        'flex flex-row items-center justify-between py-2',
        // hideBorder ? 'dial-input-no-border' : 'dial-input',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        !textBeforeInput && 'pl-3',
        !textAfterInput && 'pr-3',
        wrapperClassName,
      )}
      aria-label="input-container"
    >
      {textBeforeInput && (
        <div className="mr-2">
          <InputWrapper
            hideBorder
            wrapperClassName="rounded-r-none border-r-0"
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

      <input
        ref={ref}
        type={type}
        autoComplete={type === 'password' ? 'new-password' : 'off'}
        value={value ?? ''}
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

      <DialIcon
        icon={iconAfter}
        className={classNames(!!iconAfter && 'ml-2')}
      />

      {suffix && <p className="text-secondary dial-small ml-2"> {suffix}</p>}

      {textAfterInput && (
        <div className="ml-2">
          <InputWrapper
            hideBorder
            wrapperClassName="rounded-l-none border-l-0"
            value={textAfterInput}
            disabled
            id={`${textAfterInput}_textAfter`}
          />
        </div>
      )}
    </div>
  );
};
