import { createContext, type PropsWithChildren, useContext } from 'react';

export interface DocumentPreviewCacheContextValue {
  getFile: (url: string, loader: () => Promise<Blob>) => Promise<Blob>;
  clearCache: () => void;
}

export const DocumentPreviewCacheContext =
  createContext<DocumentPreviewCacheContextValue | null>(null);

export interface DocumentPreviewCacheProviderProps extends PropsWithChildren {
  ttlMs?: number;
  maxEntries?: number;
}

/**
 * Hook to access document preview cache functionality.
 * Must be used within a DocumentPreviewCacheProvider.
 *
 * @returns Cache context value with getFile and clearCache methods
 * @throws Error if used outside of DocumentPreviewCacheProvider
 *
 * @example
 * ```tsx
 * const { getFile, clearCache } = useDocumentPreviewCache();
 * const file = await getFile(url, () => fetch(url).then(r => r.blob()));
 * ```
 */
export const useDocumentPreviewCache = () => {
  const ctx = useContext(DocumentPreviewCacheContext);
  if (!ctx) {
    throw new Error(
      'useDocumentPreviewCache must be used within DocumentPreviewCacheProvider',
    );
  }
  return ctx;
};
