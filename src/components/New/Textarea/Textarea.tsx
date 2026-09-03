import {
  type DetailedHTMLProps,
  type FC,
  type TextareaHTMLAttributes,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { CaptionText, ErrorText } from '../CaptionText/CaptionText';
import { Label, type LabelProps } from '../Label/Label';

export enum TextareaResize {
  None = 'none',
  Both = 'both',
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export interface TextareaProps extends DetailedHTMLProps<
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>,
  HTMLTextAreaElement
> {
  labelProps?: LabelProps;
  invalid?: boolean;
  containerClassName?: string;
  resize?: boolean | TextareaResize;
  error?: string;
  caption?: string;
  onChange?: (value: string) => void;
}

const resizeClassNames: Record<TextareaResize, string> = {
  [TextareaResize.None]: 'resize-none',
  [TextareaResize.Both]: 'resize',
  [TextareaResize.Horizontal]: 'resize-x',
  [TextareaResize.Vertical]: 'resize-y',
};

const resolveResizeClassName = (resize: boolean | TextareaResize): string => {
  if (typeof resize === 'boolean') {
    return resizeClassNames[resize ? TextareaResize.Both : TextareaResize.None];
  }

  return resizeClassNames[resize];
};

/**
 * A flexible textarea component with validation support and consistent styling
 * aliases: MultilineInput|TextBox
 * Design system 2.0
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
 * @param [labelProps] - Props for the field label, including `label` (label text) and `required` (whether to show required indicator)
 * @param [className=""] - Additional CSS classes to apply to the textarea element
 * @param [containerClassName=""] - Additional CSS classes to apply to the container div
 * @param [invalid=false] - Whether the textarea has validation errors (applies error styling)
 * @param [resize=false] - Whether/how the textarea can be resized. Accepts a boolean (`true` = both directions, `false` = none) or a {@link TextareaResize} value for a single axis (`horizontal`/`vertical`)
 * @param [error] - Error message to display below the textarea (also adds error styling)
 * @param [caption] - Optional caption text to display below the textarea
 */
export const Textarea: FC<TextareaProps> = ({
  className = '',
  value,
  onChange,
  error,
  containerClassName,
  resize = false,
  labelProps,
  caption,
  id,
  ...props
}) => {
  const textareaClassName = mergeClasses(
    'dial-kit-textarea dial-kit-input px-3 py-2',
    props.invalid && 'dial-kit-input-error',
    props.disabled && 'dial-kit-input-disable',
    resolveResizeClassName(resize),
    className,
  );

  return (
    <div className={mergeClasses('flex flex-col gap-2', containerClassName)}>
      {labelProps && <Label {...labelProps} htmlFor={id} />}
      <div className="flex flex-col gap-1">
        <textarea
          id={id}
          value={value || ''}
          className={textareaClassName}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          {...props}
        />
        <ErrorText text={error} />
        {!error && <CaptionText text={caption} />}
      </div>
    </div>
  );
};
