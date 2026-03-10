import { createPortal } from 'react-dom';

import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { DialErrorText } from '@/components/CaptionText/CaptionText';
import { DialAutocompleteInputValue } from '@/components/AutocompleteInput/AutocompleteInputValue';
import OpenPopupIcon from '@/assets/icons/open-popup.svg?react';
import { DialIcon } from '@/components/Icon/Icon';
import { BASE_ICON_SIZE } from '@/constants/icon';

export interface DialInputPopupProps {
  open?: boolean;
  selectedValue?: string | string[];
  children: ReactNode;
  onOpen: () => void;
  disabled?: boolean;
  valueClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  elementId?: string;
  errorText?: string;
  invalid?: boolean;
  emptyValueText?: string;
}

/**
 * An input field that opens a popup when clicked, displaying a selected value or a list of values.
 * It supports read-only mode, error states, and disabled state, with customizable styling.
 * The modal content is rendered using a portal for seamless integration.
 *
 * @example
 * ```tsx
 * <DialInputPopup
 *   open={true}
 *   selectedValue="Selected Item"
 *   emptyValueText="No value selected"
 *   onOpen={() => setModalState(true)}
 *   disabled={false}
 *   valueClassName="custom-value-class"
 *   inputClassName="custom-input-class"
 *   elementId="input-modal"
 *   errorText="This field is required"
 * >
 *   <div>Modal Content Here</div>
 * </DialInputPopup>
 * ```
 *
 * @param [open] - The current state of the modal, indicating whether it is opened or closed.
 * @param [selectedValue] - The currently selected value(s). Can be a string for a single value or an array of strings for multiple values.
 * @param [placeholder] - Placeholder text displayed when no value is selected.
 * @param children - The content to render inside the modal when it is opened.
 * @param onOpen - A callback function triggered when the modal open button is clicked.
 * @param [disabled=false] - Whether the input is disabled, preventing user interaction.
 * @param [valueClassName] - Additional CSS classes applied to the displayed value.
 * @param [inputClassName] - Additional CSS classes applied to the input container.
 * @param [elementId] - A unique identifier for the input element, useful for accessibility and testing.
 * @param [errorText] - An optional error message displayed below the input when an error state is present.
 * @param [invalid] - Whether the input is in an invalid state, affecting styling. Applied automatically if errorText is provided.
 * @param [emptyValueText] - The text displayed when no value is selected and placeholder is not provided.
 */
export const DialInputPopup: FC<DialInputPopupProps> = ({
  children,
  open,
  disabled = false,
  selectedValue,
  valueClassName,
  inputClassName,
  onOpen,
  elementId,
  errorText,
  invalid,
  emptyValueText,
  placeholder,
}) => {
  const hasMultipleValues =
    Array.isArray(selectedValue) && selectedValue.length > 0;
  const hasSingleValue =
    typeof selectedValue === 'string' && !!selectedValue.trim();
  const value =
    hasMultipleValues || hasSingleValue
      ? selectedValue
      : placeholder
        ? undefined
        : emptyValueText;

  const handleClick = disabled ? undefined : onOpen;

  const renderSingleValue = () => (
    <>
      <button
        type="button"
        className="w-full"
        onClick={handleClick}
        aria-label="open-popup"
        id={elementId}
      >
        <div
          className={classNames(
            'dial-input px-3 py-2 dial-input-field flex flex-row items-center w-full justify-between cursor-pointer',
            inputClassName,
            disabled && 'dial-input-disable',
            (errorText || invalid) && 'dial-input-error',
          )}
        >
          <DialTooltip tooltip={value == null ? undefined : String(value)}>
            {value || !placeholder ? (
              <span className={valueClassName}>{value}</span>
            ) : (
              <span className="text-secondary">{placeholder}</span>
            )}
          </DialTooltip>
          {!disabled && (
            <div className="flex-shrink-0">
              <DialIcon
                icon={
                  <OpenPopupIcon
                    role="img"
                    width={BASE_ICON_SIZE}
                    height={BASE_ICON_SIZE}
                  />
                }
              />
            </div>
          )}
        </div>
      </button>
      <DialErrorText text={errorText} />
    </>
  );

  const renderMultipleValues = () => (
    <div className="w-full" onClick={handleClick}>
      <div
        className={classNames(
          'dial-input px-3 py-2 flex flex-row items-center w-full justify-between cursor-pointer',
          disabled && 'dial-input-disable',
        )}
      >
        <DialAutocompleteInputValue
          placeholder={placeholder}
          selectedItems={value as string[]}
        />
        {!disabled && (
          <div className="ml-1">
            <DialIcon
              icon={
                <OpenPopupIcon
                  role="img"
                  width={BASE_ICON_SIZE}
                  height={BASE_ICON_SIZE}
                />
              }
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {hasMultipleValues ? renderMultipleValues() : renderSingleValue()}
      {open && createPortal(children, document.body)}
    </>
  );
};
