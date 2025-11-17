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
  useRef,
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

import { DialSearch } from '@/components/Search/Search';
import type { SelectOption } from '@/models/select';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { DialMultiSelectTags } from './MultiSelectTags';
import { SelectSize, SelectVariant } from '@/types/select';

export interface DialSelectProps {
  options: SelectOption[];
  multiple?: boolean;
  size?: SelectSize;
  variant?: SelectVariant;
  value?: string | string[];
  prefix?: string;
  defaultValue?: string | string[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectAll?: boolean;
  selectAllLabel?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: ReactNode;
  disabled?: boolean;
  cssClass?: string;
  closable?: boolean;
  header?: ReactNode | (() => ReactNode);
  footer?: ReactNode | (() => ReactNode);
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  onChange?: (next: string | string[]) => void;
  inlineSearch?: boolean;
  onFooterClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

/**
 * A versatile select supporting single and multiple selections.
 *
 * Single mode mirrors the legacy visual:
 * - Trigger shows the selected option's leading icon + label.
 * - In the list, the selected option is indicated by a LEFT border and tinted background
 *   (no check icon).
 *
 * Multiple mode uses checkboxes (including Select All with indeterminate state).
 *
 * Search:
 * - `searchable`: shows a plain input in the overlay header that filters options.
 * - `inlineSearch` (single mode only): the trigger renders a plain input; typing filters options;
 *   when closed, the input shows the selected label.
 *
 * @example
 * ```tsx
 * <DialSelect options={[{ value: 'option-1', label: 'Option 1' }]} />
 * <DialSelect searchable options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />
 * <DialSelect multiple selectAll options={[{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]} />
 * <DialSelect inlineSearch options={[{ value: 'r', label: 'Relax-Name' }, { value: 'rep2', label: 'rep2' }]} />
 * ```
 *
 * @param options - Array of options to select from.
 * @param [multiple] - Whether multiple selections are allowed.
 * @param [size=SelectSize.Md] - Size of the control.
 * @param [variant=SelectVariant.Primary] - Visual variant.
 * @param [value] - Controlled selected value(s).
 * @param [prefix] - Prefix for selected value(s).
 * @param [defaultValue] - Uncontrolled initial selected value(s).
 * @param [placeholder="Select..."] - Placeholder text when no selection is made.
 * @param [searchable=false] - Show a search field in the overlay header.
 * @param [searchPlaceholder] - Placeholder for the search input (overlay/inline).
 * @param [selectAll=false] - Show a "Select All" checkbox in multiple mode.
 * @param [selectAllLabel="Select all"] - Label for the "Select All" checkbox.
 * @param [emptyStateTitle="No options available"] - Title text when there are no options.
 * @param [emptyStateDescription] - Description text when there are no options.
 * @param [emptyStateIcon] - Icon to display when there are no options.
 * @param [disabled=false] - Disable the control.
 * @param [cssClass] - Additional CSS classes for the trigger.
 * @param [closable=false] - Show a close button in the dropdown header.
 * @param [header] - Custom node/function rendered above the options.
 * @param [footer] - Custom node/function rendered below the options.
 * @param [onClose] - Called when the dropdown close button is clicked.
 * @param [onChange] - Called when the selection changes.
 * @param [inlineSearch=false] - Render a plain input inside trigger (single mode only).
 * @param [onFooterClick] - Called when the footer element is clicked. When provided, automatically closes the dropdown.
 */
export const DialSelect: FC<DialSelectProps> = ({
  options,
  multiple = false,
  value,
  defaultValue,
  variant = SelectVariant.Primary,
  size = SelectSize.Md,
  prefix,
  placeholder = 'Select...',
  searchable = false,
  searchPlaceholder,
  selectAll = false,
  selectAllLabel = 'Select all',
  emptyStateTitle = 'No options available',
  emptyStateDescription,
  emptyStateIcon,
  disabled = false,
  cssClass,
  closable = false,
  header,
  footer,
  onClose,
  onChange,
  inlineSearch = false,
  onFooterClick,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const listId = useId();
  const inlineSearchInputRef = useRef<HTMLInputElement>(null);

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
    (event: MouseEvent<HTMLButtonElement>, val: string) => {
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

  useEffect(() => {
    if (open && inlineSearch && !multiple && !disabled) {
      requestAnimationFrame(() => {
        const el = inlineSearchInputRef.current;
        if (!el) return;
        el.focus();
        const len = el.value?.length ?? 0;
        el.setSelectionRange?.(len, len);
      });
    }
  }, [open, inlineSearch, multiple, disabled]);

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
      <DialMultiSelectTags
        options={options}
        selectedValues={selectedValues}
        handleRemoveTag={handleRemoveTag}
      />
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
          <DialEllipsisTooltip
            text={
              prefix
                ? `${prefix} ${singleSelectedOption.label}`
                : singleSelectedOption.label
            }
          />
          {singleSelectedOption?.description && (
            <div className="text-secondary dial-small">
              {singleSelectedOption.description}
            </div>
          )}
        </>
      );
    }

    return <span className="text-secondary truncate">{placeholder}</span>;
  }, [
    hasSelection,
    multiple,
    prefix,
    placeholder,
    renderTags,
    singleSelectedOption,
  ]);

