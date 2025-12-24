/**
 * Splits a path string into normalized, non-empty segments.
 *
 * Trims whitespace from each segment and removes empty values
 * caused by leading, trailing, or repeated slashes.
 *
 * @param path - A path string (e.g. "Org / Design / Assets/")
 * @returns An array of path segments
 */
export const getSegments = (path: string) =>
  path
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);
