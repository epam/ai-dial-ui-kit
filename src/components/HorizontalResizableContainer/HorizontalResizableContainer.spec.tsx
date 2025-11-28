import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialHorizontalResizableContainer } from './HorizontalResizableContainer';
import { HorizontalResizableContainerSide } from '@/types/resizable-container';

describe('Dial UI Kit :: DialHorizontalResizableContainer', () => {
  it('renders children content', () => {
    render(
      <DialHorizontalResizableContainer
        defaultWidth={260}
        minWidth={150}
        maxWidth={500}
      >
        <div>Test content</div>
      </DialHorizontalResizableContainer>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders left-side handle when side is Left', () => {
    render(
      <DialHorizontalResizableContainer
        defaultWidth={260}
        minWidth={150}
        maxWidth={500}
        side={HorizontalResizableContainerSide.Left}
      >
        <div>Left content</div>
      </DialHorizontalResizableContainer>,
    );

    expect(screen.getByText('Left content')).toBeInTheDocument();

    const handle = document.querySelector(
      '[style*="left: -3px"]',
    ) as HTMLElement;
    expect(handle).toBeInTheDocument();
  });

  it('renders custom resize handler', () => {
    render(
      <DialHorizontalResizableContainer
        defaultWidth={260}
        minWidth={150}
        maxWidth={500}
        resizeHandler={<span>CustomHandle</span>}
      >
        <div>With custom handler</div>
      </DialHorizontalResizableContainer>,
    );

    expect(screen.getByText('With custom handler')).toBeInTheDocument();
    expect(screen.getByText('CustomHandle')).toBeInTheDocument();
  });
});
