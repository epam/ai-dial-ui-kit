# Migrating off the removed 1.0 components — v0.15 → v0.16

## Why this changed

Most 1.0 `Dial*` components have had a 2.0 replacement for several releases,
and the applications built on the kit — DIAL Chat and the DIAL Admin frontend —
no longer use the 1.0 versions listed below. Keeping them meant two components
for one control in the public API, two sets of tests and stories to maintain,
and Monaco shipped as an optional peer only for the 1.0 JSON editor. They are
removed. The 1.0 components that are still in use — `DialTabs`, `DialSteps`,
`DialLabelledText`, `DialLoadFileArea`, the `DialAnalytics*` set and the
building blocks they render — stay.

## What changed

### Components and their replacements

Every name in the first column is gone from `@epam/ai-dial-ui-kit`. Use the 2.0
component in the second column, imported from the same package. The 2.0
components have their own props, so this is a rewrite of the call site, not a
rename — check each one's story for its API.

| Removed                                                                                              | Use instead                                                           |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `DialAutocompleteInputValue`                                                                         | `AutocompleteTagInput`                                                |
| `DialButtonDropdown`                                                                                 | `ButtonDropdown`                                                      |
| `DialCheckbox`                                                                                       | `Checkbox`                                                            |
| `DialCollapsibleSidebar`                                                                             | `CollapsibleSidebar`                                                  |
| `DialConfirmationPopup`                                                                              | `ConfirmationPopup`                                                   |
| `DialDropdownIcon`, `DialDropdownIconProps`                                                          | `Dropdown` with an `IconButton` trigger                               |
| `DialFileIcon`, `DialFileIconProps`                                                                  | `FileIcon`                                                            |
| `DialFileName`                                                                                       | `FileName`                                                            |
| `DialFolderName`                                                                                     | `FolderName`                                                          |
| `DialFormItem`, `FormItemOrientation`                                                                | The 2.0 field's own `labelProps`, `caption` and `error`               |
| `DialFormPopup`, `DialPopup`                                                                         | `Popup`                                                               |
| `DialGrid`, `DialGridProps`                                                                          | `Grid`, `GridProps`                                                   |
| `DialDateCellRenderer`, `DialDateCellRendererProps`, `DialGridDateValue`                             | `DateCellRenderer`, `DateCellRendererProps`, `DateValue`              |
| `DEFAULT_GRID_DATE_FORMAT_OPTIONS`, `DEFAULT_GRID_DATE_LOCALE`, `convertGridDateToDate`              | `DEFAULT_DATE_FORMAT_OPTIONS`, `DEFAULT_DATE_LOCALE`, `convertToDate` |
| `LazyDialMarkdownEditor`, `LazyDialMarkdownEditorContainer`, `DialMarkdownEditorContainerProps`      | `LazyMarkdownEditor`, `MarkdownEditorProps` — there is no JSON mode   |
| `DialNotification`, `DialNotificationProps`                                                          | `Notification`                                                        |
| `DialNumberInput`                                                                                    | `NumberInput`                                                         |
| `DialPasswordInput`                                                                                  | `PasswordInput`                                                       |
| `DialRadioButton`                                                                                    | `Radio`                                                               |
| `DialRadioGroup`                                                                                     | `RadioGroup`                                                          |
| `DialRadioGroupPopupField`                                                                           | `RadioGroupPopupField`                                                |
| `DialResizableContainer`, `DialConditionalResizableContainer`                                        | `ResizableContainer`                                                  |
| `DialSchemaRenderer`, `DialSchemaRendererProps`                                                      | `SchemaRenderer`, `SchemaRendererProps`                               |
| `DialSearch`, `DialSearchProps`                                                                      | `Search`                                                              |
| `DialSegmentedControl`, `DialSegmentedControlProps`, `SegmentedControlOption`                        | `SegmentedControl`                                                    |
| `DialSelect`, `DialSelectField`, `SelectSize`, `SelectVariant`                                       | `Select`                                                              |
| `DialSharedEntityIndicator`                                                                          | `SharedEntityIndicator`                                               |
| `DialSlider`, `DialSliderProps`                                                                      | `Slider`                                                              |
| `DialSwitch`                                                                                         | `Switch`                                                              |
| `DialTagInput`                                                                                       | `TagInput`                                                            |
| `DialTextarea`                                                                                       | `Textarea`                                                            |
| `LazyDialJsonEditor`, `DialDraggableItem`, `DialInputPopup`, `DialPagination`, `DialPaginationProps` | No replacement in the kit                                             |

