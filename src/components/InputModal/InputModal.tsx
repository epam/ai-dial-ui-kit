import { createPortal } from 'react-dom';

import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { DialErrorText } from '@/components/ErrorText/ErrorText';
import { DialAutocompleteInputValue } from '@/components/AutocompleteInput/AutocompleteInputValue';
import OpenPopupIcon from '@/assets/icons/open-popup.svg?react';
import { DialIcon } from '@/components/Icon/Icon';
import { BASE_ICON_SIZE } from '@/constants/icon';

export interface DialInputModalProps {
  open?: boolean;
  selectedValue?: string | string[];
  children: ReactNode;
  onOpenModal: () => void;
  readonly?: boolean;
  valueCssClasses?: string;
  inputCssClasses?: string;
  elementId?: string;
  errorText?: string;
  emptyValueText: string;
}

/**
 * An input field that opens a modal (popup) when clicked, displaying a selected value or a list of values.
 * It supports read-only mode, error states, and disabled state, with customizable styling.
 * The modal content is rendered using a portal for seamless integration.
 *
 * @example
 * ```tsx
 * <DialInputModal
 *   open={true}
 *   selectedValue="Selected Item"
 *   emptyValueText="No value selected"
 *   onOpenModal={() => setModalState(true)}
 *   readonly={false}
 *   valueCssClasses="custom-value-class"
 *   inputCssClasses="custom-input-class"
 *   elementId="input-modal"
 *   errorText="This field is required"
 * >
 *   <div>Modal Content Here</div>
 * </DialInputModal>
 * ```
 *
 * @param [open] - The current state of the modal, indicating whether it is opened or closed.
 * @param [selectedValue] - The currently selected value(s). Can be a string for a single value or an array of strings for multiple values.
 * @param children - The content to render inside the modal when it is opened.
 * @param onOpenModal - A callback function triggered when the modal open button is clicked.
 * @param [readonly=false] - Whether the input is read-only, preventing user interaction.
 * @param [valueCssClasses] - Additional CSS classes applied to the displayed value.
 * @param [inputCssClasses] - Additional CSS classes applied to the input container.
 * @param [elementId] - A unique identifier for the input element, useful for accessibility and testing.
 * @param [errorText] - An optional error message displayed below the input when an error state is present.
 * @param emptyValueText - The text displayed when no value is selected.
 */
export const DialInputModal: FC<DialInputModalProps> = ({
  children,
  open,
  readonly,
  selectedValue,
  valueCssClasses,
  inputCssClasses,
  onOpenModal,
  elementId,
  errorText,
  emptyValueText,
}) => {
  const hasMultipleValues =
    Array.isArray(selectedValue) && selectedValue.length > 0;
  const hasSingleValue =
    typeof selectedValue === 'string' && !!selectedValue.trim();
  const value =
    hasMultipleValues || hasSingleValue ? selectedValue : emptyValueText;

  const handleClick = readonly ? undefined : onOpenModal;

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
            'dial-input px-3 py-2 dial-input-field flex flex-row items-center w-full justify-between',
            inputCssClasses,
            readonly && 'dial-input-disable',
            errorText && 'dial-input-error',
          )}
        >
          <DialTooltip tooltip={String(value)}>
            <span className={valueCssClasses}>{value}</span>
          </DialTooltip>
          {!readonly && (
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
      {errorText && <DialErrorText errorText={errorText} />}
    </>
  );

  const renderMultipleValues = () => (
    <div className="w-full" onClick={handleClick}>
      <div
        className={classNames(
          'dial-input px-3 py-2 flex flex-row items-center w-full justify-between',
          readonly && 'dial-input-disable',
        )}
      >
        <DialAutocompleteInputValue selectedItems={value as string[]} />
        {!readonly && (
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
