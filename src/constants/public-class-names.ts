/*
 * Public, host-addressable class names — part of this package's public API.
 *
 * Every design-system 2.0 component stamps its own class on the element that
 * draws it, so a host embedding the kit can restyle a part the props do not
 * reach without substring-matching hashed CSS-module locals, walking DOM order
 * (`> div:nth-child(2)`), or selecting on ARIA attributes. `role` and
 * `aria-label` are accessibility contracts rather than styling hooks:
 * `aria-label="dropdown"` in particular is a plain English string a localised
 * host cannot rely on.
 *
 * These classes carry no declarations of their own — nothing in the kit's
 * stylesheet selects on them. They exist only as stable selectors, so adding
 * one is never a visual change, and renaming one or moving it to a different
 * element is a breaking change.
 *
 * A few 2.0 components are deliberately absent, because an element that already
 * carries a stable `dial-kit-*` class needs no second one: `Button` and its
 * variant wrappers (`dial-kit-base-button`), `IconButton`
 * (`dial-kit-base-icon-button`), `FabButton` (`dial-kit-fab-button`), `Input`
 * (`dial-kit-input`), `Textarea` (`dial-kit-textarea`), `Slider`
 * (`dial-kit-slider`), `MarkdownEditor` (`dial-kit-markdown-editor`) and `Grid`
 * (`dial-kit-grid`). `ThemeScope` renders a `display: contents` wrapper with no
 * box of its own, `MultiSelectTags` renders `Tag`s and nothing else, and
 * `TooltipContainer` / `TooltipTrigger` contribute no element of their own — all
 * four are addressed through what they render.
 *
 * Requested in https://github.com/epam/ai-dial-chat/issues/8707.
 */
