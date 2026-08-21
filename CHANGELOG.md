# Changelog

All notable changes to `@epam/ai-dial-ui-kit` are documented here.

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
Versions match the git tags on the `development` branch.

---

## [0.14.0]

### Breaking Changes

- **Control colour tokens renamed** — the disabled, neutral-hover and accent-hover control tokens were named after their opacity or their literal hue (`-alpha`, `-beta`, `blue`), which said nothing about their role and left no room for a second step in each pair. They are now numbered by role: `control-disable-alpha`/`-beta` → `control-disable-primary`/`-secondary`, `text-control-blue-hover`/`-active` → `text-control-accent-hover`/`-active`, `bg-control-disable` → `bg-control-disable-primary`, and `bg-control-neutral-hover` → `bg-control-neutral-hover-muted` (the new `-strong` step is its darker sibling). The rendered colours are unchanged.
  See [migration guide](migration-guides/0.14.0/control-color-token-rename.md).
- **Border token `hover-alpha` removed** — it held the same value as `accent-alpha` (`#2764D933`, blue-500 alpha-20) behind a second variable, so the accent border tint had two names and a theme had to set both to stay consistent. The three hover borders that used it (`Input`, `Tag`, `Calendar`) now use `border-accent-alpha`. Replace `border-hover-alpha` with `border-accent-alpha`; if your theme sets `--stroke-hover-alpha`, move that value to `--stroke-accent-alpha`.
  See [migration guide](migration-guides/0.14.0/control-color-token-rename.md).
- **Border tokens `focus-black` → `focus`, `focus-blue` → `accent-focus`** — 0.13.0 renamed `focus` to `focus-black` to name the token after its value; the focus tokens are now named after their role instead, matching `accent` / `accent-alpha` elsewhere in the border scale. `border-focus` / `outline-focus` / `divide-focus` / `stroke-focus` are back to the names they had in 0.12.x, and `focus-blue` becomes `accent-focus`. Both keep their variables (`--stroke-focus-black`, with `--stroke-focus` still in the fallback chain, and `--stroke-focus-blue`) and their colours.
  See [migration guide](migration-guides/0.14.0/focus-border-token-role-naming.md).

### Changed

- **The accent gradient is themed through `--bg-gradient-*` / `--stroke-gradient-*`** — the gradient stops were addressed by their position in one specific gradient (`--bg-control-accent-gradient-hover-from`), so the same colour had a different variable name in every gradient that used it. Each stop is now a numbered token (`--bg-gradient-1`, `--bg-gradient-2-hover`, `--stroke-gradient-1`, …). The `--bg-control-accent-gradient-*` names stay in the fallback chain; the `--stroke-control-accent-gradient-*` names behind the selected tab's underline do **not**, so a theme that sets those must rename them (see the migration guide).
- **Renamed control variables keep their old names as fallbacks** — every token renamed in this release resolves through its 0.13.0 variable before reaching the light default (e.g. `var(--text-control-disable-primary, var(--text-control-disable-alpha, #848E9C))`). Only the Tailwind class names are breaking; a host themed by the DIAL themes service needs no theme change to keep its colours.

- **`shadow-md` and `shadow-lg` are a single blue layer, and the blue in every shadow is alpha-20/4/8** — the scale was carrying a grey layer under the blue one at every size and one `--shadow-blue-500` value (alpha-14) at all four, which the design has since split per size. `shadow-md` is now `0 8px 24px` at blue-500 alpha-4 and `shadow-lg` is `0 8px 44px` at blue-500 alpha-8, both without the grey layer; `shadow-xs` and `shadow-sm` keep their geometry and their grey layer but move to blue-500 alpha-20. Anything using `shadow-md` (`Card`, `Calendar`, `Input`, overlays, tooltips, the collapsible sidebar) or `shadow-lg` (`Notification`, card hover) drops lower and softer than before.
  Each blue layer now reads its own `--shadow-blue-500-alpha-20` / `-4` / `-8` variable so one theme value cannot flatten the ramp, falling back to `--shadow-blue-500` and then to the light default. `shadow` (the `DEFAULT`) and `--shadow-grey-1000` are unchanged.

### Fixed

