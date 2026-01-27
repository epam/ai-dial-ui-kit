import type { FC } from 'react';

import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { mergeClasses } from '@/utils/merge-classes';
import { DialFieldLabel } from '@/components/Field/Field';
import { type DialInputFieldBaseProps } from '@/components/InputField/InputField';
import { DialTextarea } from '@/components/Textarea/Textarea';

export interface DialTextAreaFieldProps extends DialInputFieldBaseProps {
  onChange?: (value: string) => void;
  disableTooltip?: boolean; // TODO: need?
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
 * @params - Component properties extending:
 * - {@link InputBaseProps} - Base input properties (id, value, placeholder, disabled, readOnly, invalid, etc.)
 *
 * @param [onChange] - Callback function called when the textarea value changes
 * @param [disableTooltip] - Whether to disable the tooltip that shows the full value on hover
 */
export const DialTextAreaField: FC<DialTextAreaFieldProps> = ({
  fieldTitle,
  optional,
  id,
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
        htmlFor={id}
      />
      <DialTextarea
        textareaId={id}
        className={elementClassName}
        containerClassName={elementContainerClassName}
        {...props}
      />
      <DialErrorText errorText={errorText} />
    </div>
  );
};
