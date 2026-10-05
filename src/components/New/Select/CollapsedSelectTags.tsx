import {
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { getVisibleTagCount } from '@/components/New/TagInput/utils';
import { InteractiveTooltip } from '@/components/New/InteractiveTooltip/InteractiveTooltip';
import { Tag } from '@/components/New/Tag/Tag';
import type { SelectOption } from '@/models/select';
import { TooltipPlacement } from '@/types/tooltip';
import { observeElementSize } from '@/utils/element-size-observer';
import { mergeClasses } from '@/utils/merge-classes';
import { MultiSelectTags, selectTagClassName } from './MultiSelectTags';

/** Matches the `gap-2` between the tags, in px. */
const TAG_GAP = 8;

export interface CollapsedSelectTagsProps {
  options: SelectOption[];
  selectedValues: string[];
  handleRemoveTag: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    val: string,
  ) => void;
}

const stopPropagation = (event: { stopPropagation: () => void }) =>
  event.stopPropagation();

/** Escape is left to bubble: it is what dismisses the panel. */
const stopKeyPropagation = (event: KeyboardEvent<HTMLElement>) => {
  if (event.key !== 'Escape') event.stopPropagation();
};

/**
 * The selected tags of a multi-select on a single row. The tags that do not fit
 * the width of the field collapse into a `+N` counter whose hover panel lists
 * them, each still removable.
 * Design system 2.0
 *
 * The count follows the width the field has, not the number of tags: every tag
 * is measured in a hidden copy of the row, so the tags that stay visible are
 * the ones that fit beside the counter, and the count follows a resize.
 *
 * @param options - All available options, used to resolve labels and icons
 * @param selectedValues - Values currently selected
 * @param handleRemoveTag - Called with the value whose tag was removed
 */
export const CollapsedSelectTags: FC<CollapsedSelectTagsProps> = ({
  options,
  selectedValues,
  handleRemoveTag,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  // `null` until measured: every tag renders, and the first layout pass trims.
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  const measure = useCallback(() => {
    const row = rowRef.current;
    const ruler = measureRef.current;
    if (!row || !ruler) return;

    const widths = Array.from(
      ruler.children,
      (el) => (el as HTMLElement).offsetWidth,
    );
    const overflowChipWidth = widths.pop() ?? 0;

    setVisibleCount(
      getVisibleTagCount({
        tagWidths: widths,
        overflowChipWidth,
        availableWidth: row.clientWidth,
        gap: TAG_GAP,
      }),
    );
  }, []);

  // Re-measure when the selection (and so the set of tags) changes, before paint.
  useLayoutEffect(() => {
    measure();
  }, [measure, options, selectedValues]);

  useLayoutEffect(() => {
    const row = rowRef.current;
    return row ? observeElementSize(row, measure) : undefined;
  }, [measure]);

  const shown = visibleCount ?? selectedValues.length;
  const visibleValues = selectedValues.slice(0, shown);
  const hiddenValues = selectedValues.slice(shown);

  return (
    <div
      ref={rowRef}
      className="relative flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
    >
      <MultiSelectTags
        options={options}
        selectedValues={visibleValues}
        handleRemoveTag={handleRemoveTag}
        tagClassName="min-w-0"
      />

      {hiddenValues.length > 0 && (
        <InteractiveTooltip
          asChild
          placement={TooltipPlacement.Bottom}
          content={
            // The panel is portalled but still a React child of the field, so
            // its clicks and keys would otherwise reach the dropdown trigger.
            <div
              className="flex flex-wrap gap-2"
              onClick={stopPropagation}
              onKeyDown={stopKeyPropagation}
            >
              <MultiSelectTags
                options={options}
                selectedValues={hiddenValues}
                handleRemoveTag={handleRemoveTag}
              />
            </div>
          }
        >
          <Tag
            label={`+${hiddenValues.length}`}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            // Names the hidden tags too: the panel that lists them is hover-only.
            aria-label={`${hiddenValues.length} more selected: ${hiddenValues
              .map((v) => options.find((o) => o.value === v)?.label ?? v)
              .join(', ')}`}
            title=""

            className={mergeClasses(selectTagClassName, 'shrink-0')}
          />
        </InteractiveTooltip>
      )}

      {/* An unclipped copy of the row, only there to be measured. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        inert
        className="pointer-events-none invisible absolute left-0 top-0 flex h-0 w-max gap-2 overflow-hidden"
      >
        <MultiSelectTags
          options={options}
          selectedValues={selectedValues}
          handleRemoveTag={handleRemoveTag}
          tagClassName="shrink-0"
        />
        <Tag
          label={`+${selectedValues.length}`}
          className={mergeClasses(selectTagClassName, 'shrink-0')}
        />
      </div>
    </div>
  );
};
