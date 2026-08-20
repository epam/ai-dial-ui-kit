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
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { CaptionText, ErrorText } from '../CaptionText/CaptionText';
import { Label, type LabelProps } from '../Label/Label';
import { InputButton, type InputButtonProps } from './Button/InputButton';
import { handleKeyDown } from './utils';

/**
 * Per-size metrics for the field. Height and typography are not here: they live
 * in `input.scss`, because a utility class would lose the cascade to the
 * unlayered `.dial-kit-input` — see the comment on `.dial-kit-input-small`.
 */
const SIZE_CLASSES: Record<
  ElementSize,
  {
    /** Gap between the field's slots, plus the height/typography modifier. */
    field: string;
    /** Inline padding, used only when no prefix / input button occupies the edge. */
    paddingStart: string;
    paddingEnd: string;
    /** Gap between the label, the field and the caption. */
    stackGap: string;
    postfixText: string;
  }
> = {
  [ElementSize.Small]: {
    field: 'dial-kit-input-small gap-x-1',
    paddingStart: 'pl-2',
    paddingEnd: 'pr-2',
    stackGap: 'gap-1',
    postfixText: 'dial-tiny-text',
  },
  [ElementSize.Standard]: {
    field: 'gap-x-2 py-2',
    paddingStart: 'pl-3',
    paddingEnd: 'pr-3',
    stackGap: 'gap-2',
    postfixText: 'dial-small-text',
  },
  [ElementSize.Large]: {
    field: 'gap-x-2 py-3',
    paddingStart: 'pl-4',
    paddingEnd: 'pr-4',
    stackGap: 'gap-2',
    postfixText: 'dial-body-text',
  },
};

// `size` shadows the native input attribute (a character-width number) on
// purpose: every 2.0 control sizes itself through the ElementSize enum.
export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'size'
> {
  labelProps?: LabelProps;
  inputButtonProps?: InputButtonProps;

  size?: ElementSize;

  invalid?: boolean;
  error?: string;
  caption?: string;
  tooltipText?: string;

  iconBefore?: ReactNode;
  iconAfter?: ReactNode;

  /**
   * Content rendered inside the field, between `iconBefore` and the input, for
   * values a plain `<input>` cannot hold — the tags of a multi-select, a value
   * with its own markup. When the slot stands in for the value, give the input
   * itself a zero width through `className` so it keeps taking focus without
   * competing for space.
   */
  children?: ReactNode;

  prefix?: string;
  postfix?: string;

  inputRef?: Ref<HTMLInputElement>;

  /**
   * Ref to the field wrapper — the bordered box holding the icons, the content
   * slot and the input. Use it to measure the space `children` has to fit into;
   * the input itself only ever reports its own share of the row.
   */
  wrapperRef?: Ref<HTMLDivElement>;

  onChange?: (value?: string) => void;

  containerClassName?: string;
  wrapperClassName?: string;
}

/**
 * A flexible input component with icon support and various styling options
 * aliases: TextField|FormInput
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <Input
 *   id="search"
 *   placeholder="Search..."
 *   iconBefore={<SearchIcon />}
 *   iconAfter={<ClearIcon />}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param [size=ElementSize.Standard] - The size of the input, which can be 'small', 'standard', or 'large'.
 * @param [invalid] - Whether the input has validation errors (applies error styling)
 * @param [iconAfter] - Icon or element to display after the input
 * @param [iconBefore] - Icon or element to display before the input
 * @param [children] - Content rendered inside the field before the input, for values a plain `<input>` cannot hold (e.g. multi-select tags)
 * @param [textBeforeInput] - Text to display before the input
 * @param [suffix] - Text to display inside the input on the right
 * @param [containerClassName] - Additional CSS classes to apply to the container div
 * @param [wrapperClassName] - Additional CSS classes to apply to the input wrapper div
 * @param [className] - Additional CSS classes to apply to the input element
 * @param [inputRef] - Ref to access the underlying input element
 * @param [error] - Error message to display below the input (also adds error styling)
 * @param [caption] - Helper text to display below the input
 * @param [onChange] - Callback function called when the input value changes
 */
export const Input: FC<InputProps> = ({
  labelProps,
  error,
  caption,
  id,
  containerClassName,
  size = ElementSize.Standard,
  ...props
}) => {
  return (
    <div
      className={mergeClasses(
        'flex flex-col',
        SIZE_CLASSES[size].stackGap,
        containerClassName,
      )}
    >
      {labelProps && <Label {...labelProps} htmlFor={id} />}

      <div className="flex flex-col gap-1">
        <InputWrapper id={id} size={size} {...props} />
        <ErrorText text={error} />
        {!error && <CaptionText text={caption} />}
      </div>
    </div>
  );
};

type InputWrapperProps = Omit<
  InputProps,
  'labelProps' | 'containerClassName' | 'errorText'
>;

const InputWrapper: FC<InputWrapperProps> = ({
  invalid,
  disabled,
  prefix,
  className,
  postfix,
  children,
  iconBefore,
  iconAfter,
  wrapperClassName,
  type,
  inputRef,
  value,
  tooltipText,
  min,
  onChange,
  max,
  inputButtonProps,
  wrapperRef,
  size = ElementSize.Standard,
  ...props
}) => {
  const sizeClasses = SIZE_CLASSES[size];
  const innerRef = useRef<HTMLInputElement | null>(null);
  const ref = useMergeRefs([inputRef, innerRef]);

  const isNumericInput =
    type === 'number' || min !== undefined || max !== undefined;

  // Prevent mouse wheel from changing numeric input values only.
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !isNumericInput || disabled) return;

    const stopScroll = (e: Event) => {
      e.preventDefault();
    };

    el.addEventListener('wheel', stopScroll, { passive: false });

    return () => {
      el.removeEventListener('wheel', stopScroll);
    };
  }, [disabled, isNumericInput, type]);

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

  const input = () => {
    return (
      <div
        ref={wrapperRef}
        className={mergeClasses(
          'dial-kit-input flex flex-row items-center justify-between',
          sizeClasses.field,
          invalid && 'dial-kit-input-error',
          disabled && 'dial-kit-input-disable',
          !prefix && sizeClasses.paddingStart,
          !inputButtonProps && sizeClasses.paddingEnd,
          wrapperClassName,
        )}
        aria-label="input-container"
      >
        {prefix && (
          <div className="border-r border-secondary">
            <InputWrapper
              wrapperClassName="!rounded-r-none"
              className="truncate"
              value={prefix}
              disabled
              size={size}
              id={`${prefix}_textBefore`}
            />
          </div>
        )}

        <DialIcon icon={iconBefore} />

        {children}

        <input
          ref={ref}
          type={type}
          autoComplete={type === 'password' ? 'new-password' : 'off'}
          value={value ?? ''}
          className={mergeClasses(
            'border-0 bg-transparent w-full truncate',
            disabled && 'cursor-not-allowed',
            className,
          )}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          min={min}
          disabled={disabled}
          max={max}
          {...props}
        />

        {postfix && (
          <p
            className={mergeClasses('text-secondary', sizeClasses.postfixText)}
          >
            {' '}
            {postfix}
          </p>
        )}

        <DialIcon icon={iconAfter} />

        {inputButtonProps && (
          <InputButton size={size} {...inputButtonProps} disabled={disabled} />
        )}
      </div>
    );
  };

  return disabled && type !== 'password' ? (
    <DialTooltip tooltip={tooltipText || value}>{input()}</DialTooltip>
  ) : (
    input()
  );
};
