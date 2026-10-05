interface CountFittingTagsParams {
  /** Natural width of each tag, in px. */
  tagWidths: number[];
  /** Width of the `+N` counter, in px. */
  counterWidth: number;
  /** Width of the row the tags have to fit in, in px. */
  available: number;
  /** Gap between neighbouring items, in px. */
  gap: number;
}

/**
 * How many tags fit on one row once the rest are folded into a `+N` counter.
 *
 * Tags are taken in order. The counter is only reserved room when something is
 * actually hidden, and at least one tag always stays — it shrinks and
 * truncates rather than leaving the field with a bare counter. A row that has
 * not been laid out yet (`available` of 0) shows every tag.
 */
export const countFittingTags = ({
  tagWidths,
  counterWidth,
  available,
  gap,
}: CountFittingTagsParams) => {
  const total = tagWidths.length;
  if (!available || total === 0) return total;

  const fullWidth =
    tagWidths.reduce((sum, width) => sum + width, 0) + gap * (total - 1);
  if (fullWidth <= available) return total;

  let used = 0;
  let fitting = 0;
  for (const [index, width] of tagWidths.entries()) {
    const next = used + (index > 0 ? gap : 0) + width;
    if (next + gap + counterWidth > available) break;
    used = next;
    fitting = index + 1;
  }

  return Math.max(fitting, 1);
};
