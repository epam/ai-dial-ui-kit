import type { FC } from 'react';

import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { mergeClasses } from '@/utils/merge-classes';
import { DialFieldLabel } from '@/components/Field/Field';
import { type DialInputFieldBaseProps } from '@/components/InputField/InputField';
import { DialTextarea } from '@/components/Textarea/Textarea';

export interface DialTextAreaFieldProps extends DialInputFieldBaseProps {
  onChange?: (value: string) => void;
  disableTooltip?: boolean;
}

/**
 * A complete textarea field component that combines a field label, textarea input, and error text
 * with consistent styling and validation support
 *
 * @example
 * ```tsx
 * <DialTextAreaField
 *   fieldTitle="Description"
 *   elementId="description"
 *   value={description}
 *   onChange={(value) => setDescription(value)}
 *   errorText={errors.description}
 *   optional={true}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the textarea element
 * @param [fieldTitle] - The label text for the field
 * @param [value] - The current value of the textarea
 * @param [onChange] - Callback function called when the textarea value changes
 * @param [errorText] - Error message to display below the textarea
 * @param [optional=false] - Whether to show optional indicator next to the label
 * @param [readonly=false] - Whether the textarea is read-only (no user input allowed)
 * @param [disabled=false] - Whether the input is disabled and cannot be interacted with
 * @param [invalid=false] - Whether the input has validation errors (applies error styling)
 * @param [defaultEmptyText="None"] - Text to display when readonly and value is empty
 * @param [iconBefore] - Icon or element to display before the input
 * @param [iconAfter] - Icon or element to display after the input
 * @param [textBeforeInput] - Text to display before the input
 * @param [elementClassName] - Additional CSS classes to apply to the textarea element
 * @param [containerClassName] - Additional CSS classes to apply to the outer container
 * @param [elementContainerClassName] - Additional CSS classes to apply to the textarea container
 * @param [disableTooltip] - Whether to disable the tooltip that shows the full value on hover
 */
export const DialTextAreaField: FC<DialTextAreaFieldProps> = ({
  fieldTitle,
  optional,
  elementId,
  elementClassName,
  containerClassName,
  elementContainerClassName,
  errorText,
  ...props
}) => {
  return (
    <div className={mergeClasses('flex flex-col', containerClassName)}>
      <DialFieldLabel
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={elementId}
      />
      <DialTextarea
        textareaId={elementId}
        className={elementClassName}
        containerClassName={elementContainerClassName}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
