import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
} from 'react';

import classNames from 'classnames';
import { DialLabel, type DialLabelProps } from '@/components/Label/Label';
import { DialTag } from '@/components/Tag/Tag';
import {
  DialCaptionText,
  DialErrorText,
} from '@/components/CaptionText/CaptionText';
import { DialTooltip } from '@/components/Tooltip/Tooltip';

const TAG_ROW_GAP_PX = 8;
const COLLAPSED_INPUT_RESERVE_PX = 24;

export interface DialTagInputProps extends DialLabelProps {
  elementId: string;
  initialTags?: string[];
  placeholder?: string;
  captionDescription?: string;
  errorText?: string;
  invalid?: boolean;
  disabled?: boolean;
  collapseTagOverflow?: boolean;
  onChange?: (tags: string[]) => void;
}

/**
 * A tag input field that allows users to add multiple tags using the Enter or comma key.
 * Supports removing tags, displaying field labels, optional indicators, validation states,
 * and dynamic layout adjustment when tags wrap to multiple lines.
 *
 * @example
 * ```tsx
 * <DialTagInput
 *   elementId="skills"
 *   fieldTitle="Skills"
 *   placeholder="Add a skill"
 *   initialTags={['React', 'TypeScript']}
 *   optional
 *   onChange={(tags) => console.log('Updated tags:', tags)}
 * />
 * ```
 *
 * @param elementId - Unique identifier for the input element.
 * @param [fieldTitle] - Optional label displayed above the input field.
 * @param [initialTags=[]] - Array of tags to be displayed initially.
 * @param [placeholder] - Placeholder text shown when the input is empty.
 * @param [captionDescription] - Caption text shown under the input if there is no errors.
 * @param [errorText] - Error message displayed below the field when validation fails.
 * @param [optional=false] - Whether the field is optional (renders an “optional” indicator).
 * @param [invalid=false] - Whether the field should be styled as invalid.
 * @param [disabled=false] - Whether the input and remove buttons are disabled.
 * @param [collapseTagOverflow=false] - When true, keeps tags on one line and shows `+N` for overflow.
 * @param [onChange] - Callback fired whenever the tag list changes (tag added or removed).
 */
