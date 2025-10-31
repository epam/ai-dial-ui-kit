import { BASE_ICON_SIZE } from '@/constants/icon';
import { FlexibleActionsDirection } from '@/types/flexible-actions';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseFlexibleActionsOptions<T> {
  actions: T[];
  direction?: FlexibleActionsDirection;
  moreButtonWidth?: number;
  actionsGap?: number;
  containerPadding?: number;
  dependencies?: unknown[];
}

/**
 * A responsive layout hook that automatically determines how many action buttons
 * can fit within a container and moves overflowing ones into a hidden list (e.g. a dropdown).
 *
 * It measures each action's width and dynamically recalculates visible and hidden actions
 * whenever the container resizes or dependencies change.
 *
 * This hook is reusable for toolbars or action strips that can have:
 * - a **left fixed section** (e.g., selection info),
 * - a **right fixed section** (e.g., metadata or pagination),
 * - and a **flexible central section** where actions may overflow.
 *
 * @template T - Type of the action item. Each action must have a unique `key` property.
 *
 * @param {Object} options - Hook configuration options.
 * @param {T[]} options.actions - Array of all available actions.
 * @param {FlexibleActionsDirection} [options.direction=FlexibleActionsDirection.Normal] -
 * Defines the fill direction:
 * - `Normal`: Fills actions from left to right.
 * - `Reverse`: Fills actions from right to left (useful when the "More" button is on the right).
 * @param {number} [options.moreButtonWidth=BASE_ICON_SIZE] - Reserved width for the “more” or overflow button.
 * @param {number} [options.actionsGap=8] - Horizontal gap (in pixels) between action buttons.
 * @param {number} [options.containerPadding=8] - Horizontal padding (in pixels) inside the container.
 * @param {unknown[]} [options.dependencies=[]] - Dependency array to trigger recalculation when external layout-affecting
 *   values (like screen size or visibility) change.
 *
 * @returns Result object containing the calculated visible and hidden actions and all relevant refs.
 *
 * @property {T[]} visibleActions - Actions that currently fit into the available width.
 * @property {T[]} hiddenActions - Actions that do not fit and should be rendered inside a dropdown.
 *
 * @property {Object} refs - A set of refs used for layout measurement.
 * @property {React.RefObject<HTMLDivElement>} refs.containerRef - Ref for the outer container. Must wrap the entire toolbar area.
 * @property {React.RefObject<HTMLDivElement>} refs.measureRef - Ref for a hidden measurement container (used to measure action widths).
 * @property {React.RefObject<HTMLDivElement>} refs.leftSectionRef - Ref for the left fixed section (optional).
 * @property {React.RefObject<HTMLDivElement>} refs.rightSectionRef - Ref for the right fixed section (optional).
 *
 * @example
 * // Example usage inside a toolbar component:
 * const { visibleActions, hiddenActions, refs } = useFlexibleActions({
 *   actions,
 *   direction: FlexibleActionsDirection.Reverse,
 *   dependencies: [isMobile],
 * });
 *
 * return (
 *   <>
 *     <div ref={refs.measureRef} className="invisible absolute top-0 left-0 flex gap-2">
 *       {actions.map(a => <ActionButton key={a.key} {...a} />)}
 *     </div>
 *
 *     <div ref={refs.containerRef} className="flex justify-between items-center">
 *       <div ref={refs.leftSectionRef}>Left section</div>
 *
 *       <div className="flex gap-2 items-center">
 *         {hiddenActions.length > 0 && <MoreMenu items={hiddenActions} />}
 *         {visibleActions.map(a => <ActionButton key={a.key} {...a} />)}
 *       </div>
 *
 *       <div ref={refs.rightSectionRef}>Right section</div>
 *     </div>
 *   </>
 * );
 */
export function useFlexibleActions<T extends { key: string }>({
  actions,
  direction = FlexibleActionsDirection.Normal,
  moreButtonWidth = BASE_ICON_SIZE,
  actionsGap = 8,
  containerPadding = 8,
  dependencies = [],
}: UseFlexibleActionsOptions<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const leftSectionRef = useRef<HTMLDivElement | null>(null);
  const rightSectionRef = useRef<HTMLDivElement | null>(null);

  const actionWidthsRef = useRef<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(actions.length);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const children = Array.from(measureRef.current.children) as HTMLElement[];
    actionWidthsRef.current = children.map((el) =>
      Math.ceil(el.getBoundingClientRect().width),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, ...dependencies]);

  useEffect(() => {
    if (!containerRef.current) return;

    let frameId: number | null = null;

    const measureVisible = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const container = containerRef.current!;
        const leftWidth = leftSectionRef.current?.offsetWidth ?? 0;
        const rightWidth = rightSectionRef.current?.offsetWidth ?? 0;
        const reservedWidth = leftWidth + rightWidth;
        const containerWidth = container.getBoundingClientRect().width;

        const availableWidth =
          containerWidth -
          reservedWidth -
          moreButtonWidth -
          actionsGap * 2 -
          containerPadding * 2;

        const widths = actionWidthsRef.current;
        let total = 0;
        let count = 0;

        if (direction === FlexibleActionsDirection.Reverse) {
          for (let i = widths.length - 1; i >= 0; i--) {
            total += widths[i] + actionsGap;
            if (total > availableWidth) break;
            count++;
          }
        } else {
          for (const width of widths) {
            total += width + actionsGap;
            if (total > availableWidth) break;
            count++;
          }
        }

        setVisibleCount(count);
      });
    };

    const resizeObserver = new ResizeObserver(measureVisible);
    resizeObserver.observe(containerRef.current);
    measureVisible();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions.length, direction, ...dependencies]);

  const hiddenActions =
    direction === FlexibleActionsDirection.Reverse
      ? actions.slice(0, actions.length - visibleCount)
      : actions.slice(visibleCount);

  const visibleActions =
    direction === FlexibleActionsDirection.Reverse
      ? actions.slice(actions.length - visibleCount)
      : actions.slice(0, visibleCount);

  return {
    visibleActions,
    hiddenActions,
    refs: {
      containerRef,
      measureRef,
      leftSectionRef,
      rightSectionRef,
    },
  };
}
