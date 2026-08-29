import { type FC } from 'react';

import { MenuItem } from '@/components/New/MenuItem/MenuItem';
import { type SelectOption } from '@/models/select';
import { MenuItemMark } from '@/types/menu-item';
import { SubMenuPanel, useSubMenuFloating } from '@/utils/sub-menu-floating';

import {
  selectSubMenuCaretIcon,
  selectSubMenuClassName,
  selectSubMenuGap,
} from './constants';

export interface SelectSubMenuItemProps {
  opt: SelectOption;
  selectedValues: string[];
  /** How a chosen child row is marked. */
  mark?:
    | MenuItemMark.Tint
    | MenuItemMark.Check
    | MenuItemMark.Checkbox
    | MenuItemMark.Highlight;
  onSelect: (value: string) => void;
}

export const SelectSubMenuItem: FC<SelectSubMenuItemProps> = ({
  opt,
  selectedValues,
  mark = MenuItemMark.Tint,
  onSelect,
}) => {
  const {
    isOpen,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
  } = useSubMenuFloating(selectSubMenuGap, 'listbox', !!opt.disabled);

  const parentSelected = opt.children?.some((c) =>
    selectedValues.includes(c.value),
  );

  return (
    <>
      {/*
        The trigger carries no mark of its own: the check belongs to the child
        that is actually chosen, one panel over. While its panel is open the row
        stays tinted, which is what the design shows for an open parent.
      */}
      <MenuItem
        ref={refs.setReference}
        role="option"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-selected={!!parentSelected}
        aria-disabled={!!opt.disabled}
        disabled={opt.disabled}
        ellipsisLabel
        icon={opt.icon}
        label={opt.labelNode ?? opt.label}
        trailing={selectSubMenuCaretIcon}
        {...getReferenceProps()}
      />

      {isOpen && (
        <SubMenuPanel
          refs={refs}
          floatingStyles={floatingStyles}
          context={context}
          getFloatingProps={getFloatingProps}
          role="listbox"
          surfaceClassName={selectSubMenuClassName}
        >
          {opt.children!.map((child) => (
            <MenuItem
              key={child.value}
              role="option"
              aria-selected={selectedValues.includes(child.value)}
              aria-disabled={!!child.disabled}
              disabled={child.disabled}
              mark={mark}
              selected={selectedValues.includes(child.value)}
              ellipsisLabel
              icon={child.icon}
              label={child.labelNode ?? child.label}
              rightControl={child.rightControl}
              onClick={() => !child.disabled && onSelect(child.value)}
            />
          ))}
        </SubMenuPanel>
      )}
    </>
  );
};
