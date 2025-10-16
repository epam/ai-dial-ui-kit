import { useCallback, type FC, type ReactNode } from 'react';

import { DialErrorText } from '@/components/ErrorText/ErrorText';

import { DialFieldLabel } from '@/components/Field/Field';
import { FormItemOrientation } from '@/types/form-item';
import { containerBaseClasses, orientationClassMap } from './constants';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialFormItemProps {
  elementId: string;
  label?: string | ReactNode;
  optional?: boolean;
  optionalText?: string;
  description?: string;
  error?: string | ReactNode | boolean;
  orientation?: FormItemOrientation;
  labelVisuallyHidden?: boolean;
  cssClass?: string;
  labelCssClass?: string;
  errorCssClass?: string;
  children: ReactNode;
  captionDescription?: string;
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
 * <DialFormItem elementId="transport" label="Transport" cssClass="w-[320px]">
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
 * @param elementId - Unique identifier for the form control element (used for accessibility)
 * @param [label] - The label text or ReactNode to display above the form control
 * @param [optional=false] - Whether the field is optional (displays "(Optional)" indicator)
 * @param [optionalText="(Optional)"] - Custom text for optional indicator
 * @param [description] - Additional description text, displayed below the label.
 * @param [error] - Error message text or ReactNode to display below the form control (replaces description when present)
 * @param [orientation='vertical'] - Layout orientation, either 'vertical' (label above control) or 'horizontal' (label to the left)
 * @param [labelVisuallyHidden=false] - Whether to visually hide the label (still accessible to screen readers)
 * @param [cssClass] - Additional CSS classes to apply to the container div
 * @param [labelCssClass] - Additional CSS classes to apply to the label element
 * @param [errorCssClass] - Additional CSS classes to apply to the error message element
 * @param [captionDescription] - Additional caption description text, displayed below the form control.
 * @param children - The form control element(s) to render inside the DialFormItem
 */
export const DialFormItem: FC<DialFormItemProps> = ({
  elementId,
  label,
  optional,
  optionalText,
  description,
  error,
  orientation = FormItemOrientation.Vertical,
  labelVisuallyHidden = false,
  cssClass,
  labelCssClass,
  errorCssClass,
  captionDescription,
  children,
}) => {
  const labelId = `${elementId}-label`;
  const descriptionId = description ? `${elementId}-desc` : undefined;
  const errorId = error ? `${elementId}-err` : undefined;
  const captionDescriptionId = `${elementId}-caption-desc`;

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
          className={errorCssClass}
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
        className={errorCssClass}
      >
        {error}
      </div>
    );
  }, [error, errorCssClass, errorId]);

  return (
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={describedBy}
      className={mergeClasses(
        containerBaseClasses,
        orientationClassMap[orientation],
        cssClass,
      )}
    >
      {label && (
        <div
          id={labelId}
          className={mergeClasses(orientation === 'horizontal' && 'shrink-0')}
        >
          <DialFieldLabel
            htmlFor={elementId}
            fieldTitle={label}
            optional={optional}
            optionalText={optionalText}
            cssClass={mergeClasses(
              labelVisuallyHidden && 'sr-only',
              labelCssClass,
            )}
            description={description}
          />
        </div>
      )}

      <div className="min-w-0 w-full">
        {children}
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
