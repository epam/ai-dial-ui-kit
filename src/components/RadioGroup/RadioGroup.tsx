import classNames from 'classnames';
import type { FC } from 'react';

import {
  optionsWrapperBaseClasses,
  orientationClassMap,
  selectedContentClasses,
} from './constants';
import { DialRadioButton } from '@/components/RadioButton/RadioButton';
import type { RadioGroupOrientation } from '@/types/radio-group';
import type { RadioButtonWithContent } from '@/models/radio';
import { DialFormItem } from '@/components/FormItem/FormItem';

export interface DialRadioGroupProps {
  fieldTitle?: string;
  elementId: string;
  radioCssClass?: string;
  labelCssClass?: string;
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
 * @param [labelCssClass] - Additional classes applied to each radio label
 * @param [disabled] - Disables all child radios when set
 * @param radioButtons - Array of options with ids, labels, and optional content
 * @param activeRadioButton - The id of the currently selected radio
 * @param orientation - Layout direction of radios: row or column
 * @param onChange - Callback fired with the selected radio id
 */
export const DialRadioGroup: FC<DialRadioGroupProps> = ({
  fieldTitle,
  radioCssClass,
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
    >
      <div
        role="radiogroup"
        aria-label={fieldTitle}
        aria-disabled={disabled || undefined}
        className={classNames(
          optionsWrapperBaseClasses,
          orientationClassMap[orientation],
        )}
      >
        {radioButtons.map((radio) => (
          <div key={radio.id} className="flex flex-col">
            <DialRadioButton
              name={elementId}
              value={radio.id}
              inputId={radio.id}
              disabled={disabled}
              cssClass={radioCssClass}
              labelCssClass={labelCssClass}
              title={radio.name}
              checked={radio.id === activeRadioButton}
              onChange={() => onChange(radio.id)}
            />
            {radio.id === activeRadioButton && radio.content ? (
              <div className={selectedContentClasses}>{radio.content}</div>
            ) : null}
          </div>
        ))}
      </div>
    </DialFormItem>
  );
};
