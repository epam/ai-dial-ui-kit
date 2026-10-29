import classNames from 'classnames';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * The overlay stacking steps in `src/styles/theme.scss` are named rather than
 * numeric, so stock tailwind-merge does not know `z-tooltip` is a z-index and
 * would keep it beside a caller's `z-[9999]`, leaving source order to decide.
 * Registering them keeps a caller's `z-*` a replacement, not an addition.
 *
 * The same goes for the `dial-*-text` type scale in `src/styles/typography.scss`:
 * each class sets the full font, size and line height, so a caller's step must
 * replace a component's default instead of losing to stylesheet order. The list
 * is explicit because the public `dial-kit-*-text` classes must not join it.
 */
const DIAL_TYPOGRAPHY_STEPS = [
  'display1',
  'display2',
  'display3',
  'h1',
  'h2',
  'h3',
  'body',
  'body-semi',
  'body-paragraph',
  'body-paragraph-semi',
  'small',
  'small-semi',
  'small-paragraph',
  'small-paragraph-semi',
  'tiny',
  'tiny-semi',
  'tiny-lead',
  'tiny-lead-semi',
  'caption',
  'caption-lead-semi',
  'code',
  'code-semi',
  'tiny-code',
  'tiny-code-semi',
  'italic',
  'small-italic',
  'tiny-italic',
  'caption-italic',
];

const twMerge = extendTailwindMerge<'dial-typography'>({
  extend: {
    classGroups: {
      z: [{ z: ['popup', 'floating', 'interactive-tooltip', 'tooltip'] }],
      'dial-typography': DIAL_TYPOGRAPHY_STEPS.map(
        (step) => `dial-${step}-text`,
      ),
    },
  },
});

/** Merge class names (classnames → tailwind-merge). */
export function mergeClasses(...inputs: Parameters<typeof classNames>): string {
  return twMerge(classNames(inputs));
}
