import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialFoldersTree } from './FoldersTree';
import { DialFileNodeType } from '@/models/file';

const mockFolders = [
  {
    name: 'Root',
    path: '/root',
    nodeType: DialFileNodeType.FOLDER,
    folderId: '1',
    items: [
      {
        name: 'Subfolder',
        path: '/root/Subfolder',
        nodeType: DialFileNodeType.FOLDER,
        folderId: '2',
        items: [
          {
            name: 'File.txt',
            path: '/root/Subfolder/File.txt',
            nodeType: DialFileNodeType.ITEM,
            folderId: '3',
          },
        ],
      },
    ],
  },
];

const getMenu = vi.fn(() => [
  { key: 'copy', label: 'Copy', icon: <span data-testid="icon-copy" /> },
]);

describe('Dial UI Kit :: DialFoldersTree', () => {
  test('renders folders', () => {
    render(
      <DialFoldersTree folders={mockFolders} getContextMenuItems={getMenu} />,
    );
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.queryByText('Subfolder')).not.toBeInTheDocument();
  });

  test('expands folder on click', () => {
    const onToggleFolder = vi.fn();
    render(
      <DialFoldersTree
        folders={mockFolders}
        onToggleFolder={onToggleFolder}
        getContextMenuItems={getMenu}
      />,
    );
    fireEvent.click(screen.getByText('Root'));
    expect(onToggleFolder).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Root' }),
    );
  });

  test('shows subfolders when expanded', () => {
    render(
      <DialFoldersTree
        folders={mockFolders}
        expandedFolders={new Set(['/root'])}
        getContextMenuItems={getMenu}
      />,
    );
    expect(screen.getByText('Subfolder')).toBeInTheDocument();
  });

  test('shows files when showFiles is true', () => {
    render(
      <DialFoldersTree
        folders={mockFolders}
        expandedFolders={new Set(['/root', '/root/Subfolder'])}
        showFiles
        getContextMenuItems={getMenu}
      />,
    );
    expect(screen.getByText('File.txt')).toBeInTheDocument();
  });

  test('does not show files when showFiles is false', () => {
    render(
      <DialFoldersTree
        folders={mockFolders}
        expandedFolders={new Set(['/root', '/root/Subfolder'])}
        showFiles={false}
        getContextMenuItems={getMenu}
      />,
    );
    expect(screen.queryByText('File.txt')).not.toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(
      <DialFoldersTree
        folders={[]}
        renderEmptyState={<div data-testid="empty">No folders</div>}
      />,
    );
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });

  test('calls getContextMenuItems for each node', () => {
    render(
      <DialFoldersTree
        folders={mockFolders}
        expandedFolders={new Set(['/root'])}
        getContextMenuItems={getMenu}
      />,
    );
    expect(getMenu).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Root' }),
    );
    expect(getMenu).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Subfolder' }),
    );
  });
});
