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

---

New guides are added here whenever a breaking change is introduced. See [CHANGELOG.md](../CHANGELOG.md) for the full list of changes per release.