  const inlineInputValue = open ? query : (singleSelectedOption?.label ?? '');

  return (
    <DialDropdown
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      closable={closable}
      onClose={onClose}
      placement="bottom-start"
      allowedPlacements={['bottom-start', 'top-start']}
      renderOverlay={() => (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          className={selectOverlayBaseClasses}
        >
          {header && <>{typeof header === 'function' ? header() : header}</>}
          {(searchable || closable) && (
            <div className="flex items-center gap-2 px-2 pt-2">
              {searchable && (
                <DialSearch
                  placeholder={searchPlaceholder}
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
                      role="option"
                      aria-selected={selected}
                      aria-disabled={!!opt.disabled}
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

                      {opt.description && (
                        <div className="text-secondary dial-small">
                          {opt.description}
                        </div>
                      )}
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
                      <DialEllipsisTooltip text={opt.label} />

                      {opt.description && (
                        <div className="text-secondary dial-small">
                          {opt.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
          {footer && (
            <div
              onClick={(e) => {
                onFooterClick?.(e);
                if (onFooterClick) {
                  setOpen(false);
                }
              }}
            >
              {typeof footer === 'function' ? footer() : footer}
            </div>
          )}
        </div>
      )}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={mergeClasses(
          selectTriggerBaseClasses,
          disabled && 'opacity-75 !cursor-not-allowed',
          size === SelectSize.Sm
            ? 'min-h-[25px] px-1.5 py-1'
            : 'min-h-[38px] px-3 py-2',
          variant === SelectVariant.Secondary ? '!bg-layer-4' : '',
          cssClass,
        )}
        onMouseDown={(e) => {
          if (disabled) return;
          if (inlineSearch && !multiple) {
            e.preventDefault();
          }
        }}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);

          if (inlineSearch && !multiple) {
            inlineSearchInputRef.current?.focus();
          }
        }}
      >
        {inlineSearch && !multiple ? (
          <div className="flex min-w-0 items-center gap-2 text-primary flex-1">
            <input
              id={`inline-${listId}`}
              type="text"
              placeholder={searchPlaceholder ?? placeholder}
              value={inlineInputValue}
              onChange={(e) => setQuery(e.currentTarget.value)}
              onFocus={() => !disabled && setOpen(true)}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent outline-none w-full dial-small"
              ref={inlineSearchInputRef}
              disabled={disabled}
              aria-disabled={disabled}
            />

            {singleSelectedOption && !disabled && (
              <DialButton
                ariaLabel="Clear selection"
                iconBefore={<IconX size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelection('');
                  setQuery('');
                  setOpen(true);
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2 text-primary">
            {renderSelectedValue()}
          </div>
        )}

        <DialIcon
          icon={selectChevronIcon}
          className={classNames('text-primary', open && 'rotate-180')}
        />
      </button>
    </DialDropdown>
  );
};
