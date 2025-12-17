import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DestinationFolderPopup } from './DestinationFolderPopup';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

const mockFiles: DialFile[] = [
  {
    id: '1',
    name: 'Documents',
    path: '/Documents',
    folderId: 'folder-1',
    nodeType: DialFileNodeType.FOLDER,
    parentPath: '/',
  },
  {
    id: '2',
    name: 'Photos',
    path: '/Photos',
    folderId: 'folder-2',
    nodeType: DialFileNodeType.FOLDER,
    parentPath: '/',
  },
];

describe('Dial UI Kit :: DestinationFolderPopup', () => {
  test('renders popup when open is true', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('does not render popup when open is false', () => {
    render(
      <DestinationFolderPopup
        open={false}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('displays Copy button label in copy mode', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="copy"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  test('displays Move button label in move mode', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="move"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Move' })).toBeInTheDocument();
  });

  test('displays custom copy label', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="copy"
        copyLabel="Copy Here"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Copy Here' }),
    ).toBeInTheDocument();
  });

  test('displays custom move label', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="move"
        moveLabel="Move Here"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Move Here' }),
    ).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <DestinationFolderPopup
        open={true}
        onClose={onClose}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        mode="copy"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('renders Add folder button', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Add folder' }),
    ).toBeInTheDocument();
  });

  test('renders hidden files switch with default label', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Show hidden files')).toBeInTheDocument();
  });

  test('renders hidden files switch with custom label', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        hiddenFilesSwitcherLabel="Display hidden items"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Display hidden items')).toBeInTheDocument();
  });

  test('toggles hidden files visibility when switch is clicked', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();

    const switchContainer = switchElement.closest('.inline-flex');
    if (switchContainer) {
      fireEvent.click(switchContainer);
    }

    expect(switchElement).toBeChecked();
  });

  test('renders FileManager with provided items', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Photos')).toBeInTheDocument();
  });

  test('passes showHiddenFiles prop to FileManager', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();

    const switchContainer = switchElement.closest('.inline-flex');
    if (switchContainer) {
      fireEvent.click(switchContainer);
    }

    expect(switchElement).toBeChecked();
  });

  test('renders with default mode as copy', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  test('renders custom copy header when getCopyHeader is provided', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="copy"
        header="Copying 2 items"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Copying 2 items')).toBeInTheDocument();
  });

  test('renders custom move header when getMoveHeader is provided', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="move"
        header="Moving 2 items: Documents"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Moving 2 items: Documents')).toBeInTheDocument();
  });

  test('renders default copy header when getCopyHeader is not provided', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="copy"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Copy to')).toBeInTheDocument();
  });

  test('renders default move header when getMoveHeader is not provided', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        mode="move"
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Move to')).toBeInTheDocument();
  });

  test('collapses tree and expands root path by default', () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  test('clicking Add folder inserts a new placeholder row in the FileManager grid', async () => {
    render(
      <DestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        rootItem={{
          id: 'root',
          name: 'Root',
          path: '/',
          folderId: 'root-folder',
          nodeType: DialFileNodeType.FOLDER,
          label: 'Root',
        }}
      />,
    );

    const rowsBefore = await screen.findAllByRole('row');
    fireEvent.click(screen.getByRole('button', { name: 'Add folder' }));

    await waitFor(() => {
      const rowsAfter = screen.getAllByRole('row');
      expect(rowsAfter.length).toBe(rowsBefore.length + 1);
    });
  });
});
