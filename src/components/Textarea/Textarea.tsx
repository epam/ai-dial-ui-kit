import classNames from 'classnames';
import type { FC } from 'react';

import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialTextareaProps {
  value?: string | number | null;
  placeholder?: string;
  textareaId?: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  invalid?: boolean;
  readonly?: boolean;
  disableTooltip?: boolean;
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
 * @param textareaId - Unique identifier for the textarea element
 * @param [value] - The current value of the textarea
 * @param [onChange] - Callback function called when the textarea value changes
 * @param [placeholder] - Placeholder text displayed when textarea is empty
 * @param [className=""] - Additional CSS classes to apply to the textarea element
 * @param [containerClassName=""] - Additional CSS classes to apply to the container div
 * @param [disabled=false] - Whether the textarea is disabled
 * @param [readonly=false] - Whether the textarea is read-only (no user input allowed)
 * @param [invalid=false] - Whether the textarea has validation errors (applies error styling)
 * @param [disableTooltip] - Whether to disable the tooltip that shows the full value on hover
 */
export const DialTextarea: FC<DialTextareaProps> = ({
  value,
  textareaId,
  placeholder,
  className = '',
  containerClassName = '',
  disabled,
  invalid,
  readonly,
  disableTooltip,
  onChange,
}) => {
  return (
    <DialTooltip
      tooltip={disableTooltip ? null : value}
      triggerClassName={mergeClasses('flex', containerClassName)}
    >
      <textarea
        id={textareaId}
        placeholder={placeholder}
        value={value || ''}
        disabled={disabled}
        className={classNames(
          'dial-textarea dial-input px-3 py-2',
          invalid && 'dial-input-error',
          disabled && 'dial-input-disable',
          readonly && 'dial-input-readonly',
          className,
        )}
        onChange={(event) => !readonly && onChange?.(event.currentTarget.value)}
      />
    </DialTooltip>
  );
};