export const DialTagInput: FC<DialTagInputProps> = ({
  initialTags = [],
  label,
  required,
  elementId,
  placeholder,
  captionDescription,
  errorText,
  invalid,
  disabled,
  collapseTagOverflow = false,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagMeasureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overflowMeasureRef = useRef<HTMLDivElement | null>(null);

  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [wraps, setWraps] = useState(false);
  const [visibleTagCount, setVisibleTagCount] = useState(initialTags.length);

  const setTagMeasureRef = useCallback((index: number) => {
    return (el: HTMLDivElement | null) => {
      tagMeasureRefs.current[index] = el;
    };
  }, []);

  const recalculateVisibleTags = useCallback(() => {
    if (!collapseTagOverflow) return;

    const row = containerRef.current;
    if (!row) return;

    const rowWidth = row.offsetWidth;
    if (rowWidth === 0) return;

    const overflowChipWidth = overflowMeasureRef.current?.offsetWidth ?? 0;
    const effectiveWidth =
      rowWidth - COLLAPSED_INPUT_RESERVE_PX - TAG_ROW_GAP_PX;

    let totalWidth = 0;
    let fitCount = 0;

    for (let i = 0; i < tags.length; i++) {
      const el = tagMeasureRefs.current[i];
      if (!el) continue;

      const itemWidth = el.offsetWidth + TAG_ROW_GAP_PX;
      if (totalWidth + itemWidth > effectiveWidth) break;
      totalWidth += itemWidth;
      fitCount++;
    }

    if (fitCount < tags.length && fitCount > 0) {
      while (totalWidth + overflowChipWidth > effectiveWidth && fitCount > 0) {
        fitCount--;
        const removedWidth = tagMeasureRefs.current[fitCount]?.offsetWidth ?? 0;
        totalWidth -= removedWidth + TAG_ROW_GAP_PX;
      }
    }

    setVisibleTagCount(fitCount);
  }, [collapseTagOverflow, tags]);

  const addTag = (value: string) => {
    const trimmed = value.trim().replace(/,$/, '');
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [trimmed, ...tags];
      setTags(newTags);
      onChange?.(newTags);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  const handleBlur = () => {
    setInputFocused(false);
    if (inputValue.trim()) {
      addTag(inputValue);
      setInputValue('');
    }
  };

  const handleRemove = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  const renderCaption = () => {
    if (errorText) {
      return <DialErrorText text={errorText} />;
    }

    if (captionDescription) {
      return <DialCaptionText text={captionDescription} />;
    }
    return null;
  };

  useEffect(() => {
    if (collapseTagOverflow) return;

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const hasWrapped =
          containerRef.current.scrollHeight >
          containerRef.current.clientHeight + 10;
        setWraps(hasWrapped);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [tags, collapseTagOverflow]);

  useEffect(() => {
    if (!collapseTagOverflow) {
      setVisibleTagCount(tags.length);
      return;
    }

    setVisibleTagCount(tags.length);

    const observer = new ResizeObserver(() => {
      recalculateVisibleTags();
    });

    const row = containerRef.current;
    if (row) observer.observe(row);

    recalculateVisibleTags();

    return () => observer.disconnect();
  }, [collapseTagOverflow, recalculateVisibleTags, tags]);

  useEffect(() => {
    setTags(initialTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialTags)]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <DialLabel label={label} required={required} htmlFor={elementId} />
      <div
        className={classNames(
          'dial-input min-h-[38px] p-[6px]',
          invalid && 'dial-input-error',
          disabled && 'dial-input-disable',
        )}
      >
        <div
          ref={containerRef}
          className={classNames(
            'flex gap-2 items-center relative',
            collapseTagOverflow
              ? 'flex-nowrap overflow-hidden w-full min-w-0'
              : classNames(
                  'flex-wrap',
                  wraps ? 'flex-col-reverse' : 'flex-row',
                ),
          )}
        >
          {(collapseTagOverflow ? tags.slice(0, visibleTagCount) : tags).map(
            (tag, index) => (
              <DialTag
                key={tag + index}
                tag={tag}
                remove={!disabled ? () => handleRemove(index) : undefined}
              />
            ),
          )}

          {collapseTagOverflow && visibleTagCount < tags.length && (
            <DialTooltip
              tooltip={tags.slice(visibleTagCount).join(', ')}
              triggerClassName="inline-flex shrink-0"
            >
              <DialTag tag={`+${tags.length - visibleTagCount}`} />
            </DialTooltip>
          )}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={handleBlur}
            className={classNames(
              'dial-input outline-none !border-none w-full flex-1 !p-1 !h-auto',
              collapseTagOverflow ? 'min-w-0' : 'min-w-[100px]',
            )}
            placeholder={
              collapseTagOverflow && !inputFocused && !disabled
                ? ''
                : (placeholder ?? '')
            }
            disabled={disabled}
          />

          {collapseTagOverflow && (
            <div
              className="absolute left-0 top-0 invisible pointer-events-none h-0 overflow-hidden whitespace-nowrap"
              aria-hidden
            >
              {tags.map((tag, index) => (
                <div
                  key={`measure-${tag}-${index}`}
                  ref={setTagMeasureRef(index)}
                  className="inline-flex shrink-0"
                >
                  <DialTag
                    tag={tag}
                    remove={!disabled ? () => handleRemove(index) : undefined}
                  />
                </div>
              ))}
              <div ref={overflowMeasureRef} className="inline-flex shrink-0">
                <DialTag tag={`+${tags.length}`} />
              </div>
            </div>
          )}
        </div>
      </div>
      {renderCaption()}
    </div>
  );
};
