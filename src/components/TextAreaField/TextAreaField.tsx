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
 * @param fieldTitle - The label text for the field
 * @param elementId - Unique identifier for the textarea element
 * @param value - The current value of the textarea
 * @param onChange - Callback function called when the textarea value changes
 * @param errorText - Error message to display below the textarea
 * @param optional - Whether to show optional indicator next to the label
 * @param readonly - Whether the textarea is read-only (no user input allowed)
 * @param elementCssClass - Additional CSS classes to apply to the textarea element
 */
const DialTextAreaField: FC<DialTextAreaFieldProps> = ({
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

export default DialTextAreaField;
