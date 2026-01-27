import classNames from 'classnames';
import {
  useCallback,
  type ChangeEvent,
  type DetailedHTMLProps,
  type FC,
  type TextareaHTMLAttributes,
} from 'react';

import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialTextareaProps
  extends DetailedHTMLProps<
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>,
    HTMLTextAreaElement
  > {
  containerClassName?: string; // TODO: need?
  invalid?: boolean;
  disableTooltip?: boolean; // TODO: review after approve Design system
  onChange?: (value: string) => void;
}

/**
 * A flexible textarea component with validation support and consistent styling
 *
 * @example
 * ```tsx
 * <DialTextarea
 *   id="description"
 *   placeholder="Enter description..."
 *   value={value}
 *   onChange={(value) => setValue(value)}
 * />
 * ```
 *
 * @param [onChange] - Callback function called when the textarea value changes
 * @param [className=""] - Additional CSS classes to apply to the textarea element
 * @param [containerClassName=""] - Additional CSS classes to apply to the container div
 * @param [disableTooltip] - Whether to disable the tooltip that shows the full value on hover
 */
export const DialTextarea: FC<DialTextareaProps> = ({
  className = '',
  containerClassName = '', // TODO: Use?
  value,
  readOnly,
  disableTooltip,
  onChange,
  disabled,
  ...props
}) => {
  const textareaClassName = classNames(
    'dial-textarea dial-input px-3 py-2',
    props.invalid && 'dial-input-error',
    disabled && 'dial-input-disable',
    readOnly && 'dial-input-readonly',
    className,
  );

  const onChangeValue = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!readOnly) {
        onChange?.(event.currentTarget.value);
      }
    },
    [onChange, readOnly],
  );

  return (
    <DialTooltip
      tooltip={disabled ? value : null}
      triggerClassName={mergeClasses('flex', containerClassName)}
    >
      <textarea
        className={textareaClassName}
        onChange={onChangeValue}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
    </DialTooltip>
  );
};
