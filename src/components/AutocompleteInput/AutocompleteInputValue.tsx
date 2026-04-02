import classNames from 'classnames';
import type { FC } from 'react';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { DialTag } from '@/components/Tag/Tag';

export interface DialAutocompleteInputValueProps {
  placeholder?: string;
  selectedItems?: string[];
  listClassName?: string;
  listElementClassName?: string;
}

/**
 * A component that displays a list of selected items in a customizable, styled list. Each item is
 * aliases: SelectedList|ItemDisplay
 *
 * rendered as a button wrapped in a tooltip, allowing for truncation and additional context when
 * hovered. The component is flexible and supports custom CSS classes for styling the list and
 * individual list items.
 *
 * @example
 * ```tsx
 * <DialAutocompleteInputValue
 *   selectedItems={['Item 1', 'Item 2', 'Item 3']}
 *   listClassName="custom-list-class"
 *   listElementClassName="custom-item-class"
 * />
 * ```
 *
 * @param [placeholder] - Placeholder text to display when no items are selected.
 * @param [selectedItems] - An array of strings representing the selected items to display. If empty or undefined, the component renders nothing.
 * @param [listClassName] - Additional CSS classes applied to the `<ul>` element containing the list of selected items.
 * @param [listElementClassName] - Additional CSS classes applied to each `<li>` element representing an individual selected item.
 */
export const DialAutocompleteInputValue: FC<
  DialAutocompleteInputValueProps
> = ({ selectedItems, listClassName, listElementClassName, placeholder }) => {
  return selectedItems?.length ? (
    <ul
      className={classNames(
        'flex-row items-center truncate flex-wrap',
        'flex gap-x-2 gap-y-1',
        listClassName,
      )}
    >
      {selectedItems?.map((selectedItem, index) => (
        <li key={`${selectedItem}_${index}`}>
          <DialTooltip tooltip={selectedItem}>
            <DialTag
              tag={selectedItem}
              className={classNames([listElementClassName])}
            />
          </DialTooltip>
        </li>
      ))}
    </ul>
  ) : placeholder ? (
    <span className="text-secondary">{placeholder}</span>
  ) : null;
};
