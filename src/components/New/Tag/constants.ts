import { TagAppearance } from '@/types/tag';

/**
 * Geometry and layout shared by every tag. No transition: the design animates
 * the hover and selected steps instantly (0ms), so the fill switches on the
 * same frame as the pointer.
 */
export const tagBaseClassName =
  'inline-flex h-[32px] max-w-full items-center gap-1 rounded-full px-3';

/**
 * Shape and type scale per appearance, over `tagBaseClassName`. The bordered
 * chip is the compact value chip of a form field — the removable twin of
 * `Badge`'s outlined label: its 24px, 6px corner and rim on the sunken layer,
 * with the value in primary text on the small type scale.
 */
export const tagShapeClassNames: Record<TagAppearance, string> = {
  [TagAppearance.Outlined]: 'dial-tiny-text',
  [TagAppearance.Selectable]: 'dial-tiny-text',
  [TagAppearance.Bordered]: 'h-[24px] rounded-md border px-2 dial-small-text',
};

/**
 * Fill and text colour per appearance and selection. `outlined` and
 * `selectable` draw no rim and are told apart by their fill — `outlined` sits
 * on the raised layer, `selectable` on nothing until it is selected, where it
 * also steps its label up from secondary to primary. `bordered` is the one with
 * a rim, on the sunken layer.
 */
export const tagStateClassNames: Record<
  TagAppearance,
  Record<'default' | 'selected', string>
> = {
  [TagAppearance.Outlined]: {
    default: 'bg-layer-raised text-primary',
    selected: 'bg-control-accent-alpha text-primary',
  },
  [TagAppearance.Selectable]: {
    default: 'text-secondary',
    selected: 'bg-control-accent-alpha text-primary',
  },
  [TagAppearance.Bordered]: {
    default: 'border-tertiary bg-layer-sunken text-primary',
    selected: 'border-accent bg-control-accent-alpha text-primary',
  },
};

/** Cursor and focus ring of a tag that can be activated. */
export const tagInteractiveClassName =
  'cursor-pointer outline-offset-0 focus-visible:outline focus-visible:outline-focus';

/**
 * Hover and active step of a clickable tag — one accent tint for every
 * appearance and both selections, as the 2.0 overlay rows do. A selected tag
 * must not read as hovered at rest, and the label is left alone, so an
 * unselected one never darkens into looking selected.
 */
export const tagHoverClassName =
  'hover:bg-control-accent-alpha-hover active:bg-control-accent-alpha-active';
