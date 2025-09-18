# AI DIAL UI Kit

[<img align="right" width="120" height="120" 
     alt="AI-DIAL-UI-KIT project logo"
     src="https://avatars.githubusercontent.com/u/1589802?s=200&v=4" 
      />](#)

A comprehensive React-based UI components library specifically designed for building AI-driven applications with modern standards and enterprise-grade quality.

[![npm version](https://badge.fury.io/js/@epam%2Fai-dial-ui-kit.svg)](https://badge.fury.io/js/@epam%2Fai-dial-ui-kit)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61dafb.svg)](https://reactjs.org/)

## Table of Contents

- [✨ Features](#-features)
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
- [📖 Storybook](#-storybook)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
- [🚀 Usage in Projects](#-usage-in-projects)
  - [Next.js Integration](#nextjs-integration)
  - [Vite Integration](#vite-integration)
  - [Tree Shaking](#tree-shaking)
- [🤝 Contributing](#-contributing)
- [🔒 Security](#-security)
- [📄 License](#-license)
- [🌟 Related Projects](#-related-projects)

## ✨ Features

- 🎨 **Unified User Experience**: Consistent design language for all AI DIAL applications
- ⚡ **Modern Stack**: Built with latest React, TypeScript, Vite, and Tailwind CSS
- 🎨 **Highly Customizable**: Deep theming capabilities with CSS custom properties
- 🧪 **Well-Tested**: Comprehensive test coverage (70%+) with Vitest and React Testing Library
- 📚 **Storybook Ready**: Interactive component documentation and development playground
- 🛠️ **Developer Experience**: ESLint, Prettier, Husky for maintainable code quality
- 📦 **Distribution Ready**: NPM package ready for easy integration

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
import { DialButton } from '@epam/ai-dial-ui-kit';
import '@epam/ai-dial-ui-kit/styles.css';

function App() {
  return (
    <div>
      <DialButton 
        cssClass="dial-primary-button"
        onClick={() => alert('Hello AI DIAL!')}
      />
    </div>
  );
}
```

## Development

### Prerequisites

- Node.js >= 22.2.0
- npm >= 10.7.0
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/ai-dial-ui-kit.git
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
  --bg-layer-1: #090D13;
  --bg-layer-2: #171B21;
  
  /* Text colors */
  --text-primary: #F3F4F6;
  --text-secondary: #9CA3AF;
  --text-tertiary: #6B7280;
   ...
}
```

Full list of variables is available [here](tailwind.config.js)

## 📖 Storybook

Storybook is a frontend workshop for building UI components and pages in isolation.

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
import { DialButton } from "@epam/ai-dial-ui-kit";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <h1>Test library</h1>
      <DialButton
        onClick={() => console.log("Next.js + AI DIAL UI Kit!")}
        title="Click me"
        cssClass="dial-primary-button"
      />
    </div>
  );
}
</details>


### Tree Shaking

 Import only the components you need:

```tsx
// ✅ Good - Tree shakable imports
import { DialButton, DialInput } from '@epam/ai-dial-ui-kit';
import '@epam/ai-dial-ui-kit/styles.css'; // Import styles separately

// ❌ Avoid - Imports entire library
import * as UIKit from '@epam/ai-dial-ui-kit';
```

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
