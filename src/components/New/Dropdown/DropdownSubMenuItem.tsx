import { useCallback, type FC, type MouseEvent } from 'react';

import { MenuItem } from '@/components/New/MenuItem/MenuItem';
import { type DropdownItem } from '@/models/dropdown';
import { MenuItemMark } from '@/types/menu-item';
import { SubMenuPanel, useSubMenuFloating } from '@/utils/sub-menu-floating';

import { getItemRole, resolveItemMark } from './item-mark';

import {
  dropdownGap,
  dropdownSubMenuClassName,
  submenuCaretIcon,
} from './constants';

export interface DropdownSubMenuItemProps {
  item: DropdownItem;
  /** Close the root dropdown when a leaf child is selected. */
  onRootClose: () => void;
}

export const DropdownSubMenuItem: FC<DropdownSubMenuItemProps> = ({
  item,
  onRootClose,
}) => {
  const {
    isOpen,
    refs,
    floatingStyles,
    context,
    getReferenceProps,
    getFloatingProps,
  } = useSubMenuFloating(dropdownGap, 'menu', !!item.disabled);

  const handleChildClick = useCallback(
    (child: DropdownItem) => (e: MouseEvent) => {
      if (child.disabled) return;
      child.onClick?.({ key: child.key, domEvent: e });
      // A multiselect child is meant to be toggled several times, so it
      // leaves both panels up — the same rule the root items follow.
      if (!child.selectable) onRootClose();
    },
    [onRootClose],
  );

  return (
    <>
      <MenuItem
        ref={refs.setReference}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-disabled={!!item.disabled}
        disabled={item.disabled}
        icon={item.icon}
        label={item.label}
        trailing={submenuCaretIcon}
        className={item.className}
        {...getReferenceProps()}
      >
        {item.renderItem?.(item)}
      </MenuItem>

      {isOpen && (
        <SubMenuPanel
          refs={refs}
          floatingStyles={floatingStyles}
          context={context}
          getFloatingProps={getFloatingProps}
          role="menu"
          surfaceClassName={dropdownSubMenuClassName}
        >
          {item.renderSubMenu ? (
            item.renderSubMenu()
          ) : (
            <>
              {item.menuHeader &&
                (typeof item.menuHeader === 'function'
                  ? item.menuHeader()
                  : item.menuHeader)}

              {item.children!.map((child) => {
                const role = getItemRole(child);

                return (
                  <MenuItem
                    key={child.key}
                    role={role}
                    aria-checked={
                      role === 'menuitem' ? undefined : !!child.checked
                    }
                    aria-current={
                      resolveItemMark(child) === MenuItemMark.Highlight &&
                      child.checked
                        ? true
                        : undefined
                    }
                    aria-disabled={!!child.disabled}
                    disabled={child.disabled}
                    mark={resolveItemMark(child)}
                    selected={!!child.checked}
                    danger={child.danger}
                    icon={child.icon}
                    label={child.label}
                    className={child.className}
                    rightControl={child.rightControl}
                    onClick={handleChildClick(child)}
                  >
                    {child.renderItem?.(child)}
                  </MenuItem>
                );
              })}

              {item.menuFooter &&
                (typeof item.menuFooter === 'function'
                  ? item.menuFooter()
                  : item.menuFooter)}
            </>
          )}
        </SubMenuPanel>
      )}
    </>
  );
};
