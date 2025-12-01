import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DialDraggableItem } from './DraggableItem';

vi.mock('react-dnd', () => {
  interface DragItem {
    id: string;
    originalIndex: number;
  }
  interface DragMonitor {
    getItem: () => { id: string } | null;
    isDragging: () => boolean;
    didDrop: () => boolean;
  }
  interface DragCollected {
    isDragging?: boolean;
  }
  interface DragSpec {
    type: string;
    item: DragItem;
    collect?: (monitor: DragMonitor) => DragCollected;
    end?: (item: DragItem, monitor: { didDrop: () => boolean }) => void;
  }
  interface DropSpec {
    accept: string;
    hover: (item: { id: string }) => void;
  }

  interface State {
    isDragging: boolean;
    itemId?: string;
    didDrop: boolean;
  }

  let state: State = { isDragging: false, itemId: undefined, didDrop: false };
  let lastDragSpec!: DragSpec;
  let lastDropSpec!: DropSpec;

  const connect = <T,>(node: T): T => node;

  const useDrag = (specFactory: () => DragSpec) => {
    lastDragSpec = specFactory();
    const monitor: DragMonitor = {
      getItem: () => (state.itemId ? { id: state.itemId } : null),
      isDragging: () => state.isDragging,
      didDrop: () => state.didDrop,
    };
    const collected = lastDragSpec.collect ? lastDragSpec.collect(monitor) : {};
    return [collected, connect, connect] as const;
  };

  const useDrop = (specFactory: () => DropSpec) => {
    lastDropSpec = specFactory();
    return [{}, connect] as const;
  };

  return {
    useDrag,
    useDrop,
    __testing: {
      setState: (patch: Partial<State>) => {
        state = { ...state, ...patch };
      },
      getSpecs: () => ({ drag: lastDragSpec, drop: lastDropSpec }),
    },
  };
});

vi.mock('@/utils/merge-classes', () => ({
  mergeClasses: (...cls: (string | undefined)[]) =>
    cls.filter(Boolean).join(' '),
}));
vi.mock('@/constants/icon', () => ({
  BASE_ICON_PROPS: { size: 16, strokeWidth: 1.5 },
}));

import * as Dnd from 'react-dnd';
interface DragSpecForTest {
  item: { id: string; originalIndex: number };
  end: (
    item: { id: string; originalIndex: number },
    monitor: { didDrop: () => boolean },
  ) => void;
}
interface DropSpecForTest {
  hover: (item: { id: string }) => void;
}
type DndWithTesting = typeof import('react-dnd') & {
  __testing: {
    setState: (
      patch: Partial<{
        isDragging: boolean;
        itemId?: string;
        didDrop: boolean;
      }>,
    ) => void;
    getSpecs: () => { drag: DragSpecForTest; drop: DropSpecForTest };
  };
};
const DndMock = Dnd as DndWithTesting;

describe('Dial UI Kit :: DialDraggableItem', () => {
  beforeEach(() => {
    DndMock.__testing.setState({
      isDragging: false,
      itemId: undefined,
      didDrop: false,
    });
  });

  test('renders children content', () => {
    render(
      <DialDraggableItem id="id-1">
        <span>Content A</span>
      </DialDraggableItem>,
    );
    expect(screen.getByText('Content A')).toBeInTheDocument();
  });

  test('renders a drag handle element with aria-label', () => {
    const { container } = render(
      <DialDraggableItem id="id-2">
        <span>Row</span>
      </DialDraggableItem>,
    );
    const handle = container.querySelector('[aria-label="Drag item"]');
    expect(handle).toBeInTheDocument();
  });

  test('applies custom className to container', () => {
    render(
      <DialDraggableItem id="id-3" className="bg-red-500">
        <span>Row</span>
      </DialDraggableItem>,
    );
    const container = screen.getByText('Row').parentElement!;
    expect(container).toHaveClass('bg-red-500');
  });

  test('collect(): sets opacity to 0 while this item is being dragged', () => {
    DndMock.__testing.setState({ isDragging: true, itemId: 'drag-1' });
    const { container } = render(
      <DialDraggableItem id="drag-1">
        <span>Dragging</span>
      </DialDraggableItem>,
    );
    const root = container.querySelector(
      '[aria-roledescription="Draggable item"]',
    )!;
    expect(root).toHaveStyle({ opacity: '0' });
  });

  test('end(): when not dropped, moves item back to originalIndex', () => {
    const findItem = vi.fn(() => 3);
    const moveItem = vi.fn();

    render(
      <DialDraggableItem id="x-1" onFind={findItem} onMove={moveItem}>
        <span>Row</span>
      </DialDraggableItem>,
    );

    const { drag } = DndMock.__testing.getSpecs();
    const monitor = { didDrop: () => false };
    drag.end(drag.item, monitor);

    expect(moveItem).toHaveBeenCalledWith('x-1', 3);
  });

  test('end(): when dropped successfully, does not call moveItem', () => {
    const findItem = vi.fn(() => 2);
    const moveItem = vi.fn();

    render(
      <DialDraggableItem id="x-2" onFind={findItem} onMove={moveItem}>
        <span>Row</span>
      </DialDraggableItem>,
    );

    const { drag } = DndMock.__testing.getSpecs();
    const monitor = { didDrop: () => true };
    drag.end(drag.item, monitor);

    expect(moveItem).not.toHaveBeenCalled();
  });

  test('hover(): moves other item to current index', () => {
    const findItem = vi.fn(() => 1);
    const moveItem = vi.fn();

    render(
      <DialDraggableItem id="host" onFind={findItem} onMove={moveItem}>
        <span>Host</span>
      </DialDraggableItem>,
    );

    const { drop } = DndMock.__testing.getSpecs();
    drop.hover({ id: 'guest' });

    expect(moveItem).toHaveBeenCalledWith('guest', 1);
  });

  test('hover(): ignores when hovering over itself', () => {
    const findItem = vi.fn(() => 0);
    const moveItem = vi.fn();

    render(
      <DialDraggableItem id="same" onFind={findItem} onMove={moveItem}>
        <span>Same</span>
      </DialDraggableItem>,
    );

    const { drop } = DndMock.__testing.getSpecs();
    drop.hover({ id: 'same' });

    expect(moveItem).not.toHaveBeenCalled();
  });

  test('end(): early-returns when item is null (no moveItem call)', () => {
    const findItem = vi.fn(() => 5);
    const moveItem = vi.fn();

    render(
      <DialDraggableItem id="null-case" onFind={findItem} onMove={moveItem}>
        <span>Row</span>
      </DialDraggableItem>,
    );

    const { drag } = DndMock.__testing.getSpecs();
    const monitor = { didDrop: () => false };

    drag.end(null as never, monitor);

    expect(moveItem).not.toHaveBeenCalled();
  });
});
