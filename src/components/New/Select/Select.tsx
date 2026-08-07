import { IconChevronDown } from '@tabler/icons-react';
import classNames from 'classnames';
import {
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { DialCheckbox } from '@/components/Checkbox/Checkbox';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { DialIcon } from '@/components/Icon/Icon';
import {
  CaptionText,
  ErrorText,
} from '@/components/New/CaptionText/CaptionText';
import { GhostIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { Input } from '@/components/New/Input/Input';
import { Label, type LabelProps } from '@/components/New/Label/Label';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import type { SelectOption } from '@/models/select';
import { ElementSize } from '@/types/size';
import { resolveAccessibleName } from '@/utils/accessible-name';
import { mergeClasses } from '@/utils/merge-classes';
import { MultiSelectTags } from './MultiSelectTags';
import { SelectSubMenuItem } from './SelectSubMenuItem';
import {
  dropdownMenuMaxHeight,
  selectCloseIcon,
  selectEmptyStateIcon,
  selectFieldIconClassName,
  selectOptionBaseClassName,
  selectOptionCheckIcon,
  selectOptionDisabledClassName,
  selectOptionSelectedClassName,
  selectOptionSingleSelectedClassName,
  selectOverlayBaseClassName,
  selectSearchIcon,
  selectSearchThreshold,
} from './constants';

export interface SelectProps {
  options: SelectOption[];
  multiple?: boolean;
  id?: string;
  size?: ElementSize;
  value?: string | string[];
  customSelectedValue?: string;
  prefix?: string;
  defaultValue?: string | string[];
  placeholder?: string;
  labelProps?: LabelProps;
  error?: string;
  caption?: string;
  ariaLabel?: string;
  searchable?: boolean;
  searchSize?: ElementSize;
  searchPlaceholder?: string;
  selectAll?: boolean;
  selectAllLabel?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: ReactNode;
  disabled?: boolean;
  className?: string;
  fieldClassName?: string;
  listClassName?: string;
  closable?: boolean;
  invalid?: boolean;
  header?: ReactNode | (() => ReactNode);
  footer?: ReactNode | (() => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearchQueryChange?: (query: string) => void;
  dismissRef?: Ref<unknown>;
  onClose?: (e: MouseEvent<HTMLButtonElement>) => void;
  onChange?: (next: string | string[]) => void;
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
 * The field is an {@link Input}, so it carries the 2.0 field styling, sizes,
 * label, caption and error states, and it exposes the control as a `combobox`
 * whose popup is the option list.
 *
 * Single mode:
 * - The field shows the selected option's leading icon + label.
 * - In the list, the selected option is indicated by a LEFT border, a tinted background
 *   and a trailing check icon.
 *
 * Multiple mode uses checkboxes (including Select All with indeterminate state) and
 * renders the selection as removable tags inside the field.
 *
 * The field itself is never typeable: `searchable` puts a search field in the overlay
 * header that filters the options.
 *
 * @example
 * ```tsx
 * <Select options={[{ value: 'option-1', label: 'Option 1' }]} />
 * <Select searchable options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />
 * <Select multiple selectAll options={[{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]} />
 * <Select labelProps={{ label: 'Operator' }} caption="Pick a comparison" options={options} />
 * ```
 *
 * @param options - Array of options to select from.
 * @param [id] - The id of the field, linked to the label.
 * @param [multiple] - Whether multiple selections are allowed.
 * @param [size=ElementSize.Standard] - Field height: standard is 40px, small is 24px.
 * @param [value] - Controlled selected value(s).
 * @param [customSelectedValue] - Custom string to render as the selected value in single mode.
 * @param [prefix] - Prefix for selected value(s).
 * @param [defaultValue] - Uncontrolled initial selected value(s).
 * @param [placeholder="Select..."] - Placeholder text when no selection is made.
 * @param [labelProps] - Props of the {@link Label} rendered above the field.
 * @param [error] - Error message rendered below the field (does not by itself apply error styling, pass `invalid` too).
 * @param [caption] - Helper text rendered below the field when there is no `error`.
 * @param [ariaLabel] - Accessible name for the field; use it when there is no visible label.
 * @param [searchable=false] - Show a search field in the overlay header.
 * @param [searchSize=ElementSize.Standard] - Size of the overlay search input when `searchable` is enabled.
 * @param [searchPlaceholder] - Placeholder for the overlay search input.
 * @param [selectAll=false] - Show a "Select All" checkbox in multiple mode.
 * @param [selectAllLabel="Select all"] - Label for the "Select All" checkbox.
 * @param [emptyStateTitle="No options available"] - Title text when there are no options.
 * @param [emptyStateDescription] - Description text when there are no options.
 * @param [emptyStateIcon] - Icon to display when there are no options.
 * @param [invalid] - Whether the select is in an invalid state, affecting styling.
 * @param [disabled=false] - Disable the control.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [fieldClassName] - Additional CSS classes for the field itself.
 * @param [listClassName] - Additional CSS classes for the list dropdown.
 * @param [closable=false] - Show a close button in the dropdown header.
 * @param [header] - Custom node/function rendered above the options.
 * @param [footer] - Custom node/function rendered below the options.
 * @param [open] - Controlled open state of the dropdown. When provided, makes the dropdown controlled.
 * @param [onOpenChange] - Called when the dropdown open state changes.
 * @param [onClose] - Called when the dropdown close button is clicked.
 * @param [onChange] - Called when the selection changes.
 * @param [onSearchQueryChange] - Called when the overlay search query changes, including the reset to `''` on close. Use it to fetch options for the query.
 * @param [onFooterClick] - Called when the footer element is clicked. When provided, automatically closes the dropdown.
 * @param [dismissRef] - Ref object to expose a `dismiss` method to programmatically close the select.
 * @param [customMultiSelectTagsRenderer] - Renders the selected tags of a multi-select in place of the default ones.
 */
export const Select: FC<SelectProps> = ({
  options,
  multiple = false,
  id,
  value,
  defaultValue,
  size = ElementSize.Standard,
  prefix,
  customSelectedValue,
  placeholder = 'Select...',
  labelProps,
  error,
  caption,
  ariaLabel,
  searchable = false,
  searchSize = ElementSize.Standard,
  searchPlaceholder,
  selectAll = false,
  invalid,
  selectAllLabel = 'Select all',
  emptyStateTitle = 'No options available',
  emptyStateDescription,
  emptyStateIcon,
  disabled = false,
  className,
  fieldClassName,
  listClassName,
  closable = false,
  header,
  footer,
  onClose,
  onChange,
  dismissRef,
  onFooterClick,
  open,
  onOpenChange,
  onSearchQueryChange,
  customMultiSelectTagsRenderer,
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const listId = `list-${fieldId}`;
  const isSmall = size === ElementSize.Small;

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

  const [query, setInternalQuery] = useState('');
  const setQuery = useCallback(
    (next?: string) => {
      if (next !== query) {
        setInternalQuery(next || '');
        onSearchQueryChange?.(next || '');
      }
    },
    [onSearchQueryChange, query],
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

  // A closed overlay drops its search, so reopening always starts from the full list.
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen, setQuery]);

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
      setOpen(false);
    },
    [multiple, setSelection, setOpen, selectedValues],
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

  const selectedLabel = singleSelectedOption
    ? prefix
      ? `${prefix} ${singleSelectedOption.label}`
      : singleSelectedOption.label
    : undefined;

  /**
   * Values an `<input>` cannot hold — the tags of a multi-select, an option's
   * `labelNode`, an option description — are rendered in the field's content
   * slot instead, and the input itself is collapsed to zero width.
   */
  const fieldContent = useMemo(() => {
    if (multiple) {
      if (!hasSelection) return null;
      return (
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {customMultiSelectTagsRenderer?.(
            options,
            selectedValues,
            handleRemoveTag,
          ) ?? (
            <MultiSelectTags
              options={options}
              selectedValues={selectedValues}
              handleRemoveTag={handleRemoveTag}
            />
          )}
        </span>
      );
    }

    if (!singleSelectedOption) return null;
    if (!singleSelectedOption.labelNode && !singleSelectedOption.description) {
      return null;
    }

    return (
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <DialEllipsisTooltip
          text={singleSelectedOption.labelNode ?? selectedLabel}
        />
        {singleSelectedOption.description && (
          <span className="truncate text-secondary dial-tiny-text">
            {singleSelectedOption.description}
          </span>
        )}
      </span>
    );
  }, [
    customMultiSelectTagsRenderer,
    handleRemoveTag,
    hasSelection,
    multiple,
    options,
    selectedLabel,
    selectedValues,
    singleSelectedOption,
  ]);

  const fieldValue = (() => {
    if (multiple || fieldContent) return '';
    if (selectedLabel) return selectedLabel;
    if (customSelectedValue && value) return customSelectedValue;
    return '';
  })();

  const labelText =
    typeof labelProps?.label === 'string' ? labelProps.label : undefined;

  // A combobox announces its value from the input's own value, so a selection
  // living in the content slot would never be read out. Fold it into the
  // accessible name instead — together with the field's own name, which an
  // `aria-label` would otherwise replace.
  const fieldAriaLabel = fieldContent
    ? [
        resolveAccessibleName(ariaLabel, labelText),
        multiple
          ? selectedValues
              .map((v) => options.find((o) => o.value === v)?.label ?? v)
              .join(', ')
          : selectedLabel,
      ]
        .filter(Boolean)
        .join(', ') || undefined
    : resolveAccessibleName(ariaLabel);

  useImperativeHandle(dismissRef, () => ({
    dismiss: () => {
      setOpen(false);
    },
  }));

  const handleFieldKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      // Enter and Space are already handled by the dropdown trigger this field
      // is nested in; only the arrow keys need wiring up.
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) setOpen(true);
      }
    },
    [disabled, isOpen, setOpen],
  );

  const renderOptionsList = () => (
    <div
      id={listId}
      role="listbox"
      aria-multiselectable={multiple || undefined}
      className={selectOverlayBaseClassName}
    >
      {header && <>{typeof header === 'function' ? header() : header}</>}
      {/*
        A short list needs no filtering — but once a query is active the row has
        to stay, or it would vanish under the cursor as soon as the results (or
        externally fetched options) drop below the threshold.
      */}
      {(searchable || closable) &&
        (options.length > selectSearchThreshold || !!query) && (
          <div className="flex items-center gap-2 px-2 pt-2">
            {searchable && (
              <Input
                id={`search-${fieldId}`}
                size={searchSize}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder || 'Search options'}
                onChange={(next) => setQuery(next)}
                value={query}
                iconBefore={selectSearchIcon}
                containerClassName="w-full"
              />
            )}
            {closable && (
              <GhostIconButton
                aria-label="Close select"
                className="shrink-0"
                size={ElementSize.Small}
                icon={selectCloseIcon}
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
            id={`${fieldId}-selectAll`}
            label={selectAllLabel}
            checked={allSelectedInFiltered}
            indeterminate={someSelectedInFiltered}
            onChange={toggleSelectAll}
            ariaLabel={selectAllLabel}
          />
        </div>
      )}

      <div className="overflow-y-auto max-h-[352px] py-1">
        {filtered.length === 0 ? (
          <div className="px-2 py-3">
            <DialNoDataContent
              icon={emptyStateIcon ?? selectEmptyStateIcon}
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
                    selectOptionBaseClassName,
                    selected && selectOptionSelectedClassName,
                    opt.disabled && selectOptionDisabledClassName,
                    'w-full',
                  )}
                >
                  <DialCheckbox
                    id={`${fieldId}-${opt.value}`}
                    label={
                      <span className="flex w-full flex-1 pl-2 min-w-0 items-center gap-2 text-primary">
                        {opt.icon && <DialIcon icon={opt.icon} />}
                        <span className="truncate">
                          {opt.labelNode ?? opt.label}
                        </span>
                      </span>
                    }
                    checked={selected}
                    disabled={opt.disabled}
                    onChange={() => !opt.disabled && handleToggle(opt.value)}
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
                <div className="flex items-center gap-2 w-full min-w-0">
                  {opt.icon && <DialIcon icon={opt.icon} />}
                  <DialEllipsisTooltip text={opt.labelNode ?? opt.label} />

                  {opt.description && (
                    <div className="text-secondary dial-small-text">
                      {opt.description}
                    </div>
                  )}
                </div>

                {selected && selectOptionCheckIcon}
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
  );

  return (
    <div className={mergeClasses('flex w-full flex-col gap-2', className)}>
      {labelProps && <Label {...labelProps} htmlFor={fieldId} />}

      <div className="flex flex-col gap-1">
        <DialDropdown
          open={isOpen}
          onOpenChange={setOpen}
          disabled={disabled}
          closable={closable}
          onClose={onClose}
          placement="bottom-start"
          allowedPlacements={['bottom-start', 'top-start']}
          maxDropdownHeight={searchable ? null : dropdownMenuMaxHeight}
          listClassName={listClassName}
          className="w-full"
          renderOverlay={renderOptionsList}
        >
          <Input
            id={fieldId}
            size={size}
            disabled={disabled}
            invalid={invalid}
            value={fieldValue}
            placeholder={fieldContent ? undefined : placeholder}
            readOnly
            iconBefore={multiple ? undefined : singleSelectedOption?.icon}
            iconAfter={
              <IconChevronDown
                size={isSmall ? DIAL_ICON_SIZE.SM : DIAL_ICON_SIZE.MD}
                aria-hidden="true"
                className={classNames(
                  selectFieldIconClassName,
                  isOpen && 'rotate-180',
                )}
              />
            }
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-autocomplete="none"
            aria-label={fieldAriaLabel}
            containerClassName="w-full"
            wrapperClassName={mergeClasses(
              !disabled && 'cursor-pointer',
              multiple &&
                hasSelection &&
                classNames(
                  '!h-auto flex-wrap py-1.5',
                  isSmall ? 'min-h-[24px]' : 'min-h-[40px]',
                ),
              fieldClassName,
            )}
            className={mergeClasses(
              'cursor-pointer',
              fieldContent && 'w-0 min-w-0 flex-none p-0',
            )}
            onKeyDown={handleFieldKeyDown}
          >
            {fieldContent}
          </Input>
        </DialDropdown>

        <ErrorText text={error} />
        {!error && <CaptionText text={caption} />}
      </div>
    </div>
  );
};
