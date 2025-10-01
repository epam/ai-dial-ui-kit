import { IconCheck, IconMinus } from '@tabler/icons-react';
import classNames from 'classnames';
import { type ChangeEvent, type FC, useCallback } from 'react';

import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { BASE_ICON_PROPS } from '@/constants/icon';

export interface DialCheckboxProps {
  id: string;
  label?: string;
  checked: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (value?: boolean, id?: string) => void;
}

export const DialCheckbox: FC<DialCheckboxProps> = ({
  label,
  id,
  checked,
  indeterminate,
  disabled,
  onChange,
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onChange?.(e.target.checked, id);
    },
    [onChange, id],
  );

  const checkboxClassNames = classNames(
    'flex flex-row items-center cursor-pointer text-accent-primary small-medium flex-1 min-w-0',
    `${checked ? '' : 'before:content-[""] before:inline-block before:w-[18px] before:h-[18px] before:border before:border-hover before:rounded before:mr-2'}`,
    disabled
      ? 'pointer-events-none text-secondary before:border-icon-secondary before:bg-layer-4'
      : '',
  );

  const iconClass = classNames(
    'mr-2 border rounded',
    disabled ? 'bg-layer-4 border-icon-secondary' : '',
  );

  return (
    <label className={checkboxClassNames} htmlFor={id}>
      {checked &&
        (indeterminate ? (
          <IconMinus className={iconClass} {...BASE_ICON_PROPS} />
        ) : (
          <IconCheck className={iconClass} {...BASE_ICON_PROPS} />
        ))}
      {label && (
        <DialTooltip tooltip={label} triggerClassName="flex-1 min-w-0">
          <p className="text-primary w-full truncate">{label}</p>
        </DialTooltip>
      )}
      <input
        type="checkbox"
        onChange={handleChange}
        id={id}
        checked={checked}
        className="invisible w-0 h-0"
      />
    </label>
  );
};
