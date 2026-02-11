import { type FC, useCallback, useEffect, useRef } from 'react';
import {
  DocumentPreviewCacheContext,
  type DocumentPreviewCacheProviderProps,
} from './DocumentPreviewCacheContext';
import { DEFAULT_MAX_ENTRIES, DEFAULT_TTL_MS } from './pdf-viewer.contants';

interface CacheEntry {
  promise?: Promise<Blob>;
  file?: Blob;
  timestamp: number;
}

/**
 * DocumentPreviewCacheProvider caches document files for previewing with TTL and LRU eviction policy.
 *
 * This provider optimizes performance by:
 * - Avoiding redundant network requests for duplicate documents
 * - Managing memory with configurable TTL (Time To Live)
 * - Implementing LRU (Least Recently Used) eviction when cache limit is reached
 *
 * @param children - Child components that will have access to the cache context
 * @param [ttlMs=1200000] - Time-to-live in milliseconds for cached entries (default: 20 minutes)
 * @param [maxEntries=20] - Maximum number of cached entries before LRU eviction
 *
 * @example
 * ```tsx
 * <DocumentPreviewCacheProvider ttlMs={30 * 60 * 1000} maxEntries={50}>
 *   <DialDocumentPreview {...props} />
 * </DocumentPreviewCacheProvider>
 * ```
 */
export const DocumentPreviewCacheProvider: FC<
  DocumentPreviewCacheProviderProps
> = ({
  children,
  ttlMs = DEFAULT_TTL_MS,
  maxEntries = DEFAULT_MAX_ENTRIES,
}) => {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  // Touch updates the timestamp of a cache entry to mark it as recently used
  const touch = useCallback((url: string, entry: CacheEntry) => {
    cacheRef.current.delete(url);
    cacheRef.current.set(url, entry);
  }, []);

  // PurgeExpired removes entries that have exceeded their TTL
  const purgeExpired = useCallback(() => {
    const now = Date.now();
    for (const [url, entry] of cacheRef.current.entries()) {
      if (entry.file && now - entry.timestamp > ttlMs) {
        cacheRef.current.delete(url);
      }
    }
  }, [ttlMs]);

  // EvictLRU removes the least recently used entries when the cache exceeds MAX_ENTRIES
  const evictLRU = useCallback(() => {
    while (cacheRef.current.size > maxEntries) {
      const oldestKey = cacheRef.current.keys().next().value;
      if (oldestKey) cacheRef.current.delete(oldestKey);
    }
  }, [maxEntries]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const getFile = useCallback(
    async (url: string, loader: () => Promise<Blob>) => {
      purgeExpired();

      const cached = cacheRef.current.get(url);
      if (cached) {
        touch(url, { ...cached, timestamp: Date.now() });
        if (cached.file) {
          return cached.file;
        }
        if (cached.promise) {
          return cached.promise;
        }
      }

      const timestamp = Date.now();
      const promise = loader()
        .then((file) => {
          const entry: CacheEntry = { file, timestamp: Date.now() };
          touch(url, entry);
          evictLRU();
          return file;
        })
        .catch((err) => {
          cacheRef.current.delete(url);
          throw err;
        });

      const entry: CacheEntry = { promise, timestamp };
      touch(url, entry);
      evictLRU();
      return promise;
    },
    [evictLRU, purgeExpired, touch],
  );

  // Ensure cache is cleared when provider is destroyed
  useEffect(() => () => clearCache(), [clearCache]);

  return (
    <DocumentPreviewCacheContext.Provider value={{ getFile, clearCache }}>
      {children}
    </DocumentPreviewCacheContext.Provider>
  );
};
