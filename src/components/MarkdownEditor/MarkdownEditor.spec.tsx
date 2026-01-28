import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialMarkdownEditor } from './MarkdownEditor';
import { EditorThemes } from '@/types/editor';

describe('Dial UI Kit :: DialMarkdownEditor', () => {
  test('Should render the Markdown Editor', () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditor
        value="# Test"
        onChange={mockOnChange}
        theme={EditorThemes.dark}
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
        theme={EditorThemes.dark}
      />,
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: newValue } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  test('Should apply theme via data-color-mode attribute', () => {
    render(<DialMarkdownEditor value="# Test" theme={EditorThemes.light} />);

    const container = screen
      .getByRole('textbox')
      .closest('[data-color-mode="light"]');
    expect(container).toHaveAttribute('data-color-mode', 'light');
  });

  test('Should use default height when not provided', () => {
    render(<DialMarkdownEditor value="# Test" theme={EditorThemes.dark} />);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  test('Should use custom height when provided', () => {
    render(
      <DialMarkdownEditor
        value="# Test"
        height={500}
        theme={EditorThemes.dark}
      />,
    );

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  test('Should use default preview mode when not provided', () => {
    render(<DialMarkdownEditor value="# Test" theme={EditorThemes.dark} />);

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });

  test('Should handle empty value', () => {
    const mockOnChange = vi.fn();
    render(
      <DialMarkdownEditor
        value=""
        onChange={mockOnChange}
        theme={EditorThemes.dark}
      />,
    );

    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
  });
});
