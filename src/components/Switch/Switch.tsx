import classNames from 'classnames';
import { useCallback, type ChangeEvent, type FC } from 'react';

export interface DialSwitchProps {
  title?: string;
  switchId: string;
  isOn?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

/**
 * A flexible input component with icon support and various styling options
 *
 * @example
 * ```tsx
 * <DialSwitch
 *   switchId="switch"
 *   title="Toggle"
 *   isOn={true}
 *   disabled={false}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param switchId - Unique identifier for the switch element
 * @param [title] - The label text for the field
 * @param [isOn=false] - The current value of the switch
 * @param [disabled=false] - Whether the switch is disabled
 * @param [onChange] - Callback function called when the switch value changes
 */
export const DialSwitch: FC<DialSwitchProps> = ({
  title,
  switchId,
  isOn = false,
  disabled,
  onChange,
}) => {
  const switchClassName = classNames(
    'flex w-[36px] h-[18px] cursor-pointer items-center gap-1 rounded-full p-0.5 transition-all duration-200',
    'hover:bg-accent-primary-hover',
    isOn ? 'flex-row-reverse' : 'flex-row',
    disabled ? 'pointer-events-none' : '',
    disabled
      ? isOn
        ? 'bg-controls-disable'
        : 'bg-layer-4'
      : isOn
        ? 'bg-accent-primary'
        : 'bg-layer-4',
  );

  const onClick = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onChange?.(!isOn);
    },
    [onChange, isOn],
  );

  return (
    <div className="flex flex-row items-center">
      <input
        type="checkbox"
        onChange={onClick}
        id={switchId}
        disabled={disabled}
        className="invisible w-0 h-0"
        checked={isOn}
      />
      <label htmlFor={switchId} className={switchClassName}>
        <span
          className={classNames(
            'size-3 rounded-full',
            disabled
              ? !isOn
                ? 'bg-layer-4'
                : 'bg-controls-disable'
              : 'bg-controls-enable-primary',
          )}
        ></span>
      </label>
      {title && <span className="pl-2 dial-small text-primary">{title}</span>}
    </div>
  );
};