The schema types keep their names and import path: `JsonSchema`,
`JsonSchemaDef`, `ValidationError`, `SchemaRendererTexts`,
`SchemaRendererVariant`, `SchemaDisplayMode`, `SchemaOrientation` and
`JsonSchemaType` are still exported from `@epam/ai-dial-ui-kit`.

### Subpaths

| Subpath                        | Removed                                                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@epam/ai-dial-ui-kit/grid`    | `DialGrid`, `DialGridProps`, `DialDateCellRenderer`, `DialDateCellRendererProps`, `DialGridDateValue`, `DEFAULT_GRID_DATE_*`, `convertGridDateToDate` |
| `@epam/ai-dial-ui-kit/editors` | `LazyDialJsonEditor`, `LazyDialMarkdownEditor`, `LazyDialMarkdownEditorContainer`, `DialMarkdownEditorContainerProps`                                 |

### Peer dependencies

`monaco-editor` and `@monaco-editor/react` are no longer optional peers: only
the removed JSON editor used them.

### Public class names and stylesheet

- `DIAL_KIT_CLASS.dropdownIcon` (`dial-kit-dropdown-icon`) and
  `DIAL_KIT_CLASS.dropdownIconCaret` (`dial-kit-dropdown-icon-caret`) are
  removed with `DialDropdownIcon`.
- `styles.css` no longer contains the rules only the removed components used:
  `dial-popup`, `dial-sm-popup`, `dial-md-popup`, `dial-lg-popup`,
  `dial-danger-popup`, `dial-input-radio`, `dial-pagination-dot` and
  `dial-textarea`.

## Step-by-step migration

### 1. Find all usages

```bash
grep -rnE "\b(DialAutocompleteInputValue|DialButtonDropdown|DialCheckbox|DialCollapsibleSidebar|DialConfirmationPopup|DialDropdownIcon(Props)?|DialFileIcon(Props)?|DialFileName|DialFolderName|DialFormItem|FormItemOrientation|DialFormPopup|DialPopup|DialGrid(Props|DateValue)?|DialDateCellRenderer(Props)?|DEFAULT_GRID_DATE_FORMAT_OPTIONS|DEFAULT_GRID_DATE_LOCALE|convertGridDateToDate|LazyDialJsonEditor|LazyDialMarkdownEditor(Container)?|DialMarkdownEditorContainerProps|DialNotification(Props)?|DialNumberInput|DialPasswordInput|DialRadioButton|DialRadioGroup(PopupField)?|DialResizableContainer|DialConditionalResizableContainer|DialSchemaRenderer(Props)?|DialSearch(Props)?|DialSegmentedControl(Props)?|SegmentedControlOption|DialSelect|DialSelectField|SelectSize|SelectVariant|DialSharedEntityIndicator|DialSlider(Props)?|DialSwitch|DialTagInput|DialTextarea|DialDraggableItem|DialInputPopup|DialPagination(Props)?)\b|dial-kit-dropdown-icon|dial-(sm-|md-|lg-|danger-)?popup\b|dial-input-radio|dial-pagination-dot|dial-textarea\b" src/
```

### 2. Replace each component with its 2.0 counterpart

**Before:**

```tsx
import { DialSelect, DialSwitch, DialPopup } from '@epam/ai-dial-ui-kit';
import { DialGrid } from '@epam/ai-dial-ui-kit/grid';
```

**After:**

```tsx
import { Popup, Select, Switch } from '@epam/ai-dial-ui-kit';
import { Grid } from '@epam/ai-dial-ui-kit/grid';
```

Then adjust the props at each call site to the 2.0 component's API — its
Storybook story lists them.

### 3. Drop Monaco if you installed it only for the kit

```bash
npm uninstall monaco-editor @monaco-editor/react
```

### 4. Verify

```bash
npm run typecheck
npm run test
```

## Notes

- If your own markup used one of the removed `dial-*` classes from
  `styles.css`, move its declarations into your own stylesheet.
