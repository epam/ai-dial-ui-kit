import type { ChangeEvent, FC, InputHTMLAttributes } from 'react';
import { useCallback, useId } from 'react';

import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { Label, type LabelProps } from '../Label/Label';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange' | 'size' | 'value'
>;

export interface RadioProps extends NativeInputProps {
  name: string;
  value: string;
  labelProps?: LabelProps;
  isSelected?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  caption?: string;
}

/**
 * A radio button from the 2.0 design system.
 * aliases: RadioButton|ChoiceOption|RadioInput
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <Radio
 *   name="plan"
 *   value="pro"
 *   labelProps={{ label: 'Pro' }}
 *   isSelected={plan === 'pro'}
 *   onChange={setPlan}
 * />
 * ```
 *
 * Radios sharing a `name` form one group: the browser gives them a single tab
 * stop and moves the selection with the arrow keys, so no `role="radiogroup"`
 * wiring is needed here. Wrap a set in a `<fieldset>` with a `<legend>` when the
 * group itself needs a name.
 *
 * The circle and the label text are two sibling `<label for>` elements rather
 * than one wrapper, so the {@link Label} keeps its own `required` marker and
 * `caption` info button — a button nested in a label forwards its clicks to the
 * labelled control. Clicking either one still selects the radio.
 *
 * @param name - The group this radio belongs to; radios sharing it are mutually exclusive
 * @param value - The value reported to `onChange` when this radio is selected
 * @param [labelProps] - Props of the {@link Label} rendered next to the control
 * @param [isSelected=false] - Whether this radio is the selected one of its group
 * @param [disabled=false] - Whether the radio is disabled
 * @param [onChange] - Callback fired with `value` when this radio becomes selected
 * @param [caption] - Caption text rendered below the label, and described by the radio
 */
export const Radio: FC<RadioProps> = ({
  id,
  name,
  value,
  labelProps,
  isSelected = false,
  disabled,
  onChange,
  caption,
  className,
  ...props
}) => {
  const generatedId = useId();
  const radioId = id ?? generatedId;
  const captionId = caption ? `${radioId}-caption` : undefined;

  const onSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) onChange?.(value);
    },
    [onChange, value],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className={mergeClasses('flex items-center gap-2 ', className)}>
        <input
          {...props}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={isSelected}
          disabled={disabled}
          onChange={onSelect}
          aria-label={resolveAccessibleName(
            typeof labelProps?.label !== 'string'
              ? props['aria-label']
              : undefined,
          )}
          aria-describedby={captionId}
          className="peer sr-only"
        />
        <label
          htmlFor={radioId}
          className={mergeClasses(
            'group grid size-[20px] shrink-0 place-items-center rounded-full border transition-colors duration-200 hover:bg-control-accent-alpha-hover',
            // 20px is below the 24x24 minimum target, so grow the pointer target
            // without touching the rendered size. The 44px enhanced target would
            // overhang by 12px per side and swallow the adjacent label.
            'dial-kit-minimum-target',
            'peer-focus-visible:outline peer-focus-visible:outline-focus',
            disabled
              ? 'cursor-not-allowed border-default bg-control-disable-primary'
              : mergeClasses(
                  'cursor-pointer',
                  isSelected
                    ? 'border border-accent bg-control-neutral'
                    : 'border-default bg-control-neutral',
                ),
          )}
        >
          {isSelected && (
            <span
              className={mergeClasses(
                'size-3 rounded-full',
                disabled ? 'bg-control-disable-secondary' : 'bg-control-accent',
              )}
            />
          )}
        </label>
        {labelProps && (
          <Label
            size={ElementSize.Standard}
            {...labelProps}
            htmlFor={radioId}
            className={mergeClasses(
              // `Label` defaults to the secondary colour; a radio's own label is
              // primary while the control is usable.
              'py-[1px]',
              disabled
                ? 'cursor-not-allowed text-control-disable-primary'
                : 'cursor-pointer text-primary',
              labelProps.className,
            )}
          />
        )}
      </div>
      {caption && (
        <span
          id={captionId}
          className="dial-tiny-text text-secondary ml-[26px]"
        >
          {caption}
        </span>
      )}
    </div>
  );
};
