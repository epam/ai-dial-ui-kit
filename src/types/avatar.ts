/** The outline an `Avatar` is clipped to. */
export enum AvatarShape {
  /** A circle — the avatar of a person. */
  Circle = 'circle',
  /** A rounded square — the avatar of an application, model or other entity. */
  Square = 'square',
}

/*
 * One key per entry of `AVATAR_PALETTE`, named after the entry's background
 * token, so a host picks a colour as `AVATAR_PALETTE[AvatarColor.Violet1]`.
 */
export enum AvatarColor {
  Green1 = 'green-1',
  Violet2 = 'violet-2',
  Brown = 'brown',
  Red = 'red',
  Green2 = 'green-2',
  Blue = 'blue',
  Violet1 = 'violet-1',
}
