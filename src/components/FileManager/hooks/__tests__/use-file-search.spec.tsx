import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileSearch } from '@/components/FileManager/hooks/use-file-search';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

const mockFiles: DialFile[] = [
  {
    id: '1',
    folderId: 'folder1',
    path: '/test/file1.txt',
    name: 'file1.txt',
    nodeType: DialFileNodeType.ITEM,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    folderId: 'folder1',
    path: '/test/file2.svg',
    name: 'file2.svg',
    nodeType: DialFileNodeType.ITEM,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    folderId: 'folder2',
    path: '/test/folder/nested.txt',
    name: 'nested.txt',
    nodeType: DialFileNodeType.ITEM,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    items: [],
  },
];

const mockFolderWithItems: DialFile = {
  id: 'folder1',
  folderId: 'root',
  path: '/test',
  name: 'test',
  nodeType: DialFileNodeType.FOLDER,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  items: mockFiles,
};

describe('Dial UI Kit :: FileManager :: useFileSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state when no search is active', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    expect(result.current.isSearchMode).toBe(false);
    expect(result.current.searchValue).toBe('');
    expect(result.current.effectiveSearchValue).toBe('');
    expect(result.current.searchResultsRows).toEqual([]);
  });

  it('activates search mode when query is provided', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);
    expect(result.current.searchValue).toBe('file');
    expect(result.current.effectiveSearchValue).toBe('file');
  });

  it('performs local search by file name', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('file1');
    });

    expect(result.current.searchResultsRows).toHaveLength(1);
    expect(result.current.searchResultsRows[0].name).toBe('file1.txt');
  });

  it('filters results by partial name match', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.searchResultsRows).toHaveLength(2);
    expect(result.current.searchResultsRows.map((r) => r.name)).toEqual([
      'file1.txt',
      'file2.svg',
    ]);
  });

  it('returns empty array when no matches found', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('nonexistent');
    });

    expect(result.current.searchResultsRows).toEqual([]);
  });

  it('clears search when empty query is provided', () => {
    const clearSearchResults = vi.fn();
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
        clearSearchResults,
      }),
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);

    act(() => {
      result.current.handleSearchChange('');
    });

    expect(result.current.isSearchMode).toBe(false);
    expect(clearSearchResults).toHaveBeenCalled();
  });

  it('calls onSearchFiles only once when external search is configured', () => {
    const onSearchFiles = vi.fn();
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        onSearchFiles,
      }),
    );

    act(() => {
      result.current.handleSearchChange('a');
    });

    expect(onSearchFiles).toHaveBeenCalledTimes(1);
    expect(onSearchFiles).toHaveBeenCalledWith('/test', 'a');

    act(() => {
      result.current.handleSearchChange('ab');
    });

    // Should not call again - filtering happens locally
    expect(onSearchFiles).toHaveBeenCalledTimes(1);
  });

  it('filters external search results locally', () => {
    const onSearchFiles = vi.fn();
    const searchResults = mockFiles;

    const { result, rerender } = renderHook(
      ({ searchResults }) =>
        useFileSearch({
          currentPath: '/test',
          onSearchFiles,
          searchResults,
        }),
      { initialProps: { searchResults: [] as DialFile[] } },
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    // Simulate API response
    rerender({ searchResults });

    expect(result.current.searchResultsRows).toHaveLength(2);

    act(() => {
      result.current.handleSearchChange('file1');
    });

    expect(result.current.searchResultsRows).toHaveLength(1);
    expect(result.current.searchResultsRows[0].name).toBe('file1.txt');
    expect(onSearchFiles).toHaveBeenCalledTimes(1);
  });

  it('syncs with navigationPanelValue when provided', () => {
    const { result, rerender } = renderHook(
      ({ navigationPanelValue }) =>
        useFileSearch({
          currentPath: '/test',
          navigationPanelValue,
          allItems: [mockFolderWithItems],
        }),
      { initialProps: { navigationPanelValue: '' as string | null } },
    );

    expect(result.current.searchValue).toBe('');

    rerender({ navigationPanelValue: 'test' });

    expect(result.current.searchValue).toBe('test');
    expect(result.current.effectiveSearchValue).toBe('test');
  });

  it('calls onNavigationPanelSearchChange when search value changes', () => {
    const onNavigationPanelSearchChange = vi.fn();
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        onNavigationPanelSearchChange,
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('query');
    });

    expect(onNavigationPanelSearchChange).toHaveBeenCalledWith('query');
  });

  it('clears search when path changes', async () => {
    const clearSearchResults = vi.fn();
    const onNavigationPanelSearchChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ currentPath }) =>
        useFileSearch({
          currentPath,
          clearSearchResults,
          onNavigationPanelSearchChange,
          allItems: [mockFolderWithItems],
        }),
      { initialProps: { currentPath: '/test' } },
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);
    expect(result.current.searchValue).toBe('file');

    rerender({ currentPath: '/test/other' });

    await waitFor(() => {
      expect(result.current.isSearchMode).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(result.current.effectiveSearchValue).toBe('');
      expect(clearSearchResults).toHaveBeenCalled();
      expect(onNavigationPanelSearchChange).toHaveBeenCalledWith('');
    });
  });

  it('clears search when path changes with external search', async () => {
    const clearSearchResults = vi.fn();
    const onNavigationPanelSearchChange = vi.fn();
    const onSearchFiles = vi.fn();

    const { result, rerender } = renderHook(
      ({ currentPath }) =>
        useFileSearch({
          currentPath,
          clearSearchResults,
          onNavigationPanelSearchChange,
          onSearchFiles,
        }),
      { initialProps: { currentPath: '/test' } },
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);
    expect(onSearchFiles).toHaveBeenCalledWith('/test', 'file');

    rerender({ currentPath: '/test/other' });

    await waitFor(() => {
      expect(result.current.isSearchMode).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(clearSearchResults).toHaveBeenCalled();
      expect(onNavigationPanelSearchChange).toHaveBeenCalledWith('');
    });
  });

  it('handles handleSearchActivate directly', () => {
    const onSearchFiles = vi.fn();
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        onSearchFiles,
      }),
    );

    act(() => {
      result.current.handleSearchActivate('query');
    });

    expect(onSearchFiles).toHaveBeenCalledWith('/test', 'query');
  });

  it('does not activate search for whitespace-only query', () => {
    const onSearchFiles = vi.fn();
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        onSearchFiles,
      }),
    );

    act(() => {
      result.current.handleSearchActivate('   ');
    });

    expect(onSearchFiles).not.toHaveBeenCalled();
    expect(result.current.isSearchMode).toBe(false);
  });

  it('handles handleSearchClear correctly', () => {
    const clearSearchResults = vi.fn();
    const onNavigationPanelSearchChange = vi.fn();

    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        clearSearchResults,
        onNavigationPanelSearchChange,
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);
    expect(result.current.searchResultsRows.length).toBeGreaterThan(0);

    act(() => {
      result.current.handleSearchClear();
    });

    expect(result.current.searchValue).toBe('');
    expect(result.current.effectiveSearchValue).toBe('');
    expect(result.current.searchResultsRows).toEqual([]);
    expect(clearSearchResults).toHaveBeenCalled();
    expect(onNavigationPanelSearchChange).toHaveBeenCalledWith('');
  });

  it('returns search results when searchInProgress is true', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        searchInProgress: true,
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);
  });

  it('setSearchValue updates internal state', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.setSearchValue('new value');
    });

    expect(result.current.searchValue).toBe('new value');
  });

  it('searches are case-insensitive', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    act(() => {
      result.current.handleSearchChange('FILE1');
    });

    expect(result.current.searchResultsRows).toHaveLength(1);
    expect(result.current.searchResultsRows[0].name).toBe('file1.txt');
  });

  it('collects files from nested folders', () => {
    const nestedStructure: DialFile = {
      id: 'root',
      folderId: '',
      path: '/',
      name: 'root',
      nodeType: DialFileNodeType.FOLDER,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      items: [
        {
          id: 'folder1',
          folderId: 'root',
          path: '/folder1',
          name: 'folder1',
          nodeType: DialFileNodeType.FOLDER,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          items: [
            {
              id: 'nested-file',
              folderId: 'folder1',
              path: '/folder1/nested.txt',
              name: 'nested.txt',
              nodeType: DialFileNodeType.ITEM,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
        },
      ],
    };

    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/',
        allItems: [nestedStructure],
      }),
    );

    act(() => {
      result.current.handleSearchChange('nested');
    });

    expect(result.current.searchResultsRows).toHaveLength(1);
    expect(result.current.searchResultsRows[0].name).toBe('nested.txt');
  });

  it('provides stable API shape', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
        allItems: [mockFolderWithItems],
      }),
    );

    expect(typeof result.current.isSearchMode).toBe('boolean');
    expect(typeof result.current.searchValue).toBe('string');
    expect(typeof result.current.effectiveSearchValue).toBe('string');
    expect(typeof result.current.setSearchValue).toBe('function');
    expect(typeof result.current.handleSearchChange).toBe('function');
    expect(typeof result.current.handleSearchActivate).toBe('function');
    expect(typeof result.current.handleSearchClear).toBe('function');
    expect(Array.isArray(result.current.searchResultsRows)).toBe(true);
  });

  it('works without optional parameters', () => {
    const { result } = renderHook(() =>
      useFileSearch({
        currentPath: '/test',
      }),
    );

    expect(result.current.isSearchMode).toBe(false);
    expect(result.current.searchResultsRows).toEqual([]);

    act(() => {
      result.current.handleSearchChange('query');
    });

    expect(result.current.searchValue).toBe('query');
  });

  it('does not clear search when path stays the same', () => {
    const clearSearchResults = vi.fn();
    const { result, rerender } = renderHook(
      ({ currentPath }) =>
        useFileSearch({
          currentPath,
          clearSearchResults,
          allItems: [mockFolderWithItems],
        }),
      { initialProps: { currentPath: '/test' } },
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);

    // Re-render with same path
    rerender({ currentPath: '/test' });

    expect(result.current.isSearchMode).toBe(true);
    expect(result.current.searchValue).toBe('file');
    expect(clearSearchResults).not.toHaveBeenCalled();
  });

  it('clears search when activeTab changes', async () => {
    const clearSearchResults = vi.fn();
    const onNavigationPanelSearchChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ activeTab }) =>
        useFileSearch({
          currentPath: '/test',
          activeTab,
          clearSearchResults,
          onNavigationPanelSearchChange,
          allItems: [mockFolderWithItems],
        }),
      { initialProps: { activeTab: 'tab1' } },
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);
    expect(result.current.searchValue).toBe('file');

    rerender({ activeTab: 'tab2' });

    await waitFor(() => {
      expect(result.current.isSearchMode).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(result.current.effectiveSearchValue).toBe('');
      expect(clearSearchResults).toHaveBeenCalled();
      expect(onNavigationPanelSearchChange).toHaveBeenCalledWith('');
    });
  });

  it('clears search when both path and activeTab change', async () => {
    const clearSearchResults = vi.fn();
    const onNavigationPanelSearchChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ currentPath, activeTab }) =>
        useFileSearch({
          currentPath,
          activeTab,
          clearSearchResults,
          onNavigationPanelSearchChange,
          allItems: [mockFolderWithItems],
        }),
      { initialProps: { currentPath: '/test', activeTab: 'tab1' } },
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);

    rerender({ currentPath: '/test/other', activeTab: 'tab2' });

    await waitFor(() => {
      expect(result.current.isSearchMode).toBe(false);
      expect(result.current.searchValue).toBe('');
      expect(clearSearchResults).toHaveBeenCalled();
      expect(onNavigationPanelSearchChange).toHaveBeenCalledWith('');
    });
  });

  it('does not clear search when activeTab stays the same', () => {
    const clearSearchResults = vi.fn();
    const { result, rerender } = renderHook(
      ({ activeTab }) =>
        useFileSearch({
          currentPath: '/test',
          activeTab,
          clearSearchResults,
          allItems: [mockFolderWithItems],
        }),
      { initialProps: { activeTab: 'tab1' } },
    );

    act(() => {
      result.current.handleSearchChange('file');
    });

    expect(result.current.isSearchMode).toBe(true);

    rerender({ activeTab: 'tab1' });

    expect(result.current.isSearchMode).toBe(true);
    expect(result.current.searchValue).toBe('file');
    expect(clearSearchResults).not.toHaveBeenCalled();
  });
});
