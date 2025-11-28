import {
  DialHorizontalResizableContainer,
  type DialHorizontalResizableContainerProps,
} from './HorizontalResizableContainer';

export interface DialConditionalHorizontalResizableContainerProps
  extends DialHorizontalResizableContainerProps {
  enabled?: boolean;
}

/**
 * DialConditionalHorizontalResizableContainer — A conditional wrapper around `DialHorizontalResizableContainer`.
 *
 * This component renders its children inside a resizable container only when `enabled` is true.
 * When `enabled` is false, children are rendered directly without any resizable behavior.
 *
 * All other props are the same as `DialHorizontalResizableContainer`. See the documentation for
 * `DialHorizontalResizableContainer` for full details on usage, controlled/uncontrolled modes, sides, and callbacks.
 *
 * @example
 * ```tsx
 * <DialConditionalHorizontalResizableContainer
 *   enabled={!isCollapsed}
 *   defaultWidth={260}
 *   minWidth={180}
 *   maxWidth={520}
 *   onResize={(w) => console.log('Current width:', w)}
 *   onResizeStop={(w) => setSidebarWidth(w)}
 * >
 *   <Sidebar />
 * </DialConditionalHorizontalResizableContainer>
 * ```
 *
 * @param enabled - Whether resizing is enabled. When false, children are rendered directly.
 * @param children - Content to render inside the container.
 * @see DialHorizontalResizableContainer
 */
export const DialConditionalHorizontalResizableContainer = ({
  enabled = true,
  children,
  ...rest
}: DialConditionalHorizontalResizableContainerProps) => {
  if (!enabled) {
    return children;
  }

  return (
    <DialHorizontalResizableContainer {...rest}>
      {children}
    </DialHorizontalResizableContainer>
  );
};
