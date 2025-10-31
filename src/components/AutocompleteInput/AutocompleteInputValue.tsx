import classNames from 'classnames';
import type { FC } from 'react';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { DialTag } from '@/components/Tag/Tag';

export interface DialAutocompleteInputValueProps {
  placeholder?: string;
  selectedItems?: string[];
  listCssClass?: string;
  listElementCssClass?: string;
}

/**
 * A component that displays a list of selected items in a customizable, styled list. Each item is
 * rendered as a button wrapped in a tooltip, allowing for truncation and additional context when
 * hovered. The component is flexible and supports custom CSS classes for styling the list and
 * individual list items.
 *
 * @example
 * ```tsx
 * <DialAutocompleteInputValue
 *   selectedItems={['Item 1', 'Item 2', 'Item 3']}
 *   listCssClass="custom-list-class"
 *   listElementCssClass="custom-item-class"
 * />
 * ```
 *
 * @param [placeholder] - Placeholder text to display when no items are selected.
 * @param [selectedItems] - An array of strings representing the selected items to display. If empty or undefined, the component renders nothing.
 * @param [listCssClass] - Additional CSS classes applied to the `<ul>` element containing the list of selected items.
 * @param [listElementCssClass] - Additional CSS classes applied to each `<li>` element representing an individual selected item.
 */
export const DialAutocompleteInputValue: FC<
  DialAutocompleteInputValueProps
> = ({ selectedItems, listCssClass, listElementCssClass, placeholder }) => {
  return selectedItems?.length ? (
    <ul
      className={classNames(
        'flex-row items-center truncate flex-wrap',
        'flex gap-x-2 gap-y-1',
        listCssClass,
      )}
    >
      {selectedItems?.map((selectedItem) => (
        <li key={selectedItem}>
          <DialTooltip tooltip={selectedItem}>
            <DialTag
              tag={selectedItem}
              cssClass={classNames([listElementCssClass])}
            />
          </DialTooltip>
        </li>
      ))}
    </ul>
  ) : placeholder ? (
    <span className="text-secondary">{placeholder}</span>
  ) : null;
};
