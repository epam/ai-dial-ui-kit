import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialMarkdownEditorContainer } from './MarkdownEditorContainer';

describe('Dial UI Kit :: DialMarkdownEditorContainer', () => {
  test('Should render component without switcher when switcherLabel is not provided', () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditorContainer
        value="# Test"
        onChangeValue={mockOnChange}
        theme="dark"
      />,
    );

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });

  test('Should render component with switcher and label when switcherLabel is provided', () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditorContainer
        value="# Test"
        onChangeValue={mockOnChange}
        switcherLabel="JSON Mode"
        label="Content Label"
        theme="dark"
      />,
    );

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.getByText('Content Label')).toBeInTheDocument();
  });

  test('Should display headerContent when provided', () => {
    render(
      <DialMarkdownEditorContainer
        value="# Test"
        headerContent={<div>Header Content</div>}
        theme="dark"
      />,
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  test('Should switch to JSON mode when switcher is toggled', async () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditorContainer
        value='{"test": "value"}'
        onChangeValue={mockOnChange}
        switcherLabel="JSON Mode"
        theme="dark"
      />,
    );

    const switcher = screen.getByRole('switch');
    fireEvent.click(switcher);

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'JSON Editor' }),
      ).toBeInTheDocument();
    });
  });

  test('Should call onChangeValue when content changes in markdown mode', async () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditorContainer
        value="# Test"
        onChangeValue={mockOnChange}
        theme="dark"
      />,
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '# Updated' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  test('Should call onChangeValue when content changes in JSON mode', async () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditorContainer
        value='{"test": "value"}'
        onChangeValue={mockOnChange}
        switcherLabel="JSON Mode"
        theme="dark"
      />,
    );

    const switcher = screen.getByRole('switch');
    fireEvent.click(switcher);

    await waitFor(() => {
      const jsonEditor = screen.getByRole('textbox', { name: 'JSON Editor' });
      expect(jsonEditor).toBeInTheDocument();
    });

    const jsonTextarea = screen.getByLabelText('JSON content');
    fireEvent.change(jsonTextarea, {
      target: { value: '{"updated": "value"}' },
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  test('Should call onValidateJSON when JSON validation occurs', async () => {
    const mockOnValidate = vi.fn();
    render(
      <DialMarkdownEditorContainer
        value='{"test": "value"}'
        switcherLabel="JSON Mode"
        onValidateJSON={mockOnValidate}
        theme="dark"
      />,
    );

    const switcher = screen.getByRole('switch');
    fireEvent.click(switcher);

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: 'JSON Editor' }),
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(mockOnValidate).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
  });
});
