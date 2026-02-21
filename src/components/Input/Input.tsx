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
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  labelProps?: DialLabelProps;

  invalid?: boolean;
  errorText?: string;

  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  inputButtonIcon?: ReactNode;

  prefix?: string;
  postfix?: string;

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
    <div className={mergeClasses('flex flex-col gap-y-1', containerClassName)}>
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
}

const InputWrapper: FC<InputWrapperProps> = ({
  invalid,
  disabled,
  prefix,
  className,
  postfix,
  iconBefore,
  iconAfter,
  wrapperClassName,
  inputButtonIcon,
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
        'dial-input flex flex-row items-center gap-x-2 justify-between py-2 pr-2',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        !prefix && 'pl-3',
        wrapperClassName,
      )}
      aria-label="input-container"
    >
      {prefix && (
        <div className="border-r border-tertiary">
          <InputWrapper
            wrapperClassName="!rounded-r-none"
            className="truncate"
            value={prefix}
            disabled
            id={`${prefix}_textBefore`}
          />
        </div>
      )}

      <DialIcon icon={iconBefore} />

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

      {postfix && <p className="text-secondary dial-small-text"> {postfix}</p>}

      <DialIcon icon={iconAfter} />

      {inputButtonIcon && <div className="">{inputButtonIcon}</div>}
    </div>
  );
};
