import { type FC, type HTMLAttributes } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  DialSkeletonVariant,
  DialSkeletonAvatarSize,
  DialSkeletonAvatarShape,
} from '@/types/skeleton';
import { getAvatarSize } from './utils';

export interface DialSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  paragraph?: boolean | { rows?: number; width?: string | string[] };
  avatar?:
    | boolean
    | {
        size?: number | DialSkeletonAvatarSize;
        shape?: DialSkeletonAvatarShape;
      };
  showTitle?: boolean | { width?: string };
  loading?: boolean;
  children?: React.ReactNode;
  variant?: DialSkeletonVariant;
  width?: string | number;
  height?: string | number;
}

/**
 * DialSkeleton
 *
 * A placeholder component to show while content is loading.
 * Provides various skeleton shapes and configurations.
 *
 * @example
 * ```tsx
 * // Simple skeleton
 * <DialSkeleton />
 *
 * // Text skeleton with custom size
 * <DialSkeleton variant={DialSkeletonVariant.Text} width="200px" height="20px" />
 *
 * // Circular avatar skeleton
 * <DialSkeleton variant={DialSkeletonVariant.Circular} width={40} height={40} />
 *
 * // Complex skeleton with avatar, showTitle and paragraph
 * <DialSkeleton
 *   avatar
 *   showTitle
 *   paragraph={{ rows: 3 }}
 *   active
 * />
 *
 * // Conditional loading
 * <DialSkeleton loading={isLoading}>
 *   <div>Your content here</div>
 * </DialSkeleton>
 *
 * // Custom paragraph widths
 * <DialSkeleton
 *   paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
 * />
 *
 * // Avatar with size and shape
 * <DialSkeleton
 *   avatar={{
 *     size: DialSkeletonAvatarSize.Large,
 *     shape: DialSkeletonAvatarShape.Square
 *   }}
 * />
 * ```
 *
 * @param [active=true] - Whether to show the loading animation
 * @param [paragraph=true] - Show paragraph placeholder or configure its appearance
 * @param [avatar=false] - Show avatar placeholder or configure its appearance
 * @param [showTitle=true] - Show title placeholder or configure its appearance
 * @param [loading=true] - Display the skeleton when true
 * @param [children] - Content to be displayed when loading is false
 * @param [variant=DialSkeletonVariant.Default] - Skeleton variant
 * @param [width] - Width of the skeleton
 * @param [height] - Height of the skeleton
 * @param [className] - Additional CSS classes
 */
export const DialSkeleton: FC<DialSkeletonProps> = ({
  active = true,
  paragraph = true,
  avatar = false,
  showTitle = true,
  loading = true,
  children,
  variant = DialSkeletonVariant.Default,
  width,
  height,
  className,
  ...props
}) => {
  if (!loading && children) {
    return <>{children}</>;
  }

  const baseClass = mergeClasses(
    'bg-layer-3',
    active && 'animate-pulse',
    className,
  );

  if (variant !== DialSkeletonVariant.Default) {
    const variantClass = mergeClasses(
      baseClass,
      variant === DialSkeletonVariant.Circular && 'rounded-full',
      variant === DialSkeletonVariant.Rectangular && 'rounded',
      variant === DialSkeletonVariant.Text && 'rounded',
    );

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height)
      style.height = typeof height === 'number' ? `${height}px` : height;

    return <div className={variantClass} style={style} {...props} />;
  }

  const showAvatar = !!avatar;
  const displayTitle = !!showTitle;
  const showParagraph = !!paragraph;

  const avatarConfig = typeof avatar === 'object' ? avatar : {};
  const titleConfig = typeof showTitle === 'object' ? showTitle : {};
  const paragraphConfig = typeof paragraph === 'object' ? paragraph : {};

  const avatarSize = getAvatarSize(avatarConfig.size);
  const avatarShape = avatarConfig.shape ?? DialSkeletonAvatarShape.Circle;
  const titleWidth = titleConfig.width ?? '38%';
  const paragraphRows = paragraphConfig.rows ?? 3;
  const paragraphWidth = paragraphConfig.width;

  const getParagraphWidth = (index: number): string => {
    if (!paragraphWidth) {
      if (index === paragraphRows - 1) return '61%';
      return '100%';
    }
    if (Array.isArray(paragraphWidth)) {
      return paragraphWidth[index] ?? '100%';
    }
    return paragraphWidth;
  };

  return (
    <div {...props} className={mergeClasses('flex gap-4', className)}>
      {showAvatar && (
        <div
          className={mergeClasses(
            baseClass,
            avatarShape === DialSkeletonAvatarShape.Circle
              ? 'rounded-full'
              : 'rounded',
            'flex-shrink-0',
          )}
          style={{ width: avatarSize, height: avatarSize }}
        />
      )}
      <div className="flex-1 flex flex-col gap-3">
        {displayTitle && (
          <div
            className={mergeClasses(baseClass, 'h-4 rounded')}
            style={{ width: titleWidth }}
          />
        )}
        {showParagraph && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: paragraphRows }).map((_, index) => (
              <div
                key={index}
                className={mergeClasses(baseClass, 'h-4 rounded')}
                style={{ width: getParagraphWidth(index) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
