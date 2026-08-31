/**
 * How a chosen row inside an overlay (dropdown menu, select list) is marked.
 *
 * The design marks a chosen row differently depending on what the overlay is.
 * A **menu** puts a check at the trailing edge, single- and multi-select alike,
 * and gives the current item of a navigation menu an accent label. A **select
 * list** tints the chosen row instead, with a checkbox in front of it when the
 * list is a multiselect.
 */
export enum MenuItemMark {
  /** Nothing marks the row — it is only ever unselected. */
  None = 'none',
  /** A trailing check on the chosen row; the row keeps its plain background. */
  Check = 'check',
  /** The chosen row is tinted, with no glyph — the select list's own mark. */
  Tint = 'tint',
  /** A leading checkbox box, tinted while checked, for multiselect rows. */
  Checkbox = 'checkbox',
  /** Accent label on a tinted row: the current item in a navigation menu. */
  Highlight = 'highlight',
}
