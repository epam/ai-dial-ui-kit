import classNames from 'classnames';
import type { ChangeEvent, FC, ReactNode } from 'react';

export interface DialRadioButtonProps {
  name: string;
  value: string;
  label?: ReactNode;
  caption?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  inputId: string;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  descriptionClassName?: string;
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
 * @param [label] - Visible label text
 * @param [caption] - Caption text describing label
 * @param [description] - Supporting text shown when checked
 * @param [checked=false] - Controlled checked state
 * @param inputId - ID associated with the label
 * @param [className] - Additional classes applied to the input element
 * @param [labelClassName] - Additional classes applied to the label element
 * @param [disabled] - Disabled state of the control
 * @param [onChange] - Callback fired with `value` when the radio is changed
 * @param [descriptionClassName] - Additional classes applied to the description block
 */
export const DialRadioButton: FC<DialRadioButtonProps> = ({
  name,
  value,
  label,
  description,
  checked = false,
  inputId,
  className,
  labelClassName,
  disabled,
  onChange,
  descriptionClassName,
  caption,
}) => {
  const descId = `${inputId}-desc`;

  const allLabelClassName = classNames(
    'dial-small-text cursor-pointer py-[1px]',
    disabled ? 'text-secondary' : 'text-primary',
    labelClassName,
  );

  const inputClassName = classNames(
    'cursor-pointer dial-input-radio',
    !!label && 'mr-2',
    className,
  );

  const containerClassName = classNames(
    'flex flex-col',
    !!description && 'mb-2',
  );

  const allDescriptionClassName = classNames(
    'dial-tiny-text mt-2 ml-[26px] text-secondary',
    descriptionClassName,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.checked) onChange?.(value);
  };

  return (
    <div className={containerClassName}>
      <div className="flex flex-row">
        <input
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          aria-describedby={checked && description ? descId : undefined}
          className={inputClassName}
          onChange={handleChange}
        />
        {(label || caption) && (
          <div className="flex flex-col gap-1 ml-2">
            {label && (
              <label
                className={allLabelClassName}
                htmlFor={inputId}
                aria-describedby={caption ? 'caption' : ''}
              >
                {label}
              </label>
            )}
            {caption && (
              <span id="caption" className="dial-tiny-text text-secondary">
                {caption}
              </span>
            )}
          </div>
        )}
      </div>
      {checked && description && (
        <div id={descId} className={allDescriptionClassName}>
          {description}
        </div>
      )}
    </div>
  );
};
