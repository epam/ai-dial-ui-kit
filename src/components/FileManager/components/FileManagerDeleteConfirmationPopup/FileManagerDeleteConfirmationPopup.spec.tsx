import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileManagerDeleteConfirmationPopup } from './FileManagerDeleteConfirmationPopup';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

describe('Dial UI Kit :: FileManagerDeleteConfirmationPopup', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  const singleFile: DialFile = {
    id: '1',
    name: 'test.pdf',
    path: '/folder/test.pdf',
    nodeType: DialFileNodeType.ITEM,
    contentLength: 1024,
    updatedAt: '2024-01-15T10:30:00Z',
    author: 'User',
    folderId: 'folder',
  };

  const multipleFiles: DialFile[] = [
    {
      id: '1',
      name: 'file1.txt',
      path: '/folder/file1.txt',
      nodeType: DialFileNodeType.ITEM,
      contentLength: 512,
      updatedAt: '2024-01-15T10:30:00Z',
      author: 'User',
      folderId: 'folder',
    },
    {
      id: '2',
      name: 'file2.pdf',
      path: '/folder/file2.pdf',
      nodeType: DialFileNodeType.ITEM,
      contentLength: 1024,
      updatedAt: '2024-01-14T14:20:00Z',
      author: 'User',
      folderId: 'folder',
    },
    {
      id: '3',
      name: 'file3.docx',
      path: '/folder/file3.docx',
      nodeType: DialFileNodeType.ITEM,
      contentLength: 2048,
      updatedAt: '2024-01-13T09:15:00Z',
      author: 'User',
      folderId: 'folder',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when open is false', () => {
    const { container } = render(
      <FileManagerDeleteConfirmationPopup
        open={false}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders popup when open is true', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('Confirm Deleting Items')).toBeInTheDocument();
  });

  it('displays single file name in message', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(
      screen.getByText(/Do you want to delete file or folder/i),
    ).toBeInTheDocument();
    expect(screen.getByText('"test.pdf"')).toBeInTheDocument();
  });

  it('displays multiple files count and list', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={multipleFiles}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(
      screen.getByText(/Do you want to delete the following/i),
    ).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('file1.txt')).toBeInTheDocument();
    expect(screen.getByText('file2.pdf')).toBeInTheDocument();
    expect(screen.getByText('file3.docx')).toBeInTheDocument();
  });

  it('shows truncated list for more than 10 files', () => {
    const manyFiles: DialFile[] = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      name: `file${i + 1}.txt`,
      path: `/folder/file${i + 1}.txt`,
      nodeType: DialFileNodeType.ITEM,
      contentLength: 1024,
      updatedAt: '2024-01-15T10:30:00Z',
      author: 'User',
      folderId: 'folder',
    }));

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={manyFiles}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('file1.txt')).toBeInTheDocument();
    expect(screen.getByText('file10.txt')).toBeInTheDocument();
    expect(screen.queryByText('file11.txt')).not.toBeInTheDocument();
    expect(screen.getByText('... and 5 more')).toBeInTheDocument();
  });

  it('calls onConfirm when Delete button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('renders custom labels', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        cancelLabel="Keep"
        confirmLabel="Remove"
      />,
    );

    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('renders custom title from titleRenderer', () => {
    const customTitle = 'Custom Delete Warning';

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        titleRenderer={() => customTitle}
      />,
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('renders custom content from contentRenderer', () => {
    const customContent = 'Custom warning message';

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        contentRenderer={() => <div>{customContent}</div>}
      />,
    );

    expect(screen.getByText(customContent)).toBeInTheDocument();
    expect(
      screen.queryByText(/Do you want to delete/i),
    ).not.toBeInTheDocument();
  });

  it('passes file names to titleRenderer', () => {
    const titleRenderer = vi.fn(() => 'Title');

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={multipleFiles}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        titleRenderer={titleRenderer}
      />,
    );

    expect(titleRenderer).toHaveBeenCalledWith([
      'file1.txt',
      'file2.pdf',
      'file3.docx',
    ]);
  });

  it('passes file names to contentRenderer', () => {
    const contentRenderer = vi.fn(() => <div>Content</div>);

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={multipleFiles}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        contentRenderer={contentRenderer}
      />,
    );

    expect(contentRenderer).toHaveBeenCalledWith([
      'file1.txt',
      'file2.pdf',
      'file3.docx',
    ]);
  });

  it('handles empty itemsToDelete array', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('Confirm Deleting Items')).toBeInTheDocument();
  });

  it('handles files with special characters in names', () => {
    const specialFile: DialFile = {
      id: '1',
      name: 'file (1) [copy].txt',
      path: '/folder/file (1) [copy].txt',
      nodeType: DialFileNodeType.ITEM,
      contentLength: 1024,
      updatedAt: '2024-01-15T10:30:00Z',
      author: 'User',
      folderId: 'folder',
    };

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[specialFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('"file (1) [copy].txt"')).toBeInTheDocument();
  });

  it('handles folder items', () => {
    const folder: DialFile = {
      id: '1',
      name: 'My Folder',
      path: '/documents/My Folder',
      nodeType: DialFileNodeType.FOLDER,
      updatedAt: '2024-01-15T10:30:00Z',
      author: 'Admin',
      folderId: 'documents',
    };

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[folder]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(screen.getByText('"My Folder"')).toBeInTheDocument();
  });

  it('correctly displays singular "item" for single file', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const message = screen.getByText(/Do you want to delete file or folder/i);
    expect(message).toBeInTheDocument();
  });

  it('uses Danger variant for confirmation popup', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[singleFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toHaveClass('dial-danger-solid-button');
  });

  it('displays files with unique keys', () => {
    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={multipleFiles}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    listItems.forEach((item, index) => {
      expect(item).toHaveTextContent(multipleFiles[index].name);
    });
  });

  it('applies truncate class to long file names', () => {
    const longNameFile: DialFile = {
      id: '1',
      name: 'very-long-file-name-that-should-be-truncated.pdf',
      path: '/folder/very-long-file-name-that-should-be-truncated.pdf',
      nodeType: DialFileNodeType.ITEM,
      contentLength: 1024,
      updatedAt: '2024-01-15T10:30:00Z',
      author: 'User',
      folderId: 'folder',
    };

    render(
      <FileManagerDeleteConfirmationPopup
        open={true}
        itemsToDelete={[longNameFile]}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />,
    );

    expect(
      screen.getByText('"very-long-file-name-that-should-be-truncated.pdf"'),
    ).toBeInTheDocument();
  });
});
