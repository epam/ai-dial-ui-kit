import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DialSearch } from './Search';

describe('Dial UI Kit :: DialSearch', () => {
  it('renders with placeholder', () => {
    render(<DialSearch id="search1" placeholder="Search placeholder" />);
    expect(
      screen.getByPlaceholderText('Search placeholder'),
    ).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    render(
      <DialSearch
        id="search2"
        placeholder="Search placeholder"
        onChange={onChange}
      />,
    );
    const search = screen.getByPlaceholderText('Search placeholder');
    fireEvent.change(search, { target: { value: 'test value' } });
    expect(onChange).toHaveBeenCalledWith('test value');
  });

  it('calls onBlur when input loses focus', () => {
    const onBlur = vi.fn();
    render(
      <DialSearch
        id="search-blur"
        placeholder="Search placeholder"
        onBlur={onBlur}
      />,
    );
    const search = screen.getByPlaceholderText('Search placeholder');
    fireEvent.blur(search);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('does not call onBlur when prop is not provided', () => {
    render(<DialSearch id="search-no-blur" placeholder="Search placeholder" />);
    const search = screen.getByPlaceholderText('Search placeholder');
    // Should not throw error
    expect(() => fireEvent.blur(search)).not.toThrow();
  });

  it('calls both onChange and onBlur in sequence', () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <DialSearch
        id="search-both"
        placeholder="Search placeholder"
        onChange={onChange}
        onBlur={onBlur}
      />,
    );
    const search = screen.getByPlaceholderText('Search placeholder');

    fireEvent.change(search, { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalledWith('test');
    expect(onBlur).not.toHaveBeenCalled();

    fireEvent.blur(search);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <DialSearch id="search3" placeholder="Search placeholder" disabled />,
    );
    expect(screen.getByPlaceholderText('Search placeholder')).toBeDisabled();
  });

  it('clears the value when Clear search button is clicked', () => {
    const onChange = vi.fn();
    render(
      <DialSearch
        id="search4"
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

  it('does not show Clear button when value is empty', () => {
    render(
      <DialSearch
        id="search-empty"
        placeholder="Search placeholder"
        value=""
      />,
    );

    const clearButton = screen.queryByRole('button', {
      name: /clear search/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });
});
