import { useState, type FC, type SyntheticEvent } from 'react';

import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { AvatarShape } from '@/types/avatar';
import { extractInitials, pickAvatarColor } from '@/utils/avatar';
import { mergeClasses } from '@/utils/merge-classes';

/** Props for `Avatar`. */
export interface AvatarProps {
  /** Display name the initials and the colour are derived from. */
  name: string;
  /** Initials to show instead of the ones derived from `name`. */
  initials?: string;
  /** Image URL. The initials show instead while it is missing or fails to load. */
  src?: string;
  /** Accessible name. Leave it empty when a visible label beside the avatar already names it. */
  alt?: string;
  /** Width and height in px. */
  size?: number;
  /** Outline of the avatar. */
  shape?: AvatarShape;
  /** Additional CSS classes for the avatar. */
  className?: string;
  /** Type-scale class for the initials. When set, it replaces the font size derived from `size`. */
  textClassName?: string;
  /** Called when the image fails to load, after the avatar has switched to initials. */
  onImageError?: (event: SyntheticEvent<HTMLImageElement>) => void;
}

const SHAPE_CLASS: Record<AvatarShape, string> = {
  [AvatarShape.Circle]: 'rounded-full',
  [AvatarShape.Square]: 'rounded-md',
};

/**
 * A person's or an entity's picture, or its initials on a colour picked from
 * its name.
 * aliases: UserAvatar|InitialsAvatar|ProfilePicture
 * Design system 2.0
 *
 * The same name always gets the same colour, drawn from the theme's visual
 * tokens, so a list of avatars stays stable between renders and sessions. An
 * image that is missing or fails to load falls back to the initials; a new
 * `src` tries the image again.
 *
 * An avatar with an `alt` is a `role="img"` named by it, whether it shows the
 * image or the initials. Without one it is decorative and hidden from
 * assistive technology, which is right when a visible name sits beside it.
 *
 * @example
 * ```tsx
 * <Avatar name="Ada Lovelace" src={photoUrl} alt="Ada Lovelace" />
 * <Avatar name="Summarizer" shape={AvatarShape.Square} size={36} />
 * ```
 *
 * @param name - Display name the initials and the colour are derived from
 * @param [initials] - Initials to show instead of the ones derived from `name`
 * @param [src] - Image URL; the initials show while it is missing or broken
 * @param [alt=''] - Accessible name; empty makes the avatar decorative
 * @param [size=32] - Width and height in px
 * @param [shape=AvatarShape.Circle] - Outline of the avatar
 * @param [className] - Additional CSS classes for the avatar
 * @param [textClassName] - Type-scale class for the initials, replacing the size-derived font size
 * @param [onImageError] - Called when the image fails to load
 */
export const Avatar: FC<AvatarProps> = ({
  name,
  initials,
  src,
  alt = '',
  size = 32,
  shape = AvatarShape.Circle,
  className,
  textClassName,
  onImageError,
}) => {
  /*
   * Remember which URL failed rather than a boolean, so a new `src` is tried
   * again without an effect to reset the flag.
   */
  const [failedSrc, setFailedSrc] = useState<string>();
  const isImageShown = !!src && failedSrc !== src;
  const isNamed = alt !== '';

  const rootClassName = (colourClassName?: string) =>
    mergeClasses(
      'inline-flex shrink-0 select-none items-center justify-center overflow-hidden',
      SHAPE_CLASS[shape],
      colourClassName,
      className,
      DIAL_KIT_CLASS.avatar,
    );

  if (isImageShown) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={mergeClasses(rootClassName(), 'object-cover')}
        onError={(event) => {
          setFailedSrc(src);
          onImageError?.(event);
        }}
      />
    );
  }

  const { background, foreground } = pickAvatarColor(name);

  return (
    <span
      role={isNamed ? 'img' : undefined}
      aria-label={isNamed ? alt : undefined}
      aria-hidden={isNamed ? undefined : true}
      className={rootClassName(mergeClasses(background, foreground))}
      // Width, height and the default font size all follow `size`, a runtime value.
      style={{
        width: size,
        height: size,
        fontSize: textClassName ? undefined : Math.round(size * 0.4),
      }}
    >
      <span
        className={mergeClasses(
          'leading-none',
          textClassName ?? 'font-semibold',
        )}
      >
        {initials ?? extractInitials(name)}
      </span>
    </span>
  );
};
