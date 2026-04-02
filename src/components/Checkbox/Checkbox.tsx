import { IconCheck, IconMinus } from '@tabler/icons-react';
import classNames from 'classnames';
import {
  type ChangeEvent,
  type FC,
  type ReactNode,
  useCallback,
  type LabelHTMLAttributes,
} from 'react';

import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { ariaDescription } from './constants';

export interface DialCheckboxProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  id: string;
  label?: ReactNode;
  checked: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  ariaLabel?: string;
  onChange?: (value?: boolean, id?: string) => void;
}

/**
 * A Checkbox component with styling options
 * aliases: ToggleCheckbox|MultiSelectOption
 *
 * @example
 * ```tsx
 * <DialCheckbox
 *   id="checkbox"
 *   label="Dial Checkbox"
 *   checked={true}
 *   disabled={false}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param id - Unique identifier for the checkbox element
 * @param [label] - The label text for the field
 * @param [checked] - The current value of the checkbox
 * @param [disabled=false] - Whether the checkbox is disabled
 * @param [indeterminate=false] - indeterminate state
 * @param [ariaLabel] - Accessible label for screen readers when no title is provided
 * @param [onChange] - Callback function called when the checkbox value changes
 * @param [className] - Additional CSS classes to apply to the checkbox wrapper
 */
export const DialCheckbox: FC<DialCheckboxProps> = ({
  label,
  id,
  checked,
  indeterminate,
  disabled,
  ariaLabel,
  onChange,
  className,
  ...labelProps
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked, id);
    },
    [onChange, id],
  );

  const checkboxClassName = classNames(
    'flex flex-row items-center cursor-pointer text-accent-primary small-medium min-w-0',
    `${checked || indeterminate ? '' : 'before:content-[""] before:inline-block before:w-[18px] before:h-[18px] before:border before:border-hover before:rounded'}`,
    disabled
      ? 'pointer-events-none text-secondary before:border-icon-secondary before:bg-layer-4'
      : '',
    className,
  );

  const iconClassName = classNames(
    'border rounded',
    disabled ? 'bg-layer-4 border-icon-secondary' : '',
  );

  const renderIcon = () => {
    if (indeterminate) {
      return <IconMinus className={iconClassName} {...BASE_ICON_PROPS} />;
    }
    if (checked) {
      return <IconCheck className={iconClassName} {...BASE_ICON_PROPS} />;
    }
    return null;
  };

  return (
    <label
      {...labelProps}
      className={checkboxClassName}
      htmlFor={id}
      aria-description={labelProps['aria-description'] || ariaDescription}
    >
      {renderIcon()}
      {label &&
        (typeof label === 'string' ? (
          <DialEllipsisTooltip text={label} className="ml-2 text-primary" />
        ) : (
          label
        ))}
      <input
        type="checkbox"
        role="checkbox"
        name={id}
        onChange={handleChange}
        id={id}
        checked={checked}
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled || undefined}
        aria-label={!label ? ariaLabel : undefined}
        className="invisible w-0 h-0"
      />
    </label>
  );
};
