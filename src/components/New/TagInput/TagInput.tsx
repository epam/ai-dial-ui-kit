import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from 'react';

import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';
import { Input } from '../Input/Input';
import type { LabelProps } from '../Label/Label';
import { Tag } from '../Tag/Tag';
import { getVisibleTagCount } from './utils';

/** Matches the `gap-1` between the rendered tags. */
const TAG_GAP_PX = 4;
/** Space a collapsed row keeps free so the text input stays usable. */
const COLLAPSED_INPUT_RESERVE_PX = 24;

const px = (value: string) => parseFloat(value) || 0;

/**
 * The measured copies of the tags render their remove button so they match the
 * real ones in width, but clicking one is impossible — they are `invisible`.
 */
const noop = () => undefined;

export interface TagInputProps {
  id?: string;

  /** Controlled tag list. Pass it together with `onChange`. */
  value?: string[];
  /** Initial tag list when the component manages its own state. */
  defaultValue?: string[];

  size?: ElementSize;
  labelProps?: LabelProps;
  placeholder?: string;
  caption?: string;
  error?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  collapseTagOverflow?: boolean;

  ariaLabel?: string;
  tagListLabel?: string;

  className?: string;
  fieldClassName?: string;
  tagClassName?: string;

  onChange?: (tags: string[]) => void;
}

/**
 * A tag input field: type a value and commit it with Enter or comma.
 * aliases: MultiTag|TagField|ChipInput
 * Design system 2.0
 *
 * The field is an {@link Input}, so it carries the 2.0 field styling, sizes,
 * label, caption and error states, and the tags render as {@link Tag}s in its
 * content slot. The field grows as tags wrap, unless `collapseTagOverflow` keeps
 * them on one line behind a `+N` chip.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`).
 * Duplicate tags are ignored. Backspace on an empty input removes the last tag.
 *
 * @example
 * ```tsx
 * const [tags, setTags] = useState<string[]>(['React']);
 *
 * <TagInput
 *   id="skills"
 *   labelProps={{ label: 'Skills' }}
 *   placeholder="Add a skill"
 *   caption="Press Enter or comma to add"
 *   value={tags}
 *   onChange={setTags}
 * />
 * ```
 *
 * @param [id] - The id of the text input, linked to the label.
 * @param [value] - Controlled tag list.
 * @param [defaultValue=[]] - Initial tag list when uncontrolled.
 * @param [size=ElementSize.Standard] - Field height: standard is 40px, small is 24px.
 * @param [labelProps] - Props of the {@link Label} rendered above the field.
 * @param [placeholder] - Placeholder shown while there are no tags.
 * @param [caption] - Helper text rendered below the field when there is no `error`.
 * @param [error] - Error message rendered below the field (pass `invalid` too for error styling).
 * @param [invalid=false] - Applies the field's error styling.
 * @param [disabled=false] - Disables typing and tag removal.
 * @param [readOnly=false] - Shows the tags without allowing new ones or removal.
 * @param [collapseTagOverflow=false] - Keep the tags on one line, replacing the ones that do not fit with a `+N` chip.
 * @param [ariaLabel] - Accessible name for the text input; use it when there is no visible label.
 * @param [tagListLabel="Tags"] - Accessible name of the tag list.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [fieldClassName] - Additional CSS classes for the field itself.
 * @param [tagClassName] - Additional CSS classes applied to every tag.
 * @param [onChange] - Called with the new list whenever a tag is added or removed.
 */
