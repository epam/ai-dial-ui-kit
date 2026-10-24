/**
 * Color scheme `Grid` passes to AG Grid. It selects the light or dark theme
 * part and the browser `color-scheme` native controls inside the grid follow.
 */
export enum GridColorScheme {
  Light = 'light',
  Dark = 'dark',
}

/**
 * Visual treatment of `Grid`. `Default` is the framed data grid. `Chat` is the
 * "Chat table" of the design: a borderless card with a 12px corner and the MD
 * shadow, row dividers inset by the cell padding, and rounded hover and
 * selected rows.
 */
export enum GridAppearance {
  Default = 'default',
  Chat = 'chat',
}