- **`--stroke-primary` and `--stroke-info` light defaults matched their comments, not their tokens** — `--stroke-primary` fell back to `#6B7280`, Tailwind's own `gray-500`, while every other grey-800 token in the kit is `#57647A`; `--stroke-info` fell back to `#124ACE` where blue-500 is `#1D4ED8`. Both now match the palette. Hosts that define the variables are unaffected.
- **The selected tab's hover underline ended on a violet no other control used** — the hover gradient's second stop was `#956CFA`, while the button hover gradient ends on `#885DF2`. Both now end on `#885DF2`, so a tab and a primary button lit by the same hover read as the same gradient.
- **`Switch` had no hover state, and its disabled knob asked for a token that does not exist** — the track carried no `hover:` rule at all, and the disabled knob used `bg-controls-disable-secondary`, which is absent from the Tailwind scale, so Tailwind emitted no rule and the knob rendered with no background. The track now lightens to `control-neutral-hover-strong` when off and `control-accent-hover` when on; both disabled tracks take the light `control-disable-primary` instead of sharing the dark grey-450 of the enabled off state, and the knob takes `control-disable-secondary`. The disabled label moves from `text-secondary` to `text-control-disable-primary`, the token the rest of 2.0 already uses for disabled text.

### Added

- **`Tooltip` (2.0)** — the generation 2.0 counterpart of `DialTooltip`: a hover- and focus-triggered bubble on the inverted control surface (`bg-control-inverted`, 8px radius, `dial-small-text`) with an arrow pointing back at the trigger. `placement` takes the four-sided `TooltipPlacement` enum the design defines rather than the full floating-ui `Placement`, and the side it resolves to after flipping is exposed as `data-placement`. The new `asChild` renders the child as the trigger, which puts the tooltip's `aria-describedby` on the control itself instead of on a wrapper `<span>` — the only way the text reaches assistive technology. The trigger is no longer forced to `truncate`, and a suppressed or empty tooltip renders no content element at all rather than a hidden one. As in 1.0 nothing renders on mobile screens, so a tooltip still cannot be a control's only accessible name. `TooltipContainer`, `TooltipTrigger` and `TooltipContent` are exported for custom composition.
- **`EllipsisTooltip` (2.0)** — the generation 2.0 counterpart of `DialEllipsisTooltip`, built on the 2.0 `Tooltip`, so clipped text reveals itself in the inverted bubble instead of the 1.0 one. Text that fits now renders no tooltip element at all, where 1.0 portaled one and hid it with a class, and `customTooltipContent` appears only while the text is clipped — which is what its documentation always described, though the 1.0 code showed it whether or not anything was truncated. `placement` takes the `TooltipPlacement` enum, and the measurement moves into a `useTruncation` hook that re-reads on text change, window resize and any change to the element's own box.
- **`Notification` (2.0) — `general` variant** — a neutral notification for messages that carry no severity: the sunken surface (`bg-layer-sunken`) with an outlined check icon in primary grey, instead of a coloured surface and a filled status icon. It announces politely (`role="status"`) like `info` and `success`, and ships as `GeneralToastNotification` / `GeneralMessageNotification` alongside the existing wrappers.
- **`Radio` (2.0)** — a radio button on a native `<input type="radio">`, so radios sharing a `name` get the browser's single tab stop and arrow-key selection without any `role="radiogroup"` wiring. The 20px circle takes `border-default` over `control-neutral` when unselected and a `border-accent` ring around a `control-accent` dot when selected, tinting to `control-accent-alpha-hover` on hover and greying to `control-disable-primary`/`-secondary` when disabled. As in `Switch`, the circle and the label text are sibling `<label for>` elements, so `Label` keeps its own required marker and caption info button.
- **`Checkbox` (2.0)** — a checkbox on a native input, with the mixed and error states the design defines. `isIndeterminate` takes visual precedence over `isSelected`, announces the control as `mixed`, and sets the native `indeterminate` DOM property that no React prop covers; `invalid` paints the box with `control-error` and sets `aria-invalid` so the failure is announced rather than only shown. Filled states carry the fill alone (`border-transparent`) and lighten to `control-accent-hover` on hover, while the unselected box tints to `control-accent-alpha-hover` behind a `border-accent` rim.
- **`ToggleIconButton` (2.0)** — an icon button that stays pressed, for a setting the icon itself represents (bookmark, pin, favourite). State rides on `aria-pressed` rather than a swapped accessible name, so it is announced as a toggle and keeps one stable label. It composes the primary ghost `IconButton`, which already supplies the unselected column — secondary-grey icon turning accent on hover, accent-alpha tint on hover and active, grey when disabled — and adds the accent icon at rest plus a `selectedIcon` swap for the filled glyph. Unlike every other 2.0 button it is a rounded square, not a pill, and it wraps the 2.0 `Tooltip` with `asChild` so `aria-describedby` lands on the button rather than a wrapper `<span>`. Defaults to `ElementSize.Small`.
- **`SegmentedControl` (2.0)** — the generation 2.0 counterpart of `DialSegmentedControl`: pill segments on a sunken track, where the selected one lifts onto the raised surface with `shadow-xs` and an accent icon, and both states tint with accent-alpha on hover and press. It is a `radiogroup` of `radio` segments rather than 1.0's `tablist`/`tab`, which is the accurate role for a control that selects a value instead of revealing a panel; the group is a single tab stop and the arrow keys, `Home` and `End` move the selection, skipping disabled segments. `items` replaces `options` and takes a per-segment `aria-label` so an icon-only segment can still be named, and the group is named with `aria-label` rather than 1.0's `ariaLabel`.
- **`Radio` and `Checkbox` reach the 24×24 pointer target** — both controls render at 20px, so they take `dial-kit-minimum-target` for WCAG 2.5.8 (AA) and are listed in the README target-size exception table: a 44px enhanced target would overhang 12px per side and swallow the adjacent label.

