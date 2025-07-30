# Contributing to AI DIAL UI Kit

Thank you for your interest in contributing to AI DIAL UI Kit! This document provides guidelines and information for contributors.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Component Development](#component-development)
- [Testing](#testing)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Development Workflow

### Branching Strategy

We follow a simple branching strategy:

- `development` - main branch for integrating development code
- `<custom name>` - feature development branches

### Creating a Feature Branch

```bash
git checkout development
git pull origin development
git checkout -b your-feature-name
```

## Component Development

### Component Guidelines

1. **File Structure**: Each component should have its own directory with:
   - `ComponentName.tsx` - Main component
   - `ComponentName.spec.tsx` - Unit tests
   - `ComponentName.stories.tsx` - Storybook stories

2. **TypeScript**: Use proper TypeScript with:
   - Explicit interface definitions for props
   - Generic types where appropriate
   - Proper export patterns

3. **Styling**: 
   - Use Tailwind CSS classes
   - Create reusable SCSS mixins when needed
   - Follow design system
   - Do not inline styles
   - Do not use hardcored custom values like hex colors, font sizes, etc

4. **Update policy**:
 - Do not make breaking changes to existing UI components. Use Open-Close principle from SOLID 



<details>
<summary>Example Component Structure</summary>

```tsx
// Button.tsx
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={classNames(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        { 'btn--disabled': disabled }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```
</details>

### Storybook Stories

Every component must have Storybook stories

<details>
<summary>Example Storybook stories</summary>

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
};
```
</details>

## Testing

### Testing Requirements

- **Coverage**: Minimum 70% code coverage required
- **Unit Tests**: Every component must have unit tests
- **Test Framework**: Vitest with React Testing Library


<details>
<summary>Example component tests</summary>

```tsx
// Button.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByText('Disabled Button')).toBeDisabled();
  });
});
```
</details>

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch

# Run tests for specific file
npm run test Button.spec.tsx
```

## Code Style

### Linting and Formatting

We use ESLint and Prettier for code consistency:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Check formatting
npm run format

# Fix formatting
npm run format-fix
```

### Code Style Guidelines

- Use functional components with hooks
- Prefer explicit typing over `any`
- Use destructuring for props
- Keep components small and focused
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

## Pull Request Process

### Before Submitting

1. **Run Quality Checks**
Do not skip pre-commit and pre-push hooks. They'll run:
   ```bash
   npm run lint
   npm run format
   npm run test
   ```

2. **Update Documentation**
   - Update Storybook stories if needed
   - Add/update README sections
   - Document breaking changes

### PR Guidelines

Follow rules from `.github/pull_request_template.md`

### Review Process

- All PRs require at least one approval
- Automated checks must pass
- Address review feedback
- Keep PRs focused and reasonably sized

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)


## Code of Conduct

For detailed information on DIAL project contributing guidelines, see the main [contributing documentation](https://github.com/epam/ai-dial/blob/main/CONTRIBUTING.md).