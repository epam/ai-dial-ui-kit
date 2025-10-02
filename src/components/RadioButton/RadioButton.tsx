import classNames from 'classnames';
import type { ChangeEvent, FC, ReactNode } from 'react';

export interface DialRadioButtonProps {
  name: string;
  value: string;
  title?: string;
  description?: ReactNode;
  checked?: boolean;
  inputId: string;
  cssClass?: string;
  labelCssClass?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  descriptionCssClass?: string;
}

/**
 * A stylized, accessible radio input with optional description.
 *
 * Renders a native `<input type="radio" />` paired with a label. When `checked`
 * and `description` are provided, a supporting text block appears under the control.
 *
 * @example
 * ```tsx
 * <DialRadioButton
 *   name="plan"
 *   value="pro"
 *   inputId="radio-pro"
 *   title="Pro plan"
 *   description="Includes all advanced features."
 *   checked
 *   onChange={(v) => console.log('changed', v)}
 * />
 * ```
 *
 * @param name - Radio group name
 * @param value - Radio value emitted on change
 * @param [title] - Visible label text
 * @param [description] - Supporting text shown when checked
 * @param [checked=false] - Controlled checked state
 * @param inputId - ID associated with the label
 * @param [cssClass] - Additional classes applied to the input element
 * @param [labelCssClass] - Additional classes applied to the label element
 * @param [disabled] - Disabled state of the control
 * @param [onChange] - Callback fired with `value` when the radio is changed
 * @param [descriptionCssClass] - Additional classes applied to the description block
 */
export const DialRadioButton: FC<DialRadioButtonProps> = ({
  name,
  value,
  title,
  description,
  checked = false,
  inputId,
  cssClass,
  labelCssClass,
  disabled,
  onChange,
  descriptionCssClass,
}) => {
  const descId = `${inputId}-desc`;

  const labelClasses = classNames(
    'dial-small cursor-pointer',
    disabled ? 'text-secondary' : 'text-primary',
    labelCssClass,
  );

  const inputClasses = classNames(
    'cursor-pointer dial-input-radio',
    title && 'mr-2',
    checked && 'bg-accent-primary',
    cssClass,
  );

  const containerClasses = classNames('flex flex-col', !!description && 'mb-2');

  const descriptionClasses = classNames(
    'dial-tiny mt-2 ml-[26px] text-secondary',
    descriptionCssClass,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.checked) onChange?.(value);
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-row items-center">
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          aria-describedby={checked && description ? descId : undefined}
          className={inputClasses}
          onChange={handleChange}
        />
        {title ? (
          <label className={labelClasses} htmlFor={inputId}>
            {title}
          </label>
        ) : null}
      </div>
      {checked && description && (
        <div id={descId} className={descriptionClasses}>
          {description}
        </div>
      )}
    </div>
  );
};
