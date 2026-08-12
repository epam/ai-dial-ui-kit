import type { FC } from 'react';
import { DialTagInput } from '@/components/TagInput/TagInput';

export interface DialAutocompleteInputValueProps {
  placeholder?: string;
  selectedItems?: string[];
  listClassName?: string;
  listElementClassName?: string;
  collapseTagOverflow?: boolean;
}

/**
 * A component that displays a list of selected items in a customizable, styled list. Each item is
 * aliases: SelectedList|ItemDisplay
 * Design system 1.0
 *
 * rendered as a tag wrapped in a tooltip, allowing for truncation and additional context when
 * hovered. The component is flexible and supports custom CSS classes for styling the list and
 * individual list items.
 *
 * @example
 * ```tsx
 * <DialAutocompleteInputValue
 *   selectedItems={['Item 1', 'Item 2', 'Item 3']}
 *   listClassName="custom-list-class"
 *   listElementClassName="custom-item-class"
 *   collapseTagOverflow
 * />
 * ```
 *
 * @param [placeholder] - Placeholder text to display when no items are selected.
 * @param [selectedItems] - An array of strings representing the selected items to display. If empty or undefined, the component renders nothing.
 * @param [listClassName] - Additional CSS classes applied to the container element containing the list of selected items.
 * @param [listElementClassName] - Additional CSS classes applied to each tag element representing an individual selected item.
 * @param [collapseTagOverflow=false] - When true, keeps items on one line and shows `+N` chip with a tooltip for overflow items.
 */
export const DialAutocompleteInputValue: FC<
  DialAutocompleteInputValueProps
> = ({
  selectedItems,
  placeholder,
  collapseTagOverflow = false,
  listClassName,
  listElementClassName,
}) => {
  if (!selectedItems?.length) {
    return placeholder ? (
      <span className="text-secondary">{placeholder}</span>
    ) : null;
  }

  return (
    <DialTagInput
      readOnly
      initialTags={selectedItems}
      collapseTagOverflow={collapseTagOverflow}
      containerClassName={listClassName}
      tagClassName={listElementClassName}
    />
  );
};
