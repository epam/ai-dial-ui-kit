import { SkeletonAvatarSize } from '@/types/skeleton';

export const getAvatarSize = (size?: number | SkeletonAvatarSize): number => {
  if (typeof size === 'number') return size;
  switch (size) {
    case SkeletonAvatarSize.Small:
      return 32;
    case SkeletonAvatarSize.Large:
      return 64;
    case SkeletonAvatarSize.Default:
    default:
      return 40;
  }
};
