import type { FC } from 'react';
import {
  DialResizableContainer,
  type DialResizableContainerProps,
} from './ResizableContainer';

export interface DialConditionalResizableContainerProps extends DialResizableContainerProps {
  enabled?: boolean;
}

/**
 * DialConditionalResizableContainer — A conditional wrapper around `DialResizableContainer`.
 * aliases: OptionalResize|ConditionalPanel
 * Design system 1.0
 *
 * This component renders its children inside a resizable container only when `enabled` is true.
 * When `enabled` is false, children are rendered directly without any resizable behavior.
 *
 * All other props are the same as `DialResizableContainer`. See the documentation for
 * `DialResizableContainer` for full details on usage, controlled/uncontrolled modes, sides, and callbacks.
 *
 * @example
 * ```tsx
 * <DialConditionalResizableContainer
 *   enabled={!isCollapsed}
 *   defaultWidth={260}
 *   minWidth={180}
 *   maxWidth={520}
 *   onResize={(w) => console.log('Current width:', w)}
 *   onResizeStop={(w) => setSidebarWidth(w)}
 * >
 *   <Sidebar />
 * </DialConditionalResizableContainer>
 * ```
 *
 * @param enabled - Whether resizing is enabled. When false, children are rendered directly.
 * @param children - Content to render inside the container.
 * @see DialResizableContainer
 */
export const DialConditionalResizableContainer: FC<
  DialConditionalResizableContainerProps
> = ({ enabled = true, children, ...rest }) => {
  if (!enabled) {
    return children;
  }

  return <DialResizableContainer {...rest}>{children}</DialResizableContainer>;
};
