import { DialSkeletonAvatarSize } from '@/types/skeleton';

export const getAvatarSize = (
  size?: number | DialSkeletonAvatarSize,
): number => {
  if (typeof size === 'number') return size;
  switch (size) {
    case DialSkeletonAvatarSize.Small:
      return 32;
    case DialSkeletonAvatarSize.Large:
      return 64;
    case DialSkeletonAvatarSize.Default:
    default:
      return 40;
  }
};
