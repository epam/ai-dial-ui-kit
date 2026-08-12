import type { ChangeEvent, FC, InputHTMLAttributes } from 'react';
import { useCallback, useId } from 'react';

import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { Label, type LabelProps } from '../Label/Label';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange' | 'size'
>;

export interface SwitchProps extends NativeInputProps {
  labelProps?: LabelProps;
  isOn?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  caption?: string;
}

/**
 * A switch (toggle) control from the 2.0 design system.
 * aliases: ToggleSwitch|BinaryToggle|Switcher
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <Switch
 *   id="notifications"
 *   labelProps={{ label: 'Active' }}
 *   isOn={isActive}
 *   onChange={setIsActive}
 * />
 * ```
 *
 * The track and the label text are two sibling `<label for>` elements rather
 * than one wrapper, so the {@link Label} keeps its own `required` marker and
 * `caption` info button — a button nested in a label forwards its clicks to the
 * labelled control. Clicking either one still toggles the switch.
 *
 * @param [labelProps] - Props of the {@link Label} rendered next to the control
 * @param [isOn=false] - The current value of the switch
 * @param [disabled=false] - Whether the switch is disabled
 * @param [onChange] - Callback fired with the new value when toggled
 * @param [caption] - Caption text rendered below the label, and described by the switch
 */
export const Switch: FC<SwitchProps> = ({
  id,
  labelProps,
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
      <div className={mergeClasses('flex items-center gap-2', className)}>
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
            typeof labelProps?.label !== 'string'
              ? props['aria-label']
              : undefined,
          )}
          aria-describedby={captionId}
          className="peer sr-only"
        />
        <label
          htmlFor={switchId}
          className={mergeClasses(
            'flex h-[18px] w-[36px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
            'peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-black',
            isOn ? 'justify-end' : 'justify-start',
            isOn && !disabled ? 'bg-control-accent' : 'bg-control-disable',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          <span
            className={mergeClasses(
              'size-3.5 shrink-0 rounded-full',
              disabled ? 'bg-controls-disable-accent' : 'bg-control-neutral',
            )}
          />
        </label>
        {labelProps && (
          <Label
            size={ElementSize.Standard}
            {...labelProps}
            htmlFor={switchId}
            className={mergeClasses(
              // `Label` defaults to the secondary colour; the switch's own label
              // has always been primary while the control is usable.
              'py-[1px]',
              disabled
                ? 'cursor-not-allowed text-secondary'
                : 'cursor-pointer text-primary',
              labelProps.className,
            )}
          />
        )}
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
