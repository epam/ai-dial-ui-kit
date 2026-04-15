import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import type { DialFile } from '@/models/file';
import { normalizeToLowerCase } from '../utils';

export interface UseFileSearchOptions {
  onSearchFiles?: (folder: string, query: string) => void;
  clearSearchResults?: () => void;
  currentPath?: string;
  searchResults?: DialFile[];
  searchInProgress?: boolean;
  navigationPanelValue?: string | number | null;
  onNavigationPanelSearchChange?: (value: string) => void;
  allItems?: DialFile[];
  activeTab?: string;
}

export interface UseFileSearchReturn {
  isSearchMode: boolean;
  searchValue: string;
  effectiveSearchValue: string;
  setSearchValue: (value: string) => void;
  handleSearchChange: (value?: string) => void;
  handleSearchActivate: (query: string) => void;
  handleSearchClear: () => void;
  searchResultsRows: DialFile[];
}

function collectAllFiles(items: DialFile[]): DialFile[] {
  const result: DialFile[] = [];

  function traverse(nodes: DialFile[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.items) {
        traverse(node.items);
      }
    }
  }

  traverse(items);
  return result;
}

function filterFilesByName(files: DialFile[], query: string): DialFile[] {
  const normalizedQuery = normalizeToLowerCase(query);

  return files.filter((file) => {
    const nameLower = normalizeToLowerCase(file.name);
    return nameLower.includes(normalizedQuery);
  });
}

export function useFileSearch({
  onSearchFiles,
  clearSearchResults,
  currentPath,
  searchResults = [],
  searchInProgress = false,
  navigationPanelValue,
  onNavigationPanelSearchChange,
  allItems = [],
  activeTab,
}: UseFileSearchOptions): UseFileSearchReturn {
  const [searchValue, setSearchValue] = useState<string>('');
  const hasCalledSearchRef = useRef<boolean>(false);
  const isSearchModeRef = useRef<boolean>(false);
  const allFilesCache = useRef<DialFile[]>([]);
  const prevPathRef = useRef<string | undefined>(currentPath);
  const prevActiveTabRef = useRef<string | undefined>(activeTab);

  useEffect(() => {
    if (navigationPanelValue != null) {
      setSearchValue(String(navigationPanelValue));
    }
  }, [navigationPanelValue]);

  const effectiveSearchValue = String(
    navigationPanelValue ?? searchValue ?? '',
  ).trim();

  const isSearchMode =
    isSearchModeRef.current &&
    (searchInProgress ||
      searchResults.length > 0 ||
      effectiveSearchValue !== '');

  const handleSearchActivate = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        isSearchModeRef.current = false;
        hasCalledSearchRef.current = false;
        return;
      }

      isSearchModeRef.current = true;

      // Call external search only once to get all files
      if (onSearchFiles && currentPath && !hasCalledSearchRef.current) {
        hasCalledSearchRef.current = true;
        onSearchFiles(currentPath, trimmedQuery);
      }
    },
    [onSearchFiles, currentPath],
  );

  const handleSearchClear = useCallback(() => {
    hasCalledSearchRef.current = false;
    isSearchModeRef.current = false;
    allFilesCache.current = [];
    setSearchValue('');
    onNavigationPanelSearchChange?.('');
    clearSearchResults?.();
  }, [clearSearchResults, onNavigationPanelSearchChange]);

  const handleSearchChange = useCallback(
    (value?: string) => {
      const next = String(value ?? '');
      setSearchValue(next);
      onNavigationPanelSearchChange?.(next);

      if (next.trim()) {
        handleSearchActivate(next);
      } else {
        handleSearchClear();
      }
    },
    [onNavigationPanelSearchChange, handleSearchActivate, handleSearchClear],
  );

  useEffect(() => {
    if (
      prevPathRef.current !== currentPath ||
      prevActiveTabRef.current !== activeTab
    ) {
      prevPathRef.current = currentPath;
      prevActiveTabRef.current = activeTab;

      // Always clear search when path or tab changes, regardless of search mode state
      hasCalledSearchRef.current = false;
      isSearchModeRef.current = false;
      allFilesCache.current = [];
      setSearchValue('');
      onNavigationPanelSearchChange?.('');
      clearSearchResults?.();
    }
  }, [
    currentPath,
    activeTab,
    onNavigationPanelSearchChange,
    clearSearchResults,
  ]);

  // Cache all files when search results arrive, and update when search is not in progress
  useEffect(() => {
    if (!searchInProgress) {
      allFilesCache.current = searchResults;
    }
  }, [searchResults, searchInProgress]);

  const filteredSearchResults = useMemo(() => {
    if (onSearchFiles) {
      const filesToFilter = searchInProgress
        ? allFilesCache.current
        : searchResults;

      if (!effectiveSearchValue || filesToFilter.length === 0) {
        return filesToFilter;
      }

      return filterFilesByName(filesToFilter, effectiveSearchValue);
    }

    if (!effectiveSearchValue || !allItems.length) {
      return [];
    }

    const allFiles = collectAllFiles(allItems);
    return filterFilesByName(allFiles, effectiveSearchValue);
  }, [
    onSearchFiles,
    searchResults,
    searchInProgress,
    effectiveSearchValue,
    allItems,
  ]);

  return {
    isSearchMode,
    searchValue,
    effectiveSearchValue,
    setSearchValue,
    handleSearchChange,
    handleSearchActivate,
    handleSearchClear,
    searchResultsRows: filteredSearchResults,
  };
}
