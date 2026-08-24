import type { ChangeEvent, FC, InputHTMLAttributes } from 'react';
import { useCallback, useId } from 'react';

import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { Label, type LabelProps } from '../Label/Label';
import { CheckboxBox } from './CheckboxBox';

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange' | 'size'
>;

export interface CheckboxProps extends NativeInputProps {
  labelProps?: LabelProps;
  isSelected?: boolean;
  isIndeterminate?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  caption?: string;
  boxClassName?: string;
}

/**
 * A checkbox from the 2.0 design system.
 * aliases: ToggleCheckbox|MultiSelectOption|TriStateCheckbox
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <Checkbox
 *   labelProps={{ label: 'Accept terms' }}
 *   isSelected={accepted}
 *   onChange={setAccepted}
 * />
 * ```
 *
 * `isIndeterminate` takes visual precedence over `isSelected` and announces the
 * control as `mixed` — use it for a parent whose children are partly selected.
 * It also sets the native `indeterminate` DOM property, which no React prop
 * covers. Clicking an indeterminate checkbox selects it, as it does natively.
 *
 * The box and the label text are two sibling `<label for>` elements rather than
 * one wrapper, so the {@link Label} keeps its own `required` marker and
 * `caption` info button — a button nested in a label forwards its clicks to the
 * labelled control. Clicking either one still toggles the checkbox.
 *
 * @param [labelProps] - Props of the {@link Label} rendered next to the control
 * @param [isSelected=false] - The current value of the checkbox
 * @param [isIndeterminate=false] - Whether the checkbox is in the mixed state
 * @param [invalid=false] - Whether the checkbox failed validation (applies error styling)
 * @param [disabled=false] - Whether the checkbox is disabled
 * @param [onChange] - Callback fired with the new value when toggled
 * @param [caption] - Caption text rendered below the label, and described by the checkbox
 * @param [boxClassName] - Additional classes for the box itself. Use it to drop
 * the box's own focus ring where the container already draws one, as a
 * multiselect row does.
 */
export const Checkbox: FC<CheckboxProps> = ({
  id,
  labelProps,
  isSelected = false,
  isIndeterminate = false,
  invalid = false,
  disabled,
  onChange,
  caption,
  className,
  boxClassName,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const captionId = caption ? `${checkboxId}-caption` : undefined;

  const onToggle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    },
    [onChange],
  );

  // `indeterminate` is a DOM property with no React prop, so it has to be set
  // on the node itself. A callback ref reapplies it whenever the state changes.
  const applyIndeterminate = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = isIndeterminate;
    },
    [isIndeterminate],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className={mergeClasses('flex items-center gap-2', className)}>
        <input
          {...props}
          ref={applyIndeterminate}
          type="checkbox"
          id={checkboxId}
          checked={isSelected}
          disabled={disabled}
          onChange={onToggle}
          aria-checked={isIndeterminate ? 'mixed' : isSelected}
          aria-invalid={invalid || undefined}
          aria-label={resolveAccessibleName(
            typeof labelProps?.label !== 'string'
              ? props['aria-label']
              : undefined,
          )}
          aria-describedby={captionId}
          className="peer sr-only"
        />
        <CheckboxBox
          htmlFor={checkboxId}
          isSelected={isSelected}
          isIndeterminate={isIndeterminate}
          invalid={invalid}
          disabled={disabled}
          className={boxClassName}
        />
        {labelProps && (
          <Label
            size={ElementSize.Standard}
            {...labelProps}
            htmlFor={checkboxId}
            className={mergeClasses(
              // `Label` defaults to the secondary colour; a checkbox's own label
              // is primary while the control is usable.
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
          className="dial-tiny-text text-secondary ml-[28px]"
        >
          {caption}
        </span>
      )}
    </div>
  );
};
