# Changelog

All notable changes to `@epam/ai-dial-ui-kit` are documented here.

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
Versions match the git tags on the `development` branch.

---

## [Unreleased]

_No unreleased changes yet._

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
