import { useCallback, type FC, type MouseEvent } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { type DropdownItem } from '@/models/dropdown';
import { mergeClasses } from '@/utils/merge-classes';
import { SubMenuPanel, useSubMenuFloating } from '@/utils/sub-menu-floating';

import {
  dropdownGap,
  dropdownItemBaseClassName,
  dropdownItemDangerClassName,
  dropdownItemDisabledClassName,
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
      onRootClose();
    },
    [onRootClose],
  );

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-disabled={!!item.disabled}
        disabled={item.disabled}
        className={mergeClasses(
          dropdownItemBaseClassName,
          item.disabled && dropdownItemDisabledClassName,
          item.className,
        )}
        {...getReferenceProps()}
      >
        {item.renderItem ? (
          item.renderItem(item)
        ) : (
          <>
            {item.icon && (
              <span
                className={mergeClasses(item.disabled && 'text-secondary')}
              >
                <DialIcon icon={item.icon} />
              </span>
            )}
            <span
              className={mergeClasses(
                'flex-1 truncate text-start',
                item.disabled && 'text-secondary',
              )}
            >
              {item.label}
            </span>
          </>
        )}
        <span
          className={mergeClasses(
            'ml-auto shrink-0',
            item.disabled && 'text-secondary',
          )}
        >
          {submenuCaretIcon}
        </span>
      </button>

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

              {item.children!.map((child) => (
                <button
                  key={child.key}
                  role="menuitem"
                  type="button"
                  aria-disabled={!!child.disabled}
                  disabled={child.disabled}
                  className={mergeClasses(
                    dropdownItemBaseClassName,
                    child.disabled && dropdownItemDisabledClassName,
                    child.danger && dropdownItemDangerClassName,
                    child.className,
                  )}
                  onClick={handleChildClick(child)}
                >
                  {child.renderItem ? (
                    child.renderItem(child)
                  ) : (
                    <>
                      {child.icon && (
                        <span
                          className={mergeClasses(
                            child.danger && 'text-error',
                            child.disabled && 'text-secondary',
                          )}
                        >
                          <DialIcon icon={child.icon} />
                        </span>
                      )}
                      <span
                        className={mergeClasses(
                          'flex-1 truncate text-start',
                          child.danger && 'text-error',
                          child.disabled && 'text-secondary',
                        )}
                      >
                        {child.label}
                      </span>
                    </>
                  )}
                </button>
              ))}

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
