import classNames from 'classnames';
import type { FC } from 'react';
import { DialTooltip } from '@/components/Tooltip/Tooltip';

export interface DialAutocompleteInputValueProps {
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
 * @param [selectedItems] - An array of strings representing the selected items to display. If empty or undefined, the component renders nothing.
 * @param [listCssClass] - Additional CSS classes applied to the `<ul>` element containing the list of selected items.
 * @param [listElementCssClass] - Additional CSS classes applied to each `<li>` element representing an individual selected item.
 */
export const DialAutocompleteInputValue: FC<
  DialAutocompleteInputValueProps
> = ({ selectedItems, listCssClass, listElementCssClass }) => {
  return (
    !!selectedItems?.length && (
      <ul
        className={classNames(
          'flex-row items-center truncate flex-wrap',
          'flex gap-x-2 gap-y-1',
          listCssClass,
        )}
      >
        {selectedItems?.map((selectedItem) => (
          <li
            key={selectedItem}
            className={classNames([
              'tiny bg-layer-3 rounded p-1 border border-primary max-w-[200px] truncate',
              listElementCssClass,
            ])}
          >
            <DialTooltip tooltip={selectedItem}>
              <button
                aria-label="autocomplete-action"
                type="button"
                className="truncate w-full"
              >
                {selectedItem}
              </button>
            </DialTooltip>
          </li>
        ))}
      </ul>
    )
  );
};
