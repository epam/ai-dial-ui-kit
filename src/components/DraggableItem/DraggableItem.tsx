import { IconGripVertical } from '@tabler/icons-react';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  containerBaseClassName,
  DRAG_TYPE,
  handleBaseClassName,
} from './constants';
import { mergeClasses } from '@/utils/merge-classes';
import { BASE_ICON_PROPS } from '@/constants/icon';

export interface DialDraggableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onFind?: (field: string) => number;
  onMove?: (field: string, atIndex: number) => void;
}

/**
 * A lightweight wrapper that makes its children sortable via drag-and-drop.
 *
 * Renders a row with a grab handle (left) and the provided content (right).
 * Integrates with `react-dnd` using a simple "column" drag type and delegates
 * reordering logic to the provided `findItem` and `moveItem` callbacks.
 *
 * @example
 * ```tsx
 * <DialDraggableItem id="a" findItem={find} moveItem={move}>
 *   <span>Item A</span>
 * </DialDraggableItem>
 * ```
 *
 * @param id - Unique identifier of the draggable item
 * @param children - Content rendered within the draggable row
 * @param [className] - Additional CSS classes applied to the root container
 * @param [onFind] - Function to resolve an item's current index by id
 * @param [onMove] - Function to move an item (by id) to a target index
 * @param [ariaLabel='Drag item'] - Accessible label for the handle
 */
export const DialDraggableItem: FC<DialDraggableItemProps> = ({
  id,
  children,
  className,
  onFind,
  onMove,
  ariaLabel = 'Drag item',
}) => {
  const dragRef = useRef<HTMLDivElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const originalIndex = typeof onFind === 'function' ? onFind(id) : -1;

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: DRAG_TYPE,
      item: { id, originalIndex },
      collect: (monitor) => {
        const item = monitor.getItem<{ id?: string } | null>();
        return {
          isDragging: monitor.isDragging() && item?.id === id,
        };
      },
      end: (item, monitor) => {
        if (!item) return;
        const didDrop = monitor.didDrop();
        if (
          !didDrop &&
          typeof onMove === 'function' &&
          item.originalIndex > -1
        ) {
          onMove(item.id, item.originalIndex);
        }
      },
    }),
    [id, originalIndex, onMove],
  );

  const [, drop] = useDrop(
    () => ({
      accept: DRAG_TYPE,
      hover: (item: { id: string }) => {
        if (!item || item.id === id) return;
        if (typeof onFind === 'function' && typeof onMove === 'function') {
          const index = onFind(id);
          onMove(item.id, index);
        }
      },
    }),
    [onFind, onMove, id],
  );

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <div
      ref={dropRef}
      className={mergeClasses(containerBaseClassName, className)}
      style={{ opacity: isDragging ? 0 : 1 }}
      aria-roledescription="Draggable item"
    >
      <div ref={dragRef} className={handleBaseClassName} aria-label={ariaLabel}>
        <IconGripVertical {...BASE_ICON_PROPS} />
      </div>
      {children}
    </div>
  );
};