export const DIAL_KIT_CLASS = {
  /* ── Feedback and status ───────────────────────────────────────────────── */
  /** The `role="status"` root of a `Spinner`. */
  spinner: 'dial-kit-spinner',
  /**
   * The outermost element of a `ProgressBar`: the box wrapping its label,
   * track and readout — or the track itself, which is the root when the bar
   * has neither.
   */
  progressBar: 'dial-kit-progress-bar',
  /** The root of a `Skeleton`, wrapping its avatar and text rows. */
  skeleton: 'dial-kit-skeleton',
  /**
   * The `Notification` surface. Present on every wrapper too — the toast and
   * section-message variants of error, info, success, warning, loading and
   * general all render this component.
   */
  notification: 'dial-kit-notification',
  /** The empty-state root of `NoDataContent`. */
  noDataContent: 'dial-kit-no-data-content',

  /* ── Text ──────────────────────────────────────────────────────────────── */
  /** The text element of a `Highlight`, which renders the matched query. */
  highlight: 'dial-kit-highlight',
  /** The caption line under a field, rendered by `CaptionText`. */
  captionText: 'dial-kit-caption-text',
  /**
   * A caption in its error variant — what `ErrorText` renders. Additive to
   * `captionText`, since one component draws both.
   */
  errorText: 'dial-kit-error-text',
  /** The `Label` root, which wraps the `label` element and its info button. */
  label: 'dial-kit-label',

  /* ── Containers ────────────────────────────────────────────────────────── */
  /** The `article` element of a `CardShell`. */
  cardShell: 'dial-kit-card-shell',
  /** The `aside` element of a `CollapsibleSidebar`. */
  collapsibleSidebar: 'dial-kit-collapsible-sidebar',
  /** The content box inside a `ResizableContainer`'s resize frame. */
  resizableContainer: 'dial-kit-resizable-container',
  /**
   * The `role="dialog"` panel of a `Popup`. Its backdrop is reached through
   * `overlayClassName`.
   */
  popup: 'dial-kit-popup',
  /** The `Popup` panel of a `ConfirmationPopup`, additive to `popup`. */
  confirmationPopup: 'dial-kit-confirmation-popup',
  /** The root of an `Accordion`. */
  accordion: 'dial-kit-accordion',
  /** The breadcrumb root of a `FolderPath`. */
  folderPath: 'dial-kit-folder-path',

  /* ── Menus and overlays ────────────────────────────────────────────────── */
  /**
   * The trigger wrapper of a `Dropdown`. Its floating panel is reached through
   * `listClassName`.
   */
  dropdown: 'dial-kit-dropdown',
  /**
   * The `role="none"` item list inside a dropdown overlay — the box that holds
   * the rows and owns their vertical padding. Present in both generations, and
   * on a submenu's own list. It is *not* the floating panel.
   */
  dropdownList: 'dial-kit-dropdown-list',
  /**
   * One row of a floating overlay: a dropdown item, a `Select` option, a
   * submenu trigger, or a submenu child. It sits on the element that draws the
   * row box — so on the wrapper, not the inner button, for a row that has a
   * `rightControl` beside it.
   */
  menuItem: 'dial-kit-menuitem',
  /**
   * The trailing check of a chosen `MenuItemMark.Check` row. Decorative, like
   * the glyph itself — the row's `aria-checked` / `aria-selected` carries the
   * state.
   */
  menuItemCheck: 'dial-kit-menuitem-check',
  /** The primary icon of a `DialDropdownIcon` trigger. */
  dropdownIcon: 'dial-kit-dropdown-icon',
  /**
   * The caret badge of a `DialDropdownIcon` trigger — the round plate the
   * chevron sits on. Absent when `showCaret` is `false`.
   */
  dropdownIconCaret: 'dial-kit-dropdown-icon-caret',
  /** The bubble of a `Tooltip`, rendered by `TooltipContent` into a portal. */
  tooltip: 'dial-kit-tooltip',
  /** The panel of an `InteractiveTooltip` — the one whose content takes focus. */
  interactiveTooltip: 'dial-kit-interactive-tooltip',
  /** The text element of an `EllipsisTooltip`, which is also its trigger. */
  ellipsisTooltip: 'dial-kit-ellipsis-tooltip',

  /* ── Fields ────────────────────────────────────────────────────────────── */
  /** The `Search` field, additive to the `dial-kit-input` its `Input` carries. */
  search: 'dial-kit-search',
  /** The `PasswordInput` field, additive to `dial-kit-input`. */
  passwordInput: 'dial-kit-password-input',
  /** The `NumberInput` field, additive to `dial-kit-input`. */
  numberInput: 'dial-kit-number-input',
  /** The `TagInput` field, additive to `dial-kit-input`. */
  tagInput: 'dial-kit-tag-input',
  /** The root of a `Select`, wrapping its label, field and caption. */
  select: 'dial-kit-select',
  /** The trigger button of an `InlineSelect`. */
  inlineSelect: 'dial-kit-inline-select',
  /** The root of a `Calendar`, wrapping its label and date field. */
  calendar: 'dial-kit-calendar',
  /** The drop area of a `FileDropzone`. */
  fileDropzone: 'dial-kit-file-dropzone',

  /* ── Controls ──────────────────────────────────────────────────────────── */
  /** The row of a `Switch`: the control and its label. */
  switch: 'dial-kit-switch',
  /** The row of a `Checkbox`: the box and its label. */
  checkbox: 'dial-kit-checkbox',
  /** The decorative box a `CheckboxBox` draws, in a checkbox or a menu row. */
  checkboxBox: 'dial-kit-checkbox-box',
  /** The row of a `Radio`: the circle and its label. */
  radio: 'dial-kit-radio',
  /** The root of a `RadioGroup`, wrapping its label and its radios. */
  radioGroup: 'dial-kit-radio-group',
  /**
   * The root of a `RadioGroupPopupField`, wrapping its label and the collapsed
   * field that opens the group.
   */
  radioGroupPopupField: 'dial-kit-radio-group-popup-field',
  /** The `role="radiogroup"` track of a `SegmentedControl`. */
  segmentedControl: 'dial-kit-segmented-control',
  /** One segment of a `SegmentedControl`. */
  segmentedControlItem: 'dial-kit-segmented-control-item',
  /** The `role="tablist"` root of `Tabs`. */
  tabs: 'dial-kit-tabs',
  /**
   * One tab inside `Tabs`. The selected tab's underline keeps its own
   * `dial-kit-tab-selected-underline`.
   */
  tab: 'dial-kit-tab',
  /** A `Tag` pill, wherever it is rendered — including a `TagInput`'s rows. */
  tag: 'dial-kit-tag',
  /**
   * A `ToggleIconButton`, additive to the `dial-kit-base-icon-button` it
   * already carries.
   */
  toggleIconButton: 'dial-kit-toggle-icon-button',
  /** A `CloseButton`, additive to `dial-kit-base-icon-button`. */
  closeButton: 'dial-kit-close-button',
  /** An `InfoButton`, additive to `dial-kit-base-icon-button`. */
  infoButton: 'dial-kit-info-button',
  /**
   * The wrapper of a `ButtonDropdown` — its trigger carries
   * `dial-kit-base-button`.
   */
  buttonDropdown: 'dial-kit-button-dropdown',
} as const;
