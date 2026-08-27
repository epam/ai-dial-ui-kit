import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ConditionalResizableContainer } from './ConditionalResizableContainer';

const BOUNDS = { minWidth: 150, maxWidth: 500 };

describe('Dial UI Kit :: ConditionalResizableContainer', () => {
  test('wraps children in a resizable container by default', () => {
    render(
      <ConditionalResizableContainer {...BOUNDS} defaultWidth={260}>
        <div>Panel content</div>
      </ConditionalResizableContainer>,
    );

    expect(screen.getByText('Panel content')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  test('renders children on their own when disabled', () => {
    const { container } = render(
      <ConditionalResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        enabled={false}
      >
        <div>Panel content</div>
      </ConditionalResizableContainer>,
    );

    expect(screen.getByText('Panel content')).toBeInTheDocument();
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    // No wrapper element is added around the children.
    expect(container.firstElementChild).toHaveTextContent('Panel content');
    expect(container.childElementCount).toBe(1);
  });
});
