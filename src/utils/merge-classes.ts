import classNames from 'classnames';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * The overlay stacking steps in `tailwind.config.js` are named rather than
 * numeric, so stock tailwind-merge does not know `z-tooltip` is a z-index and
 * would keep it beside a caller's `z-[9999]`, leaving source order to decide.
 * Registering them keeps a caller's `z-*` a replacement, not an addition.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      z: [{ z: ['popup', 'floating', 'interactive-tooltip', 'tooltip'] }],
    },
  },
});

/** Merge class names (classnames → tailwind-merge). */
export function mergeClasses(...inputs: Parameters<typeof classNames>): string {
  return twMerge(classNames(inputs));
}
