import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { DialPagination } from '../Pagination';

describe('Dial UI Kit :: DialPagination', () => {
  test('renders navigation landmark', () => {
    render(<DialPagination totalPages={6} page={1} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
  });

  test('renders prev and next buttons', () => {
    render(<DialPagination totalPages={6} page={5} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).toBeInTheDocument();
  });

  test('prev button is disabled on first page', () => {
    render(<DialPagination totalPages={6} page={1} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  test('prev button is enabled when not on first page', () => {
    render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).not.toBeDisabled();
  });

  test('next button is always enabled', () => {
    render(<DialPagination totalPages={6} page={3} onPageChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Next page' }),
    ).not.toBeDisabled();
  });

  test('calls onPageChange with previous page on prev click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination totalPages={6} page={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Previous page' }),
    );
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  test('calls onPageChange with next page on next click', async () => {
    const onPageChange = vi.fn();
    render(
      <DialPagination totalPages={6} page={5} onPageChange={onPageChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  test('applies custom className to nav', () => {
    render(
      <DialPagination
        totalPages={6}
        page={1}
        onPageChange={vi.fn()}
        className="custom-class"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass(
      'custom-class',
    );
  });
});
