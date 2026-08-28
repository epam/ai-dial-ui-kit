import { IconMaximize } from '@tabler/icons-react';
import { type FC, type ReactNode, useCallback, useId, useState } from 'react';

import {
  NeutralButton,
  PrimaryButton,
} from '@/components/New/Button/ButtonWrappers';
import {
  CaptionText,
  ErrorText,
} from '@/components/New/CaptionText/CaptionText';
import { Label, type LabelProps } from '@/components/New/Label/Label';
import { Popup } from '@/components/New/Popup/Popup';
import {
  RadioGroup,
  type RadioGroupItem,
} from '@/components/New/RadioGroup/RadioGroup';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { PopupSize } from '@/types/popup';
import { RadioGroupOrientation } from '@/types/radio-group';
import { mergeClasses } from '@/utils/merge-classes';
import { resolveAccessibleName } from '@/utils/accessible-name';
import {
  defaultApplyLabel,
  defaultCancelLabel,
  fieldBaseClassName,
  fieldIconClassName,
  fieldPlaceholderClassName,
  fieldValueClassName,
  popupBodyClassName,
  popupFooterClassName,
} from './constants';

export interface RadioGroupPopupFieldProps {
  items: RadioGroupItem[];
  value?: string;
  customValue?: string;
  header: ReactNode;
  onApply: (value?: string) => void;
  id?: string;
  labelProps?: LabelProps;
  placeholder?: string;
  selectedValue?: string;
  onSelectionChange?: (value: string) => void;
  onCancel?: () => void;
  onClose?: () => void;
  isValid?: boolean;
  applyButtonLabel?: string;
  cancelButtonLabel?: string;
  size?: PopupSize;
  portalId?: string;
  disabled?: boolean;
  invalid?: boolean;
  error?: string;
  caption?: string;
  ariaLabel?: string;
  className?: string;
  fieldClassName?: string;
}

/**
 * A field whose value is picked from a {@link RadioGroup} inside a {@link Popup}.
 * aliases: PopupRadio|ChoicePopup|RadioPopupField
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <RadioGroupPopupField
 *   labelProps={{ label: 'Status' }}
 *   header="Select status"
 *   placeholder="None"
 *   items={[
 *     { value: 'draft', label: 'Draft' },
 *     { value: 'published', label: 'Published' },
 *   ]}
 *   value={status}
 *   onApply={(next) => setStatus(next)}
 * />
 * ```
 *
 * The collapsed field is a `<button>` rather than a read-only `<input>`: it
 * opens a dialog and holds no text of its own, so the button role and its
 * `Enter` / `Space` activation come from the element itself instead of being
 * re-implemented on an input that would also invite typing.
 *
 * The selection inside the popup is a draft. Uncontrolled, it is seeded from
 * `value` each time the popup opens, so an edit the user cancelled never leaks
 * into the next one, and `onApply` is the only callback reporting a committed
 * value. Pass `selectedValue` with `onSelectionChange` to drive the draft
 * yourself — needed when `isValid` depends on what is currently selected.
 *
 * The field's accessible name is its label followed by the current value, so it
 * announces like a collapsed picker ("Status, Draft"). With no `labelProps`,
 * pass `ariaLabel`: it is exposed through a visually hidden element rather than
 * as `aria-label`, which would replace the value in the name instead of
 * preceding it.
 *
 * @param items - Options offered inside the popup
 * @param [value] - The committed value, shown in the collapsed field
 * @param [customValue] - Text shown in the field in place of the selected option's label
 * @param header - Title of the popup
 * @param onApply - Callback fired with the selected value when Apply is clicked
 * @param [id] - Base id for the field; the label and the options derive theirs from it
 * @param [labelProps] - Props of the {@link Label} rendered above the field
 * @param [placeholder] - Text shown in the field while no value is selected
 * @param [selectedValue] - Controlled draft selection inside the popup
 * @param [onSelectionChange] - Callback fired when the draft selection changes
 * @param [onCancel] - Callback fired when Cancel is clicked, before the popup closes
 * @param [onClose] - Callback fired whenever the popup closes
 * @param [isValid=true] - Whether Apply is enabled
 * @param [applyButtonLabel="Apply"] - Label of the Apply button
 * @param [cancelButtonLabel="Cancel"] - Label of the Cancel button
 * @param [size=PopupSize.Md] - Size of the popup
 * @param [portalId] - Portal container id for the popup
 * @param [disabled] - Disables the field, so the popup cannot be opened
 * @param [invalid] - Paints the field with the error border
 * @param [error] - Error message rendered below the field
 * @param [caption] - Helper text rendered below the field when there is no `error`
 * @param [ariaLabel] - Names the field when there is no string `labelProps.label`
 * @param [className] - Additional classes for the outer container
 * @param [fieldClassName] - Additional classes for the collapsed field
 */
