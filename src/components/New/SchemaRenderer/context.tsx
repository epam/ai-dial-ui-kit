import { createContext, useContext } from 'react';

import type { SchemaRendererContextValue } from './types';

export const SchemaRendererContext =
  createContext<SchemaRendererContextValue | null>(null);

export const useSchemaContext = (): SchemaRendererContextValue => {
  const ctx = useContext(SchemaRendererContext);
  if (!ctx)
    throw new Error('useSchemaContext must be used inside SchemaRenderer');
  return ctx;
};

/**
 * Whether a path, or any path under it, has been touched. Every field counts as
 * touched while `skipUntouched` is off, so errors show from the first render.
 */
export const isPathTouched = (
  path: string,
  touchedPaths: ReadonlySet<string> = new Set(),
  skipUntouched = false,
  includeDescendants = false,
): boolean => {
  if (!skipUntouched || touchedPaths.has(path)) return true;
  if (!includeDescendants) return false;

  const prefix = path + '.';
  return [...touchedPaths].some((p) => p.startsWith(prefix));
};
