import {
  type CSSProperties,
  type FC,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  SkeletonVariant,
  SkeletonAvatarSize,
  SkeletonAvatarShape,
} from '@/types/skeleton';
import { getAvatarSize } from './utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  paragraph?: boolean | { rows?: number; width?: string | string[] };
  avatar?:
    | boolean
    | {
        size?: number | SkeletonAvatarSize;
        shape?: SkeletonAvatarShape;
      };
  showTitle?: boolean | { width?: string };
  loading?: boolean;
  children?: ReactNode;
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  overlay?: ReactNode;
  color?: string;
}

/**
 * Skeleton
 * aliases: PlaceholderUI|ShimmerLoader
 * Design system 2.0
 *
 * A placeholder component to show while content is loading.
 * Provides various skeleton shapes and configurations.
 *
 * @example
 * ```tsx
 * // Simple skeleton
 * <Skeleton />
 *
 * // Text skeleton with custom size
 * <Skeleton variant={SkeletonVariant.Text} width="200px" height="20px" />
 *
 * // Circular avatar skeleton
 * <Skeleton variant={SkeletonVariant.Circular} width={40} height={40} />
 *
 * // Complex skeleton with avatar, showTitle and paragraph
 * <Skeleton
 *   avatar
 *   showTitle
 *   paragraph={{ rows: 3 }}
 *   active
 * />
 *
 * // Conditional loading
 * <Skeleton loading={isLoading}>
 *   <div>Your content here</div>
 * </Skeleton>
 *
 * // Custom paragraph widths
 * <Skeleton
 *   paragraph={{ rows: 3, width: ['100%', '80%', '60%'] }}
 * />
 *
 * // Avatar with size and shape
 * <Skeleton
 *   avatar={{
 *     size: SkeletonAvatarSize.Large,
 *     shape: SkeletonAvatarShape.Square
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
 * @param [variant=SkeletonVariant.Default] - Skeleton variant
 * @param [width] - Width of the skeleton
 * @param [height] - Height of the skeleton
 * @param [className] - Additional CSS classes
 * @param [overlay] - Content to overlay on top of the skeleton (e.g., a spinner)
 * @param [color] - Custom background color for the skeleton elements (overrides the default token)
 */
export const Skeleton: FC<SkeletonProps> = ({
  active = true,
  paragraph = true,
  avatar = false,
  showTitle = true,
  loading = true,
  children,
  variant = SkeletonVariant.Default,
  width,
  height,
  overlay,
  color,
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

  if (variant !== SkeletonVariant.Default) {
    const variantClass = mergeClasses(
      baseClass,
      variant === SkeletonVariant.Circular && 'rounded-full',
      variant === SkeletonVariant.Rectangular && 'rounded',
      variant === SkeletonVariant.Text && 'rounded',
      !!overlay && 'relative',
    );

    const style: CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height)
      style.height = typeof height === 'number' ? `${height}px` : height;
    if (color) style.backgroundColor = color;

    return (
      <div className={variantClass} style={style} {...props}>
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {overlay}
          </div>
        )}
      </div>
    );
  }

  const showAvatar = !!avatar;
  const displayTitle = !!showTitle;
  const showParagraph = !!paragraph;

  const avatarConfig = typeof avatar === 'object' ? avatar : {};
  const titleConfig = typeof showTitle === 'object' ? showTitle : {};
  const paragraphConfig = typeof paragraph === 'object' ? paragraph : {};

  const avatarSize = getAvatarSize(avatarConfig.size);
  const avatarShape = avatarConfig.shape ?? SkeletonAvatarShape.Circle;
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
    <div
      {...props}
      className={mergeClasses('flex gap-4', !!overlay && 'relative', className)}
    >
      {showAvatar && (
        <div
          className={mergeClasses(
            baseClass,
            avatarShape === SkeletonAvatarShape.Circle
              ? 'rounded-full'
              : 'rounded',
            'flex-shrink-0',
          )}
          style={{
            width: avatarSize,
            height: avatarSize,
            ...(color && { backgroundColor: color }),
          }}
        />
      )}
      <div className="flex-1 flex flex-col gap-3">
        {displayTitle && (
          <div
            className={mergeClasses(baseClass, 'h-4 rounded')}
            style={{
              width: titleWidth,
              ...(color && { backgroundColor: color }),
            }}
          />
        )}
        {showParagraph && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: paragraphRows }).map((_, index) => (
              <div
                key={index}
                className={mergeClasses(baseClass, 'h-4 rounded')}
                style={{
                  width: getParagraphWidth(index),
                  ...(color && { backgroundColor: color }),
                }}
              />
            ))}
          </div>
        )}
      </div>
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {overlay}
        </div>
      )}
    </div>
  );
};
