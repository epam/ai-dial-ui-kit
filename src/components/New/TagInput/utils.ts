export interface VisibleTagCountInput {
  /** Width the tags have to fit into, in px. */
  availableWidth: number;
  /** Rendered width of every tag, in render order. */
  tagWidths: number[];
  /** Rendered width of the `+N` chip shown when not every tag fits. */
  overflowChipWidth: number;
  /** Horizontal gap between two neighbouring tags. */
  gap: number;
}

/**
 * How many tags of a collapsed row fit before the `+N` chip has to take over.
 *
 * Kept pure and separate from the component because jsdom performs no layout:
 * the widths come from the DOM, but the arithmetic they feed is the part worth
 * testing.
 *
 * A non-positive `availableWidth` means nothing has been laid out yet, so every
 * tag is reported as visible and the caller is expected to skip the update.
 */
export const getVisibleTagCount = ({
  availableWidth,
  tagWidths,
  overflowChipWidth,
  gap,
}: VisibleTagCountInput): number => {
  if (availableWidth <= 0) return tagWidths.length;

  let usedWidth = 0;
  let count = 0;

  for (const tagWidth of tagWidths) {
    const nextWidth = tagWidth + gap;
    if (usedWidth + nextWidth > availableWidth) break;
    usedWidth += nextWidth;
    count++;
  }

  if (count === tagWidths.length) return count;

  // Something is being hidden, so the `+N` chip is on the row too and needs its
  // own space — give up tags until it has it.
  while (count > 0 && usedWidth + overflowChipWidth > availableWidth) {
    count--;
    usedWidth -= tagWidths[count] + gap;
  }

  return count;
};
