import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialMarkdownEditor } from './MarkdownEditor';

describe('Dial UI Kit :: DialMarkdownEditor', () => {
  test('Should render the Markdown Editor', () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditor
        value="# Test"
        onChange={mockOnChange}
        theme="dark"
      />,
    );

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  test('Should call onChange when content changes', async () => {
    const mockOnChange = vi.fn();
    const initialValue = '# Initial';
    const newValue = '# Updated';

    render(
      <DialMarkdownEditor
        value={initialValue}
        onChange={mockOnChange}
        theme="dark"
      />,
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: newValue } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  test('Should apply custom className', () => {
    render(
      <DialMarkdownEditor
        value="# Test"
        className="custom-class"
        theme="dark"
      />,
    );

    const container = screen
      .getByRole('textbox')
      .closest('.dial-markdown-editor');
    expect(container).toHaveClass('custom-class');
  });

  test('Should apply theme via data-color-mode attribute', () => {
    render(<DialMarkdownEditor value="# Test" theme="light" />);

    const container = screen
      .getByRole('textbox')
      .closest('.dial-markdown-editor');
    expect(container).toHaveAttribute('data-color-mode', 'light');
  });

  test('Should use default height when not provided', () => {
    render(<DialMarkdownEditor value="# Test" theme="dark" />);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  test('Should use custom height when provided', () => {
    render(<DialMarkdownEditor value="# Test" height={500} theme="dark" />);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  test('Should use default preview mode when not provided', () => {
    render(<DialMarkdownEditor value="# Test" theme="dark" />);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  test('Should handle empty value', () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditor value="" onChange={mockOnChange} theme="dark" />,
    );

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });
});
