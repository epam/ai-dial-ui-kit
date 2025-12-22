import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConflictResolutionPopup } from './ConflictResolutionPopup';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';

vi.mock('@/components/Grid/Grid', () => ({
  DialGrid: vi.fn(({ rowData, columnDefs }) => (
    <table role="grid">
      <thead>
        <tr>
          {columnDefs.map((col: { field: string; headerName: string }) => (
            <th key={col.field} role="columnheader">
              {col.headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowData.map((row: { id: string; name: string }) => (
          <tr key={row.id} role="row">
            <td role="gridcell">{row.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )),
}));

describe('Dial UI Kit :: ConflictResolutionPopup', () => {
  const singleFile: DialFile[] = [
    {
      id: '1',
      name: 'test.svg',
      path: '/test.svg',
      nodeType: DialFileNodeType.ITEM,
    } as DialFile,
  ];

  const multipleFiles: DialFile[] = [
    {
      id: '1',
      name: 'a.txt',
      path: '/a.txt',
      nodeType: DialFileNodeType.ITEM,
    } as DialFile,
    {
      id: '2',
      name: 'b.pdf',
      path: '/b.pdf',
      nodeType: DialFileNodeType.ITEM,
    } as DialFile,
    {
      id: '3',
      name: 'folder',
      path: '/folder',
      nodeType: DialFileNodeType.FOLDER,
    } as DialFile,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders single file conflict with correct title and message', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={singleFile}
      />,
    );

    expect(screen.getByText('Replace Or Duplicate Item')).toBeInTheDocument();
    expect(screen.getByText('"test.svg"')).toBeInTheDocument();
    expect(
      screen.getByText(/already exists in this destination/),
    ).toBeInTheDocument();
  });

  it('renders multiple files conflict with correct title and count', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
      />,
    );

    expect(screen.getByText('Replace Or Duplicate Items')).toBeInTheDocument();
    expect(
      screen.getByText(
        '3 items with the same names already exist in this destination.',
      ),
    ).toBeInTheDocument();
  });

  it('single file: Replace radio is selected by default', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={singleFile}
      />,
    );

    const replaceRadio = screen.getByRole('radio', { name: /replace/i });
    expect(replaceRadio).toBeChecked();
  });

  it('single file: calls onReplace when Replace is selected and Confirm clicked', () => {
    const onReplace = vi.fn();
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={onReplace}
        onDuplicate={vi.fn()}
        conflictingFiles={singleFile}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onReplace).toHaveBeenCalledTimes(1);
  });

  it('single file: calls onDuplicate when Duplicate is selected and Confirm clicked', () => {
    const onDuplicate = vi.fn();
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={onDuplicate}
        conflictingFiles={singleFile}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /duplicate/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onDuplicate).toHaveBeenCalledTimes(1);
  });

  it('multiple files: Replace All is selected by default', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
      />,
    );

    const replaceAllRadio = screen.getByRole('radio', { name: /replace all/i });
    expect(replaceAllRadio).toBeChecked();
  });

  it('multiple files: calls onReplace when Replace All selected and Confirm clicked', () => {
    const onReplace = vi.fn();
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={onReplace}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onReplace).toHaveBeenCalledTimes(1);
  });

  it('multiple files: calls onDuplicate when Duplicate All selected', () => {
    const onDuplicate = vi.fn();
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={onDuplicate}
        conflictingFiles={multipleFiles}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /duplicate all/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onDuplicate).toHaveBeenCalledTimes(1);
  });

  it('multiple files: shows grid when Decide for each is selected', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /decide for each/i }));

    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();

    const columnHeaders = within(grid).getAllByRole('columnheader');
    expect(columnHeaders[0]).toHaveTextContent('Name');
    expect(columnHeaders[1]).toHaveTextContent('Action');

    const rows = within(grid).getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0);

    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('b.pdf')).toBeInTheDocument();
    expect(screen.getByText('folder')).toBeInTheDocument();
  });

  it('multiple files: calls onDecideForEach with decisions', () => {
    const onDecideForEach = vi.fn();
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        onDecideForEach={onDecideForEach}
        conflictingFiles={multipleFiles}
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /decide for each/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    expect(onDecideForEach).toHaveBeenCalledTimes(1);
    const decisions = onDecideForEach.mock.calls[0][0];
    expect(decisions).toHaveLength(3);
    expect(decisions[0].action).toBe('replace');
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={onClose}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={singleFile}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses custom labels from actionLabels prop', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={singleFile}
        actionLabels={{
          replace: 'Overwrite',
          duplicate: 'Keep Both',
          cancel: 'Skip',
        }}
      />,
    );

    expect(screen.getByText('Overwrite')).toBeInTheDocument();
    expect(screen.getByText('Keep Both')).toBeInTheDocument();
  });

  it('uses custom labels from strategyLabels prop', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
        strategyLabels={{
          replaceAll: 'Overwrite All',
          duplicateAll: 'Keep All',
          decideForEach: 'Choose Individually',
        }}
      />,
    );

    expect(screen.getByText('Overwrite All')).toBeInTheDocument();
    expect(screen.getByText('Keep All')).toBeInTheDocument();
    expect(screen.getByText('Choose Individually')).toBeInTheDocument();
  });

  it('uses custom column labels', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
        nameColumnLabel="File Name"
        actionColumnLabel="Resolution"
      />,
    );

    fireEvent.click(screen.getByRole('radio', { name: /decide for each/i }));

    const grid = screen.getByRole('grid');
    const columnHeaders = within(grid).getAllByRole('columnheader');

    expect(columnHeaders[0]).toHaveTextContent('File Name');
    expect(columnHeaders[1]).toHaveTextContent('Resolution');
  });

  it('does not render when open is false', () => {
    const { container } = render(
      <ConflictResolutionPopup
        open={false}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={singleFile}
      />,
    );

    expect(container.querySelector('.dial-popup')).not.toBeInTheDocument();
  });

  it('grid is not rendered when Decide for each is not selected', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
      />,
    );

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('grid appears after selecting Decide for each', () => {
    render(
      <ConflictResolutionPopup
        open={true}
        onClose={vi.fn()}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        conflictingFiles={multipleFiles}
      />,
    );

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: /decide for each/i }));

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('applies correct width for single file mode', () => {
    render(
      <ConflictResolutionPopup
        open
        conflictingFiles={singleFile}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveClass('dial-sm-popup');
  });

  it('applies correct width for multiple files mode', () => {
    render(
      <ConflictResolutionPopup
        open
        conflictingFiles={multipleFiles}
        onReplace={vi.fn()}
        onDuplicate={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveClass('w-[600px]');
  });
});
