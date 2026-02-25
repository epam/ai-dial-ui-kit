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

  it('calls onBlur when input loses focus', () => {
    const onBlur = vi.fn();
    render(
      <DialSearch
        elementId="search-blur"
        placeholder="Search placeholder"
        onBlur={onBlur}
      />,
    );
    const search = screen.getByPlaceholderText('Search placeholder');
    fireEvent.blur(search);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('does not call onBlur when prop is not provided', () => {
    render(
      <DialSearch
        elementId="search-no-blur"
        placeholder="Search placeholder"
      />,
    );
    const search = screen.getByPlaceholderText('Search placeholder');
    // Should not throw error
    expect(() => fireEvent.blur(search)).not.toThrow();
  });

  it('calls both onChange and onBlur in sequence', () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <DialSearch
        elementId="search-both"
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
      <DialSearch
        elementId="search3"
        placeholder="Search placeholder"
        disabled
      />,
    );
    expect(screen.getByPlaceholderText('Search placeholder')).toBeDisabled();
  });

  it('does not call onChange when readonly', () => {
    const onChange = vi.fn();
    render(
      <DialSearch
        elementId="search-readonly-change"
        placeholder="Search placeholder"
        readonly
        onChange={onChange}
      />,
    );
    const search = screen.getByPlaceholderText('Search placeholder');
    fireEvent.change(search, { target: { value: 'test' } });
    expect(onChange).not.toHaveBeenCalled();
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

  it('does not show Clear button when allowClear is false', () => {
    render(
      <DialSearch
        elementId="search5"
        placeholder="Search placeholder"
        value="initial value"
        allowClear={false}
      />,
    );

    const clearButton = screen.queryByRole('button', {
      name: /clear search/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('does not show Clear button when value is empty', () => {
    render(
      <DialSearch
        elementId="search-empty"
        placeholder="Search placeholder"
        value=""
      />,
    );

    const clearButton = screen.queryByRole('button', {
      name: /clear search/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('does not show Clear button when disabled', () => {
    render(
      <DialSearch
        elementId="search-disabled-clear"
        placeholder="Search placeholder"
        value="some value"
        disabled
      />,
    );

    const clearButton = screen.queryByRole('button', {
      name: /clear search/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('does not show Clear button when readonly', () => {
    render(
      <DialSearch
        elementId="search-readonly-clear"
        placeholder="Search placeholder"
        value="some value"
        readonly
      />,
    );

    const clearButton = screen.queryByRole('button', {
      name: /clear search/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });
});
