import classNames from 'classnames';
import type { FC, ReactNode } from 'react';

import { DialFieldLabel } from '@/components/Field/Field';
import type { InputBaseProps } from '@/models/field-control-props';
import DialDropdownComponent from './DropdownComponent';
import { DialDropdownItem } from './DropdownItem';
import type { DropdownItemsModel } from '@/models/dropdown';

export interface DialDropdownFieldProps extends InputBaseProps {
  items: DropdownItemsModel[];
  selectedClassName?: string;
  selectedValue?: string;
  multipleValues?: string[] | null;
  onChange: (value: string) => void;
  prefix?: string;
  children?: ReactNode;
  listClassName?: string;
  containerCssClass?: string;
  fieldTitle?: string;
  optional?: boolean;
}

/**
 * A dropdown field component that combines a field label with a dropdown
 *
 * @example
 * ```tsx
 * <DialDropdownField
 *   elementId="category"
 *   fieldTitle="Category"
 *   items={categoryOptions}
 *   selectedValue={selectedCategory}
 *   onChange={setSelectedCategory}
 *   placeholder="Select a category..."
 * />
 * ```
 *
 * @param fieldTitle - Label text for the field
 * @param optional - Whether the field is optional (shows in label)
 * @param elementId - Unique identifier for the dropdown
 * @param items - Array of dropdown items to display
 * @param onChange - Callback when selection changes
 * @param selectedValue - Currently selected item ID
 * @param children - Additional content to render in dropdown
 * @param multipleValues - Array of selected values for multi-select mode
 * @param containerCssClass - Additional CSS classes for the container
 * @param prefix - Text prefix for the selected value
 * @param listClassName - Additional CSS classes for the dropdown list
 * @param selectedClassName - Additional CSS classes for the selected value display
 */
export const DialDropdownField: FC<DialDropdownFieldProps> = ({
  fieldTitle,
  optional,
  elementId,
  items,
  onChange,
  selectedValue,
  children,
  multipleValues,
  containerCssClass,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value,
  ...props
}) => {
  return (
    <div className={classNames('flex flex-col w-full', containerCssClass)}>
      <DialFieldLabel
        fieldTitle={fieldTitle}
        optional={optional}
        htmlFor={elementId}
      />

      <DialDropdownComponent
        {...props}
        id={elementId}
        selectedValue={items.find((item) => item.id === selectedValue)}
        multipleValues={multipleValues}
      >
        {items.map((item, i) => (
          <DialDropdownItem
            id={item.id}
            key={i}
            dropdownItem={item}
            onClick={() => onChange(item.id)}
            multipleValues={multipleValues}
          />
        ))}
        {children && <DialDropdownItem>{children}</DialDropdownItem>}
      </DialDropdownComponent>
    </div>
  );
};
