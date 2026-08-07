# Changelog

All notable changes to `@epam/ai-dial-ui-kit` are documented here.

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
Versions match the git tags on the `development` branch.

---

## [Unreleased]

### Breaking Changes

- **`DialSpinner` → `Spinner`** — the spinner is exported as `Spinner` (and `DialSpinnerProps` as `SpinnerProps`), dropping the `Dial*` prefix in line with the 2.0 component naming. Props and behaviour are unchanged; only the import name moves.
  See [migration guide](migration-guides/0.13.0/spinner-dial-prefix-removal.md).
- **Border token `focus` → `focus-black`** — the token behind `border-focus` / `outline-focus` was named for its state rather than its value, which left no room for the sibling `focus-blue` token. It is now `focus-black`, backed by `--stroke-focus-black` instead of `--stroke-focus`. The colour is unchanged (`#161B2D`).
  See [migration guide](migration-guides/0.13.0/focus-border-token-rename.md).
- **`Notification` (2.0) — live-region role now follows the variant** — the container was hardcoded to `role="alert"` for every variant. `role="alert"` is implicitly `aria-live="assertive"` and interrupts the screen reader, which is wrong for routine feedback and for section messages that are static page content. `error` and `warning` keep `role="alert"`; `info`, `success`, and `loading` now use the polite `role="status"`. Pass an explicit `role` to override.
  Consumers asserting `getByRole('alert')` on a non-error notification must query `status` instead.

### Fixed

- **`Notification` (2.0)** — the variant icon is hidden from assistive tech. The `loading` spinner carries its own `role="status"`, so it previously formed a live region nested inside the notification's, announcing the content twice.
- **`FolderPath`** — the `<nav>` landmark is named "Folder path" instead of inheriting `DialBreadcrumb`'s "Breadcrumb" default, which misdescribed a path with no navigable segments. Added an `ariaLabel` prop to override. Decorative folder and separator icons are now `aria-hidden`.
- **`InlineSelect`** — the trigger now exposes `aria-expanded`, so screen readers can tell whether the dropdown is open, and accepts an `ariaLabel` prop naming the control (previously it announced only its current value).
- **`ButtonDropdown` (2.0)** — the trigger button now carries `aria-haspopup` and `aria-expanded` itself. `DialDropdown` sets them on a non-focusable wrapper `<span>`, so assistive tech never reached them.
- **`Calendar` (2.0)** — day cells are named with their full date (e.g. "Sunday, 15 March 2026") instead of a bare day number; the popover is a named dialog; and the field `label` is associated with the `div[role="button"]` trigger, which `<label htmlFor>` cannot label.
- **`FabButton`, `DialIconButton`, `IconButton` (2.0)** — an icon-only button with only `tooltipProps` is now named from the tooltip text. A tooltip's `aria-describedby` lands on a wrapper element and is suppressed on mobile, so it never reached assistive tech.

### Added

- **Enhanced pointer targets** — standard-size buttons expose a 44×44 pointer target (WCAG 2.5.5, Level AAA) via the `dial-kit-enhanced-target` utility, with no change to their rendered size. See the [Accessibility section of the README](README.md#-accessibility) for the documented exceptions.

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
