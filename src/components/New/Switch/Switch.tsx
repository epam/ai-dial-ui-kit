import type { ChangeEvent, FC, InputHTMLAttributes, ReactNode } from 'react';
import { useCallback, useId } from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange' | 'size'
>;

export interface SwitchProps extends NativeInputProps {
  label?: ReactNode;
  isOn?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  caption?: string;
}

/**
 * A switch (toggle) control from the 2.0 design system.
 * aliases: ToggleSwitch|BinaryToggle|Switcher
 *
 * @example
 * ```tsx
 * <Switch
 *   id="notifications"
 *   label="Active"
 *   isOn={isActive}
 *   onChange={setIsActive}
 * />
 * ```
 *
 * @param [label] - Visible label rendered next to the control
 * @param [isOn=false] - The current value of the switch
 * @param [disabled=false] - Whether the switch is disabled
 * @param [onChange] - Callback fired with the new value when toggled
 * @param [caption] - Caption text rendered below the label
 */
export const Switch: FC<SwitchProps> = ({
  id,
  label,
  isOn = false,
  disabled,
  onChange,
  caption,
  className,
  ...props
}) => {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  const captionId = caption ? `${switchId}-caption` : undefined;

  const onToggle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center">
        <input
          {...props}
          type="checkbox"
          role="switch"
          id={switchId}
          checked={isOn}
          aria-checked={isOn}
          disabled={disabled}
          onChange={onToggle}
          aria-label={resolveAccessibleName(
            typeof label !== 'string' ? props['aria-label'] : undefined,
          )}
          aria-describedby={captionId}
          className="peer sr-only"
        />
        <label
          htmlFor={switchId}
          className={mergeClasses(
            'flex items-center gap-2 rounded-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-black',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className,
          )}
        >
          <span
            className={mergeClasses(
              'flex h-[18px] w-[36px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
              isOn ? 'justify-end' : 'justify-start',
              disabled
                ? isOn
                  ? 'bg-controls-disable'
                  : 'bg-layer-4'
                : isOn
                  ? 'bg-controls-accent-primary'
                  : 'bg-layer-4',
            )}
          >
            <span
              className={mergeClasses(
                'size-3.5 shrink-0 rounded-full',
                disabled
                  ? 'bg-controls-disable-accent'
                  : 'bg-controls-enable-primary',
              )}
            />
          </span>
          {label && (
            <span
              className={mergeClasses(
                'dial-small-text py-[1px]',
                disabled ? 'text-secondary' : 'text-primary',
              )}
            >
              {label}
            </span>
          )}
        </label>
      </div>
      {caption && (
        <span
          id={captionId}
          className="dial-tiny-text text-secondary ml-[44px]"
        >
          {caption}
        </span>
      )}
    </div>
  );
};
