import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react';
import type { HTMLProps } from 'react';
import { forwardRef } from 'react';

import DialDropdownComponent, {
  type DialDropdownComponentProps,
} from './DropdownComponent';
import { DialDropdownItem } from './DropdownItem';
import { DialDropdownField } from './DropdownField';

/**
 * A flexible dropdown component with support for single and multi-selection
 *
 * @example
 * ```tsx
 * <DialDropdown placeholder="Select option" selectedValue={selectedItem}>
 *   <DialDropdown.Item dropdownItem={item1} onClick={() => handleSelect(item1)} />
 *   <DialDropdown.Item dropdownItem={item2} onClick={() => handleSelect(item2)} />
 * </DialDropdown>
 * ```
 *
 * @example
 * With field wrapper:
 * ```tsx
 * <DialDropdown.Field
 *   fieldTitle="Select option"
 *   items={items}
 *   selectedValue="item1"
 *   onChange={handleChange}
 * />
 * ```
 *
 * @param children - DialDropdownItem components to display in the dropdown
 * @param selectedValue - Currently selected dropdown item
 * @param placeholder - Text to show when no item is selected
 * @param listClassName - Additional CSS classes for the dropdown list
 * @param selectedClassName - Additional CSS classes for the selected value display
 * @param trigger - Custom trigger element (if not provided, uses default selected value display)
 * @param type - Type of dropdown ('dropdown' or 'menu')
 * @param isMenuOpen - Whether the dropdown is open (controlled mode)
 * @param onOpenChange - Callback when dropdown open state changes
 * @param placement - Floating UI placement for the dropdown
 * @param shouldFlip - Whether to flip the dropdown when it doesn't fit
 * @param shouldApplySize - Whether to apply size constraints
 * @param enableAncestorScroll - Whether to close on ancestor scroll
 * @param noFocusReturn - Whether to prevent focus return to trigger
 * @param isTriggerEnabled - Whether the trigger is enabled
 * @param isMenu - Whether this is a menu-style dropdown
 * @param prefix - Text prefix for the selected value
 * @param multipleValues - Array of selected values for multi-select mode
 */
const DialDropdownBase = forwardRef<
  HTMLDivElement,
  DialDropdownComponentProps & HTMLProps<HTMLButtonElement>
>(function DialDropdown(props, ref) {
  const parentId = useFloatingParentNodeId();
  if (parentId === null) {
    return (
      <FloatingTree>
        <DialDropdownComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <DialDropdownComponent {...props} ref={ref} />;
});

// Create a compound component with sub-components
const DialDropdownWithSubComponents =
  DialDropdownBase as typeof DialDropdownBase & {
    Item: typeof DialDropdownItem;
    Field: typeof DialDropdownField;
  };

DialDropdownWithSubComponents.Item = DialDropdownItem;
DialDropdownWithSubComponents.Field = DialDropdownField;

export const DialDropdown = DialDropdownWithSubComponents;
