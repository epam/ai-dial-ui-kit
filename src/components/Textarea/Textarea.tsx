import {
  type DetailedHTMLProps,
  type FC,
  type TextareaHTMLAttributes,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DialErrorText } from '../ErrorText/ErrorText';

// TODO: add tooltip for disable textarea
export interface DialTextareaProps
  extends DetailedHTMLProps<
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>,
    HTMLTextAreaElement
  > {
  invalid?: boolean;
  containerClassName?: string;
  // disableTooltip?: boolean; // TODO: review after approve Design system
  onChange?: (value: string) => void;
  errorText?: string;
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
 * @params Component properties extending:
 * - {@link TextareaHTMLAttributes<HTMLTextAreaElement>} - Standard textarea attributes (id, value, placeholder, disabled, etc.)
 * - {@link HTMLTextAreaElement} - The underlying HTML textarea element type
 *
 * @param [onChange] - Callback function called when the textarea value changes
 * @param [className=""] - Additional CSS classes to apply to the textarea element
 * @param [containerClassName=""] - Additional CSS classes to apply to the container div
 * @param [invalid=false] - Whether the textarea has validation errors (applies error styling)
 * @param [disableTooltip] - Whether to disable the tooltip that shows the full value on hover
 * @param [errorText] - Error message to display below the textarea (also adds error styling)
 */
export const DialTextarea: FC<DialTextareaProps> = ({
  className = '',
  value,
  onChange,
  errorText,
  containerClassName,
  ...props
}) => {
  const textareaClassName = mergeClasses(
    'dial-textarea dial-input px-3 py-2',
    props.invalid && 'dial-input-error',
    props.disabled && 'dial-input-disable',
    className,
  );

  return (
    <div className={mergeClasses('flex flex-col', containerClassName)}>
      <textarea
        value={value || ''}
        className={textareaClassName}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
