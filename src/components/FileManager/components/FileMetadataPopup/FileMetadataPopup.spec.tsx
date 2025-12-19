import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileMetadataPopup } from './FileMetadataPopup';
import { DialFileNodeType, type DialFile } from '@/models/file';
import userEvent from '@testing-library/user-event';

const mockFile: DialFile = {
  id: 'file-1',
  name: 'test-file.svg',
  path: 'My files/Folder 1/test-file.svg',
  updatedAt: '2025-09-05T10:30:00Z',
  contentLength: 2150,
  author: 'John Doe',
  contentType: 'image/svg+xml',
  nodeType: DialFileNodeType.ITEM,
  folderId: 'folder-1',
};

describe('Dial UI Kit :: FileMetadataPopup', () => {
  it('renders popup when open', () => {
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={mockFile}
      />,
    );

    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('test-file.svg')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const { container } = render(
      <FileMetadataPopup
        open={false}
        onClose={vi.fn()}
        fileMetadata={mockFile}
      />,
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('displays all file metadata fields', () => {
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={mockFile}
      />,
    );

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('test-file.svg')).toBeInTheDocument();

    expect(screen.getByText('Modified Date:')).toBeInTheDocument();
    expect(screen.getByText('Sep 05, 2025')).toBeInTheDocument();

    expect(screen.getByText('Size:')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();

    expect(screen.getByText('Author:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(screen.getByText('Path:')).toBeInTheDocument();
    expect(
      screen.getByText('My files/Folder 1/test-file.svg'),
    ).toBeInTheDocument();
  });

  it('decodes URI encoded path', () => {
    const fileWithEncodedPath: DialFile = {
      ...mockFile,
      path: 'files/folder/Screenshot%202025-12-10%20at%2009.44.24.png',
    };

    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithEncodedPath}
      />,
    );

    expect(
      screen.getByText('files/folder/Screenshot 2025-12-10 at 09.44.24.png'),
    ).toBeInTheDocument();
  });

  it('decodes URI encoded path with special characters', () => {
    const fileWithSpecialChars: DialFile = {
      ...mockFile,
      path: 'files/folder/file%20with%20%26%20special%20%23%20chars.txt',
    };

    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithSpecialChars}
      />,
    );

    expect(
      screen.getByText('files/folder/file with & special # chars.txt'),
    ).toBeInTheDocument();
  });

  it('decodes complex URI encoded path', () => {
    const fileWithComplexPath: DialFile = {
      ...mockFile,
      path: 'files/akWB1YBFr8MR1nshJgXHKUWfPCLZf8x6nMKGsa9WMxmggzPWW42NdcfpPRiPjRHT5/13/Screenshot%202025-12-10%20at%2009.44.24.png',
    };

    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithComplexPath}
      />,
    );

    expect(
      screen.getByText(
        'files/akWB1YBFr8MR1nshJgXHKUWfPCLZf8x6nMKGsa9WMxmggzPWW42NdcfpPRiPjRHT5/13/Screenshot 2025-12-10 at 09.44.24.png',
      ),
    ).toBeInTheDocument();
  });

  it('handles path with multiple encoded spaces', () => {
    const fileWithSpaces: DialFile = {
      ...mockFile,
      path: 'My%20Files/My%20Folder/My%20Document.pdf',
    };

    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithSpaces}
      />,
    );

    expect(
      screen.getByText('My Files/My Folder/My Document.pdf'),
    ).toBeInTheDocument();
  });

  it('handles path with plus signs', () => {
    const fileWithPlus: DialFile = {
      ...mockFile,
      path: 'files/folder/file+with+plus.txt',
    };

    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithPlus}
      />,
    );

    expect(
      screen.getByText('files/folder/file+with+plus.txt'),
    ).toBeInTheDocument();
  });

  it('handles already decoded path', () => {
    const fileWithDecodedPath: DialFile = {
      ...mockFile,
      path: 'files/folder/normal file name.txt',
    };

    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithDecodedPath}
      />,
    );

    expect(
      screen.getByText('files/folder/normal file name.txt'),
    ).toBeInTheDocument();
  });

  it('calls onClose when popup is closed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <FileMetadataPopup
        open={true}
        onClose={onClose}
        fileMetadata={mockFile}
      />,
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays custom title', () => {
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={mockFile}
        header="File Details"
      />,
    );

    expect(screen.getByText('File Details')).toBeInTheDocument();
  });

  it('displays custom labels', () => {
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={mockFile}
        nameLabel="File Name:"
        pathLabel="Location:"
        modifiedDateLabel="Last Updated:"
        sizeLabel="File Size:"
        authorLabel="Created By:"
      />,
    );

    expect(screen.getByText('File Name:')).toBeInTheDocument();
    expect(screen.getByText('Location:')).toBeInTheDocument();
    expect(screen.getByText('Last Updated:')).toBeInTheDocument();
    expect(screen.getByText('File Size:')).toBeInTheDocument();
    expect(screen.getByText('Created By:')).toBeInTheDocument();
  });

  it('displays "—" when author is missing', () => {
    const fileWithoutAuthor = { ...mockFile, author: undefined };
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithoutAuthor}
      />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('formats file size correctly for bytes', () => {
    const smallFile = { ...mockFile, contentLength: 512 };
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={smallFile}
      />,
    );

    expect(screen.getByText('512 bytes')).toBeInTheDocument();
  });

  it('formats file size correctly for KB', () => {
    const mediumFile = { ...mockFile, contentLength: 153600 };
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={mediumFile}
      />,
    );

    expect(screen.getByText('150 KB')).toBeInTheDocument();
  });

  it('formats file size correctly for MB', () => {
    const largeFile = { ...mockFile, contentLength: 15728640 };
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={largeFile}
      />,
    );

    expect(screen.getByText('15.0 MB')).toBeInTheDocument();
  });

  it('shows labels in loading state', () => {
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={mockFile}
        loading={true}
      />,
    );

    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Modified Date:')).toBeInTheDocument();
    expect(screen.getByText('Size:')).toBeInTheDocument();
    expect(screen.getByText('Author:')).toBeInTheDocument();
    expect(screen.getByText('Path:')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={mockFile}
      />,
    );

    expect(screen.getByText('Sep 05, 2025')).toBeInTheDocument();
  });

  it('handles invalid date gracefully', () => {
    const fileWithInvalidDate = { ...mockFile, updatedAt: 'invalid-date' };
    render(
      <FileMetadataPopup
        open={true}
        onClose={vi.fn()}
        fileMetadata={fileWithInvalidDate}
      />,
    );

    expect(screen.getByText('invalid-date')).toBeInTheDocument();
  });
});
