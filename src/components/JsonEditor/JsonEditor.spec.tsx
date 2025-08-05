import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DialJsonEditor } from './JsonEditor';
import { EDITOR_THEMES } from '@/types/editor';

describe('Dial UI Kit :: DialJsonEditor', () => {
  test('Should render the Monaco Editor', () => {
    const mockOnChange = vi.fn();
    render(
      <DialJsonEditor
        value=""
        currentTheme={EDITOR_THEMES.dark}
        onChange={mockOnChange}
      />,
    );

    expect(
      screen.getByRole('textbox', { name: 'JSON Editor' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('JSON content')).toBeInTheDocument();
  });

  test('Should call onChange when content changes', async () => {
    const mockOnChange = vi.fn();
    const initialValue = '{"initial": "value"}';
    const newValue = '{"updated": "value"}';

    render(
      <DialJsonEditor
        value={initialValue}
        currentTheme={EDITOR_THEMES.dark}
        onChange={mockOnChange}
      />,
    );

    const textarea = screen.getByLabelText('JSON content');
    fireEvent.change(textarea, { target: { value: newValue } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(newValue);
    });
  });
});
