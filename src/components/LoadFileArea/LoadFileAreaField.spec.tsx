import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialLoadFileAreaField } from './LoadFileAreaField';
import userEvent from '@testing-library/user-event';

describe('Dial UI Kit :: DialLoadFileAreaField', () => {
  test('Should render label and LoadFileArea', () => {
    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        emptyTextFirstLine="empty"
        emptyButtonLabel="Browse"
        onChange={vi.fn()}
        isMultiple={true}
        acceptTypes="image/png"
      />,
    );
    expect(screen.getByText('Files: 0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse' })).toBeInTheDocument();
  });

  test('Should render delete and add buttons when files exist', () => {
    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        emptyTextFirstLine="empty"
        emptyButtonLabel="Browse"
        files={[new File([''], 'file1.png', { type: 'image/png' })]}
        onChange={vi.fn()}
        acceptTypes="image/png"
        deleteAllButtonLabel="Delete All"
        addButtonLabel="Add"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Delete All' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  test('Should call onChangeFile([]) when delete-all button is clicked', () => {
    const onChangeFile = vi.fn();
    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        maxFilesCount={3}
        files={[new File([''], 'file1.png', { type: 'image/png' })]}
        onChange={onChangeFile}
        acceptTypes="image/png"
        emptyTextFirstLine="empty"
        emptyButtonLabel="Browse"
        deleteAllButtonLabel="Delete all"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete all' }));
    expect(onChangeFile).toHaveBeenCalledWith([]);
  });

  // test('Should call file input click when add button is clicked', () => {
  //   render(
  //     <DialLoadFileAreaField
  //       fieldTitle="Files"
  //       elementId="file-input"
  //       files={[new File([''], 'file1.png', { type: 'image/png' })]}
  //       onChange={vi.fn()}
  //       acceptTypes="image/png"
  //       emptyTextFirstLine="empty"
  //       emptyButtonLabel="Browse"
  //     />,
  //   );
  //   expect(screen.getByText('Files: 1')).toBeInTheDocument();
  // });

  test('Should show tooltip with errorText by hovering on invalid file', async () => {
    const user = userEvent.setup();

    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        files={[new File([''], 'file1.png', { type: 'image/png' })]}
        onChange={vi.fn()}
        acceptTypes="image/jpg"
        emptyTextFirstLine="empty"
        emptyButtonLabel="Browse"
        errorText="invalid format"
        isInvalid={(file) => !!file}
      />,
    );

    const input = screen.getByDisplayValue('file1.png') as HTMLInputElement;

    await user.hover(input);

    await waitFor(() => {
      expect(screen.getByText('invalid format')).toBeInTheDocument();
    });
  });

  test('Should display empty texts and button label when there is an empty area', () => {
    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        files={[]}
        onChange={vi.fn()}
        acceptTypes="image/jpg"
        emptyTextFirstLine="Drop file here"
        emptyTextSecondLine="or"
        emptyButtonLabel="Browse"
      />,
    );

    expect(screen.getByText('Drop file here')).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
  });

  test('Should call onChange on files select', () => {
    const mockOnChange = vi.fn();

    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        files={[]}
        onChange={mockOnChange}
        acceptTypes="image/png"
        emptyTextFirstLine="Drop file here"
        emptyTextSecondLine="or"
        emptyButtonLabel="Browse"
      />,
    );

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    const file = new File(['file content'], 'example.png', {
      type: 'image/png',
    });
    const mockFileList = {
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
      0: file,
    };

    fireEvent.change(fileInput!, { target: { files: mockFileList } });

    expect(mockOnChange).toHaveBeenCalledWith([file]);
  });

  test('Should display fileFormatError when invalid format file is selected', () => {
    const mockOnChange = vi.fn();

    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        files={[]}
        onChange={mockOnChange}
        acceptTypes="image/jpg"
        fileFormatError="Invalid format"
      />,
    );

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    const file = new File(['file content'], 'example.png', {
      type: 'image/png',
    });
    const mockFileList = {
      length: 1,
      item: (index: number) => (index === 0 ? file : null),
      0: file,
    };

    fireEvent.change(fileInput!, { target: { files: mockFileList } });

    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });

  test('Should trigger clink on input by clicking Browse button', () => {
    const mockOnChange = vi.fn();

    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        onChange={mockOnChange}
        acceptTypes="image/jpg"
        emptyButtonLabel="Browse"
      />,
    );

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    const clickSpy = vi.spyOn(fileInput as HTMLInputElement, 'click');

    const button = screen.getByText('Browse');
    fireEvent.click(button);

    expect(clickSpy).toHaveBeenCalled();
  });
});
