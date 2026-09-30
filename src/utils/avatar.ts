/** A background and text colour pair for an initials avatar, as Tailwind classes. */
export interface AvatarColorClasses {
  /** Background class, bound to a `--bg-visual-*` token. */
  background: string;
  /** Text class, bound to the matching `--text-visual-*` token. */
  foreground: string;
}

/*
 * One pair per visual background token, each with the text token designed to
 * sit on it, so the avatar follows the active theme. Written out as literal
 * class names so Tailwind's content scan keeps every one of them.
 */
export const AVATAR_PALETTE: readonly AvatarColorClasses[] = [
  { background: 'bg-green-1', foreground: 'text-green-2' },
  { background: 'bg-violet-2', foreground: 'text-violet-1' },
  { background: 'bg-brown', foreground: 'text-brown-2' },
  { background: 'bg-red', foreground: 'text-red' },
  { background: 'bg-green-2', foreground: 'text-green-3' },
  { background: 'bg-blue', foreground: 'text-accent' },
  { background: 'bg-violet-1', foreground: 'text-violet-2' },
];

/** Returns the palette entry for a name; the same name always gets the same colours. */
export const pickAvatarColor = (name: string): AvatarColorClasses => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
};

const firstLetter = (word: string): string => word.match(/\p{L}/u)?.[0] ?? '';

/** Returns 1–2 uppercase initials derived from a display name, or `'?'` when it has no letters. */
export const extractInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';

  if (words.length >= 2) {
    const initials = (
      firstLetter(words[0]) + firstLetter(words[1])
    ).toUpperCase();
    return initials || '?';
  }

  const letters = words[0].replace(/[^\p{L}]/gu, '');
  return letters.slice(0, 2).toUpperCase() || '?';
};
