# AI DIAL UI Kit

[<img align="right" width="120" height="120" 
     alt="AI-DIAL-UI-KIT project logo"
     src="https://avatars.githubusercontent.com/u/1589802?s=200&v=4" 
      />](#)


The AI DIAL UI Kit is an production-ready React component library designed to streamline your development process. It features a collection of base components, such as Buttons, Inputs, Dropdowns, and more — allowing you to effortlessly reuse elements, quick and easy.

[![npm version](https://badge.fury.io/js/@epam%2Fai-dial-ui-kit.svg)](https://badge.fury.io/js/@epam%2Fai-dial-ui-kit)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61dafb.svg)](https://reactjs.org/)

## Table of Contents

- [✨ Highlights](#-highlights)
- [📖 Documentation](#-documentation)
- [🚀 Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
- [Development](#development)
  - [Prerequisites](#prerequisites-1)
  - [Development Setup](#development-setup)
  - [Project Structure](#project-structure)
- [🎨 Theming & Customization](#-theming--customization)
  - [Public class names](#public-class-names)
- [♿ Accessibility](#-accessibility)
  - [Naming icon-only controls](#naming-icon-only-controls)
  - [Target size (WCAG 2.5.5, Level AAA)](#target-size-wcag-255-level-aaa)
- [📖 Storybook](#-storybook)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
- [🚀 Usage in Projects](#-usage-in-projects)
  - [Next.js Integration](#nextjs-integration)
  - [Tree Shaking](#tree-shaking)
- [🤖 AI Agent MCP Server](#-ai-agent-mcp-server)
- [🤝 Contributing](#-contributing)
- [🔒 Security](#-security)
- [📄 License](#-license)
- [🌟 Related Projects](#-related-projects)

## ✨ Highlights

- 🎨 **Unified User Experience**: Ui Kit usage helps with design consistency across AI DIAL applications
- ⚡ **Modern Stack**: Built with latest React, TypeScript, Vite, and Tailwind CSS
- 🎨 **Highly Customizable**: Deep theming capabilities with CSS custom properties
- 🧪 **Well-Tested**: Comprehensive test coverage (70%+) with Vitest and React Testing Library
- 📚 **Storybook Ready**: Includes interactive component documentation and development playground
- 🛠️ **Developer Experience**: Leverage ESLint, Prettier, Husky for maintainable code quality
- 📦 **Distribution Ready**: Deployed as NPM package ready for easy integration

## 📖 Documentation

Explore our components and their usage in our interactive [Storybook documentation](http://localhost:6006).

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22.2.0
- npm >= 10.7.0

### Installation

```bash
npm install @epam/ai-dial-ui-kit
```

### Basic Usage

```tsx
import { DialPrimaryButton } from '@epam/ai-dial-ui-kit';
import '@epam/ai-dial-ui-kit/styles.css';

function App() {
  return (
    <div>
      <DialPrimaryButton onClick={() => alert('Hello AI DIAL!')} />
    </div>
  );
}
```

### Optional: Markdown Components CSS

If you're using markdown-related components (`DialMarkdownEditor` or `DialMarkdownEditorContainer`), you need to import the required CSS files globally in your application (e.g., in your root layout or main entry point):

```tsx
import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
```

This ensures the CSS is loaded once per application rather than being bundled with each component instance, reducing bundle size.

## Development

### Prerequisites

- Node.js >= 22.2.0
- npm >= 10.7.0
- Git

### Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/epam/ai-dial-ui-kit.git
   cd ai-dial-ui-kit
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Environment**
   ```bash
   # Start Storybook for component development
   npm run storybook
   
   # Run tests in watch mode
   npm run test -- --watch
   
   # Start Vite dev server
   npm run dev
   ```

### Running Tests

```bash
# Run all tests with coverage
npm run test
```

### Project Structure

```
src/
├── components/          # React components
│   ├── Button/         # Example component
│   │   ├── Button.tsx
│   │   ├── Button.spec.tsx
│   │   └── Button.stories.tsx
│   └── ...
├── styles/             # Global styles and Tailwind configuration
│   ├── buttons.scss
│   ├── typography.scss
│   └── tailwind-entry.scss
├── types/              # TypeScript type definitions
└── index.ts            # Main entry point
```

## 🎨 Theming & Customization

The library uses CSS custom properties for comprehensive theming. Override these variables to match your brand:

```css
:root {
  /* Background layers */
  --bg-layer-0: #000000;
  --bg-layer-1: #0C101D;
  --bg-layer-2: #171B21;
  
  /* Text colors */
  --text-primary: ##EEF1F7;
  --text-secondary: #9CA3AF;
  --text-tertiary: #6B7280;
   ...
}
```

Full list of variables is available [here](tailwind.config.js)

Corner radii of the 2.0 controls are themable the same way. Each defaults to the
fully rounded pill the buttons ship with, so setting nothing keeps the stock
look:

```css
:root {
  --radius-control: 12px; /* Button at standard and large size */
  --radius-control-small: 8px; /* Button at ElementSize.Small */
  --radius-control-icon: 9999px; /* IconButton, ToggleIconButton — any size */
}
```

Labelled and icon-only buttons read separate variables on purpose: a design that
wants squarer action buttons usually still wants its icon buttons round.

These are defaults, not overrides: a `rounded-*` utility passed to a single
control through `className` still wins, because a consumer's utilities are
emitted after this package's stylesheet.

### Public class names

Some hosts need to restyle a part of a component the props do not reach — the
padding of a menu's row list, the radius of a row, the caret badge of an icon
trigger. The kit's own classes are Tailwind utilities and hashed module locals,
so a host that reaches for them ends up on selectors that break on the next
upgrade: `[class*='_selectedItem_']`, `> div:nth-child(2) > button`,
`[role='none'][aria-label='dropdown']` — the last of which is an accessibility
contract and, being a plain English string, is not one a localised host can rely
on either.

Every design-system 2.0 component therefore stamps a stable class on the element
that draws it. They are exported as one record:

```tsx
import { DIAL_KIT_CLASS } from '@epam/ai-dial-ui-kit';

DIAL_KIT_CLASS.menuItem; // 'dial-kit-menuitem'
```

```css
.dial-kit-dropdown-list {
  padding-block: 0;
}

.dial-kit-menuitem {
  border-radius: 8px;
}
```

Nothing in `dist/index.css` selects on them: they carry no declarations of their
own and exist only as selectors, so a host's rule needs no `!important` it would
not otherwise need. Renaming one, or moving it to a different element, is a
breaking change and goes through the migration-guide process.

#### Feedback and status

| Key             | Class                     | Element                                                                                  |
| --------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| `spinner`       | `dial-kit-spinner`        | The `role="status"` root of a `Spinner`                                                  |
| `progressBar`   | `dial-kit-progress-bar`   | The outermost element of a `ProgressBar` — its wrapper, or the track when it has neither label nor readout |
| `skeleton`      | `dial-kit-skeleton`       | The root of a `Skeleton`                                                                 |
| `notification`  | `dial-kit-notification`   | The `Notification` surface, including every toast and section-message wrapper             |
| `noDataContent` | `dial-kit-no-data-content` | The empty-state root of `NoDataContent`                                                 |

#### Text

| Key             | Class                     | Element                                                             |
| --------------- | ------------------------- | ------------------------------------------------------------------- |
| `highlight`     | `dial-kit-highlight`      | The text element of a `Highlight`                                   |
| `captionText`   | `dial-kit-caption-text`   | The caption line under a field                                      |
| `errorText`     | `dial-kit-error-text`     | A caption in its error variant, additive to `captionText`           |
| `label`         | `dial-kit-label`          | The `Label` root, wrapping its `label` element and its info button   |

#### Containers

| Key                  | Class                             | Element                                                              |
| -------------------- | --------------------------------- | -------------------------------------------------------------------- |
| `cardShell`          | `dial-kit-card-shell`             | The `article` element of a `CardShell`                               |
| `collapsibleSidebar` | `dial-kit-collapsible-sidebar`    | The `aside` element of a `CollapsibleSidebar`                        |
| `resizableContainer` | `dial-kit-resizable-container`    | The content box inside a `ResizableContainer`'s resize frame         |
| `popup`              | `dial-kit-popup`                  | The `role="dialog"` panel of a `Popup`                               |
| `confirmationPopup`  | `dial-kit-confirmation-popup`     | A `ConfirmationPopup`'s panel, additive to `popup`                   |
| `accordion`          | `dial-kit-accordion`              | The root of an `Accordion`                                           |
| `folderPath`         | `dial-kit-folder-path`            | The breadcrumb root of a `FolderPath`                                |
| `breadcrumbs`        | `dial-kit-breadcrumbs`            | The `nav` element of a `Breadcrumbs` trail                           |
| `breadcrumbsItem`    | `dial-kit-breadcrumbs-item`       | One segment of it: the link, button or span that draws the label     |

#### Menus and overlays

| Key                 | Class                             | Element                                                                                          |
| ------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `dropdown`          | `dial-kit-dropdown`               | The trigger wrapper of a `Dropdown`                                                              |
| `dropdownList`      | `dial-kit-dropdown-list`          | The `role="none"` item list inside a dropdown overlay, and a submenu's own list. Both generations |
| `menuItem`          | `dial-kit-menuitem`               | One overlay row: a dropdown item, a `Select` option, a submenu trigger or child                   |
| `menuItemCheck`     | `dial-kit-menuitem-check`         | The trailing check of a chosen `MenuItemMark.Check` row                                          |
| `dropdownIcon`      | `dial-kit-dropdown-icon`          | The primary icon of a `DialDropdownIcon` trigger                                                 |
| `dropdownIconCaret` | `dial-kit-dropdown-icon-caret`    | Its caret badge. Absent when `showCaret` is `false`                                              |
| `tooltip`           | `dial-kit-tooltip`                | The bubble of a `Tooltip`                                                                        |
| `interactiveTooltip` | `dial-kit-interactive-tooltip`   | The panel of an `InteractiveTooltip`                                                             |
| `ellipsisTooltip`   | `dial-kit-ellipsis-tooltip`       | The text element of an `EllipsisTooltip`, which is also its trigger                              |

#### Fields

| Key                    | Class                                 | Element                                                        |
| ---------------------- | ------------------------------------- | -------------------------------------------------------------- |
| `search`               | `dial-kit-search`                     | The `Search` field box, additive to `dial-kit-input`           |
| `passwordInput`        | `dial-kit-password-input`             | The `PasswordInput` field box, additive to `dial-kit-input`    |
| `numberInput`          | `dial-kit-number-input`               | The `NumberInput` field box, additive to `dial-kit-input`      |
| `tagInput`             | `dial-kit-tag-input`                  | The `TagInput` field box, additive to `dial-kit-input`         |
| `select`               | `dial-kit-select`                     | The root of a `Select`                                         |
| `inlineSelect`         | `dial-kit-inline-select`              | The trigger button of an `InlineSelect`                        |
| `calendar`             | `dial-kit-calendar`                   | The root of a `Calendar`, in every mode                        |
| `fileDropzone`         | `dial-kit-file-dropzone`              | The drop area of a `FileDropzone`                              |
| `radioGroupPopupField` | `dial-kit-radio-group-popup-field`    | The root of a `RadioGroupPopupField`                           |

#### Controls

| Key                    | Class                                 | Element                                                    |
| ---------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `switch`               | `dial-kit-switch`                     | The row of a `Switch`: the control and its label           |
| `checkbox`             | `dial-kit-checkbox`                   | The row of a `Checkbox`                                    |
| `checkboxBox`          | `dial-kit-checkbox-box`               | The decorative box a `CheckboxBox` draws                   |
| `radio`                | `dial-kit-radio`                      | The row of a `Radio`                                       |
| `radioGroup`           | `dial-kit-radio-group`                | The root of a `RadioGroup`                                 |
| `segmentedControl`     | `dial-kit-segmented-control`          | The `role="radiogroup"` track of a `SegmentedControl`       |
| `segmentedControlItem` | `dial-kit-segmented-control-item`     | One segment of it                                          |
| `tabs`                 | `dial-kit-tabs`                       | The outermost element of a `Tabs` — the heading wrapper, or the tab list when there is no `sectionLabel` |
| `tabList`              | `dial-kit-tab-list`                   | The `role="tablist"` inside it, in either orientation      |
| `tab`                  | `dial-kit-tab`                        | One tab inside it                                          |
| `tabSelected`          | `dial-kit-tab-selected`               | The selected tab, in either orientation                    |
| `tabsSectionLabel`     | `dial-kit-tabs-section-label`         | The `sectionLabel` heading above a `Tabs`                  |
| `tag`                  | `dial-kit-tag`                        | A `Tag` pill, including a `TagInput`'s rows                |
| `filterChips`          | `dial-kit-filter-chips`               | The `role="group"` row of a `FilterChips`; its chips carry `dial-kit-tag` |
| `toggleIconButton`     | `dial-kit-toggle-icon-button`         | A `ToggleIconButton`, additive to `dial-kit-base-icon-button` |
| `closeButton`          | `dial-kit-close-button`               | A `CloseButton`, additive to `dial-kit-base-icon-button`    |
| `infoButton`           | `dial-kit-info-button`                | An `InfoButton`, additive to `dial-kit-base-icon-button`    |
| `buttonDropdown`       | `dial-kit-button-dropdown`            | The wrapper of a `ButtonDropdown`                          |

#### Components with no entry, and why

Some 2.0 components are deliberately absent, because the element a host would
target already carries a stable class:

| Component                                     | Target it already |
| --------------------------------------------- | ----------------- |
| `Button` and its six variant wrappers         | `dial-kit-base-button` (plus a per-variant class such as `dial-kit-primary-solid-button`) |
| `IconButton` and its five variant wrappers    | `dial-kit-base-icon-button` |
| `FabButton`                                   | `dial-kit-fab-button` |
| `Input`                                       | `dial-kit-input` |
| `Textarea`                                    | `dial-kit-textarea` |
| `Slider`                                      | `dial-kit-slider` |
| `MarkdownEditor`                              | `dial-kit-markdown-editor` |
| `Grid`                                        | `dial-kit-grid` (exported as `GRID_ROOT_CLASS`) |

Four more contribute no element of their own, and are addressed through what
they render: `ThemeScope` (a `display: contents` wrapper), `MultiSelectTags`
(`Tag`s), and `TooltipContainer` / `TooltipTrigger`.

Two neighbouring elements are reached through props instead, and keep being: a
`Dropdown`'s floating panel takes `listClassName`, a `Popup`'s backdrop takes
`overlayClassName`, and the `DialDropdownIcon` trigger button takes
`buttonClassName`.

## ♿ Accessibility

### Naming icon-only controls

`DialFabButton`, `DialIconButton`, and `IconButton` render no text, so they need an
explicit accessible name. Pass `aria-label`; if you pass only a string
`tooltipProps.tooltip`, it is used as the label instead. Do not rely on the tooltip
alone to convey the name — a tooltip's `aria-describedby` lands on a wrapper element
rather than on the control, and tooltips are suppressed entirely on mobile.

`InfoButton` names itself from `caption` for the same reason. Pass a short
`aria-label` when the caption is a full sentence, so the name stays scannable.

### Target size (WCAG 2.5.5, Level AAA)

Standard-size buttons render at 40×40 but expose a **44×44 pointer target** via the
`dial-kit-enhanced-target` utility, which grows the target with a transparent
pseudo-element. The visible control is unchanged, so layouts keep their existing
metrics. WCAG 2.5.5 measures the region that accepts a pointer action, not the
visible decoration.

A control too small for a 44px target to clear its neighbours uses
`dial-kit-minimum-target` instead, which applies the same pseudo-element at the
Level AA minimum of 24×24 (WCAG 2.5.8).

These controls are **documented exceptions** and meet Level AA (2.5.8, 24×24) but
not AAA:

| Control | Size | Why it is excluded |
| --- | --- | --- |
| `ElementSize.Small` variants | 24×24 | A 44px target overhangs 10px per side and would overlap adjacent controls in dense toolbars |
| `ButtonAppearance.Link` | content | Exempt under the 2.5.5 *Inline* exception; expanding it would overlap surrounding copy |
| `DialCloseButton` | icon-sized | Renders `h-auto w-auto`, so its target follows the caller's icon size |
| `DialInfoButton`, `InfoButton` | 24×24 | Fixed small affordance, same overlap constraint as small variants |
| Standard 2.0 fields (`Input`, `Select`, `RadioGroupPopupField`) | 40px tall | The pointer target spans the full field width but stays 4px short of 44 vertically; the height is a shared form design token, not a per-control choice. `.dial-kit-input` clips its overflow, so the pseudo-element cannot grow the target either |
| `Tag` remove button | 16×16 rendered | Reaches 24×24 through `dial-kit-minimum-target`; a 44px target would overhang 14px per side and swallow the neighbouring tags of a `TagInput` row |
| Clickable `Tag` | 32px tall | A 44px target would overhang 6px per side and swallow the neighbouring chips of a filter row; the tag is already wider than 24px on both axes |
| `Radio` circle | 20×20 rendered | Reaches 24×24 through `dial-kit-minimum-target`; a 44px target would overhang 12px per side and swallow the adjacent label. Clicking the label selects the radio, so the practical target is wider |
| `Checkbox` box | 20×20 rendered | Reaches 24×24 through `dial-kit-minimum-target`; a 44px target would overhang 12px per side and swallow the adjacent label. Clicking the label toggles the checkbox, so the practical target is wider |
| `Slider` track row | 24px tall | The pointer target spans the full track width but is only 24px tall; a 44px row would add 20px of dead space to every form the slider sits in, and the thumb is dragged rather than tapped |
| `Breadcrumbs` segment link | content | Exempt under the 2.5.5 *Inline* exception — a segment is a text link in a line of text, and expanding it would overlap the segments beside it |
| `Breadcrumbs` overflow button | 16×16 rendered | Reaches 24×24 through `dial-kit-minimum-target`; a 44px target would overhang 14px per side and swallow the segments on either side of it in an inline trail |
| `SegmentedControl` segment | 32px tall | Sits 4px from its neighbours inside a 40px track, so a 44px target would overhang 6px per side and swallow the adjacent segments; the segment is already wider than 24px on both axes |
| `ResizableContainer` resize handle | 10px wide pointer strip | The handle has to sit exactly on the panel boundary, so a 44px-wide strip would swallow content on both sides of it — essential to the control. It is a focusable `separator`, so the resize is also available from the keyboard with the arrow keys |

Give small-variant controls at least 20px of surrounding space if you need to reach
AAA in a specific layout, or use the standard size instead.

## 📖 Storybook

Storybook is a handy library for documenting and developing of UI components.

### Stories
To run fully interactive storybook:

#### Development mode
```bash
npm run storybook
# Open http://localhost:6006
```

#### Production Build
```bash
npm run build-storybook
```
#### Production start

```bash
npx http-server ./storybook-static
# Open http://127.0.0.1:8080/
```

### Documents
To run documents only:

#### Development mode
``` bash
npm run storybook-docs
# Open http://localhost:54800/
```
#### Production build
```bash
npm run build-storybook-docs
```
#### Production start
```bash
npx http-server ./storybook-static
# Open http://127.0.0.1:8080/
```

Storybook provides:
- 📖 Interactive component documentation
- 🎨 Visual testing playground
- ♿ Accessibility testing tools
- 📱 Responsive design testing
- 🎯 Component isolation

## 🚀 Usage in Projects

<details>
<summary>Next.js Integration</summary>

1. Install the package. React is the only peer you have to supply — everything
   the kit renders with, it installs itself.

``` bash
npm install @epam/ai-dial-ui-kit
npm install react react-dom
```

Add the editor packages only if you use the `@epam/ai-dial-ui-kit/editors`
subpath. They are optional peers, so `npm install` stays quiet without them, and
the kit only reaches for them when a `Lazy*` editor actually mounts:

``` bash
npm install monaco-editor @monaco-editor/react @uiw/react-md-editor
```

2. Import style in the root layout of the project:

```tsx
// app/layout.tsx
import "@epam/ai-dial-ui-kit/styles.css";
```

3. Usage example

```tsx
// app/page.tsx
"use client";
import { DialPrimaryButton } from "@epam/ai-dial-ui-kit";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <h1>Test library</h1>
      <DialPrimaryButton onClick={() => alert('Hello AI DIAL!')} />
    </div>
  );
}
```
</details>


### Tree Shaking

 Import only the components you need:

```tsx
// ✅ Good - Tree shakable imports
import { DialPrimaryButton, DialInput } from '@epam/ai-dial-ui-kit';
import '@epam/ai-dial-ui-kit/styles.css'; // Import styles separately

// ❌ Avoid - Imports entire library
import * as UIKit from '@epam/ai-dial-ui-kit';
```

## 🤖 AI Agent MCP Server

The AI DIAL UI Kit includes a built-in **MCP (Model Context Protocol) server** that enables AI agents to discover components, types, hooks, and utilities programmatically. This allows AI assistants to generate accurate, type-safe component code without hallucination.

Component results are ranked **generation 2.0 first** — the current design system, exported without the `Dial` prefix — and each legacy `Dial*` component points at its 2.0 replacement, so agents land on the right component by default.

For setup, configuration, and detailed resources, see the [MCP Server Guide](./src/mcp/README.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code style guidelines
- Testing requirements
- Pull request process

## 🔒 Security

If you discover a security vulnerability, please refer to our [Security Policy](./SECURITY.md).

## 📄 License

[Apache 2.0](./LICENSE) - see the [LICENSE](./LICENSE) file for details.

## 🌟 Related Projects

- [AI-DIAL](https://github.com/epam/ai-dial) - Entrypoint for all AI Dial projects

---

<p align="center">
  Made with ❤️ by <a href="https://www.epam.com">EPAM Systems</a>
</p>