---

## [0.13.0]

### Breaking Changes

- **`DialSpinner` → `Spinner`** — the spinner is exported as `Spinner` (and `DialSpinnerProps` as `SpinnerProps`), dropping the `Dial*` prefix in line with the 2.0 component naming. Props and behaviour are unchanged; only the import name moves.
  See [migration guide](migration-guides/0.13.0/spinner-dial-prefix-removal.md).
- **Border token `focus` → `focus-black`** — the token behind `border-focus` / `outline-focus` was named for its state rather than its value, which left no room for the sibling `focus-blue` token. It is now `focus-black`, backed by `--stroke-focus-black` instead of `--stroke-focus`. The colour is unchanged (`#161B2D`).
  See [migration guide](migration-guides/0.13.0/focus-border-token-rename.md).
- **Typography — heading classes shifted one step down the scale** — the design scale has three display sizes, but the kit had only two, so its 22px step was shipping as `dial-h1-text` and every heading class sat one step above the size design assigned it. `dial-display3-text` now carries 22px/32px, and `dial-h1-text` → 20px/28px, `dial-h2-text` → 18px/26px, `dial-h3-text` → 16px/24px. Bare `h1`/`h2`/`h3` elements shrink with them, as does the 1.0 `DialPopup` title (18px → 16px). To keep a rendered size, move the class name up one step (`dial-h1-text` → `dial-display3-text`, and so on).
  See [migration guide](migration-guides/0.13.0/typography-heading-scale-shift.md).
- **`dial-caption-semi-text` → `dial-caption-lead-semi-text`** — the design scale's only 10px semibold style is Caption Lead (Semi Bold): uppercase with `+0.06em` tracking. The class already had the tracking but neither the uppercase nor "lead" in its name. It now applies `text-transform: uppercase`, and the rename keeps that from changing existing text silently.
  See [migration guide](migration-guides/0.13.0/caption-semi-text-lead-rename.md).
- **`Notification` (2.0) — live-region role now follows the variant** — the container was hardcoded to `role="alert"` for every variant. `role="alert"` is implicitly `aria-live="assertive"` and interrupts the screen reader, which is wrong for routine feedback and for section messages that are static page content. `error` and `warning` keep `role="alert"`; `info`, `success`, and `loading` now use the polite `role="status"`. Pass an explicit `role` to override.
  Consumers asserting `getByRole('alert')` on a non-error notification must query `status` instead.
