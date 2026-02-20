import {
  type DetailedHTMLProps,
  type FC,
  type TextareaHTMLAttributes,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { DialLabel, type DialLabelProps } from '@/components/Label/Label';

export interface DialTextareaProps
  extends DetailedHTMLProps<
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>,
    HTMLTextAreaElement
  > {
  labelProps?: DialLabelProps;
  invalid?: boolean;
  containerClassName?: string;
  resize?: boolean;
  errorText?: string;
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
 * @params Component properties extending:
 * - {@link TextareaHTMLAttributes<HTMLTextAreaElement>} - Standard textarea attributes (id, value, placeholder, disabled, etc.)
 * - {@link HTMLTextAreaElement} - The underlying HTML textarea element type
 *
 * @param [onChange] - Callback function called when the textarea value changes
 * @param [labelProps] - Props for the field label, including `fieldLabel` (label text) and `required` (whether to show required indicator)
 * @param [className=""] - Additional CSS classes to apply to the textarea element
 * @param [containerClassName=""] - Additional CSS classes to apply to the container div
 * @param [invalid=false] - Whether the textarea has validation errors (applies error styling)
 * @param [resize=false] - Whether the textarea has possibility to resize
 * @param [errorText] - Error message to display below the textarea (also adds error styling)
 */
export const DialTextarea: FC<DialTextareaProps> = ({
  className = '',
  value,
  onChange,
  errorText,
  containerClassName,
  resize = false,
  labelProps,
  id,
  ...props
}) => {
  const textareaClassName = mergeClasses(
    'dial-textarea dial-input px-3 py-2',
    props.invalid && 'dial-input-error',
    props.disabled && 'dial-input-disable',
    resize ? 'resize' : 'resize-none',
    className,
  );

  return (
    <div className={mergeClasses('flex flex-col gap-y-1', containerClassName)}>
      {labelProps && <DialLabel {...labelProps} htmlFor={id} />}
      <textarea
        id={id}
        value={value || ''}
        className={textareaClassName}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
