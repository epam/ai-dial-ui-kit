import { IconChevronRight } from '@tabler/icons-react';
import classNames from 'classnames';
import { type FC } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { type SelectOption } from '@/models/select';
import { SubMenuPanel, useSubMenuFloating } from '@/utils/sub-menu-floating';

import {
  selectOptionBaseClassName,
  selectOptionDisabledClassName,
  selectOptionSingleSelectedClassName,
  selectSubMenuGap,
} from './constants';

export interface SelectSubMenuItemProps {
  opt: SelectOption;
  selectedValues: string[];
  onSelect: (value: string) => void;
}

export const SelectSubMenuItem: FC<SelectSubMenuItemProps> = ({
  opt,
  selectedValues,
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
      <button
        ref={refs.setReference}
        type="button"
        role="option"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-selected={!!parentSelected}
        aria-disabled={!!opt.disabled}
        disabled={opt.disabled}
        className={classNames(
          selectOptionBaseClassName,
          parentSelected && selectOptionSingleSelectedClassName,
          opt.disabled && selectOptionDisabledClassName,
        )}
        {...getReferenceProps()}
      >
        <div className="flex items-center gap-2 w-full min-w-0">
          {opt.icon && <DialIcon icon={opt.icon} />}
          <DialEllipsisTooltip text={opt.label} />
        </div>
        <IconChevronRight size={14} className="shrink-0" />
      </button>

      {isOpen && (
        <SubMenuPanel
          refs={refs}
          floatingStyles={floatingStyles}
          context={context}
          getFloatingProps={getFloatingProps}
          role="listbox"
          className="w-max py-1"
        >
          {opt.children!.map((child) => {
            const childSelected = selectedValues.includes(child.value);
            return (
              <button
                key={child.value}
                type="button"
                role="option"
                aria-selected={childSelected}
                aria-disabled={!!child.disabled}
                disabled={child.disabled}
                className={classNames(
                  selectOptionBaseClassName,
                  childSelected && selectOptionSingleSelectedClassName,
                  child.disabled && selectOptionDisabledClassName,
                )}
                onClick={() => !child.disabled && onSelect(child.value)}
              >
                <div className="flex items-center gap-2 w-full">
                  {child.icon && <DialIcon icon={child.icon} />}
                  <DialEllipsisTooltip text={child.label} />
                </div>
              </button>
            );
          })}
        </SubMenuPanel>
      )}
    </>
  );
};
