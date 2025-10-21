import type { FC } from 'react';

import { DialFormItem } from '@/components/FormItem/FormItem';
import { DialRadioButton } from '@/components/RadioButton/RadioButton';
import type { RadioButtonWithContent } from '@/models/radio';
import type { RadioGroupOrientation } from '@/types/radio-group';
import { mergeClasses } from '@/utils/merge-classes';
import {
  optionsWrapperBaseClasses,
  orientationClassMap,
  selectedContentClasses,
} from './constants';

export interface DialRadioGroupProps {
  fieldTitle?: string;
  elementId: string;
  radioCssClass?: string;
  labelCssClass?: string;
  containerCssClass?: string;
  selectedItemCssClass?: string;
  selectedLabelCssClass?: string;
  radioGroupCssClass?: string;
  inputContainerCssClass?: string;
  disabled?: boolean;
  radioButtons: RadioButtonWithContent[];
  activeRadioButton: string;
  orientation: RadioGroupOrientation;
  onChange: (radioId: string) => void;
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
 *   fieldTitle="Delivery"
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
 * @param [fieldTitle] - Optional label rendered by `DialField`
 * @param elementId - Name for the underlying radio group; also used for input `name`
 * @param [radioCssClass] - Additional classes applied to each radio input
 * @param [inputContainerCssClass] - Additional classes applied to each radio input's container
 * @param [labelCssClass] - Additional classes applied to each radio label
 * @param [containerCssClass] - Additional classes applied to the outer container
 * @param [selectedItemCssClass] - Additional classes applied to the selected option's content container
 * @param [selectedLabelCssClass] - Additional classes applied to the selected option's label
 * @param [radioGroupCssClass] - Additional classes applied to the radio group container
 * @param [disabled] - Disables all child radios when set
 * @param radioButtons - Array of options with ids, labels, and optional content
 * @param activeRadioButton - The id of the currently selected radio
 * @param orientation - Layout direction of radios: row or column
 * @param onChange - Callback fired with the selected radio id
 */
export const DialRadioGroup: FC<DialRadioGroupProps> = ({
  fieldTitle,
  radioCssClass,
  containerCssClass,
  selectedItemCssClass,
  selectedLabelCssClass,
  radioGroupCssClass,
  inputContainerCssClass,
  labelCssClass,
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
      label={fieldTitle}
      labelCssClass={labelCssClass}
      cssClass={containerCssClass}
    >
      <div
        role="radiogroup"
        aria-label={fieldTitle}
        aria-disabled={disabled || undefined}
        className={mergeClasses(
          optionsWrapperBaseClasses,
          orientationClassMap[orientation],
          radioGroupCssClass,
        )}
      >
        {radioButtons.map((radio) => (
          <div
            key={radio.id}
            className={mergeClasses('flex flex-col', inputContainerCssClass)}
          >
            <DialRadioButton
              name={elementId}
              value={radio.id}
              inputId={radio.id}
              disabled={disabled}
              cssClass={radioCssClass}
              labelCssClass={mergeClasses(
                labelCssClass,
                radio.id === activeRadioButton && selectedLabelCssClass,
              )}
              title={radio.name}
              checked={radio.id === activeRadioButton}
              onChange={() => onChange(radio.id)}
            />
            {radio.id === activeRadioButton && radio.content ? (
              <div
                className={mergeClasses(
                  selectedContentClasses,
                  selectedItemCssClass,
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
