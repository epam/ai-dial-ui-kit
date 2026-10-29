export enum DropdownType {
  Dropdown = 'dropdown',
  Menu = 'menu',
}

export enum DropdownTrigger {
  Click = 'click',
  Hover = 'hover',
  ContextMenu = 'contextMenu',
}

export enum DropdownItemType {
  Item = 'item',
  Divider = 'divider',
  PlainText = 'plainText',
}

/**
 * Role of the 2.0 `Dropdown`'s floating overlay, and with it the
 * `aria-haspopup` value its trigger announces.
 */
export enum DropdownOverlayRole {
  /** `role="menu"`, trigger `aria-haspopup="menu"`; options are arrow-key navigated. */
  Menu = 'menu',
  /** `role="dialog"`, trigger `aria-haspopup="dialog"`; for a panel of free-form content. */
  Dialog = 'dialog',
  /**
   * No role on the overlay and no `aria-haspopup` on the trigger, which keeps
   * `aria-expanded`/`aria-controls` as a disclosure; for an overlay whose
   * content supplies its own semantics (a `region`, its own `dialog`).
   */
  None = 'none',
}
