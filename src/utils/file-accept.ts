/**
 * Tests a file against the value of a native `accept` attribute.
 *
 * The file picker filters by `accept` on its own, but a drop does not: dropping
 * a `.png` onto an input that accepts `.md` hands the file over regardless. Any
 * drop target therefore has to re-check what it received.
 *
 * Supports all three `accept` token forms — an extension (`.md`), a full MIME
 * type (`text/markdown`) and a MIME wildcard (`image/*`). An empty or missing
 * `accept` accepts everything, matching the attribute's own semantics.
 *
 * @param file - The file to test
 * @param accept - Comma-separated `accept` tokens, e.g. `'.md,.zip,image/*'`
 * @returns `true` when the file matches at least one token
 */
export const matchesAccept = (file: File, accept?: string): boolean => {
  const tokens = (accept ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const fileName = file.name.toLowerCase();
  // A file dragged from an archive or with an unknown extension can have an
  // empty `type`, which must not accidentally match a wildcard.
  const mimeType = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith('.')) return fileName.endsWith(token);
    if (token.endsWith('/*')) {
      const group = token.slice(0, -1);
      return mimeType.length > group.length && mimeType.startsWith(group);
    }
    return mimeType === token;
  });
};
