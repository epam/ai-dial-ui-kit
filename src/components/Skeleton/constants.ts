/**
 * Suggested sizes of skeleton placeholders, from the Patterns 2.0 skeleton
 * instructions. Pass them as the `width` / `height` / `className` of a
 * `Skeleton` so a placeholder matches the design without re-deriving numbers.
 */

/** Height of every bar, in px. */
export const SKELETON_BAR_HEIGHT = 20;

/** Radius of a bar (12px). `Skeleton`'s own `Text` radius is 4px, so pass this in `className`. */
export const SKELETON_BAR_CLASS_NAME = 'rounded-xl';

/** Circle for an icon or avatar in a list, in px. */
export const SKELETON_CIRCLE_SIZE_LIST = 24;

/** Circle for an image or avatar in a card, in px. */
export const SKELETON_CIRCLE_SIZE_CARD = 48;

/** Width of a short text bar (a version, a tag), in px. The design allows 100–150. */
export const SKELETON_SHORT_BAR_WIDTH = 120;

/**
 * Bar widths to cycle through, so the result reads like real text. Fixed, not
 * random: `Math.random()` gives a different look on every render and a
 * hydration mismatch on the server. Index with `(row + column) % length`.
 */
export const SKELETON_BAR_WIDTHS = ['70%', '45%', '60%', '85%', '50%'] as const;
