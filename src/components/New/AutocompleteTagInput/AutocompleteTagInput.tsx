import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size as fuiSize,
  useFloating,
} from '@floating-ui/react';
import {
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';

import { Input } from '@/components/New/Input/Input';
import type { LabelProps } from '@/components/New/Label/Label';
import { MenuItem } from '@/components/New/MenuItem/MenuItem';
import { selectTagClassName } from '@/components/New/Select/MultiSelectTags';
import { Tag } from '@/components/New/Tag/Tag';
import { useThemeScope } from '@/components/New/ThemeScope/ThemeScope';
import {
  overlayGap,
  overlayListClassName,
  overlaySurfaceClassName,
} from '@/components/New/constants/overlay';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { MenuItemMark } from '@/types/menu-item';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import {
  type AutocompleteTagInputSuggestion,
  filterAutocompleteSuggestions,
} from '@/components/New/AutocompleteTagInput/utils';

export type { AutocompleteTagInputSuggestion } from '@/components/New/AutocompleteTagInput/utils';

const DEFAULT_MAX_SUGGESTIONS = 5;

export interface AutocompleteTagInputProps {
  id?: string;
  /** Controlled tag list. */
  value?: string[];
  /** Initial tag list when uncontrolled. */
  defaultValue?: string[];
  /** Values offered while typing; a picked suggestion adds its `value` as a tag. */
  suggestions: AutocompleteTagInputSuggestion[];
  /** How many matching suggestions the list shows at most. */
  maxSuggestions?: number;
  size?: ElementSize;
  labelProps?: LabelProps;
  placeholder?: string;
  caption?: string;
  error?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  ariaLabel?: string;
  tagListLabel?: string;
  /** Accessible name of a tag's remove button; defaults to `Remove <tag>`. */
  getRemoveTagLabel?: (tag: string) => string;
  className?: string;
  fieldClassName?: string;
  tagClassName?: string;
  listClassName?: string;
  onChange?: (tags: string[]) => void;
}

/**
 * A tag input that suggests values while typing and also accepts its own.
 * aliases: Autocomplete|Combobox|TagAutocomplete|ChipAutocomplete|MultiValueAutocomplete
 * Design system 2.0
 *
 * Typing opens a list of the `suggestions` that match the text (by label, value
 * or description) and are not already tags, capped at `maxSuggestions`, with the
 * first one highlighted. Enter or comma adds the highlighted suggestion, or the
 * typed text when nothing matches; clicking a suggestion adds it too. The arrow
 * keys move the highlight and wrap at the ends; Escape and leaving the field
 * close the list without adding what was typed. Backspace on an empty input
 * removes the last tag, and duplicate tags are ignored. Entered text is not
 * validated — say what format is expected through `caption`.
 *
 * Reach for {@link TagInput} when there is nothing to suggest, and for a
 * multiple `Select` when only listed values are allowed.
 *
 * The input follows the ARIA combobox pattern: it keeps focus while the list is
 * open, and the highlighted suggestion is announced through
 * `aria-activedescendant`. The tags are a list named by `tagListLabel`, and each
 * remove button is named after its tag.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 *
 * @example
 * ```tsx
 * const [types, setTypes] = useState<string[]>([]);
 *
 * <AutocompleteTagInput
 *   id="attachment-types"
 *   labelProps={{ label: 'Attachment types', required: true }}
 *   caption="Choose a suggested MIME type or add one as <type>/<subtype>"
 *   suggestions={[
 *     { value: 'image/png', label: 'PNG', description: 'image/png' },
 *     { value: 'application/pdf', label: 'PDF', description: 'application/pdf' },
 *   ]}
 *   value={types}
 *   onChange={setTypes}
 * />
 * ```
 *
 * @param [id] - The id of the text input, linked to the label.
 * @param [value] - Controlled tag list.
 * @param [defaultValue=[]] - Initial tag list when uncontrolled.
 * @param suggestions - Values offered while typing.
 * @param [maxSuggestions=5] - How many matching suggestions the list shows at most.
 * @param [size=ElementSize.Standard] - Field height: standard is 40px, small is 24px.
 * @param [labelProps] - Props of the {@link Label} rendered above the field.
 * @param [placeholder] - Placeholder shown while there are no tags.
 * @param [caption] - Helper text rendered below the field when there is no `error`.
 * @param [error] - Error message rendered below the field (pass `invalid` too for error styling).
 * @param [invalid=false] - Applies the field's error styling and marks the input `aria-invalid`.
 * @param [disabled=false] - Disables typing and tag removal.
 * @param [readOnly=false] - Shows the tags without allowing new ones or removal.
 * @param [ariaLabel] - Accessible name for the input; use it when there is no visible label.
 * @param [tagListLabel="Tags"] - Accessible name of the tag list.
 * @param [getRemoveTagLabel] - Accessible name of a tag's remove button, given the tag; pass a translated one, as the default is the English `Remove <tag>`.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [fieldClassName] - Additional CSS classes for the field itself.
 * @param [tagClassName] - Additional CSS classes applied to every tag.
 * @param [listClassName] - Additional CSS classes for the floating suggestion list.
 * @param [onChange] - Called with the new list whenever a tag is added or removed.
 */
export const AutocompleteTagInput: FC<AutocompleteTagInputProps> = ({
  id,
  value,
  defaultValue,
  suggestions,
  maxSuggestions = DEFAULT_MAX_SUGGESTIONS,
  size = ElementSize.Standard,
  labelProps,
  placeholder,
  caption,
  error,
  invalid = false,
  disabled = false,
  readOnly = false,
  ariaLabel,
  tagListLabel = 'Tags',
  getRemoveTagLabel,
  className,
  fieldClassName,
  tagClassName,
  listClassName,
  onChange,
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const listboxId = `${fieldId}-listbox`;
  const themeScope = useThemeScope();
  const isSmall = size === ElementSize.Small;

  const isControlled = value !== undefined;
  const [uncontrolledTags, setUncontrolledTags] = useState<string[]>(
    defaultValue ?? [],
  );
  const tags = isControlled ? value : uncontrolledTags;
  const hasTags = tags.length > 0;
  const isEditable = !readOnly && !disabled;

  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const matches = useMemo(
    () =>
      filterAutocompleteSuggestions(
        suggestions,
        inputValue,
        tags,
        maxSuggestions,
      ),
    [inputValue, maxSuggestions, suggestions, tags],
  );
  const isListShown = isOpen && isEditable && matches.length > 0;
  const activeIndex = Math.min(highlightIndex, matches.length - 1);
  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  const { refs, floatingStyles } = useFloating({
    open: isListShown,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(overlayGap),
      flip({ padding: overlayGap }),
      fuiSize({
        padding: overlayGap,
        apply({ rects, availableHeight, elements }) {
          // The list spans the field it completes, however wide the tags make it.
          elements.floating.style.width = `${Math.round(rects.reference.width)}px`;
          elements.floating.style.maxHeight = `${Math.floor(availableHeight)}px`;
        },
      }),
    ],
  });

  const setTags = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolledTags(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const closeList = () => {
    setIsOpen(false);
    setHighlightIndex(0);
  };

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setInputValue('');
    closeList();
  };

  const removeTag = (tag: string) =>
    setTags(tags.filter((current) => current !== tag));

  const handleInputChange = (next?: string) => {
    const text = next ?? '';
    setInputValue(text);
    // Blank text would match every suggestion and let Enter pick one the user
    // never asked for; ArrowDown still opens the full list on purpose.
    setIsOpen(!!text.trim());
    setHighlightIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isEditable) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        setIsOpen(true);
        if (!isListShown) return;
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setHighlightIndex(
          (activeIndex + step + matches.length) % matches.length,
        );
        return;
      }
      case 'Enter':
      case ',':
        // Enter would submit the surrounding form, and the comma is the
        // delimiter rather than part of the tag.
        event.preventDefault();
        addTag(isListShown ? matches[activeIndex].value : inputValue);
        return;
      case 'Escape':
        if (isListShown) event.preventDefault();
        closeList();
        return;
      case 'Backspace':
        if (!inputValue && hasTags) {
          event.preventDefault();
          setTags(tags.slice(0, -1));
        }
        return;
      default:
    }
  };

  // Keeps focus in the input, so the click lands before blur closes the list.
  const preventBlur = (event: MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  return (
    <>
      <Input
        id={fieldId}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isListShown}
        aria-controls={listboxId}
        aria-activedescendant={
          isListShown ? getOptionId(activeIndex) : undefined
        }
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        size={size}
        labelProps={labelProps}
        caption={caption}
        error={error}
        invalid={invalid}
        disabled={disabled}
        readOnly={readOnly}
        value={inputValue}
        placeholder={hasTags ? undefined : placeholder}
        wrapperRef={refs.setReference}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={closeList}
        containerClassName={mergeClasses('w-full', className)}
        wrapperClassName={mergeClasses(
          hasTags && [
            '!h-auto flex-wrap gap-1 py-2',
            isSmall ? 'min-h-[24px]' : 'min-h-[40px]',
          ],
          fieldClassName,
          DIAL_KIT_CLASS.autocompleteTagInput,
        )}
        className={mergeClasses(
          'w-auto min-w-[100px] flex-1',
          readOnly && 'cursor-default',
        )}
      >
        {hasTags && (
          <span
            role="list"
            aria-label={tagListLabel}
            className="flex min-w-0 flex-wrap items-center gap-1"
          >
            {tags.map((tag) => (
              <Tag
                key={tag}
                role="listitem"
                label={tag}
                className={mergeClasses(
                  selectTagClassName,
                  'min-w-0',
                  tagClassName,
                )}
                disabled={disabled}
                closable={isEditable}
                removeLabel={getRemoveTagLabel?.(tag)}
                onRemove={isEditable ? () => removeTag(tag) : undefined}
              />
            ))}
          </span>
        )}
      </Input>

      {/* Rendered while closed too, so `aria-controls` always resolves. */}
      <FloatingPortal>
        <div
          ref={refs.setFloating}
          id={listboxId}
          role="listbox"
          aria-label={tagListLabel}
          hidden={!isListShown}
          style={floatingStyles}
          className={mergeClasses(
            'z-floating overflow-y-auto',
            overlaySurfaceClassName,
            overlayListClassName,
            themeScope,
            listClassName,
          )}
        >
          {isListShown &&
            matches.map((suggestion, index) => {
              const isActive = index === activeIndex;
              return (
                <MenuItem
                  key={suggestion.value}
                  id={getOptionId(index)}
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
                  label={suggestion.label}
                  description={suggestion.description}
                  mark={MenuItemMark.Tint}
                  selected={isActive}
                  onMouseDown={preventBlur}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => addTag(suggestion.value)}
                />
              );
            })}
        </div>
      </FloatingPortal>
    </>
  );
};
