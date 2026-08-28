import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { ResizableContainerSide } from '@/types/resizable-container';
import { ResizableContainer } from './ResizableContainer';

const BOUNDS = { minWidth: 150, maxWidth: 500 };

const focusHandle = async (name = 'Resize panel') => {
  const handle = screen.getByRole('separator', { name });
  handle.focus();
  expect(handle).toHaveFocus();

  return handle;
};

describe('Dial UI Kit :: ResizableContainer', () => {
  test('renders children', () => {
    render(
      <ResizableContainer {...BOUNDS} defaultWidth={260}>
        <div>Panel content</div>
      </ResizableContainer>,
    );

    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });

  test('exposes the handle as a focusable separator carrying the bounds', () => {
    render(
      <ResizableContainer {...BOUNDS} defaultWidth={260}>
        <div>Panel content</div>
      </ResizableContainer>,
    );

    const handle = screen.getByRole('separator', { name: 'Resize panel' });

    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('aria-valuenow', '260');
    expect(handle).toHaveAttribute('aria-valuemin', '150');
    expect(handle).toHaveAttribute('aria-valuemax', '500');
    expect(handle).toHaveAttribute('tabindex', '0');
  });

  test('names the handle from ariaLabel', () => {
    render(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        ariaLabel="Resize tree"
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    expect(
      screen.getByRole('separator', { name: 'Resize tree' }),
    ).toBeInTheDocument();
  });

  test('uncontrolled: arrow keys resize the panel and report the new width', async () => {
    const user = userEvent.setup();
    const onResize = vi.fn();
    const onResizeStop = vi.fn();
    const { container } = render(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        onResize={onResize}
        onResizeStop={onResizeStop}
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    await focusHandle();
    await user.keyboard('{ArrowRight}');

    expect(onResize).toHaveBeenLastCalledWith(276);
    expect(onResizeStop).toHaveBeenLastCalledWith(276);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-valuenow',
      '276',
    );
    expect(container.firstElementChild).toHaveStyle({ width: '276px' });

    await user.keyboard('{ArrowLeft}{ArrowLeft}');

    expect(onResizeStop).toHaveBeenLastCalledWith(244);
    expect(container.firstElementChild).toHaveStyle({ width: '244px' });
  });

  test('uncontrolled: falls back to minWidth when defaultWidth is omitted', () => {
    render(
      <ResizableContainer {...BOUNDS}>
        <div>Panel content</div>
      </ResizableContainer>,
    );

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-valuenow',
      '150',
    );
  });

  test('Home and End jump to the bounds and stop there', async () => {
    const user = userEvent.setup();
    const onResizeStop = vi.fn();
    render(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        onResizeStop={onResizeStop}
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    await focusHandle();

    await user.keyboard('{End}');
    expect(onResizeStop).toHaveBeenLastCalledWith(500);

    // Already at the maximum, so there is nothing to report.
    onResizeStop.mockClear();
    await user.keyboard('{ArrowRight}');
    expect(onResizeStop).not.toHaveBeenCalled();

    await user.keyboard('{Home}');
    expect(onResizeStop).toHaveBeenLastCalledWith(150);

    onResizeStop.mockClear();
    await user.keyboard('{ArrowLeft}');
    expect(onResizeStop).not.toHaveBeenCalled();
  });

  test('a left-side handle grows the panel with ArrowLeft', async () => {
    const user = userEvent.setup();
    const onResizeStop = vi.fn();
    render(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        side={ResizableContainerSide.Left}
        onResizeStop={onResizeStop}
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    await focusHandle();

    await user.keyboard('{ArrowLeft}');
    expect(onResizeStop).toHaveBeenLastCalledWith(276);

    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(onResizeStop).toHaveBeenLastCalledWith(244);
  });

  test('honours a custom keyboardStep', async () => {
    const user = userEvent.setup();
    const onResizeStop = vi.fn();
    render(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        keyboardStep={50}
        onResizeStop={onResizeStop}
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    await focusHandle();
    await user.keyboard('{ArrowRight}');

    expect(onResizeStop).toHaveBeenLastCalledWith(310);
  });

  test('ignores keys that are not resize keys', async () => {
    const user = userEvent.setup();
    const onResizeStop = vi.fn();
    render(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        onResizeStop={onResizeStop}
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    await focusHandle();
    await user.keyboard('{Enter}{ArrowUp}a');

    expect(onResizeStop).not.toHaveBeenCalled();
  });

  test('controlled: reports the next width without changing its own', async () => {
    const user = userEvent.setup();
    const onResizeStop = vi.fn();
    render(
      <ResizableContainer {...BOUNDS} width={300} onResizeStop={onResizeStop}>
        <div>Panel content</div>
      </ResizableContainer>,
    );

    await focusHandle();
    await user.keyboard('{ArrowRight}');

    expect(onResizeStop).toHaveBeenCalledWith(316);
    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-valuenow',
      '300',
    );
  });

  test('controlled: follows the width prop', () => {
    const { rerender } = render(
      <ResizableContainer {...BOUNDS} width={300}>
        <div>Panel content</div>
      </ResizableContainer>,
    );

    rerender(
      <ResizableContainer {...BOUNDS} width={420}>
        <div>Panel content</div>
      </ResizableContainer>,
    );

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-valuenow',
      '420',
    );
  });

  test('marks the handle with a chevron pointing away from the panel', () => {
    const { rerender } = render(
      <ResizableContainer {...BOUNDS} defaultWidth={260}>
        <div>Panel content</div>
      </ResizableContainer>,
    );

    expect(
      screen
        .getByRole('separator')
        .querySelector('svg.tabler-icon-chevron-right'),
    ).not.toBeNull();

    rerender(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        side={ResizableContainerSide.Left}
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    expect(
      screen
        .getByRole('separator')
        .querySelector('svg.tabler-icon-chevron-left'),
    ).not.toBeNull();
  });

  test('renders a custom handler in place of the chevron', () => {
    render(
      <ResizableContainer
        {...BOUNDS}
        defaultWidth={260}
        resizeHandler={<span>Grip</span>}
      >
        <div>Panel content</div>
      </ResizableContainer>,
    );

    const handle = screen.getByRole('separator');

    expect(handle).toContainElement(screen.getByText('Grip'));
    expect(handle.querySelector('svg.tabler-icon-chevron-right')).toBeNull();
  });
});
