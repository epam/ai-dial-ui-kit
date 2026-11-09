import { mergeClasses } from '@/utils/merge-classes';
import type { FC, Ref } from 'react';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';

export interface SpinnerProps {
  size?: number;
  className?: string;
  fullWidth?: boolean;
  /**
   * Covers the whole viewport: a fixed overlay on the page background, above
   * the page and at the kit's popup layer, with the ring centred. For an app's
   * loading screen; it replaces the `fullWidth` + `h-screen` wrappers hosts
   * wrote themselves.
   */
  fullScreen?: boolean;
  ariaLabel?: string;
  /**
   * Makes the ring focusable (`tabIndex={-1}`) and points this ref at it, so
   * a host can move focus to the loading state after a retry removes the
   * focused control. The ring, not the overlay, takes focus, so the host's
   * focus outline stays on screen.
   */
  focusRef?: Ref<HTMLDivElement>;
}

/**
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <Spinner fullScreen size={48} ariaLabel="Checking your session…" />
 * ```
 *
 * @param [size] - Ring diameter in px.
 * @param [className] - Additional container classes.
 * @param [fullWidth] - Stretches the container to its parent's width and height.
 * @param [fullScreen] - Covers the whole viewport with the ring centred.
 * @param [ariaLabel] - Accessible label for screen readers.
 * @param [focusRef] - Makes the ring focusable and points this ref at it.
 */
export const Spinner: FC<SpinnerProps> = ({
  size = 40,
  className,
  fullWidth = false,
  fullScreen = false,
  ariaLabel = 'Loading',
  focusRef,
}) => {
  return (
    <div
      role="status"
      className={mergeClasses(
        'flex items-center justify-center',
        { 'size-full': fullWidth },
        { 'fixed inset-0 z-popup bg-layer-base': fullScreen },
        className,
        DIAL_KIT_CLASS.spinner,
      )}
    >
      <div
        ref={focusRef}
        tabIndex={focusRef ? -1 : undefined}
        role="img"
        aria-label={ariaLabel}
        style={{ width: size, height: size }}
        className="rounded-full border-2 border-secondary border-t-accent animate-spin-steps shrink-0"
      />
    </div>
  );
};
