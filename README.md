# AI DIAL UI KIT
[<img align="right" width="120" height="120" 
     alt="AI-DIAL-UI-KIT project logo"
     src="https://avatars.githubusercontent.com/u/1589802?s=200&v=4" 
      />](#)
React-based UI components library for building AI-driven applications with ease.
<br/>     

## Features

- :robot: **AI-First Design**: Components specifically designed for AI and conversational interfaces
- :black_joker: **Unified User Experience**: Use these components for any AI DIAL applications 
- :rocket: **Modern Stack**: Built with React 19, TypeScript, Vite, and Tailwind CSS
- :art: **Customizable**: Deep theming capabilities with CSS custom properties
- :test_tube: **Well-Tested**: Comprehensive test coverage with Vitest and React Testing Library
- :books: **Storybook Ready**: Interactive component documentation and playground
- :gear: **Developer Experience**: ESLint, Prettier, Husky for code quality
- :package: **Distribution Ready**: Distributed as npm package, this library can be easily adopted 

## Documentation

Explore the components and their usage in our interactive [Storybook documentation](#storybook).

## Getting Started

### Prerequisites

- Node.js >= 22.2.0
- npm >= 10.7.0

### Installation

```bash
npm install @epam/ai-dial-ui-kit
```

### Basic Usage

```tsx
import { ExampleComponent } from '@epam/ai-dial-ui-kit';
import '@epam/ai-dial-ui-kit/styles.css';

function App() {
  return (
    <ExampleComponent 
      title="Welcome to AI-DIAL" 
      description="Build amazing AI applications with our UI components"
    />
  );
}
```

### With Custom Styling

The library uses CSS custom properties for theming. You can customize the appearance by overriding theme variables:

```css
:root {
  --bg-layer-0: #000000;
  --bg-layer-1: #090D13;
  --text-primary: #F3F4F6;
  --controls-bg-accent: #5C8DEA;
  /* ... */
}
```

## Storybook

### Development Mode
```bash
npm run storybook
```
Access Storybook at `http://localhost:6006`

### Production Build
```bash
npm run build-storybook
npx http-server ./storybook-static
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/epam/ai-dial-ui-kit.git
cd ai-dial-ui-kit

# Install dependencies
npm install

# Start development
npm run dev
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ...
│   └── ...
├── styles/             # Global styles and Tailwind configuration
└── types/              # TypeScript type definitions
```


## Testing

We maintain high code quality standards with comprehensive testing:

- **Unit Tests**: Vitest with React Testing Library
- **Coverage**: Minimum 70% coverage requirement
- **E2E**: Storybook test runner for component interactions

```bash
# Run tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch
```


## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## Security

If you discover a security vulnerability, please refer to our [Security Policy](./SECURITY.md).

## License

[Apache 2.0](./LICENSE) - see the [LICENSE](./LICENSE) file for details.

## Related Projects

- [AI-DIAL](https://github.com/epam/ai-dial) - The main AI-DIAL framework
- [AI-DIAL Admin Frontend](https://github.com/epam/ai-dial-admin-frontend) - Admin interface using this UI kit

---

<p align="center">
  Made with ❤️ by <a href="https://www.epam.com">EPAM Systems</a>
</p>
