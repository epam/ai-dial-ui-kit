import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialResizableContainer } from './ResizableContainer';
import { ResizableContainerSide } from '@/types/resizable-container';

describe('Dial UI Kit :: DialResizableContainer', () => {
  it('renders children content', () => {
    render(
      <DialResizableContainer defaultWidth={260} minWidth={150} maxWidth={500}>
        <div>Test content</div>
      </DialResizableContainer>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders left-side handle when side is Left', () => {
    render(
      <DialResizableContainer
        defaultWidth={260}
        minWidth={150}
        maxWidth={500}
        side={ResizableContainerSide.Left}
      >
        <div>Left content</div>
      </DialResizableContainer>,
    );

    expect(screen.getByText('Left content')).toBeInTheDocument();

    const handle = document.querySelector('[style*="left: 0"]') as HTMLElement;
    expect(handle).toBeInTheDocument();
  });

  it('renders custom resize handler', () => {
    render(
      <DialResizableContainer
        defaultWidth={260}
        minWidth={150}
        maxWidth={500}
        resizeHandler={<span>CustomHandle</span>}
      >
        <div>With custom handler</div>
      </DialResizableContainer>,
    );

    expect(screen.getByText('With custom handler')).toBeInTheDocument();
    expect(screen.getByText('CustomHandle')).toBeInTheDocument();
  });
});
