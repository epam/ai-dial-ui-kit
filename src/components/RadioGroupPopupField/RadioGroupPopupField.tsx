import classNames from 'classnames';
import { useCallback, useState, type FC } from 'react';

import {
  DialPrimaryButton,
  DialNeutralButton,
} from '@/components/Button/ButtonWrappers';
import { DialLabel, type DialLabelProps } from '@/components/Label/Label';
import {
  DialInputPopup,
  type DialInputPopupProps,
} from '@/components/InputPopup/InputPopup';
import { DialPopup, type DialPopupProps } from '@/components/Popup/Popup';
import {
  DialRadioGroup,
  type DialRadioGroupProps,
} from '@/components/RadioGroup/RadioGroup';
import { PopupSize } from '@/types/popup';
import { RadioGroupOrientation } from '@/types/radio-group';

export interface RadioGroupPopupFieldProps
  extends
    Pick<DialLabelProps, 'label' | 'htmlFor'>,
    Omit<DialInputPopupProps, 'onOpen' | 'children'>,
    Pick<DialRadioGroupProps, 'radioButtons'>,
    Pick<DialPopupProps, 'onClose' | 'portalId' | 'size'> {
  customInputValue?: string;
  header: string;
  cancelButtonTitle?: string;
  applyButtonTitle?: string;
  isValid: boolean;
  onApply: () => void;
  onCancel?: () => void;
  selectedRadioValue: string;
  onChangeRadioField: (id: string) => void;
  id: string;
}

/**
 * A composite field that opens a popup with a radio group selector.
 * aliases: PopupRadio|ChoicePopup
 * Design system 1.0
 *
 * Renders a labeled readout using `DialInputPopup`; when opened, a `DialPopup`
 * displays a `DialRadioGroup` allowing the user to pick from a list of options.
 * The footer provides Cancel/Apply actions, with Apply disabled when `isValid` is false.
 *
 * The value shown in the collapsed field is derived from either `customInputValue`
 * or the name of the currently selected radio option identified by `selectedValue`.
 *
 * @example
 * ```tsx
 * <DialRadioGroupPopupField
 *   fieldTitle="Status"
 *   htmlFor="status"
 *   header="Select status"
 *   emptyValueText="None"
 *   radioButtons={[
 *     { id: 'draft', name: 'Draft' },
 *     { id: 'review', name: 'In Review' },
 *     { id: 'published', name: 'Published' },
 *   ]}
 *   selectedValue="draft"
 *   selectedRadioValue="draft"
 *   onChangeRadioField={(id) => console.log('radio changed', id)}
 *   id="status-group"
 *   isValid={true}
 *   onApply={() => console.log('applied')}
 * />
 * ```
 *
 * @param fieldTitle - Field label text displayed above the input
 * @param htmlFor - Associates the label with an input id for a11y
 * @param [readonly] - When true, the popup cannot be opened
 * @param [selectedValue] - Current value id used to resolve the displayed option name
 * @param radioButtons - Collection of radio options (id/name)
 * @param [customInputValue] - Custom value text to display instead of a radio option name
 * @param [placeholder] - Placeholder text shown in the field when no value is selected; unlike `emptyValueText`, it suppresses the tooltip
 * @param [valueClassName] - Extra classes applied to the value text in the collapsed field
 * @param [inputClassName] - Extra classes applied to the collapsed input container
 * @param emptyValueText - Placeholder text when no value is selected
 * @param [onClose] - Callback fired when the popup closes
 * @param header - Title text shown in the popup header
 * @param [portalId] - Target portal id for rendering the popup
 * @param onApply - Callback fired when the Apply button is clicked
 * @param [onCancel] - Callback fired when the Cancel button is clicked
 * @param [cancelButtonTitle="Cancel"] - Text for the Cancel button
 * @param [applyButtonTitle="Apply"] - Text for the Apply button
 * @param isValid - Determines whether the Apply action is enabled
 * @param selectedRadioValue - Currently selected radio id inside the popup
 * @param onChangeRadioField - Handler for radio selection changes
 * @param id - Element id used for the internal radio group
 * @param [size=PopupSize.Md] - Size of the popup
 */
export const DialRadioGroupPopupField: FC<RadioGroupPopupFieldProps> = ({
  label,
  htmlFor,
  disabled,
  selectedValue,
  radioButtons,
  customInputValue,
  valueClassName,
  inputClassName,
  emptyValueText,
  placeholder,
  onClose,
  header,
  portalId,
  onApply,
  onCancel,
  cancelButtonTitle = 'Cancel',
  applyButtonTitle = 'Apply',
  isValid,
  selectedRadioValue,
  onChangeRadioField,
  id,
  size = PopupSize.Md,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenPopup = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
  }, [disabled]);

  const onClosePopup = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const onCancelValue = useCallback(() => {
    onCancel?.();
    onClosePopup();
  }, [onCancel, onClosePopup]);

  const onApplyValue = useCallback(() => {
    onApply();
    onClosePopup();
  }, [onApply, onClosePopup]);

  return (
    <div className="flex flex-col gap-1">
      <DialLabel label={label} htmlFor={htmlFor} />
      <DialInputPopup
        disabled={disabled}
        open={isOpen}
        selectedValue={
          customInputValue ??
          radioButtons.find((rb) => rb.id === selectedValue)?.name
        }
        valueClassName={valueClassName}
        inputClassName={classNames(inputClassName, 'py-2', 'px-3')}
        emptyValueText={emptyValueText}
        placeholder={placeholder}
        onOpen={onOpenPopup}
      >
        <DialPopup
          open={isOpen}
          onClose={onCancelValue}
          header={header}
          portalId={portalId}
          size={size}
          footer={
            <div className="flex flex-row items-center justify-end gap-2 px-6 py-4">
              <DialNeutralButton
                label={cancelButtonTitle}
                onClick={onCancelValue}
              />
              <DialPrimaryButton
                label={applyButtonTitle}
                onClick={onApplyValue}
                disabled={!isValid}
              />
            </div>
          }
        >
          <div className="px-6 py-4">
            <DialRadioGroup
              radioButtons={radioButtons}
              labelClassName="dial-small-text"
              activeRadioButton={selectedRadioValue}
              onChange={onChangeRadioField}
              elementId={id}
              orientation={RadioGroupOrientation.Column}
            />
          </div>
        </DialPopup>
      </DialInputPopup>
    </div>
  );
};
