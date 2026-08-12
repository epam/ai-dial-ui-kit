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

---

New guides are added here whenever a breaking change is introduced. See [CHANGELOG.md](../CHANGELOG.md) for the full list of changes per release.
