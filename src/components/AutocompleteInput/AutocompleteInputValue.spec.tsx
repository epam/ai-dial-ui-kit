import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DialAutocompleteInputValue } from './AutocompleteInputValue';

describe('Dial UI Kit :: DialAutocompleteInputValue', () => {
  test('renders selected items as tags', () => {
    render(<DialAutocompleteInputValue selectedItems={['val1', 'val2']} />);
    expect(screen.getByText('val1')).toBeTruthy();
    expect(screen.getByText('val2')).toBeTruthy();
  });

  test('renders placeholder when no items are selected', () => {
    render(<DialAutocompleteInputValue placeholder="Pick items" />);
    expect(screen.getByText('Pick items')).toBeTruthy();
  });

  test('collapseTagOverflow: renders all items when all fit', () => {
    render(
      <DialAutocompleteInputValue
        selectedItems={['a', 'b', 'c']}
        collapseTagOverflow
      />,
    );
    // getAllByText because the measurement (aria-hidden) div duplicates text nodes
    expect(screen.getAllByText('a').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('b').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('c').length).toBeGreaterThanOrEqual(1);
  });
});
