import { IconClipboardX, IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import {
  type FC,
  type ReactNode,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  useImperativeHandle,
  type Ref,
  useId,
} from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { DialButton } from '@/components/Button/Button';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { DialCheckbox } from '@/components/Checkbox/Checkbox';
import { DialSearch } from '@/components/Search/Search';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { DialMultiSelectTags } from './MultiSelectTags';
import type { SelectOption } from '@/models/select';
import { SelectSize, SelectVariant } from '@/types/select';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import {
  selectTriggerBaseClassName,
  selectOverlayBaseClassName,
  selectOptionBaseClassName,
  selectOptionSelectedClassName,
  selectOptionSingleSelectedClassName,
  selectOptionDisabledClassName,
  selectChevronIcon,
  dropdownMenuMaxHeight,
} from './constants';
import { mergeClasses } from '@/utils/merge-classes';
import { SelectSubMenuItem } from './SelectSubMenuItem';

export interface DialSelectProps {
  options: SelectOption[];
  multiple?: boolean;
  elementId?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  value?: string | string[];
  customSelectedValue?: string;
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
  className?: string;
  listClassName?: string;
  closable?: boolean;
  invalid?: boolean;
  header?: ReactNode | (() => ReactNode);
  footer?: ReactNode | (() => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onInlineQueryChange?: (query: string) => void;
  dismissRef?: Ref<unknown>;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  onChange?: (next: string | string[]) => void;
  inlineSearch?: boolean;
  onFooterClick?: (e: MouseEvent<HTMLDivElement>) => void;
  customMultiSelectTagsRenderer?: (
    options: SelectOption[],
    selectedValues: string[],
    handleRemoveTag: (
      event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
      val: string,
    ) => void,
  ) => ReactNode;
}

/**
 * A versatile select supporting single and multiple selections.
 * aliases: OptionPicker|ChoiceSelector
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
 * @param [elementId] - The id attribute for the select element.
 * @param [multiple] - Whether multiple selections are allowed.
 * @param [size=SelectSize.Md] - Size of the control.
 * @param [variant=SelectVariant.Primary] - Visual variant.
 * @param [value] - Controlled selected value(s).
 * @param [customSelectedValue] - Custom string to render as the selected value in single mode.
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
 * @param [invalid] - Whether the select is in an invalid state, affecting styling.
 * @param [disabled=false] - Disable the control.
 * @param [className] - Additional CSS classes for the trigger.
 * @param [listClassName] - Additional CSS classes for the list dropdown.
 * @param [closable=false] - Show a close button in the dropdown header.
 * @param [header] - Custom node/function rendered above the options.
 * @param [footer] - Custom node/function rendered below the options.
 * @param [open] - Controlled open state of the dropdown. When provided, makes the dropdown controlled.
 * @param [onOpenChange] - Called when the dropdown open state changes.
 * @param [onClose] - Called when the dropdown close button is clicked.
 * @param [onChange] - Called when the selection changes.
 * @param [inlineSearch=false] - Render a plain input inside trigger (single mode only).
 * @param [onInlineQueryChange] - Called when the inline search query changes
 * @param [onFooterClick] - Called when the footer element is clicked. When provided, automatically closes the dropdown.
 * @param [dismissRef] - Ref object to expose a `dismiss` method to programmatically close the select.
 */
export const DialSelect: FC<DialSelectProps> = ({
  options,
  multiple = false,
  elementId,
  value,
  defaultValue,
  variant = SelectVariant.Primary,
  size = SelectSize.Md,
  prefix,
  customSelectedValue,
  placeholder = 'Select...',
  searchable = false,
  searchPlaceholder,
  selectAll = false,
  invalid,
  selectAllLabel = 'Select all',
  emptyStateTitle = 'No options available',
  emptyStateDescription,
  emptyStateIcon,
  disabled = false,
  className,
  listClassName,
  closable = false,
  header,
  footer,
  onClose,
  onChange,
  inlineSearch = false,
  dismissRef,
  onFooterClick,
  open,
  onOpenChange,
  onInlineQueryChange,
  customMultiSelectTagsRenderer,
}) => {
  const listId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlledOpen = open !== undefined;
  const isOpen = isControlledOpen ? !!open : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlledOpen) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlledOpen, onOpenChange],
  );

  const [query, setInternalQuery] = useState(
    inlineSearch ? customSelectedValue || '' : '',
  );
  const inlineSearchInputRef = useRef<HTMLInputElement>(null);
  const setQuery = useCallback(
    (next?: string) => {
      if (next !== query) {
        setInternalQuery(next || '');
        onInlineQueryChange?.(next || '');
      }
    },
    [onInlineQueryChange, query],
  );

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
    if (!isOpen && !inlineSearch) setQuery('');
  }, [inlineSearch, isOpen, setQuery]);

  useEffect(() => {
    if (inlineSearch && !isOpen && customSelectedValue)
      setQuery(customSelectedValue || '');
  }, [customSelectedValue, inlineSearch, isOpen, setQuery]);

  const setSelection = useCallback(
    (next: string | string[]) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleToggle = useCallback(
    (val: string) => {
      if (multiple) {
        const set = new Set(selectedValues);
        if (set.has(val)) {
          set.delete(val);
        } else {
          set.add(val);
        }
        setSelection(Array.from(set));
        return;
      }
      setSelection(val);
      if (inlineSearch) {
        const selectedOption =
          options.find((o) => o.value === val) ??
          options.flatMap((o) => o.children ?? []).find((c) => c.value === val);
        if (selectedOption) {
          setQuery(selectedOption.label);
          onInlineQueryChange?.(selectedOption.label);
        }
      }
      setOpen(false);
    },
    [
      multiple,
      setSelection,
      inlineSearch,
      setOpen,
      selectedValues,
      options,
      setQuery,
      onInlineQueryChange,
    ],
  );

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

  const handleClose = useCallback(
    (value: boolean) => {
      if (inlineSearch && !multiple && !value) handleToggle(query);
      setOpen(value);
    },
    [handleToggle, inlineSearch, multiple, query, setOpen],
  );

  const { allSelectedInFiltered, someSelectedInFiltered } = useMemo(() => {
    const all =
      selectableFiltered.length > 0 &&
      selectedInFilteredCount === selectableFiltered.length;
    return {
      allSelectedInFiltered: all,
      someSelectedInFiltered: selectedInFilteredCount > 0 && !all,
    };
  }, [selectableFiltered, selectedInFilteredCount]);

  const toggleSelectAll = useCallback(() => {
    if (!multiple || selectableFiltered.length === 0) return;
    if (allSelectedInFiltered) {
      const filteredIds = new Set(selectableFiltered.map((o) => o.value));
      setSelection(selectedValues.filter((v) => !filteredIds.has(v)));
    } else {
      const union = new Set(selectedValues);
      selectableFiltered.forEach((o) => union.add(o.value));
      setSelection(Array.from(union));
    }
  }, [
    allSelectedInFiltered,
    multiple,
    selectableFiltered,
    selectedValues,
    setSelection,
  ]);

  const hasSelection = selectedValues.length > 0;

  useEffect(() => {
    if (isOpen && inlineSearch && !multiple && !disabled) {
      requestAnimationFrame(() => {
        const el = inlineSearchInputRef.current;
        if (!el) return;
        el.focus();
        const len = el.value?.length ?? 0;
        el.setSelectionRange?.(len, len);
      });
    }
  }, [isOpen, inlineSearch, multiple, disabled]);

  const singleSelectedValue =
    !multiple && hasSelection ? selectedValues[0] : undefined;

  const singleSelectedOption = useMemo(
    () =>
      singleSelectedValue
        ? (options.find((o) => o.value === singleSelectedValue) ??
          options
            .flatMap((o) => o.children ?? [])
            .find((c) => c.value === singleSelectedValue))
        : undefined,
    [options, singleSelectedValue],
  );

  const renderSelectedValue = useCallback(() => {
    if (multiple) {
      if (!hasSelection)
        return <span className="text-secondary truncate">{placeholder}</span>;
      return (
        customMultiSelectTagsRenderer?.(
          options,
          selectedValues,
          handleRemoveTag,
        ) || (
          <DialMultiSelectTags
            options={options}
            selectedValues={selectedValues}
            handleRemoveTag={handleRemoveTag}
          />
        )
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
            <div className="text-secondary dial-small-text">
              {singleSelectedOption.description}
            </div>
          )}
        </>
      );
    }

    if (customSelectedValue && value) {
      return customSelectedValue;
    }

    return <span className="text-secondary truncate">{placeholder}</span>;
  }, [
    hasSelection,
    multiple,
    customSelectedValue,
    prefix,
    value,
    placeholder,
    singleSelectedOption,
    options,
    selectedValues,
    handleRemoveTag,
    customMultiSelectTagsRenderer,
  ]);

  useImperativeHandle(dismissRef, () => ({
    dismiss: () => {
      setOpen(false);
    },
  }));

  const setInlineSearchQuery = useCallback(() => {
    setQuery(
      selectedValues.length === 1 ? (singleSelectedOption?.label ?? query) : '',
    );
  }, [query, selectedValues.length, setQuery, singleSelectedOption?.label]);

  const handleTriggerAction = useCallback(() => {
    if (disabled) return;
    setOpen(!isOpen);

    if (inlineSearch && !multiple) {
      setInlineSearchQuery();
      inlineSearchInputRef.current?.focus();
    }
  }, [disabled, inlineSearch, isOpen, multiple, setInlineSearchQuery, setOpen]);

  return (
    <DialDropdown
      open={isOpen}
      onOpenChange={handleClose}
      disabled={disabled}
      closable={closable}
      onClose={onClose}
      placement="bottom-start"
      allowedPlacements={['bottom-start', 'top-start']}
      maxDropdownHeight={searchable ? null : dropdownMenuMaxHeight}
      listClassName={listClassName}
      renderOverlay={() => (
        <div
          id={`list-${elementId || listId}`}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          className={selectOverlayBaseClassName}
        >
          {header && <>{typeof header === 'function' ? header() : header}</>}
          {(searchable || closable) && options.length > 8 && (
            <div className="flex items-center gap-2 px-2 pt-2">
              {searchable && (
                <DialSearch
                  placeholder={searchPlaceholder}
                  onChange={setQuery}
                  value={query}
                  id={`search-${elementId || listId}`}
                  containerClassName="w-full"
                />
              )}
              {closable && (
                <DialButton
                  aria-label="Close select"
                  className="shrink-0"
                  iconBefore={<IconX size={DIAL_ICON_SIZE.SM} />}
                  onClick={(e) => {
                    onClose?.(e);
                    setOpen(false);
                  }}
                />
              )}
            </div>
          )}

          {multiple && selectAll && selectableFiltered.length > 0 && (
            <div className={classNames(selectOptionBaseClassName, 'mt-2')}>
              <DialCheckbox
                id={`${elementId || listId}-selectAll`}
                label={selectAllLabel}
                checked={allSelectedInFiltered}
                indeterminate={someSelectedInFiltered}
                onChange={toggleSelectAll}
                ariaLabel={selectAllLabel}
              />
            </div>
          )}

          <div
            className={classNames(
              'overflow-y-auto max-h-[352px]',
              inlineSearch && filtered.length === 0 ? '' : 'py-1',
            )}
          >
            {filtered.length === 0
              ? !inlineSearch && (
                  <div className="px-2 py-3">
                    <DialNoDataContent
                      icon={
                        emptyStateIcon ?? (
                          <IconClipboardX
                            size={DIAL_ICON_SIZE.LG}
                            stroke={0.5}
                          />
                        )
                      }
                      title={emptyStateTitle}
                      description={emptyStateDescription}
                    />
                  </div>
                )
              : filtered.map((opt) => {
                  const selected = selectedValues.includes(opt.value);

                  if (multiple) {
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={selected}
                        aria-disabled={!!opt.disabled}
                        className={classNames(
                          selectOptionBaseClassName,
                          selected && selectOptionSelectedClassName,
                          opt.disabled && selectOptionDisabledClassName,
                          'w-full',
                        )}
                      >
                        <DialCheckbox
                          id={`${elementId || listId}-${opt.value}`}
                          label={
                            <span className="flex w-full flex-1 pl-2 min-w-0 items-center gap-2 text-primary">
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
                          <div className="text-secondary dial-small-text">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (opt.children?.length) {
                    return (
                      <SelectSubMenuItem
                        key={opt.value}
                        opt={opt}
                        selectedValues={selectedValues}
                        onSelect={handleToggle}
                      />
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
                        selectOptionBaseClassName,
                        selected && selectOptionSingleSelectedClassName,
                        opt.disabled && selectOptionDisabledClassName,
                      )}
                      onClick={() => !opt.disabled && handleToggle(opt.value)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {opt.icon && <DialIcon icon={opt.icon} />}
                        <DialEllipsisTooltip text={opt.label} />

                        {opt.description && (
                          <div className="text-secondary dial-small-text">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
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
      <div
        role="button"
        tabIndex={0}
        aria-roledescription="button to open select list"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`list-${elementId || listId}`}
        className={mergeClasses(
          selectTriggerBaseClassName,
          disabled && 'opacity-75 !cursor-not-allowed',
          size === SelectSize.Sm
            ? 'min-h-[25px] px-1.5 py-1'
            : 'min-h-[38px] px-3 py-2',
          invalid && 'dial-input-error',
          variant === SelectVariant.Secondary ? '!bg-layer-4 !h-auto' : '',
          className,
        )}
        onMouseDown={(e) => {
          if (disabled) return;
          if (inlineSearch && !multiple) {
            setInlineSearchQuery();
            e.preventDefault();
          }
        }}
        onClick={() => {
          handleTriggerAction();
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            handleTriggerAction();
          }
        }}
      >
        {inlineSearch && !multiple ? (
          <div className="flex min-w-0 items-center gap-2 text-primary flex-1">
            <input
              id={`inline-${elementId || listId}`}
              type="text"
              placeholder={searchPlaceholder ?? placeholder}
              value={query || ''}
              onChange={(e) => setQuery(e.currentTarget.value.trimStart())}
              onFocus={() => !disabled && setOpen(true)}
              onMouseDown={(e) => {
                setInlineSearchQuery();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              className="bg-transparent outline-none w-full dial-small-text"
              ref={inlineSearchInputRef}
              disabled={disabled}
              aria-disabled={disabled}
              autoComplete="off"
            />
          </div>
        ) : (
          <div className="flex w-full min-w-0 items-center gap-2 text-primary">
            {renderSelectedValue()}
          </div>
        )}

        {!inlineSearch && (
          <DialIcon
            icon={selectChevronIcon}
            className={classNames('text-primary', isOpen && 'rotate-180')}
          />
        )}
      </div>
    </DialDropdown>
  );
};
