import classNames from 'classnames';
import { useCallback, type ChangeEvent, type FC, type ReactNode } from 'react';

export interface DialSwitchProps {
  label?: ReactNode;
  switchId: string;
  isOn?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  caption?: string;
}

/**
 * A Switch component with various styling options
 *
 * @example
 * ```tsx
 * <DialSwitch
 *   switchId="switch"
 *   label="Toggle"
 *   isOn={true}
 *   disabled={false}
 *   onChange={(value) => console.log(value)}
 *   caption="Caption"
 * />
 * ```
 *
 * @param switchId - Unique identifier for the switch element
 * @param [title] - The label text for the field
 * @param [isOn=false] - The current value of the switch
 * @param [disabled=false] - Whether the switch is disabled
 * @param [onChange] - Callback function called when the switch value changes
 * @param [caption] - Caption text
 */
export const DialSwitch: FC<DialSwitchProps> = ({
  label,
  switchId,
  isOn = false,
  disabled,
  onChange,
  caption,
}) => {
  const switchClassName = classNames(
    'flex w-[36px] h-[18px] cursor-pointer items-center gap-1 rounded-full p-0.5 transition-all duration-200',
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
    <div className="flex flex-row items-start" role="switch">
      <input
        type="checkbox"
        onChange={onClick}
        id={switchId}
        disabled={disabled}
        className="invisible w-0 h-0"
        checked={isOn}
      />
      <label
        htmlFor={switchId}
        className={switchClassName}
        aria-describedby={caption && 'caption'}
      >
        <span
          className={classNames(
            'size-3 rounded-full',
            disabled
              ? 'bg-controls-disable-accent'
              : 'bg-controls-enable-primary',
          )}
        ></span>
      </label>
      {(label || caption) && (
        <div className="flex flex-col gap-1 ml-2">
          {label && (
            <span
              className={classNames(
                'dial-small-text py-[1px]',
                disabled ? 'text-secondary' : 'text-primary',
              )}
              aria-label="switch-title"
            >
              {label}
            </span>
          )}
          {caption && (
            <span id="caption" className="dial-tiny-text text-secondary">
              {caption}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
