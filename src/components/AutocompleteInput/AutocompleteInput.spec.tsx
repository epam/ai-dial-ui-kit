import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DialAutocompleteInput } from './AutocompleteInput';

describe('Dial UI Kit :: DialAutocompleteInput', () => {
  const mockUpdateSelected = vi.fn();

  beforeEach(() => {
    mockUpdateSelected.mockClear();
  });

  test('renders input', () => {
    render(
      <DialAutocompleteInput
        placeholder="autocomplete"
        updateSelected={mockUpdateSelected}
      />,
    );
    const input = screen.getByRole('textbox', { name: '' });
    expect(input).toBeInTheDocument();
  });

  test('calls updateSelected when input changes', async () => {
    render(
      <DialAutocompleteInput
        placeholder="autocomplete"
        updateSelected={mockUpdateSelected}
      />,
    );
    const input = screen.getByRole('textbox', { name: '' });
    await userEvent.type(input, 'test{enter}');
    expect(mockUpdateSelected).toHaveBeenCalled();
  });

  test('removes last selected item when Backspace or Delete is pressed', async () => {
    const selectedItems = ['item1', 'item2', 'item3'];
    render(
      <DialAutocompleteInput
        placeholder="autocomplete"
        updateSelected={mockUpdateSelected}
        selectedItems={[...selectedItems]}
      />,
    );
    const input = screen.getByRole('textbox', { name: '' });

    await userEvent.type(input, '{backspace}');
    expect(mockUpdateSelected).toHaveBeenCalledWith(['item1', 'item2']);
  });

  test('adds new item to selected list when user enters text and presses Enter', async () => {
    const initialSelected = ['item1', 'item2'];
    render(
      <DialAutocompleteInput
        placeholder="autocomplete"
        updateSelected={mockUpdateSelected}
        selectedItems={[...initialSelected]}
      />,
    );
    const input = screen.getByRole('textbox', { name: '' });
    await userEvent.type(input, 'newItem{enter}');
    expect(mockUpdateSelected).toHaveBeenCalledWith([
      'item1',
      'item2',
      'newItem',
    ]);
  });
});
