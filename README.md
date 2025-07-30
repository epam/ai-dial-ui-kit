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
import { Button } from '@epam/ai-dial-ui-kit';
import '@epam/ai-dial-ui-kit/styles.css';

function App() {
  return (
    <div>
      <Button 
        cssClass="dial-primary-button"
        onClick={() => alert('Hello AI DIAL!')}
      >
        Get Started
      </Button>
    </div>
  );
}
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

### Development Mode
Access our interactive component documentation:

```bash
npm run storybook
# Open http://localhost:6006
```

### Production Build
```bash
npm run build-storybook
npx http-server ./storybook-static
```

Storybook provides:
- 📖 Interactive component documentation
- 🎨 Visual testing playground
- ♿ Accessibility testing tools
- 📱 Responsive design testing
- 🎯 Component isolation

## 🚀 Usage in Projects

### Next.js Integration

```tsx
// pages/_app.tsx
import '@epam/ai-dial-ui-kit/styles.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// components/MyComponent.tsx
import { Button } from '@epam/ai-dial-ui-kit';

export function MyComponent() {
  return (
    <Button onClick={() => console.log('Next.js + AI DIAL UI Kit!')}>
      Click me
    </Button>
  );
}
```

### Vite Integration

```tsx
// main.tsx
import '@epam/ai-dial-ui-kit/styles.css';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

### Tree Shaking

Import only the components you need:

```tsx
// ✅ Good - Tree shakable
import { Button } from '@epam/ai-dial-ui-kit';

// ❌ Avoid - Imports entire library
import * as UIKit from '@epam/ai-dial-ui-kit';
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up the development environment
- Code style guidelines
- Testing requirements
- Pull request process


## 🔒 Security

If you discover a security vulnerability, please refer to our [Security Policy](./SECURITY.md).

## 📄 License

[Apache 2.0](./LICENSE) - see the [LICENSE](./LICENSE) file for details.

## 🌟 Related Projects

- [AI-DIAL](https://github.com/epam/ai-dial) - Entrypoint for all AI Dial project
- [AI-DIAL Chat](https://github.com/epam/ai-dial-chat) - AI Dial Chat
- [AI-DIAL Admin Frontend](https://github.com/epam/ai-dial-admin-frontend) - AI Dial Admin

---

<p align="center">
  Made with ❤️ by <a href="https://www.epam.com">EPAM Systems</a>
</p>
