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
| Standard 2.0 fields (`Input`, `Select`) | 40px tall | The pointer target spans the full field width but stays 4px short of 44 vertically; the height is a shared form design token, not a per-control choice |
| `Tag` remove button | 16×16 rendered | Reaches 24×24 through `dial-kit-minimum-target`; a 44px target would overhang 14px per side and swallow the neighbouring tags of a `TagInput` row |
| `Radio` circle | 20×20 rendered | Reaches 24×24 through `dial-kit-minimum-target`; a 44px target would overhang 12px per side and swallow the adjacent label. Clicking the label selects the radio, so the practical target is wider |

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

1. Install the package and peer dependencies that are not currently in your project
``` bash
npm install @epam/ai-dial-ui-kit
npm install react react-dom  @tabler/icons-react classnames
npm install @floating-ui/react monaco-editor @monaco-editor/react
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