export const TagInput: FC<TagInputProps> = ({
  id,
  value,
  defaultValue,
  size = ElementSize.Standard,
  labelProps,
  placeholder,
  caption,
  error,
  invalid,
  disabled = false,
  readOnly = false,
  collapseTagOverflow = false,
  ariaLabel,
  tagListLabel = 'Tags',
  className,
  fieldClassName,
  tagClassName,
  onChange,
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const isSmall = size === ElementSize.Small;
  const tagSize = isSmall ? ElementSize.Small : ElementSize.Standard;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tagMeasureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const overflowMeasureRef = useRef<HTMLSpanElement | null>(null);

  const isControlled = value !== undefined;
  const [uncontrolledTags, setUncontrolledTags] = useState<string[]>(
    defaultValue ?? [],
  );
  const tags = isControlled ? value : uncontrolledTags;
  const tagCount = tags.length;

  const [inputValue, setInputValue] = useState('');
  const [visibleTagCount, setVisibleTagCount] = useState(tagCount);

  const removable = !readOnly && !disabled;

  const setTags = useCallback(
    (next: string[]) => {
      if (!isControlled) setUncontrolledTags(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const setTagMeasureRef = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      tagMeasureRefs.current[index] = el;
    },
    [],
  );

  const recalculateVisibleTags = useCallback(() => {
    const wrapper = wrapperRef.current;
    // A field that has not been laid out — inside a `display: none` ancestor, or
    // under jsdom — reports 0. Show everything rather than hiding tags behind a
    // `+N` derived from widths nobody measured.
    if (!wrapper || wrapper.clientWidth === 0) {
      setVisibleTagCount(tags.length);
      return;
    }

    const { paddingLeft, paddingRight } = getComputedStyle(wrapper);

    setVisibleTagCount(
      getVisibleTagCount({
        availableWidth:
          wrapper.clientWidth -
          px(paddingLeft) -
          px(paddingRight) -
          (readOnly ? 0 : COLLAPSED_INPUT_RESERVE_PX),
        tagWidths: tags.map(
          (_, index) => tagMeasureRefs.current[index]?.offsetWidth ?? 0,
        ),
        overflowChipWidth: overflowMeasureRef.current?.offsetWidth ?? 0,
        gap: TAG_GAP_PX,
      }),
    );
  }, [readOnly, tags]);

  useEffect(() => {
    if (!collapseTagOverflow) {
      setVisibleTagCount(tagCount);
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(() => recalculateVisibleTags());
    observer.observe(wrapper);
    recalculateVisibleTags();

    return () => observer.disconnect();
  }, [collapseTagOverflow, recalculateVisibleTags, tagCount]);

  const tagClassNames = mergeClasses(
    // A collapsed row shows a tag at its measured width or not at all; a
    // wrapping row lets a long tag shrink and truncate instead.
    collapseTagOverflow ? 'shrink-0' : 'min-w-0',
    tagClassName,
  );

  const addTag = (raw: string) => {
    const trimmed = raw.trim().replace(/,+$/, '').trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((current) => current !== tag));
  };

  const commitInput = () => {
    addTag(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!removable) return;

    if (event.key === 'Enter' || event.key === ',') {
      // Enter would submit the surrounding form, and the comma is the delimiter
      // rather than part of the tag.
      event.preventDefault();
      commitInput();
      return;
    }

    if (event.key === 'Backspace' && !inputValue && tagCount > 0) {
      event.preventDefault();
      setTags(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (removable && inputValue.trim()) commitInput();
  };

  const visibleTags = collapseTagOverflow
    ? tags.slice(0, visibleTagCount)
    : tags;
  const hiddenTags = collapseTagOverflow ? tags.slice(visibleTagCount) : [];
  const hiddenTagsLabel = hiddenTags.join(', ');

  const tagList = tagCount > 0 && (
    <span
      role="list"
      aria-label={tagListLabel}
      className={mergeClasses(
        'relative flex min-w-0 items-center gap-1',
        collapseTagOverflow ? 'flex-nowrap' : 'flex-wrap',
      )}
    >
      {visibleTags.map((tag) => (
        <Tag
          key={tag}
          role="listitem"
          label={tag}
          size={tagSize}
          className={tagClassNames}
          disabled={disabled}
          closable={removable}
          onRemove={removable ? () => removeTag(tag) : undefined}
        />
      ))}

      {hiddenTags.length > 0 && (
        <Tag
          role="listitem"
          label={`+${hiddenTags.length}`}
          aria-label={hiddenTagsLabel}
          title={hiddenTagsLabel}
          size={tagSize}
          className={mergeClasses('shrink-0', tagClassName)}
          disabled={disabled}
        />
      )}

      {/*
        Measures every tag at its natural width so the `+N` cut-off can be
        calculated. `invisible` keeps the copies out of the layout and out of the
        tab order — `visibility: hidden` is not focusable — while still leaving
        them measurable, which `display: none` would not.
      */}
      {collapseTagOverflow && (
        <span
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden whitespace-nowrap"
        >
          {tags.map((tag, index) => (
            <span
              key={tag}
              ref={setTagMeasureRef(index)}
              className="inline-flex"
            >
              <Tag
                label={tag}
                size={tagSize}
                className={tagClassName}
                disabled={disabled}
                closable={removable}
                onRemove={removable ? noop : undefined}
              />
            </span>
          ))}
          <span ref={overflowMeasureRef} className="inline-flex">
            <Tag
              label={`+${tagCount}`}
              size={tagSize}
              className={tagClassName}
            />
          </span>
        </span>
      )}
    </span>
  );

  return (
    <Input
      id={fieldId}
      size={size}
      labelProps={labelProps}
      caption={caption}
      error={error}
      invalid={invalid}
      disabled={disabled}
      readOnly={readOnly}
      value={inputValue}
      placeholder={tagCount > 0 ? undefined : placeholder}
      aria-label={ariaLabel}
      wrapperRef={wrapperRef}
      onChange={(next) => setInputValue(next ?? '')}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      containerClassName={mergeClasses('w-full', className)}
      wrapperClassName={mergeClasses(
        tagCount > 0 && [
          '!h-auto',
          isSmall ? 'min-h-[24px] py-0.5' : 'min-h-[40px] py-1.5',
          collapseTagOverflow ? 'flex-nowrap overflow-hidden' : 'flex-wrap',
        ],
        fieldClassName,
      )}
      className={mergeClasses(
        'w-auto flex-1',
        collapseTagOverflow ? 'min-w-[24px]' : 'min-w-[100px]',
        readOnly && 'cursor-default',
      )}
    >
      {tagList}
    </Input>
  );
};