- **`Calendar`, `Switch`, `ProgressBar` — `label` → `labelProps`** — the three components rendered their own label from a bare `label` prop, so `required`, `caption` and `size` were unreachable while every other 2.0 field (`Input`, `Textarea`, `Select`, `TagInput`, …) took them through a `labelProps` object. All three now take `labelProps: LabelProps` and render the shared `Label`. In `Switch` the track and the label text become two sibling `<label for>` elements rather than one wrapper — a `caption` info button nested in a label forwards its clicks to the labelled control — which moves `className` onto the row and the focus ring onto the track.
  See [migration guide](migration-guides/0.13.0/field-label-props-unification.md).
- **`DialProgressBar` → `ProgressBar`** — the progress bar was built on 1.0 tokens slated for removal (`bg-layer-4`, `bg-controls-accent-primary`), so it could not appear in a 2.0 screen without pulling the legacy palette along. It is rebuilt on the 2.0 set and adopts the 2.0 conventions: the `Dial*` prefix is dropped, the bespoke `DialProgressBarSize` gives way to the shared `ElementSize` (`Medium` → `Standard`), and `ariaLabel` becomes the native `aria-label`. A new optional `labelProps` renders a `Label` above the bar and names it, replacing the generic `"Progress"` default that every bar shared, and `valueLabel` puts a readout (`"3.31 / 500"`) at the end of that row.
  See [migration guide](migration-guides/0.13.0/progress-bar-2-0-rewrite.md).

### Fixed

