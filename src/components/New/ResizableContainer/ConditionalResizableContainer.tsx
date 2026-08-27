import type { FC } from 'react';

import {
  ResizableContainer,
  type ResizableContainerProps,
} from './ResizableContainer';

export interface ConditionalResizableContainerProps extends ResizableContainerProps {
  /** Whether resizing is enabled. Defaults to `true`. */
  enabled?: boolean;
}

/**
 * Renders its children inside a {@link ResizableContainer} only while `enabled`.
 * aliases: OptionalResize|ConditionalPanel
 * Design system 2.0
 *
 * When `enabled` is false the children are rendered on their own, with no
 * wrapper element and no resize behaviour — useful for a panel that is only
 * resizable while it is expanded. Every other prop is passed straight through;
 * see {@link ResizableContainer} for controlled and uncontrolled sizing, sides
 * and callbacks.
 *
 * @example
 * ```tsx
 * <ConditionalResizableContainer
 *   enabled={isExpanded}
 *   minWidth={180}
 *   maxWidth={520}
 *   defaultWidth={260}
 * >
 *   <Sidebar />
 * </ConditionalResizableContainer>
 * ```
 *
 * @param [enabled=true] - Whether resizing is enabled.
 * @param children - Content to render inside the container.
 * @see ResizableContainer
 */
export const ConditionalResizableContainer: FC<
  ConditionalResizableContainerProps
> = ({ enabled = true, children, ...rest }) => {
  if (!enabled) {
    return children;
  }

  return <ResizableContainer {...rest}>{children}</ResizableContainer>;
};
