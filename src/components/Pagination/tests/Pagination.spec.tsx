import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DialPagination } from '../Pagination';

describe('Dial UI Kit :: DialPagination', () => {
  test('renders navigation landmark', () => {
    render(<DialPagination page={1} totalPages={10} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
  });

  test('renders prev and next buttons', () => {
    render(<DialPagination page={5} totalPages={10} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).toBeInTheDocument();
  });

  test('prev button is disabled on first page', () => {
    render(<DialPagination page={1} totalPages={10} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  test('next button is disabled on last page', () => {
    render(<DialPagination page={10} totalPages={10} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  test('prev button is enabled when not on first page', () => {
    render(<DialPagination page={3} totalPages={10} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).not.toBeDisabled();
  });

  test('next button is enabled when not on last page', () => {
    render(<DialPagination page={3} totalPages={10} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).not.toBeDisabled();
  });

  test('calls onPageChange with previous page on prev click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination page={5} totalPages={10} onPageChange={onPageChange} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Previous page' }),
    );
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  test('calls onPageChange with next page on next click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination page={5} totalPages={10} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  test('calls onPageChange with correct page on page button click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination page={1} totalPages={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('active page has aria-current="page"', () => {
    render(<DialPagination page={3} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('inactive pages do not have aria-current', () => {
    render(<DialPagination page={3} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  test('renders all pages when count is small', () => {
    render(<DialPagination page={2} totalPages={5} onPageChange={vi.fn()} />);
    [1, 2, 3, 4, 5].forEach((p) => {
      expect(
        screen.getByRole('button', { name: `Page ${p}` }),
      ).toBeInTheDocument();
    });
  });

  test('renders ellipsis when pages are truncated', () => {
    render(<DialPagination page={10} totalPages={20} onPageChange={vi.fn()} />);
    const ellipses = document.querySelectorAll('[aria-hidden="true"]');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  test('applies custom className to nav', () => {
    render(
      <DialPagination
        page={1}
        totalPages={5}
        onPageChange={vi.fn()}
        className="custom-class"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass(
      'custom-class',
    );
  });
});
