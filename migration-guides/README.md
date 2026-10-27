# Migration Guides

This folder contains step-by-step migration guides for breaking changes introduced in each release of `@epam/ai-dial-ui-kit`.

## Structure

```
migration-guides/
  <version>/
    <migration-name>.md   ← one file per breaking change
```

## Index

| Version | Guide | Summary |
| ------- | ----- | ------- |
| 0.11.0 | [dropdown-menu-prop-flatten](0.11.0/dropdown-menu-prop-flatten.md) | `DialDropdown`/`DialDropdownIcon` `menu` prop replaced with flat `items`, `onItemClick`, `menuHeader`, `menuFooter` props |
| 0.12.0 | [legacy-typography-classes-removal](0.12.0/legacy-typography-classes-removal.md) | Legacy `dial-h*`, `dial-body`, `dial-small*`, `dial-tiny*`, `dial-caption` classes removed in favor of the `dial-*-text` scale |
| 0.13.0 | [spinner-dial-prefix-removal](0.13.0/spinner-dial-prefix-removal.md) | `DialSpinner`/`DialSpinnerProps` renamed to `Spinner`/`SpinnerProps` |
| 0.13.0 | [focus-border-token-rename](0.13.0/focus-border-token-rename.md) | Border token `focus` renamed to `focus-black` (`--stroke-focus` → `--stroke-focus-black`) |
| 0.13.0 | [typography-heading-scale-shift](0.13.0/typography-heading-scale-shift.md) | `dial-display3-text` added at 22px; `dial-h1`/`h2`/`h3-text` shifted one step down to 20/18/16px |
| 0.13.0 | [caption-semi-text-lead-rename](0.13.0/caption-semi-text-lead-rename.md) | `dial-caption-semi-text` renamed to `dial-caption-lead-semi-text` and now uppercases |
| 0.13.0 | [progress-bar-2-0-rewrite](0.13.0/progress-bar-2-0-rewrite.md) | `DialProgressBar` rebuilt on 2.0 tokens as `ProgressBar`; `DialProgressBarSize` → `ElementSize`, `ariaLabel` → `aria-label` |
| 0.13.0 | [field-label-props-unification](0.13.0/field-label-props-unification.md) | `Calendar`, `Switch` and `ProgressBar` take `labelProps` instead of `label`, so every 2.0 field names itself through `Label` |
| 0.14.0 | [control-color-token-rename](0.14.0/control-color-token-rename.md) | Control tokens renamed by role: `control-disable-alpha`/`-beta` → `-primary`/`-secondary`, `text-control-blue-*` → `text-control-accent-*`, `bg-control-disable` → `bg-control-disable-primary`, `bg-control-neutral-hover` → `-hover-muted` |
| 0.14.0 | [focus-border-token-role-naming](0.14.0/focus-border-token-role-naming.md) | Border tokens `focus-black` → `focus` and `focus-blue` → `accent-focus`, reversing the 0.13.0 value-based naming |
| 0.14.0 | [select-multiselect-option-row](0.14.0/select-multiselect-option-row.md) | A multi-select `Select` option is one `option` with `aria-selected` and a decorative box, instead of an option wrapping a real `role="checkbox"` |
| 0.14.0 | [button-tooltip-2-0](0.14.0/button-tooltip-2-0.md) | `Button` and `IconButton` wrap the 2.0 `Tooltip` with `asChild`: `placement` takes `TooltipPlacement`, and the trigger `<span>` is gone |
| 0.14.0 | [tag-single-size](0.14.0/tag-single-size.md) | `Tag` drops `size` for one 32px pill; the selectable chip gets a semibold selected label |
| 0.14.0 | [shadow-token-per-step-rename](0.14.0/shadow-token-per-step-rename.md) | Shadow scale rebuilt per step: `sm` moves to the side panels, controls keep their shadow under `dial-kit-control-shadow` |
| 0.15.0 | [legacy-theme-variable-fallbacks-removal](0.15.0/legacy-theme-variable-fallbacks-removal.md) | Old theme variable names (`--bg-control-neutral-hover`, `--stroke-focus-black`, `--bg-control-accent-gradient-*`) dropped from the fallback chains |
| 0.15.0 | [slider-redesign](0.15.0/slider-redesign.md) | `Slider` redrawn: 12px accent thumb with a hover/focus halo, accent-tint track; adds `showTooltip`, `showTicks`, `leftContent`, `rightContent` |
| 0.16.0 | [tailwind-v4-stylesheet](0.16.0/tailwind-v4-stylesheet.md) | `styles.css` built with Tailwind v4: variant utilities move into `@layer ui`, v4 preflight, new browser baseline |
| 0.16.0 | [legacy-file-manager-removal](0.16.0/legacy-file-manager-removal.md) | Legacy `DialFileManager`, its helpers and the `./file-manager` subpath removed; import them from `@epam/ai-dial-react-file-manager` |
| 0.16.0 | [caption-text-no-alert-role](0.16.0/caption-text-no-alert-role.md) | `CaptionText` / `ErrorText` drop `role="alert"`; 2.0 fields link their error and caption through `aria-describedby` |
| 0.16.0 | [legacy-analytics-and-steps-removal](0.16.0/legacy-analytics-and-steps-removal.md) | Legacy `DialAnalytics*` components and 1.0 `DialSteps` removed; use the 2.0 `Analytics*` components and `Steps` |
| 0.16.0 | [unused-legacy-components-removal](0.16.0/unused-legacy-components-removal.md) | 34 unused 1.0 components (`DialSelect`, `DialPopup`, `DialGrid`, `LazyDialJsonEditor` …) and `DialSchemaRenderer` removed in favour of their 2.0 counterparts; Monaco is no longer a peer |

---

New guides are added here whenever a breaking change is introduced. See [CHANGELOG.md](../CHANGELOG.md) for the full list of changes per release.
