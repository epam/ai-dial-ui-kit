import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialFoldersTree } from './FoldersTree';
import { DialFileNodeType } from '@/models/file';

const mockItems = [
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
  { key: 'copy', label: 'Copy', icon: <span>copy-icon</span> },
]);

describe('Dial UI Kit :: DialFoldersTree', () => {
  test('renders folders', () => {
    render(<DialFoldersTree items={mockItems} getContextMenuItems={getMenu} />);
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.queryByText('Subfolder')).not.toBeInTheDocument();
  });

  test('expands folder on click', () => {
    const onToggleFolder = vi.fn();
    render(
      <DialFoldersTree
        items={mockItems}
        onItemClick={onToggleFolder}
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
        items={mockItems}
        expandedPaths={new Set(['/root'])}
        getContextMenuItems={getMenu}
      />,
    );
    expect(screen.getByText('Subfolder')).toBeInTheDocument();
  });

  test('shows files when showFiles is true', () => {
    render(
      <DialFoldersTree
        items={mockItems}
        expandedPaths={new Set(['/root', '/root/Subfolder'])}
        showFiles
        getContextMenuItems={getMenu}
      />,
    );
    expect(screen.getByText('File.txt')).toBeInTheDocument();
  });

  test('does not show files when showFiles is false', () => {
    render(
      <DialFoldersTree
        items={mockItems}
        expandedPaths={new Set(['/root', '/root/Subfolder'])}
        showFiles={false}
        getContextMenuItems={getMenu}
      />,
    );
    expect(screen.queryByText('File.txt')).not.toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(<DialFoldersTree items={[]} emptyStateTitle="No folders" />);
    expect(screen.getByText('No folders')).toBeInTheDocument();
  });

  test('calls getContextMenuItems for each node', () => {
    render(
      <DialFoldersTree
        items={mockItems}
        expandedPaths={new Set(['/root'])}
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

  test('renders root item with custom label when rootItemLabel is provided', () => {
    render(
      <DialFoldersTree
        items={mockItems}
        rootItemPath="/root"
        rootItemLabel="Custom Root Label"
        expandedPaths={new Set(['/root'])}
      />,
    );

    expect(screen.getByText('Custom Root Label')).toBeInTheDocument();

    expect(screen.queryByText('Root')).not.toBeInTheDocument();
  });

  test('renders shared icon for folders included in sharedByMePaths', () => {
    const sharedPaths = new Set(['/root/Subfolder']);

    render(
      <DialFoldersTree
        items={mockItems}
        expandedPaths={new Set(['/root', '/root/Subfolder'])}
        sharedByMePaths={sharedPaths}
        getContextMenuItems={getMenu}
      />,
    );

    expect(screen.getByText('Subfolder')).toBeInTheDocument();

    const sharedIcon = screen.getByRole('img', { name: 'Shared entity' });
    expect(sharedIcon).toBeInTheDocument();
  });

  test('does not render shared icon when folder is not shared', () => {
    render(
      <DialFoldersTree
        items={mockItems}
        expandedPaths={new Set(['/root', '/root/Subfolder'])}
        sharedByMePaths={new Set()}
        getContextMenuItems={getMenu}
      />,
    );

    expect(
      screen.queryByRole('img', { name: 'Shared entity' }),
    ).not.toBeInTheDocument();
  });
});
