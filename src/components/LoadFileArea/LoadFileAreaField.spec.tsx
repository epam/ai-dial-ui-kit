import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialLoadFileAreaField } from './LoadFileAreaField';

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

  test('Should call file input click when add button is clicked', () => {
    render(
      <DialLoadFileAreaField
        fieldTitle="Files"
        elementId="file-input"
        files={[new File([''], 'file1.png', { type: 'image/png' })]}
        onChange={vi.fn()}
        acceptTypes="image/png"
        emptyTextFirstLine="empty"
        emptyButtonLabel="Browse"
      />,
    );
    expect(screen.getByText('Files: 1')).toBeInTheDocument();
  });
});
