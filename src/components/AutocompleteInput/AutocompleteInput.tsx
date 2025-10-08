import {
  useCallback,
  useState,
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
} from 'react';
import {
  DialAutocompleteInputValue,
  type DialAutocompleteInputValueProps,
} from './AutocompleteInputValue';
import classNames from 'classnames';

export interface DialAutocompleteInputProps
  extends DialAutocompleteInputValueProps {
  placeholder?: string;
  updateSelected: (items: string[]) => void;
  containerCssClass?: string;
  inputCssClass?: string;
}

/**
 * A component that provides an interactive input field with autocomplete functionality. Users can
 * add items to a list by typing and pressing "Enter" or remove items using "Backspace" or "Delete"
 * when the input is empty. The component supports customizable styling for the container, input,
 * and list elements.
 *
 * @example
 * ```tsx
 * <DialAutocompleteInput
 *   placeholder="Type to add items"
 *   selectedItems={['Item 1', 'Item 2']}
 *   updateSelected={(items) => console.log(items)}
 *   containerCssClass="custom-container-class"
 *   inputCssClass="custom-input-class"
 *   listCssClass="custom-list-class"
 *   listElementCssClass="custom-item-class"
 * />
 * ```
 *
 * @param [placeholder] - The placeholder text displayed in the input field when no items are selected.
 * @param [selectedItems=[]] - An array of strings representing the currently selected items.
 * @param updateSelected - A callback function that updates the list of selected items. Called when items are added or removed.
 * @param [listCssClass] - Additional CSS classes applied to the `<ul>` element containing the list of selected items.
 * @param [listElementCssClass] - Additional CSS classes applied to each `<li>` element representing an individual selected item.
 * @param [containerCssClass] - Additional CSS classes applied to the container `<div>` element wrapping the input and list.
 * @param [inputCssClass] - Additional CSS classes applied to the `<input>` element.
 */
export const DialAutocompleteInput: FC<DialAutocompleteInputProps> = ({
  placeholder = '',
  selectedItems = [],
  updateSelected,
  listCssClass,
  listElementCssClass,
  containerCssClass,
  inputCssClass,
}) => {
  const [value, setValue] = useState('');

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        updateSelected([...selectedItems, e.currentTarget.value]);
        setValue('');
      }

      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        selectedItems.length &&
        !value
      ) {
        updateSelected(selectedItems.slice(0, -1));
      }
    },
    [selectedItems, updateSelected, value],
  );

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  return (
    <div
      className={classNames([
        'dial-input px-3 py-2 flex flex-row items-center flex-wrap w-fit gap-2',
        containerCssClass,
      ])}
    >
      <DialAutocompleteInputValue
        selectedItems={selectedItems}
        listCssClass={listCssClass}
        listElementCssClass={listElementCssClass}
      />
      <input
        type="text"
        value={value}
        className={classNames(['border-0 bg-transparent p-0', inputCssClass])}
        placeholder={selectedItems?.length ? '' : placeholder}
        onKeyDown={onKeyDown}
        onChange={onInputChange}
      />
    </div>
  );
};
