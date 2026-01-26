import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

interface CacheEntry {
  promise?: Promise<Blob>;
  file?: Blob;
  timestamp: number;
}

// Cache configuration defaults
const DEFAULT_TTL_MS = 20 * 60 * 1000; // TTL (Time To Live) 20 minutes
const DEFAULT_MAX_ENTRIES = 20; // LRU (Least Recently Used) cap

interface DocumentPreviewCacheContextValue {
  getFile: (url: string, loader: () => Promise<Blob>) => Promise<Blob>;
  clearCache: () => void;
}

const DocumentPreviewCacheContext =
  createContext<DocumentPreviewCacheContextValue | null>(null);

interface DocumentPreviewCacheProviderProps extends PropsWithChildren {
  ttlMs?: number;
  maxEntries?: number;
}

/**
 * This context provider caches document files for previewing, with a TTL and LRU eviction policy.
 * It helps optimize performance by avoiding redundant network requests for duplicate documents between different fields
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

export const useDocumentPreviewCache = () => {
  const ctx = useContext(DocumentPreviewCacheContext);
  if (!ctx) {
    throw new Error(
      'useDocumentPreviewCache must be used within DocumentPreviewCacheProvider',
    );
  }
  return ctx;
};
