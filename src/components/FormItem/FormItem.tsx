import { useCallback, type FC, type ReactNode } from 'react';

import { DialErrorText } from '@/components/ErrorText/ErrorText';

import { DialFieldLabel } from '@/components/Field/Field';
import {
  FormItemOrientation,
  type DialFormItemBaseProps,
} from '@/types/form-item';
import { containerBaseClassName, orientationClassMap } from './constants';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialFormItemProps extends DialFormItemBaseProps {
  id?: string;
  labelVisuallyHidden?: boolean;
  className?: string;
  childrenClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  children: ReactNode;
  value?: ReactNode;
  defaultEmptyText?: string;
}

/**
 * A layout wrapper for form controls with label, helper text and error message.
 *
 * Uses `DialFieldLabel` for the label and `DialErrorText` for consistent error styling.
 * Wires accessibility with:
 * - `role="group"`
 * - `aria-labelledby` (when label is present)
 * - `aria-describedby` (description and/or error ids)
 *
 * @example
 * ```tsx
 * <DialFormItem elementId="transport" label="Transport" className="w-[320px]">
 *   <DialSelect
 *     elementId="transport"
 *     value={transport}
 *     options={transportOptions}
 *     onChange={(val) => setTransport(val as ToolsetTransport)}
 *   />
 * </DialFormItem>
 *
 * // With description and error
 * <DialFormItem
 *   elementId="email"
 *   label="Email Address"
 *   description="We'll never share your email."
 *   error="Please enter a valid email address."
 * >
 *   <DialInput
 *     elementId="email"
 *     type="email"
 *     value={email}
 *     onChange={(val) => setEmail(val as string)}
 *     placeholder="name@company.com"
 *   />
 * </DialFormItem>
 * ```
 *
 * @params - Component properties extending:
 * - {@link DialFormItemBaseProps} - Form item properties (label, error, description, orientation, etc.)
 *
 * @param id - Unique identifier for the form control element (used for accessibility)
 * @param labelVisuallyHidden - Whether to visually hide the label (still accessible to screen readers, default: false)
 * @param className - Additional CSS classes to apply to the container div
 * @param childrenClassName - Additional CSS classes to apply to the children container div
 * @param labelClassName - Additional CSS classes to apply to the label element
 * @param errorClassName - Additional CSS classes to apply to the error message element
 * @param children - The form control element(s) to render inside the DialFormItem
 * @param value - The current value of the form control (for readonly mode)
 * @param defaultEmptyText - Text to display when readonly and value is empty (default: "None")
 */
export const DialFormItem: FC<DialFormItemProps> = ({
  id,
  label,
  optional,
  optionalText,
  description,
  error,
  orientation = FormItemOrientation.Vertical,
  labelVisuallyHidden = false,
  className,
  labelClassName,
  errorClassName,
  childrenClassName,
  captionDescription,
  readonly,
  value,
  defaultEmptyText,
  children,
}) => {
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-err` : undefined;
  const captionDescriptionId = `${id}-caption-desc`;

  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const renderError = useCallback(() => {
    if (typeof error === 'boolean') {
      return null;
    }

    if (typeof error === 'string' || typeof error === 'undefined') {
      return error ? (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className={errorClassName}
        >
          <DialErrorText errorText={error} />
        </div>
      ) : null;
    }

    return (
      <div
        id={errorId}
        role="alert"
        aria-live="polite"
        className={errorClassName}
      >
        {error}
      </div>
    );
  }, [error, errorClassName, errorId]);

  const renderReadonlyValue = useCallback(() => {
    if (!value) {
      return (
        <span className="flex min-h-4" aria-readonly="true">
          {defaultEmptyText ?? 'None'}
        </span>
      );
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return <span aria-readonly="true">{value}</span>;
    }

    return value;
  }, [value, defaultEmptyText]);

  return (
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={describedBy}
      className={mergeClasses(
        containerBaseClassName,
        orientationClassMap[orientation],
        className,
      )}
    >
      {label && (
        <div
          id={labelId}
          className={mergeClasses(orientation === 'horizontal' && 'shrink-0')}
        >
          <DialFieldLabel
            htmlFor={id}
            fieldTitle={label}
            optional={optional}
            optionalText={optionalText}
            className={mergeClasses(
              labelVisuallyHidden && 'sr-only',
              labelClassName,
            )}
            description={description}
          />
        </div>
      )}

      <div className={mergeClasses('min-w-0 w-full', childrenClassName)}>
        {readonly ? (
          <div className="dial-input px-3 py-2">{renderReadonlyValue()}</div>
        ) : (
          children
        )}
        {captionDescription && (
          <div
            id={captionDescriptionId}
            className={mergeClasses({
              'dial-tiny text-secondary mt-1': true,
              'text-error': !!error,
            })}
          >
            {captionDescription}
          </div>
        )}
        {renderError()}
      </div>
    </div>
  );
};