- **`Dropdown` (2.0) — the overlay never took focus, so nothing inside it was reachable from the keyboard** — the focus manager was pinned to `initialFocus={-1}`, which leaves focus on the trigger. Opening a menu or a popover therefore parked the keyboard user outside it: the items were reachable only by tabbing on past the trigger, and a panel opened by Enter behaved as if nothing had happened ([ai-dial-chat#7936](https://github.com/epam/ai-dial-chat/issues/7936)). Focus now moves to the overlay's first control — the first item, or the first control of a `renderOverlay` panel, falling back to the overlay container when it holds none. A menu opened by hover is the exception and keeps focus where it is, since the pointer being over a trigger says nothing about where the user is typing. The overlay also answers ArrowDown/ArrowUp with wrap-around movement between its `menuitem` / `option` children, and Home/End for the two ends, which a `menu` is expected to do and which neither the item list nor `Select`'s option list did on its own; a key an inner overlay already handled is left to it. `Select`, `InlineSelect`, and `ButtonDropdown` inherit all of this. `DialDropdown` (1.0), `Calendar`, and the sub-menu overlay still pin `initialFocus={-1}` and are unchanged.
- **`DialPopup` and `Popup` (2.0) — Enter closed the dialog the moment it opened** — the focus manager's default focuses the first tabbable descendant, and in a dialog whose header is a heading plus a close button, that is the close button. Every modal form therefore opened with the × focused, so the first Enter dismissed it instead of submitting ([ai-dial-chat#2579](https://github.com/epam/ai-dial-chat/issues/2579)). Initial focus now goes to the dialog container, which the focus manager marks `tabindex="-1"`: it is not a tab stop, screen readers announce the dialog on open, and Tab still moves to the first real control. `preventKeyboardOnOpen` is unchanged but no longer needed for this — the new default cannot raise the virtual keyboard either.
- **Focus rings were invisible on hosts still themed with the pre-0.13 token names** — the `focus-black` border token dropped straight to its light default (`#161B2D`) when `--stroke-focus-black` was undefined. Hosts themed by the DIAL themes service still ship the old `--stroke-focus`, so every focus ring built on the token — inputs, buttons, icon buttons, dropdowns, accordion, calendar, slider — was painted `#161B2D`, which is the dark theme's own `--bg-layer-2`: a border drawn in the background colour. The token now falls back through `--stroke-focus` before reaching the light default, so those hosts get their real focus colour again. Light themes and hosts with no theme at all are unchanged.
- **`DialGrid` — the legacy-token fallback inverted the raised/sunken relationship** — when a host defines the legacy DIAL layers but not `--bg-layer-raised`, the row surface fell back to `--bg-layer-0`, the _deepest_ layer in that palette (`#000000` in the DIAL dark theme), while odd rows fell back to the lighter `--bg-layer-2`. A grid whose base surface sits below its own sunken rows reads as inside-out, and pure black matches no other surface in the theme. The fallback is now `--bg-layer-3`, the elevated layer, which is what consumers already use for their own grid surfaces. The light default when no theme is present is unchanged (`#FCFCFC`).
- **`Notification` (2.0)** — the variant icon is hidden from assistive tech. The `loading` spinner carries its own `role="status"`, so it previously formed a live region nested inside the notification's, announcing the content twice.
- **`FolderPath`** — the `<nav>` landmark is named "Folder path" instead of inheriting `DialBreadcrumb`'s "Breadcrumb" default, which misdescribed a path with no navigable segments. Added an `ariaLabel` prop to override. Decorative folder and separator icons are now `aria-hidden`.
- **`InlineSelect`** — the trigger now exposes `aria-expanded`, so screen readers can tell whether the dropdown is open, and accepts an `ariaLabel` prop naming the control (previously it announced only its current value).
- **`ButtonDropdown` (2.0)** — the trigger button now carries `aria-haspopup` and `aria-expanded` itself. `DialDropdown` sets them on a non-focusable wrapper `<span>`, so assistive tech never reached them.
- **`Calendar` (2.0)** — day cells are named with their full date (e.g. "Sunday, 15 March 2026") instead of a bare day number; the popover is a named dialog; and the field `label` is associated with the `div[role="button"]` trigger, which `<label htmlFor>` cannot label.
- **`FabButton`, `DialIconButton`, `IconButton` (2.0)** — an icon-only button with only `tooltipProps` is now named from the tooltip text. A tooltip's `aria-describedby` lands on a wrapper element and is suppressed on mobile, so it never reached assistive tech.
- **MCP server — 2.0 components were invisible to agents** — the manifest generator treated only `Dial*` exports as components, so every generation 2.0 component (`Button`, `Input`, `Select`, `Popup`, …) was filed as a hook and lost its props table and examples entirely. Components are now identified by where they live rather than by their name prefix, which also restores the un-prefixed 1.0 components (`Spinner`, `Skeleton`, `FabButton`) and documents the 2.0 enums (`NotificationVariant`, `CalendarMode`) as types.
- **MCP server — components exported through a re-export barrel were dropped** — `src/index.ts` reaches the Analytics set through `components/Analytics/index.ts`, which the generator tried to read as a file and skipped. Named re-exports are now followed to the declaring file, adding all five Analytics components to discovery.
- **MCP server — multi-line JSDoc descriptions broke the markdown tables** in `searchEntity` results. Cells are collapsed to a single line and `|` is escaped.

### Added

- **`Tag` (2.0)** — the generation 2.0 counterpart of `DialTag`: a compact label for selections, filters, and categories, with `standard` (24px) and `small` (20px) sizes, an optional icon, a `selected` state, and a removable variant. A tag given `onClick` is a keyboard-operable `role="button"`; its remove control is named `Remove <label>` and stops the click from also activating the tag. Built on 2.0 tokens and `IconButton`, so it pulls none of the 1.0 styling `DialTag` still carries.
- **`TagInput` (2.0)** — the generation 2.0 counterpart of `DialTagInput`, built on the 2.0 `Input`, so it shares its sizes, label, caption, error and disabled states. Works controlled (`value`) or uncontrolled (`defaultValue`), commits on Enter or comma, removes the last tag on Backspace in an empty input, and renders the tags as a named list of `Tag`s rather than as unlabelled markup. `collapseTagOverflow` keeps the row on one line behind a `+N` chip that names the tags it hides.
- **`FileDropzone` (2.0) — `labelProps`** — a `Label` above the drop area naming the field it fills, with the `required` marker and `caption` info button the other 2.0 fields already had. The existing `label` stays the copy inside the area: it says how to use the control, not what it is for. Both point at the same input, so its accessible name reads as the field name followed by that copy.
- **`Input` (2.0) — `wrapperRef`** — exposes the bordered field wrapper, so a caller rendering into the `children` slot can measure the space its content has to fit into. The input itself only ever reports its own share of the row.
- **`dial-kit-minimum-target`** — the `dial-kit-enhanced-target` mechanism at WCAG 2.5.8's Level AA minimum of 24×24, for controls where the 44px AAA target would overhang far enough to swallow their neighbours. Used by the `Tag` remove button; the rendered size is untouched.
- **Typography — `dial-display3-text` and `dial-tiny-lead-semi-text`** — the two steps the design scale defined but the kit never shipped: Display 3 (22px/32px semibold) and Tiny Text Lead (Semi Bold) (12px/16px semibold, `+0.03em`, uppercase). The `dial-*-text` scale now covers every row of the design table.
- **Typography — `dial-code-text` names a monospace face** — it previously inherited the body font despite being the Code style. It resolves through `var(--theme-font-mono, var(--font-fira-code, 'Fira Code'))` before the system monospace stack, mirroring the existing `--theme-font` / `--font-inter` hook. The kit ships no font file; hosts that want Fira Code load it themselves.
- **Enhanced pointer targets** — standard-size buttons expose a 44×44 pointer target (WCAG 2.5.5, Level AAA) via the `dial-kit-enhanced-target` utility, with no change to their rendered size. See the [Accessibility section of the README](README.md#-accessibility) for the documented exceptions.
- **MCP server — generation-aware component discovery** — component entries carry `generation` (`1.0` | `2.0`), and a 1.0 component carries `supersededBy` naming its 2.0 replacement (e.g. `DialButton` → `Button`). `searchEntity` ranks 2.0 above 1.0 and reports a **Use instead** column; `getEntityDetails` flags a superseded component and, on a name miss, suggests the other generation's spelling. Both are derived automatically from component location and Storybook category — there is no list to maintain. See the [MCP Server Guide](src/mcp/README.md).
- **`DialAnalyticsCard` — `deltaUnit`** — optional suffix appended to the delta badge with no space (`delta={9} deltaUnit="s"` → `+9s`).

### Changed

- **Storybook — 2.0 stories are all titled `Components_2_0/…`** — the group was split between `Components_2.0/` and `Components_2_0/`, which showed up as two sidebar sections and two MCP categories for one generation.

---

## [0.12.0]

### Breaking Changes

- **Legacy typography classes removed** — `dial-h1`, `dial-h2`, `dial-h3`, `dial-body`, `dial-small`, `dial-small-semi`, `dial-small-medium`, `dial-small-150`, `dial-tiny`, `dial-tiny-150`, `dial-tiny-semi`, and `dial-caption` have been removed in favor of the `dial-*-text` typography scale (e.g. `dial-h1-text`, `dial-small-text`, `dial-caption-text`). This consolidates typography onto a single naming convention.
  See [migration guide](migration-guides/0.12.0/legacy-typography-classes-removal.md).

---

## [0.11.0]

### Breaking Changes

- **`DialDropdown` — `menu` prop removed, flat props added** — The nested `menu: { items, onClick, header, footer }` prop has been replaced with four top-level props: `items`, `onItemClick`, `menuHeader`, `menuFooter`. `DropdownMenuProps` is no longer exported. `DialDropdownIcon` is updated the same way — its `menu` prop is gone; pass `items` (and optionally `onItemClick`, `menuHeader`, `menuFooter`) directly.
  See [migration guide](migration-guides/0.11.0/dropdown-menu-prop-flatten.md).

---

## [0.10.0]

---

## Format guide

Each version section may contain these subsections (only include non-empty ones):

### Breaking Changes

> What changed, what it changed **from → to**, and **why**.
> Every breaking change must have a corresponding migration guide linked below.

- **`ComponentName` prop renamed** — `oldProp` → `newProp` to align with HTML semantics. See [migration guide](migration-guides/0.x.0/component-name-prop-rename.md).

### Added

- Short description of new feature or component.

### Changed

- Backwards-compatible changes to existing behavior or API.

### Deprecated

- Features that will be removed in a future version; include the planned removal version.

### Removed

- Features removed in this release (non-breaking removals, e.g. internal APIs).

### Fixed

- Bug fixes.

### Security

- Vulnerability patches.
