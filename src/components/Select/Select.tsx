import { IconClipboardX, IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import {
  type FC,
  type ReactNode,
  type MouseEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialButton } from '@/components/Button/Button';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { DialCheckbox } from '@/components/Checkbox/Checkbox';

import {
  selectTriggerBaseClasses,
  selectOverlayBaseClasses,
  selectOptionBaseClasses,
  selectOptionSelectedClasses,
  selectOptionSingleSelectedClasses,
  selectOptionDisabledClasses,
  selectChevronIcon,
} from './constants';
import { DialTag } from '@/components/Tag/Tag';
import { DialSearch } from '@/components/Search/Search';
import type { SelectOption } from '@/models/select';

export interface DialSelectProps {
  options: SelectOption[];
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  placeholder?: string;
  searchable?: boolean;
  selectAll?: boolean;
  selectAllLabel?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: ReactNode;
  disabled?: boolean;
  cssClass?: string;
  closable?: boolean;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  onChange?: (next: string | string[]) => void;
}

/**
 * A versatile select supporting single and multiple selections.
 *
 * Single mode mirrors the legacy visual:
 * - Trigger shows the selected option's leading icon + label.
 * - In the list, the selected option is indicated by a LEFT border and tinted background
 *   (no check icon).
 *
 * @example
 * ```tsx
 * <DialSelect
 *   options={[
 *     { value: 'option-1', label: 'Option 1' },
 *     { value: 'option-2', label: 'Option 2' },
 *   ]}
 *   multiple
 * />
 * ```
 *
 * Multiple mode uses checkboxes (including Select All with indeterminate state).
 *
 * @property options - Array of options to select from.
 * @property multiple - Whether multiple selections are allowed.
 * @property value - Controlled selected value(s).
 * @property defaultValue - Uncontrolled initial selected value(s).
 * @property placeholder - Placeholder text when no selection is made.
 * @property searchable - Whether to show a search input to filter options.
 * @property selectAll - Whether to show a "Select All" checkbox in multiple mode.
 * @property selectAllLabel - Label for the "Select All" checkbox.
 * @property emptyStateTitle - Title text when there are no options to display.
 * @property emptyStateDescription - Optional description text when there are no options.
 * @property emptyStateIcon - Optional icon to display when there are no options.
 * @property disabled - Whether the select is disabled.
 * @property cssClass - Additional CSS classes to apply to the select trigger.
 * @property closable - Whether to show a close button in the dropdown header.
 * @property onClose - Callback when the dropdown is closed via the close button.
 * @property onChange - Callback when the selection changes.
 */
export const DialSelect: FC<DialSelectProps> = ({
  options,
  multiple = false,
  value,
  defaultValue,
  placeholder = 'Select...',
  searchable = false,
  selectAll = false,
  selectAllLabel = 'Select all',
  emptyStateTitle = 'No options available',
  emptyStateDescription,
  emptyStateIcon,
  disabled = false,
  cssClass,
  closable = false,
  onClose,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const listId = useId();

  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<
    string | string[] | undefined
  >(defaultValue);
  const currentValue = isControlled ? value : uncontrolled;

  const selectedValues: string[] = useMemo(() => {
    if (multiple) return Array.isArray(currentValue) ? currentValue : [];
    return typeof currentValue === 'string' ? [currentValue] : [];
  }, [currentValue, multiple]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const setSelection = useCallback(
    (next: string | string[]) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleToggle = (val: string) => {
    if (multiple) {
      const set = new Set(selectedValues);
      if (set.has(val)) {
        set.delete(val);
      } else {
        set.add(val);
      }
      setSelection(Array.from(set));
    } else {
      setSelection(val);
      setOpen(false);
    }
  };

  const handleRemoveTag = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, val: string) => {
      event.stopPropagation();
      if (!multiple) {
        setSelection('');
        return;
      }
      const next = selectedValues.filter((v) => v !== val);
      setSelection(next);
    },
    [multiple, selectedValues, setSelection],
  );

  const selectableFiltered = useMemo(
    () => filtered.filter((o) => !o.disabled),
    [filtered],
  );

  const selectedInFilteredCount = useMemo(
    () =>
      selectableFiltered.filter((o) => selectedValues.includes(o.value)).length,
    [selectableFiltered, selectedValues],
  );

  const allSelectedInFiltered =
    selectableFiltered.length > 0 &&
    selectedInFilteredCount === selectableFiltered.length;

  const someSelectedInFiltered =
    selectedInFilteredCount > 0 && !allSelectedInFiltered;

  const toggleSelectAll = () => {
    if (!multiple || selectableFiltered.length === 0) return;

    if (allSelectedInFiltered) {
      const filteredIds = new Set(selectableFiltered.map((o) => o.value));
      const next = selectedValues.filter((v) => !filteredIds.has(v));

      setSelection(next);
    } else {
      const union = new Set(selectedValues);
      selectableFiltered.forEach((o) => union.add(o.value));

      setSelection(Array.from(union));
    }
  };

  const hasSelection = selectedValues.length > 0;

  const singleSelectedValue =
    !multiple && hasSelection ? selectedValues[0] : undefined;

  const singleSelectedOption = useMemo(
    () =>
      singleSelectedValue
        ? options.find((o) => o.value === singleSelectedValue)
        : undefined,
    [options, singleSelectedValue],
  );

  const renderTags = useCallback(() => {
    if (!multiple || selectedValues.length === 0) return null;
    return (
      <div className="flex flex-wrap w-full items-center gap-1">
        {selectedValues.map((v) => {
          const label = options.find((o) => o.value === v)?.label ?? v;
          const icon = options.find((o) => o.value === v)?.icon;
          return (
            <DialTag
              key={v}
              tag={label}
              remove={(e) => handleRemoveTag(e, v)}
              iconBefore={icon ? <DialIcon icon={icon} /> : null}
              cssClass="max-w-full"
            />
          );
        })}
      </div>
    );
  }, [multiple, options, selectedValues, handleRemoveTag]);

  const renderSelectedValue = useCallback(() => {
    if (multiple) {
      return hasSelection ? (
        renderTags()
      ) : (
        <span className="text-secondary truncate">{placeholder}</span>
      );
    }

    if (singleSelectedOption) {
      return (
        <>
          {singleSelectedOption.icon && (
            <DialIcon icon={singleSelectedOption.icon} />
          )}
          <span className="truncate">{singleSelectedOption.label}</span>
        </>
      );
    }

    return <span className="text-secondary truncate">{placeholder}</span>;
  }, [hasSelection, multiple, placeholder, renderTags, singleSelectedOption]);

  return (
    <DialDropdown
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      closable={closable}
      onClose={onClose}
      placement="bottom-start"
      renderOverlay={() => (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          className={selectOverlayBaseClasses}
        >
          {(searchable || closable) && (
            <div className="flex items-center gap-2 px-2 pt-2">
              {searchable && (
                <DialSearch
                  onChange={setQuery}
                  value={query}
                  elementId={`search-${listId}`}
                />
              )}
              {closable && (
                <DialButton
                  ariaLabel="Close select"
                  cssClass="shrink-0"
                  iconBefore={<IconX size={16} />}
                  onClick={(e) => {
                    onClose?.(e);
                    setOpen(false);
                  }}
                />
              )}
            </div>
          )}

          {multiple && selectAll && selectableFiltered.length > 0 && (
            <div className={classNames(selectOptionBaseClasses, 'mt-2')}>
              <DialCheckbox
                id={`${listId}-selectAll`}
                label={selectAllLabel}
                checked={allSelectedInFiltered}
                indeterminate={someSelectedInFiltered}
                onChange={toggleSelectAll}
                ariaLabel={selectAllLabel}
              />
            </div>
          )}

          <div className="overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-2 py-3">
                <DialNoDataContent
                  icon={emptyStateIcon ?? <IconClipboardX size={24} />}
                  title={emptyStateTitle}
                  description={emptyStateDescription}
                />
              </div>
            ) : (
              filtered.map((opt) => {
                const selected = selectedValues.includes(opt.value);

                if (multiple) {
                  return (
                    <div
                      key={opt.value}
                      className={classNames(
                        selectOptionBaseClasses,
                        selected && selectOptionSelectedClasses,
                        opt.disabled && selectOptionDisabledClasses,
                        'w-full',
                      )}
                    >
                      <DialCheckbox
                        id={`${listId}-${opt.value}`}
                        label={
                          <span className="flex w-full flex-1 min-w-0 items-center gap-2 text-primary">
                            {opt.icon && <DialIcon icon={opt.icon} />}
                            <span className="truncate">{opt.label}</span>
                          </span>
                        }
                        checked={selected}
                        disabled={opt.disabled}
                        onChange={() =>
                          !opt.disabled && handleToggle(opt.value)
                        }
                        ariaLabel={opt.label}
                      />
                    </div>
                  );
                }

                return (
                  <button
                    key={opt.value}
                    role="option"
                    type="button"
                    aria-selected={selected}
                    aria-disabled={!!opt.disabled}
                    disabled={opt.disabled}
                    className={classNames(
                      selectOptionBaseClasses,
                      selected && selectOptionSingleSelectedClasses,
                      opt.disabled && selectOptionDisabledClasses,
                    )}
                    onClick={() => !opt.disabled && handleToggle(opt.value)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {opt.icon && <DialIcon icon={opt.icon} />}
                      <span className="truncate">{opt.label}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={classNames(
          selectTriggerBaseClasses,
          disabled && 'opacity-75 !cursor-not-allowed',
          cssClass,
        )}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <div className="flex min-w-0 items-center gap-2 text-primary">
          {renderSelectedValue()}
        </div>
        <DialIcon
          icon={selectChevronIcon}
          className={classNames('text-primary', open && 'rotate-180')}
        />
      </button>
    </DialDropdown>
  );
};
