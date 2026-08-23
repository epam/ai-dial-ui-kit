/**
 * The collapsed field. `dial-kit-input` gives it the 2.0 field box — 40px tall,
 * raised surface, accent border on hover, accent outline on focus, and the
 * sunken disabled treatment through its own `:disabled` rule, which a `<button>`
 * matches. The utilities after it only lay the row out; the SCSS class is
 * unlayered, so anything it already sets (`truncate`, `w-full`, the height)
 * cannot be overridden from here.
 *
 * No `dial-kit-enhanced-target`: `truncate` puts `overflow: hidden` on the
 * field, which would clip the 44px pseudo-element back to the field's own 40px,
 * and being unlayered it cannot be undone with a utility. The field takes the
 * same documented 2.5.5 exception as `Input` and `Select` — full-width target,
 * 4px short of 44 vertically.
 */
export const fieldBaseClassName =
  'dial-kit-input flex flex-row items-center justify-between gap-x-2 px-3 text-left';

export const fieldValueClassName = 'min-w-0 flex-1 truncate text-primary';

export const fieldPlaceholderClassName =
  'min-w-0 flex-1 truncate text-secondary';

export const fieldIconClassName = 'shrink-0 text-secondary';

export const popupBodyClassName = 'px-6 pb-4';

export const popupFooterClassName =
  'flex justify-end gap-2 px-6 py-4 border-t border-tertiary';

export const defaultCancelLabel = 'Cancel';

export const defaultApplyLabel = 'Apply';
