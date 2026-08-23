import { type FC } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { type SelectOption } from '@/models/select';
import { mergeClasses } from '@/utils/merge-classes';
import { SubMenuPanel, useSubMenuFloating } from '@/utils/sub-menu-floating';

import {
  selectOptionBaseClassName,
  selectOptionCheckIcon,
  selectOptionDisabledClassName,
  selectSubMenuCaretIcon,
  selectSubMenuClassName,
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
        className={mergeClasses(
          selectOptionBaseClassName,
          opt.disabled && selectOptionDisabledClassName,
        )}
        {...getReferenceProps()}
      >
        <div className="flex items-center gap-2 w-full min-w-0">
          {opt.icon && <DialIcon icon={opt.icon} />}
          <EllipsisTooltip text={opt.labelNode ?? opt.label} />
        </div>
        <span className="shrink-0">{selectSubMenuCaretIcon}</span>
      </button>

      {isOpen && (
        <SubMenuPanel
          refs={refs}
          floatingStyles={floatingStyles}
          context={context}
          getFloatingProps={getFloatingProps}
          role="listbox"
          surfaceClassName={selectSubMenuClassName}
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
                className={mergeClasses(
                  selectOptionBaseClassName,
                  child.disabled && selectOptionDisabledClassName,
                )}
                onClick={() => !child.disabled && onSelect(child.value)}
              >
                <div className="flex items-center gap-2 w-full min-w-0">
                  {child.icon && <DialIcon icon={child.icon} />}
                  <EllipsisTooltip text={child.labelNode ?? child.label} />
                </div>

                {childSelected && selectOptionCheckIcon}
              </button>
            );
          })}
        </SubMenuPanel>
      )}
    </>
  );
};
