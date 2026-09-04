import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { EditorThemes } from '@/types/editor';
import { MarkdownEditor } from './MarkdownEditor';

describe('Dial UI Kit :: MarkdownEditor', () => {
  test('Should render the Markdown Editor', () => {
    render(<MarkdownEditor value="# Test" theme={EditorThemes.dark} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should call onChange when content changes', async () => {
    const mockOnChange = vi.fn();
    render(<MarkdownEditor value="# Initial" onChange={mockOnChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '# Updated' },
    });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('# Updated');
    });
  });

  test('Should apply theme via data-color-mode attribute', () => {
    render(<MarkdownEditor value="# Test" theme={EditorThemes.light} />);

    const container = screen
      .getByRole('textbox')
      .closest('[data-color-mode="light"]');
    expect(container).toHaveAttribute('data-color-mode', 'light');
  });

  test('Should render placeholder text on the underlying textarea', () => {
    render(<MarkdownEditor value="" placeholder="Start typing here…" />);

    expect(
      screen.getByPlaceholderText('Start typing here…'),
    ).toBeInTheDocument();
  });

  test('Should name the textarea from ariaLabel', () => {
    render(<MarkdownEditor value="" ariaLabel="Instructions" />);

    expect(
      screen.getByRole('textbox', { name: 'Instructions' }),
    ).toBeInTheDocument();
  });

  test('Should let a visible label name the textarea through id', () => {
    render(
      <>
        <label htmlFor="task-instructions">Instructions</label>
        <MarkdownEditor value="" id="task-instructions" />
      </>,
    );

    expect(screen.getByLabelText('Instructions')).toHaveAttribute(
      'id',
      'task-instructions',
    );
  });

  test('Should leave the textarea unnamed when neither is given', () => {
    render(<MarkdownEditor value="" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).not.toHaveAttribute('aria-label');
    expect(textarea).not.toHaveAttribute('id');
  });

  test('Should render the formatting toolbar buttons', () => {
    render(<MarkdownEditor value="Hello" />);

    expect(
      screen.getByRole('button', { name: /add bold text/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add italic text/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add strikethrough text/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /text style/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add unordered list/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add ordered list/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /insert a quote/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add a link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^insert code/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add table/i }),
    ).toBeInTheDocument();
  });

  test('Should insert bold markdown syntax when the bold button is clicked', async () => {
    const mockOnChange = vi.fn();
    render(<MarkdownEditor value="Hello" onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.setSelectionRange(0, textarea.value.length);
    fireEvent.select(textarea);

    fireEvent.click(screen.getByRole('button', { name: /add bold text/i }));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(expect.stringContaining('**'));
    });
  });

  test('Should render the edit/live/preview mode buttons', () => {
    render(<MarkdownEditor value="Hello" />);

    expect(
      screen.getByRole('button', { name: /edit code/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /live code/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /preview code/i }),
    ).toBeInTheDocument();
  });

  test('Should default to edit mode', () => {
    const { container } = render(<MarkdownEditor value="Hello" />);

    expect(
      container.querySelector('.w-md-editor-show-edit'),
    ).toBeInTheDocument();
  });

  test('Should respect the defaultPreview prop', () => {
    const { container } = render(
      <MarkdownEditor value="Hello" defaultPreview="preview" />,
    );

    expect(
      container.querySelector('.w-md-editor-show-preview'),
    ).toBeInTheDocument();
  });

  test('Should switch to live mode when the live button is clicked', () => {
    const { container } = render(<MarkdownEditor value="Hello" />);

    fireEvent.click(screen.getByRole('button', { name: /live code/i }));

    expect(
      container.querySelector('.w-md-editor-show-live'),
    ).toBeInTheDocument();
  });

  test('Should switch to preview mode when the preview button is clicked', () => {
    const { container } = render(<MarkdownEditor value="Hello" />);

    fireEvent.click(screen.getByRole('button', { name: /preview code/i }));

    expect(
      container.querySelector('.w-md-editor-show-preview'),
    ).toBeInTheDocument();
  });

  test('Should toggle fullscreen mode when the fullscreen button is clicked', () => {
    const { container } = render(<MarkdownEditor value="Hello" />);

    fireEvent.click(screen.getByRole('button', { name: /toggle fullscreen/i }));

    expect(
      container.querySelector('.w-md-editor-fullscreen'),
    ).toBeInTheDocument();
  });
});
