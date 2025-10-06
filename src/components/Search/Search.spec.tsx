import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialSearch } from './Search';

describe('Dial UI Kit :: DialSearch', () => {
  it('renders with placeholder', () => {
    render(<DialSearch elementId="search1" placeholder="Search placeholder" />);
    expect(
      screen.getByPlaceholderText('Search placeholder'),
    ).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    render(
      <DialSearch
        elementId="search2"
        placeholder="Search placeholder"
        onChange={onChange}
      />,
    );
    const search = screen.getByPlaceholderText('Search placeholder');
    fireEvent.change(search, { target: { value: 'test value' } });
    expect(onChange).toHaveBeenCalledWith('test value');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <DialSearch
        elementId="search3"
        placeholder="Search placeholder"
        disabled
      />,
    );
    expect(screen.getByPlaceholderText('Search placeholder')).toBeDisabled();
  });

  it('clears the value when Clear search button is clicked', () => {
    const onChange = vi.fn();
    render(
      <DialSearch
        elementId="search4"
        placeholder="Search placeholder"
        value="initial value"
        onChange={onChange}
      />,
    );

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
  });
});
