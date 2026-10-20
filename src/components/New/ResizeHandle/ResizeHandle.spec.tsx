import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';

import { ResizeHandle, type ResizeHandleProps } from './ResizeHandle';

const BOUNDS = { minWidth: 200, maxWidth: 400 };

/* jsdom ships no `PointerEvent`, so pointer events would lose their coordinates. */
class TestPointerEvent extends MouseEvent {
  pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

beforeAll(() => {
  vi.stubGlobal('PointerEvent', TestPointerEvent);
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn(() => true);
});

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);

    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.stubGlobal('PointerEvent', TestPointerEvent);
});

const renderHandle = (props: Partial<ResizeHandleProps> = {}, dir?: string) => {
  const onWidthChange = vi.fn();
  render(
    <div dir={dir}>
      <ResizeHandle
        width={300}
        {...BOUNDS}
        label="Resize columns"
        tooltip="Drag to resize"
        onWidthChange={onWidthChange}
        {...props}
      />
    </div>,
  );

  return { onWidthChange, handle: screen.getByRole('separator') };
};

const drag = (handle: HTMLElement, from: number, to: number) => {
  fireEvent.pointerDown(handle, { clientX: from, button: 0 });
  fireEvent.pointerMove(handle, { clientX: to });
  fireEvent.pointerUp(handle);
};

describe('Dial UI Kit :: ResizeHandle', () => {
  test('is a vertical separator named by the label and carrying the bounds', () => {
    const { handle } = renderHandle();

    expect(handle).toHaveAccessibleName('Resize columns');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    expect(handle).toHaveAttribute('aria-valuenow', '300');
    expect(handle).toHaveAttribute('aria-valuemin', '200');
    expect(handle).toHaveAttribute('aria-valuemax', '400');
    expect(handle).toHaveAttribute('tabindex', '0');
  });

  test('moves by the keyboard step with the arrow keys', () => {
    const { handle, onWidthChange } = renderHandle();

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onWidthChange).toHaveBeenLastCalledWith(316);

    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onWidthChange).toHaveBeenLastCalledWith(284);
  });

  test('uses a custom keyboard step', () => {
    const { handle, onWidthChange } = renderHandle({ keyboardStep: 40 });

    fireEvent.keyDown(handle, { key: 'ArrowRight' });

    expect(onWidthChange).toHaveBeenCalledWith(340);
  });

  test('jumps to the bounds with Home and End', () => {
    const { handle, onWidthChange } = renderHandle();

    fireEvent.keyDown(handle, { key: 'Home' });
    expect(onWidthChange).toHaveBeenLastCalledWith(200);

    fireEvent.keyDown(handle, { key: 'End' });
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
  });

  test('never reports a width outside the bounds from the keyboard', () => {
    const { handle, onWidthChange } = renderHandle({ width: 395 });

    fireEvent.keyDown(handle, { key: 'ArrowRight' });

    expect(onWidthChange).toHaveBeenCalledWith(400);
  });

  test('ignores other keys', () => {
    const { handle, onWidthChange } = renderHandle();

    fireEvent.keyDown(handle, { key: 'a' });

    expect(onWidthChange).not.toHaveBeenCalled();
  });

  test('mirrors the arrow keys in RTL', () => {
    const { handle, onWidthChange } = renderHandle({}, 'rtl');

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onWidthChange).toHaveBeenLastCalledWith(284);

    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onWidthChange).toHaveBeenLastCalledWith(316);
  });

  test('resizes by the distance the pointer is dragged', () => {
    const { handle, onWidthChange } = renderHandle();

    drag(handle, 100, 150);

    expect(onWidthChange).toHaveBeenCalledWith(350);
    expect(handle.setPointerCapture).toHaveBeenCalled();
    expect(handle.releasePointerCapture).toHaveBeenCalled();
  });

  test('limits a drag to the bounds', () => {
    const { handle, onWidthChange } = renderHandle();

    drag(handle, 100, 900);
    expect(onWidthChange).toHaveBeenLastCalledWith(400);

    drag(handle, 100, -900);
    expect(onWidthChange).toHaveBeenLastCalledWith(200);
  });

  test('reverses the drag direction in RTL', () => {
    const { handle, onWidthChange } = renderHandle({}, 'rtl');

    drag(handle, 100, 150);

    expect(onWidthChange).toHaveBeenCalledWith(250);
  });

  test('ignores a drag that does not start with the primary button', () => {
    const { handle, onWidthChange } = renderHandle();

    fireEvent.pointerDown(handle, { clientX: 100, button: 2 });
    fireEvent.pointerMove(handle, { clientX: 150 });

    expect(onWidthChange).not.toHaveBeenCalled();
  });

  test('stops resizing once the pointer is released', () => {
    const { handle, onWidthChange } = renderHandle();

    drag(handle, 100, 150);
    onWidthChange.mockClear();
    fireEvent.pointerMove(handle, { clientX: 250 });

    expect(onWidthChange).not.toHaveBeenCalled();
  });

  test('resets to the default width on double click', () => {
    const { handle, onWidthChange } = renderHandle({ defaultWidth: 250 });

    fireEvent.doubleClick(handle);

    expect(onWidthChange).toHaveBeenCalledWith(250);
  });

  test('limits the default width to the bounds', () => {
    const { handle, onWidthChange } = renderHandle({ defaultWidth: 900 });

    fireEvent.doubleClick(handle);

    expect(onWidthChange).toHaveBeenCalledWith(400);
  });

  test('does nothing on double click without a default width', () => {
    const { handle, onWidthChange } = renderHandle();

    fireEvent.doubleClick(handle);

    expect(onWidthChange).not.toHaveBeenCalled();
  });

  test('shows the hint only after the pointer has rested on the handle', () => {
    vi.useFakeTimers();
    const { handle } = renderHandle();

    fireEvent.pointerEnter(handle, { clientX: 10, clientY: 10 });
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.queryByText('Drag to resize')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText('Drag to resize')).toBeInTheDocument();
  });

  test('restarts the wait when the pointer moves away', () => {
    vi.useFakeTimers();
    const { handle } = renderHandle();

    fireEvent.pointerEnter(handle, { clientX: 10, clientY: 10 });
    act(() => {
      vi.advanceTimersByTime(800);
    });
    fireEvent.pointerMove(handle, { clientX: 40, clientY: 10 });
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.queryByText('Drag to resize')).toBeNull();
  });

  test('hides the hint when the pointer leaves', () => {
    vi.useFakeTimers();
    const { handle } = renderHandle();

    fireEvent.pointerEnter(handle, { clientX: 10, clientY: 10 });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.pointerLeave(handle);

    expect(screen.queryByText('Drag to resize')).toBeNull();
  });

  test('hides the hint while dragging', () => {
    vi.useFakeTimers();
    const { handle } = renderHandle();

    fireEvent.pointerEnter(handle, { clientX: 10, clientY: 10 });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.pointerDown(handle, { clientX: 10, button: 0 });

    expect(screen.queryByText('Drag to resize')).toBeNull();
  });

  test('stamps the public class and accepts a custom class last-but-one', () => {
    const { handle } = renderHandle({ className: 'custom-class' });

    expect(handle).toHaveClass('custom-class', 'dial-kit-resize-handle');
  });
});
