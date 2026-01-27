import type { FC } from 'react';

import { DialFormItem } from '@/components/FormItem/FormItem';
import { DialRadioButton } from '@/components/RadioButton/RadioButton';
import type { RadioButtonWithContent } from '@/models/radio';
import type { RadioGroupOrientation } from '@/types/radio-group';
import { mergeClasses } from '@/utils/merge-classes';
import {
  optionsWrapperBaseClassName,
  orientationClassMap,
  selectedContentClassName,
} from './constants';

export interface DialRadioGroupProps {
  fieldLabel?: string;
  elementId: string;
  disabled?: boolean;
  radioButtons: RadioButtonWithContent[];
  activeRadioButton: string;
  orientation: RadioGroupOrientation;
  onChange: (radioId: string) => void;
  // Optional CSS class names
  radioClassName?: string;
  groupLabelClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
  formItemChildrenClassName?: string;
  selectedItemClassName?: string;
  selectedLabelClassName?: string;
  radioGroupClassName?: string;
  inputContainerClassName?: string;
  selectedInputContainerClassName?: string;
}

/**
 * Groups multiple `DialRadio` options and renders custom content for the active option.
 *
 * Uses `DialField` as the field label and a container with `role="radiogroup"`.
 * Content provided in `radioButtons[].content` is shown under the currently active radio.
 *
 * @example
 * ```tsx
 * <DialRadioGroup
 *   fieldLabel="Delivery"
 *   elementId="delivery"
 *   orientation={RadioGroupOrientation.Column}
 *   activeRadioButton="courier"
 *   radioButtons={[
 *     { id: 'pickup', name: 'Pickup', content: <span>Free, ready today</span> },
 *     { id: 'courier', name: 'Courier', content: <span>Arrives tomorrow</span> },
 *   ]}
 *   onChange={(id) => console.log('selected', id)}
 * />
 * ```
 *
 * @param [fieldLabel] - Optional label rendered by `DialField`
 * @param elementId - Name for the underlying radio group; also used for input `name`
 * @param [radioClassName] - Additional classes applied to each radio input
 * @param [inputContainerClassName] - Additional classes applied to each radio input's container
 * @param [selectedInputContainerClassName] - Additional classes applied to the selected radio input's container
 * @param [groupLabelClassName] - Optional classes applied to the group label. If not provided, `labelClassName` will be used.
 * @param [formItemChildrenClassName] - Additional classes applied to the DialFormItem's children container
 * @param [labelClassName] - Additional classes applied to each radio label
 * @param [containerClassName] - Additional classes applied to the outer container
 * @param [selectedItemClassName] - Additional classes applied to the selected option's content container
 * @param [selectedLabelClassName] - Additional classes applied to the selected option's label
 * @param [radioGroupClassName] - Additional classes applied to the radio group container
 * @param [disabled] - Disables all child radios when set
 * @param radioButtons - Array of options with ids, labels, and optional content
 * @param activeRadioButton - The id of the currently selected radio
 * @param orientation - Layout direction of radios: row or column
 * @param onChange - Callback fired with the selected radio id
 */
export const DialRadioGroup: FC<DialRadioGroupProps> = ({
  fieldLabel,
  radioClassName,
  containerClassName,
  selectedItemClassName,
  selectedLabelClassName,
  radioGroupClassName,
  inputContainerClassName,
  selectedInputContainerClassName,
  groupLabelClassName,
  formItemChildrenClassName,
  labelClassName,
  disabled,
  elementId,
  radioButtons,
  activeRadioButton,
  orientation,
  onChange,
}) => {
  return (
    <DialFormItem
      elementId={elementId}
      label={fieldLabel}
      labelClassName={
        groupLabelClassName ? groupLabelClassName : labelClassName
      }
      className={containerClassName}
      childrenClassName={formItemChildrenClassName}
    >
      <div
        role="radiogroup"
        aria-label={fieldLabel}
        aria-disabled={disabled || undefined}
        className={mergeClasses(
          optionsWrapperBaseClassName,
          orientationClassMap[orientation],
          radioGroupClassName,
        )}
      >
        {radioButtons.map((radio) => (
          <div
            key={radio.id}
            className={mergeClasses(
              'flex flex-col',
              inputContainerClassName,
              radio.id === activeRadioButton && selectedInputContainerClassName,
            )}
          >
            <DialRadioButton
              name={elementId}
              value={radio.id}
              inputId={radio.id}
              disabled={disabled}
              className={radioClassName}
              labelClassName={mergeClasses(
                labelClassName,
                radio.id === activeRadioButton && selectedLabelClassName,
              )}
              label={radio.name}
              checked={radio.id === activeRadioButton}
              onChange={() => onChange(radio.id)}
            />
            {radio.id === activeRadioButton && radio.content ? (
              <div
                className={mergeClasses(
                  selectedContentClassName,
                  selectedItemClassName,
                )}
              >
                {radio.content}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </DialFormItem>
  );
};
