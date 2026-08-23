import type { FC, ReactNode } from 'react';
import { useId } from 'react';

import {
  CaptionText,
  ErrorText,
} from '@/components/New/CaptionText/CaptionText';
import { Label, type LabelProps } from '@/components/New/Label/Label';
import { Radio } from '@/components/New/Radio/Radio';
import { RadioGroupOrientation } from '@/types/radio-group';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import {
  groupBaseClassName,
  optionsWrapperBaseClassName,
  orientationClassMap,
  selectedContentClassName,
} from './constants';

export interface RadioGroupItem {
  value: string;
  label?: ReactNode;
  /** Explanatory text rendered under the option's label. */
  caption?: string;
  /** Content revealed under the option while it is the selected one. */
  content?: ReactNode;
  disabled?: boolean;
  /** Names the option when its `label` is not a string (or absent). */
  'aria-label'?: string;
}

export interface RadioGroupProps {
  items: RadioGroupItem[];
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  orientation?: RadioGroupOrientation;
  labelProps?: LabelProps;
  disabled?: boolean;
  error?: string;
  caption?: string;
  ariaLabel?: string;
  className?: string;
  optionsClassName?: string;
  radioClassName?: string;
  contentClassName?: string;
}

/**
 * A set of mutually exclusive {@link Radio} options with one group label.
 * aliases: SelectionGroup|OptionGroup|RadioList
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   labelProps={{ label: 'Delivery' }}
 *   value={delivery}
 *   onChange={setDelivery}
 *   items={[
 *     { value: 'pickup', label: 'Pickup', caption: 'Free, ready today' },
 *     { value: 'courier', label: 'Courier', content: <AddressForm /> },
 *   ]}
 * />
 * ```
 *
 * The options are native radios sharing one `name`, so the browser gives the
 * group a single tab stop and moves the selection with the arrow keys — no
 * roving `tabindex` is needed. The wrapper still takes `role="radiogroup"` so
 * the group's own name is announced before the options.
 *
 * An option's `content` is mounted only while that option is selected, so a
 * form or an input inside it never holds focus for an option the user has moved
 * away from.
 *
 * The group is named by `labelProps.label` when that is a string, and by
 * `ariaLabel` otherwise — a group whose label is a node has no other name.
 *
 * @param items - Options to render; each needs a unique `value` and may carry a `label`, `caption`, `content` and `disabled` flag
 * @param [value] - The `value` of the selected option
 * @param onChange - Callback fired with the newly selected `value`
 * @param [name] - The `name` shared by the underlying radios; defaults to the group id
 * @param [id] - Base id for the group; option ids are derived from it
 * @param [orientation=RadioGroupOrientation.Column] - Whether the options stack or sit in a row
 * @param [labelProps] - Props of the {@link Label} rendered above the options
 * @param [disabled] - Disables every option
 * @param [error] - Error message rendered below the options
 * @param [caption] - Helper text rendered below the options when there is no `error`
 * @param [ariaLabel] - Names the group when there is no string `labelProps.label`
 * @param [className] - Additional classes for the outer container
 * @param [optionsClassName] - Additional classes for the options wrapper
 * @param [radioClassName] - Additional classes for every option's control row
 * @param [contentClassName] - Additional classes for the selected option's content
 */
export const RadioGroup: FC<RadioGroupProps> = ({
  items,
  value,
  onChange,
  name,
  id,
  orientation = RadioGroupOrientation.Column,
  labelProps,
  disabled,
  error,
  caption,
  ariaLabel,
  className,
  optionsClassName,
  radioClassName,
  contentClassName,
}) => {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const labelId = `${groupId}-label`;
  const errorId = error ? `${groupId}-error` : undefined;
  const captionId = !error && caption ? `${groupId}-caption` : undefined;

  const labelText = resolveAccessibleName(labelProps?.label);

  return (
    <div className={mergeClasses(groupBaseClassName, className)}>
      {labelProps && <Label {...labelProps} id={labelId} />}

      <div
        role="radiogroup"
        // The `<label>` element itself, not the `Label` wrapper: the wrapper
        // also holds the caption info button, whose text would otherwise be
        // read as part of the group's name.
        aria-labelledby={labelText ? labelId : undefined}
        aria-label={labelText ? undefined : resolveAccessibleName(ariaLabel)}
        aria-describedby={
          [errorId, captionId].filter(Boolean).join(' ') || undefined
        }
        aria-disabled={disabled || undefined}
        className={mergeClasses(
          optionsWrapperBaseClassName,
          orientationClassMap[orientation],
          optionsClassName,
        )}
      >
        {items.map((item) => {
          const isSelected = item.value === value;

          return (
            <div key={item.value} className="flex min-w-0 flex-col">
              <Radio
                id={`${groupId}-${item.value}`}
                name={name ?? groupId}
                value={item.value}
                labelProps={
                  item.label == null ? undefined : { label: item.label }
                }
                aria-label={item['aria-label']}
                caption={item.caption}
                isSelected={isSelected}
                disabled={disabled || item.disabled}
                onChange={onChange}
                className={radioClassName}
              />

              {isSelected && item.content ? (
                <div
                  className={mergeClasses(
                    selectedContentClassName,
                    contentClassName,
                  )}
                >
                  {item.content}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <ErrorText id={errorId} text={error} />
      {!error && <CaptionText id={captionId} text={caption} />}
    </div>
  );
};
