import type { FC } from 'react';

import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { DialFieldLabel } from '@/components/Field/Field';
import { type DialInputFieldBaseProps } from '@/components/InputField/InputField';
import { DialTextarea } from '@/components/Textarea/Textarea';

export interface DialTextAreaFieldProps extends DialInputFieldBaseProps {
  onChange?: (value: string) => void;
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
 * @param required elementId - Unique identifier for the textarea element
 * @param optional fieldTitle - The label text for the field
 * @param optional value - The current value of the textarea
 * @param optional onChange - Callback function called when the textarea value changes
 * @param optional errorText - Error message to display below the textarea
 * @param optional optional - Whether to show optional indicator next to the label
 * @default false
 * @param optional readonly - Whether the textarea is read-only (no user input allowed)
 * @default false
 * @param optional elementCssClass - Additional CSS classes to apply to the textarea element
 * @param optional disabled - Whether the input is disabled and cannot be interacted with
 * @default false
 * @param optional invalid - Whether the input has validation errors (applies error styling)
 * @default false
 * @param optional defaultEmptyText - Text to display when readonly and value is empty
 * @default "None"
 * @param optional iconBeforeInput - Icon or element to display before the input
 * @param optional iconAfterInput - Icon or element to display after the input
 * @param optional textBeforeInput - Text to display before the input
 * @param optional elementCssClass - Additional CSS classes to apply to the input element
 * @param optional elementContainerCssClass - Additional CSS classes to apply to the input container
 * @param optional containerCssClass - Additional CSS classes to apply to the outer container
 */
export const DialTextAreaField: FC<DialTextAreaFieldProps> = ({
  fieldTitle,
  optional,
  elementId,
  elementCssClass,
  errorText,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <DialFieldLabel
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={elementId}
      />
      <DialTextarea
        textareaId={elementId}
        cssClass={elementCssClass}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
