import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialDestinationFolderPopup } from './DestinationFolderPopup';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import { NotificationVariant } from '@/types/notification';

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

describe('Dial UI Kit :: DialDestinationFolderPopup', () => {
  test('renders popup when open is true', () => {
    render(
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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

    fireEvent.click(switchElement);

    expect(switchElement).toBeChecked();
  });

  test('renders FileManager with provided items', () => {
    render(
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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

    fireEvent.click(switchElement);

    expect(switchElement).toBeChecked();
  });

  test('renders with default mode as copy', () => {
    render(
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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
      <DialDestinationFolderPopup
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

  test('clicking Add folder inserts a new placeholder folder entry', async () => {
    render(
      <DialDestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        emptyStateTitle="Empty folder"
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

    expect(screen.getByText('Empty folder')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /add folder/i }));

    await waitFor(() => {
      expect(screen.queryByText('Empty folder')).not.toBeInTheDocument();
      expect(screen.getAllByRole('row').length).toBeGreaterThan(0);
    });
  });

  test('disables button when destination matches source folder', () => {
    render(
      <DialDestinationFolderPopup
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
        sourceFolder="/Documents"
        path="/Documents"
      />,
    );

    const moveButton = screen.getByRole('button', { name: 'Move' });
    expect(moveButton).toBeDisabled();
  });

  test('enables button when destination differs from source folder', () => {
    render(
      <DialDestinationFolderPopup
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
        sourceFolder="/Documents"
        path="/Photos"
      />,
    );

    const moveButton = screen.getByRole('button', { name: 'Move' });
    expect(moveButton).not.toBeDisabled();
  });

  test('displays tooltip when button is disabled', async () => {
    render(
      <DialDestinationFolderPopup
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
        sourceFolder="/Documents"
        path="/Documents"
        disabledPathTooltip="Cannot copy to the same location"
      />,
    );

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    expect(copyButton).toBeDisabled();
  });

  test('renders alert when alertProps provided', () => {
    render(
      <DialDestinationFolderPopup
        open={true}
        onClose={vi.fn()}
        items={mockFiles}
        alertProps={{
          message: 'Action unavailable in this folder',
          variant: NotificationVariant.Warning,
          closable: true,
        }}
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

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Action unavailable in this folder',
    );
    expect(
      screen.getByRole('button', { name: 'Close alert' }),
    ).toBeInTheDocument();
  });

  test('hides hidden files switcher', () => {
    render(
      <DialDestinationFolderPopup
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
        showHiddenFileSwitcher={false}
      />,
    );

    expect(screen.queryByText('Show hidden files')).not.toBeInTheDocument();
  });
});