export const RadioGroupPopupField: FC<RadioGroupPopupFieldProps> = ({
  items,
  value,
  customValue,
  header,
  onApply,
  id,
  labelProps,
  placeholder,
  selectedValue,
  onSelectionChange,
  onCancel,
  onClose,
  isValid = true,
  applyButtonLabel = defaultApplyLabel,
  cancelButtonLabel = defaultCancelLabel,
  size = PopupSize.Md,
  portalId,
  disabled,
  invalid,
  error,
  caption,
  ariaLabel,
  className,
  fieldClassName,
}) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const valueId = `${fieldId}-value`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const captionId = !error && caption ? `${fieldId}-caption` : undefined;

  const [isOpen, setIsOpen] = useState(false);

  const isDraftControlled = selectedValue !== undefined;
  const [uncontrolledDraft, setUncontrolledDraft] = useState(value);
  const draft = isDraftControlled ? selectedValue : uncontrolledDraft;

  const openPopup = useCallback(() => {
    if (disabled) return;
    // An uncontrolled draft restarts from the committed value, so an edit the
    // user cancelled is not still selected the next time the popup opens.
    if (!isDraftControlled) setUncontrolledDraft(value);
    setIsOpen(true);
  }, [disabled, isDraftControlled, value]);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const cancel = useCallback(() => {
    onCancel?.();
    closePopup();
  }, [onCancel, closePopup]);

  const apply = useCallback(() => {
    onApply(draft);
    closePopup();
  }, [onApply, draft, closePopup]);

  const selectDraft = useCallback(
    (next: string) => {
      if (!isDraftControlled) setUncontrolledDraft(next);
      onSelectionChange?.(next);
    },
    [isDraftControlled, onSelectionChange],
  );

  const labelText = resolveAccessibleName(labelProps?.label);
  const hiddenName = labelText ? undefined : resolveAccessibleName(ariaLabel);
  const nameId = labelText ? labelId : hiddenName && `${fieldId}-name`;
  const headerText = resolveAccessibleName(header);

  const selectedLabel = items.find((item) => item.value === value)?.label;
  const fieldValue = customValue ?? selectedLabel;

  return (
    <div className={mergeClasses('flex w-full flex-col gap-2', className)}>
      {labelProps && <Label {...labelProps} id={labelId} htmlFor={fieldId} />}

      <div className="flex flex-col gap-1">
        {hiddenName && (
          <span id={nameId} className="sr-only">
            {hiddenName}
          </span>
        )}

        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          // The value belongs in the name rather than in a description: a
          // collapsed picker announcing only its label leaves the user guessing
          // what it currently holds.
          aria-labelledby={nameId ? `${nameId} ${valueId}` : undefined}
          aria-describedby={
            [errorId, captionId].filter(Boolean).join(' ') || undefined
          }
          onClick={openPopup}
          className={mergeClasses(
            fieldBaseClassName,
            invalid && 'dial-kit-input-error',
            disabled && 'dial-kit-input-disable',
            fieldClassName,
          )}
        >
          <span
            id={valueId}
            className={
              fieldValue == null
                ? fieldPlaceholderClassName
                : fieldValueClassName
            }
          >
            {fieldValue ?? placeholder}
          </span>

          <IconMaximize
            size={DIAL_ICON_SIZE.MD}
            stroke={DIAL_KIT_ICON_STROKE}
            aria-hidden="true"
            className={fieldIconClassName}
          />
        </button>

        <ErrorText id={errorId} text={error} />
        {!error && <CaptionText id={captionId} text={caption} />}
      </div>

      <Popup
        open={isOpen}
        header={header}
        ariaLabel={headerText ? undefined : labelText}
        portalId={portalId}
        size={size}
        onClose={cancel}
        footer={
          <div className={popupFooterClassName}>
            <NeutralButton label={cancelButtonLabel} onClick={cancel} />
            <PrimaryButton
              label={applyButtonLabel}
              disabled={!isValid}
              onClick={apply}
            />
          </div>
        }
      >
        <div className={popupBodyClassName}>
          <RadioGroup
            id={`${fieldId}-options`}
            items={items}
            value={draft}
            onChange={selectDraft}
            orientation={RadioGroupOrientation.Column}
            ariaLabel={labelText ?? headerText}
          />
        </div>
      </Popup>
    </div>
  );
};
