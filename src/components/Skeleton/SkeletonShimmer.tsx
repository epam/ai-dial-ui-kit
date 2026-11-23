import { type FC, type HTMLAttributes, type ReactNode } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { LiveRegion } from '@/components/New/LiveRegion/LiveRegion';

export interface SkeletonShimmerProps extends HTMLAttributes<HTMLDivElement> {
  /** Run the shimmer band. `false` leaves a static skeleton. Defaults to `true`. */
  active?: boolean;
  /**
   * Text announced to assistive technology while loading, e.g. "Loading
   * plugins". Rendered in a live region beside the container, and announced as
   * soon as it mounts — so while the skeleton is still hidden by the timing
   * delay (`placeholderClassName`), pass it only once `showSkeleton` is `true`.
   */
  label?: string;
  /** The skeleton placeholders (`Skeleton` circles and bars). They are `aria-hidden`. */
  children?: ReactNode;
}

/**
 * SkeletonShimmer
 * aliases: SkeletonRegion|ShimmerContainer|LoadingRegion|SkeletonWave
 * Design system 2.0
 *
 * The loading container of a skeleton: one shimmer wave across everything
 * inside it, instead of one pulse per placeholder. Put the skeleton circles and
 * bars (`Skeleton`) inside; call `getEntityDetails("skeleton")` for the full
 * guide.
 *
 * - **One motion source.** The band crosses the whole container, left to right,
 *   1.5 s, linear, infinite, animated with `transform: translateX`. The
 *   per-element pulse of any `Skeleton` inside is switched off, so the two never
 *   run together.
 * - **Reduced motion.** With `prefers-reduced-motion: reduce` the band does not
 *   animate and stays out of view, leaving a static skeleton.
 * - **Accessibility.** The container is `aria-busy="true"` and its content is
 *   `aria-hidden`, so placeholders are neither read nor focusable. `label` is
 *   announced from a live region rendered next to the container, because an
 *   `aria-busy` region does not announce its own changes. `aria-busy` is always
 *   set after your props are spread, so a caller cannot override it.
 *
 * Do not give the container a fixed height. Render it in the same slot as the
 * real content, with placeholders in normal flow that have their own width and
 * height, so it is sized by the layout and nothing moves when the content
 * arrives. Keep headers, inputs and footers outside it so they stay
 * interactive. Pair it with `useSkeletonTiming` for the delay, minimum display
 * time and reveal.
 *
 * @example
 * ```tsx
 * const { showPlaceholder, showSkeleton, placeholderClassName, showContent, contentClassName } =
 *   useSkeletonTiming(isLoading);
 *
 * {showPlaceholder && (
 *   <SkeletonShimmer
 *     label={showSkeleton ? 'Loading plugins' : undefined}
 *     className={`flex flex-col gap-4 ${placeholderClassName}`}
 *   >
 *     <div className="flex gap-3">
 *       <Skeleton variant={SkeletonVariant.Circular} width={24} height={24} />
 *       <Skeleton
 *         variant={SkeletonVariant.Text}
 *         width="70%"
 *         height={20}
 *         className="rounded-xl bg-layer-sunken"
 *       />
 *     </div>
 *   </SkeletonShimmer>
 * )}
 * {showContent && <div className={contentClassName}>{plugins}</div>}
 * ```
 *
 * @param [active=true] - Run the shimmer. When `false` the skeleton is static.
 * @param [label] - Text announced to assistive technology while loading, e.g. "Loading plugins". Pass it only while the skeleton is visible (`showSkeleton`), not during the timing delay.
 * @param [className] - Additional CSS classes for the container (layout only; avoid fixed heights).
 * @param [children] - The skeleton placeholders.
 */
export const SkeletonShimmer: FC<SkeletonShimmerProps> = ({
  active = true,
  label,
  className,
  children,
  ...props
}) => (
  <>
    <div
      {...props}
      aria-busy="true"
      className={mergeClasses(
        'relative overflow-clip',
        '[&_.animate-pulse]:animate-none',
        className,
        DIAL_KIT_CLASS.skeletonShimmer,
      )}
    >
      <div aria-hidden="true" className="contents">
        {children}
      </div>
      {active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[-50%] w-1/2 bg-linear-to-r from-transparent via-white/70 to-transparent motion-safe:animate-skeleton-shimmer"
        />
      )}
    </div>
    {label && <LiveRegion visuallyHidden>{label}</LiveRegion>}
  </>
);
